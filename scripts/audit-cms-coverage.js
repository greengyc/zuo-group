const fs = require("fs");
const path = require("path");
const http = require("http");

let chromium;
try {
  ({ chromium } = require("playwright"));
} catch (error) {
  console.error("Playwright is required for the browser-rendered coverage audit.");
  console.error("When running from Codex, set NODE_PATH to the bundled node_modules path.");
  process.exit(2);
}

const root = path.resolve(__dirname, "..");
const pages = [
  "index.html",
  "research.html",
  "publications.html",
  "people.html",
  "news.html",
  "photos.html",
  "resources.html",
  "facilities.html",
  "join.html",
  "contact.html"
];

const contentFiles = [
  "site.json",
  "home.json",
  "research.json",
  "publications.json",
  "people.json",
  "news.json",
  "photos.json",
  "resources.json",
  "facilities.json",
  "join.json",
  "contact.json"
];

const allowedText = new Set([
  "menu"
]);

const allowedAssetFragments = [
  "lucide",
  "identity.netlify.com",
  "decap-cms",
  "js/main.js",
  "js/content-renderer.js",
  "css/styles.css",
  "admin/",
  "#"
];

const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".yml": "text/yaml",
  ".yaml": "text/yaml"
};

function normalizeText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .trim()
    .toLowerCase();
}

function normalizePathValue(value) {
  return String(value || "")
    .replace(/^https?:\/\/[^/]+\//i, "")
    .replace(/^\/+/, "")
    .replace(/^zuo-group\//, "")
    .replace(/\\/g, "/")
    .split("#")[0]
    .split("?")[0]
    .trim();
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function flattenValues(value, output = []) {
  if (typeof value === "string") {
    if (value.trim()) output.push(value.trim());
    return output;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => flattenValues(item, output));
    return output;
  }
  if (value && typeof value === "object") {
    Object.values(value).forEach((item) => flattenValues(item, output));
  }
  return output;
}

function collectKeys(value, output = new Set()) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectKeys(item, output));
    return output;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      output.add(key);
      collectKeys(child, output);
    }
  }
  return output;
}

function collectContentValues() {
  const values = [];
  for (const file of contentFiles) {
    values.push(...flattenValues(readJson(path.join("content", file))));
  }
  return values;
}

function isTextCovered(text, contentText) {
  const normalized = normalizeText(text);
  if (!normalized || allowedText.has(normalized)) return true;
  if (/^[0-9]+$/.test(normalized) && normalized.length <= 2) return true;
  return contentText.some((candidate) => {
    if (!candidate) return false;
    return candidate === normalized || candidate.includes(normalized) || normalized.includes(candidate);
  });
}

function isAssetCovered(value, contentAssets) {
  const normalized = normalizePathValue(value);
  if (!normalized) return true;
  if (allowedAssetFragments.some((fragment) => normalized.includes(fragment))) return true;
  return contentAssets.some((candidate) => {
    const asset = normalizePathValue(candidate);
    return asset && (normalized === asset || normalized.endsWith(asset) || asset.endsWith(normalized));
  });
}

function startServer() {
  const server = http.createServer((request, response) => {
    const requestUrl = new URL(request.url, "http://127.0.0.1");
    let pathname = decodeURIComponent(requestUrl.pathname);
    if (pathname === "/") pathname = "/index.html";
    let filePath = path.join(root, pathname);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }
    if (!filePath.startsWith(root) || !fs.existsSync(filePath)) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
    response.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream"
    });
    fs.createReadStream(filePath).pipe(response);
  });

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

async function auditRenderedPages(contentText, contentAssets) {
  const server = await startServer();
  const port = server.address().port;
  const browser = await chromium.launch({
    headless: true,
    executablePath: fs.existsSync("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe")
      ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
      : undefined
  });

  const failures = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    for (const pageName of pages) {
      await page.goto(`http://127.0.0.1:${port}/${pageName}`, { waitUntil: "networkidle" });
      const rendered = await page.evaluate(() => {
        function visible(element) {
          const style = window.getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return style.visibility !== "hidden" && style.display !== "none" && rect.width > 0 && rect.height > 0;
        }

        const texts = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          const node = walker.currentNode;
          const text = node.textContent.replace(/\s+/g, " ").trim();
          if (!text) continue;
          const parent = node.parentElement;
          if (!parent || !visible(parent)) continue;
          if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) continue;
          texts.push(text);
        }

        const assets = [];
        document.querySelectorAll("img[src]").forEach((img) => {
          if (visible(img)) assets.push(img.getAttribute("src"));
          const alt = img.getAttribute("alt");
          if (alt) texts.push(alt);
        });
        document.querySelectorAll("a[href]").forEach((link) => {
          if (visible(link)) assets.push(link.getAttribute("href"));
        });
        document.querySelectorAll("*").forEach((element) => {
          if (!visible(element)) return;
          const background = window.getComputedStyle(element).backgroundImage;
          if (!background || background === "none") return;
          for (const match of background.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
            assets.push(match[1]);
          }
        });

        return { texts: [...new Set(texts)], assets: [...new Set(assets)] };
      });

      for (const text of rendered.texts) {
        if (!isTextCovered(text, contentText)) {
          failures.push({ page: pageName, type: "text", value: text });
        }
      }

      for (const asset of rendered.assets) {
        if (!isAssetCovered(asset, contentAssets)) {
          failures.push({ page: pageName, type: "asset/link", value: asset });
        }
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  return failures;
}

function auditAdminConfig() {
  const config = fs.readFileSync(path.join(root, "admin", "config.yml"), "utf8");
  const failures = [];
  for (const file of contentFiles) {
    const expected = `file: "content/${file}"`;
    if (!config.includes(expected)) {
      failures.push({ type: "admin-config", value: `Missing ${expected}` });
    }

    const content = readJson(path.join("content", file));
    for (const key of collectKeys(content)) {
      const quoted = `name: "${key}"`;
      const unquoted = `name: ${key}`;
      if (!config.includes(quoted) && !config.includes(unquoted)) {
        failures.push({ type: "admin-config", value: `content/${file} key "${key}" has no admin field` });
      }
    }
  }
  return failures;
}

(async () => {
  const contentValues = collectContentValues();
  const contentText = contentValues.map(normalizeText).filter(Boolean);
  const contentAssets = contentValues.filter((value) => {
    return /^(assets\/|https?:\/\/|mailto:|[a-z0-9_-]+\.html$|#)/i.test(value);
  });

  const failures = [
    ...auditAdminConfig(),
    ...(await auditRenderedPages(contentText, contentAssets))
  ];

  if (failures.length) {
    console.error("CMS coverage audit failed:");
    for (const failure of failures) {
      const page = failure.page ? `${failure.page} ` : "";
      console.error(`- ${page}${failure.type}: ${failure.value}`);
    }
    process.exit(1);
  }

  console.log("CMS coverage audit passed: all rendered visible text, links, images, and configured content files are covered by admin-managed content.");
})();
