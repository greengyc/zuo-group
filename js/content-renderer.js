(function () {
  const colors = ["blue", "teal", "red", "gold"];

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, "&#96;");
  }

  async function loadJson(path, fallback) {
    try {
      const response = await fetch(path, { cache: "no-store" });
      if (!response.ok) throw new Error(`Unable to load ${path}`);
      return await response.json();
    } catch (error) {
      return fallback;
    }
  }

  function refreshIcons() {
    if (window.lucide) window.lucide.createIcons();
  }

  function renderHero(data) {
    const hero = data?.hero;
    if (!hero) return;

    const eyebrow = document.querySelector("[data-hero-eyebrow]");
    const title = document.querySelector("[data-hero-title]");
    const subtitle = document.querySelector("[data-hero-subtitle]");

    if (eyebrow && hero.eyebrow !== undefined) eyebrow.textContent = hero.eyebrow;
    if (title && hero.title !== undefined) title.textContent = hero.title;
    if (subtitle && hero.subtitle !== undefined) subtitle.textContent = hero.subtitle;
  }

  function publicationLinks(item) {
    const links = [];

    if (item.doiUrl) {
      links.push(`<a href="${escapeAttr(item.doiUrl)}" target="_blank" rel="noreferrer">DOI</a>`);
    } else if (item.doiLabel) {
      links.push(`<span>${escapeHtml(item.doiLabel)}</span>`);
    }

    if (item.journalUrl) {
      links.push(`<a href="${escapeAttr(item.journalUrl)}" target="_blank" rel="noreferrer">Journal</a>`);
    }

    return links.length ? `<div class="pub-links">${links.join("")}</div>` : "";
  }

  function renderPublications(data) {
    const list = document.querySelector("[data-publication-list]");
    const prior = document.querySelector("[data-prior-publications]");

    if (data && list) {
      let currentYear = "";
      list.innerHTML = (data.independent || [])
        .map((item, index) => {
          const yearHeading = item.year !== currentYear ? `<h3 class="year-heading">${escapeHtml(item.year)}</h3>` : "";
          currentYear = item.year;
          const color = item.tocColor || colors[index % colors.length];
          return `${yearHeading}
          <article class="publication-item">
            <div class="toc-box ${escapeAttr(color)}"><span>TOC pending</span></div>
            <div>
              <span class="pub-year">${escapeHtml(item.year)}</span>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.authors)}</p>
              <p class="citation"><em>${escapeHtml(item.journal)}</em> <strong>${escapeHtml(item.year)}</strong>, ${escapeHtml(item.details)}</p>
              ${publicationLinks(item)}
            </div>
          </article>`;
        })
        .join("");
    }

    if (data && prior) {
      prior.innerHTML = (data.prior || [])
        .map((item) => `<li><strong>${escapeHtml(item.title)}</strong> ${escapeHtml(item.authors)} <em>${escapeHtml(item.journal)}</em> <strong>${escapeHtml(item.year)}</strong>, ${escapeHtml(item.details)}</li>`)
        .join("");
    }
  }

  function renderPeople(data) {
    const target = document.querySelector("[data-people-list]");
    const groups = Array.isArray(data) ? data : data?.groups;
    if (!groups || !target) return;

    target.innerHTML = groups
      .map((group) => {
        const members = group.members || [];
        const body = members.length
          ? members
              .map((member) => {
                if (member.featured) {
                  const tags = (member.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
                  const photo = member.photo ? `<img class="person-photo" src="${escapeAttr(member.photo)}" alt="${escapeAttr(member.name)}" />` : "";
                  return `<article class="person-large">
                    ${photo}
                    <div>
                      <h3>${escapeHtml(member.name)}</h3>
                      <p>${escapeHtml(member.role)}</p>
                      ${tags ? `<div class="tag-row">${tags}</div>` : ""}
                    </div>
                  </article>`;
                }

                const detail = [member.role, member.degree, member.year, member.destination].filter(Boolean).join(" / ");
                return `<div class="person-placeholder"><strong>${escapeHtml(member.name)}</strong><span>${escapeHtml(detail)}</span></div>`;
              })
              .join("")
          : `<p class="muted-text">${escapeHtml(group.note || "To be updated.")}</p>`;

        const wrappedBody = members.some((member) => member.featured) || !members.length ? body : `<div class="placeholder-grid">${body}</div>`;
        return `<div class="people-category"><h2>${escapeHtml(group.category)}</h2>${wrappedBody}</div>`;
      })
      .join("");
  }

  function renderNews(data) {
    const target = document.querySelector("[data-news-list]");
    const items = Array.isArray(data) ? data : data?.items;
    renderHero(data);
    if (!items || !target) return;

    target.innerHTML = items
      .map((item) => `<article><time>${escapeHtml(item.date)}</time><h2>${escapeHtml(item.title)}</h2><p>${escapeHtml(item.text)}</p></article>`)
      .join("");
  }

  function renderResearch(data) {
    const target = document.querySelector("[data-research-list]");
    if (!data?.topics || !target) return;

    target.innerHTML = data.topics
      .map((topic) => `<article class="research-feature">
        <span class="card-number">${escapeHtml(topic.number)}</span>
        <h2>${escapeHtml(topic.titleLine1)}<br />${escapeHtml(topic.titleLine2)}</h2>
        <p>${escapeHtml(topic.text)}</p>
      </article>`)
      .join("");
  }

  function renderContact(data) {
    const rowsTarget = document.querySelector("[data-contact-rows]");
    const profilesTarget = document.querySelector("[data-contact-profiles]");
    if (!data) return;

    if (rowsTarget) {
      rowsTarget.innerHTML = (data.rows || [])
        .map((row) => {
          const value = row.type === "email"
            ? `<a href="mailto:${escapeAttr(row.value)}">${escapeHtml(row.value)}</a>`
            : `<p>${escapeHtml(row.value)}</p>`;
          return `<div class="contact-row"><span>${escapeHtml(row.label)}</span>${value}</div>`;
        })
        .join("");
    }

    if (profilesTarget) {
      profilesTarget.innerHTML = (data.profiles || [])
        .map((profile) => {
          const icon = `<i data-lucide="${escapeAttr(profile.icon || "external-link")}"></i>`;
          const text = `<span><strong>${escapeHtml(profile.label)}</strong><small>${escapeHtml(profile.detail)}</small></span>`;
          if (!profile.url) return `<article class="profile-link inactive">${icon}${text}</article>`;
          return `<a class="profile-link" href="${escapeAttr(profile.url)}" target="_blank" rel="noreferrer">${icon}${text}<i data-lucide="arrow-up-right"></i></a>`;
        })
        .join("");
    }
  }

  function renderPhotos(data) {
    const target = document.querySelector("[data-photo-list]");
    if (!data?.photos || !target) return;

    target.innerHTML = data.photos
      .map((photo) => {
        const classes = photo.large ? "photo-tile large" : "photo-tile";
        const image = photo.image ? ` style="background-image: linear-gradient(rgba(16, 24, 32, 0.28), rgba(16, 24, 32, 0.28)), url('${escapeAttr(photo.image)}')"` : "";
        return `<div class="${classes}"${image}><span>${escapeHtml(photo.title)}</span><small>${escapeHtml(photo.caption)}</small></div>`;
      })
      .join("");
  }

  function renderFacilities(data) {
    const target = document.querySelector("[data-facility-list]");
    if (!data?.items || !target) return;

    target.innerHTML = data.items
      .map((item) => `<article class="info-card"><i data-lucide="${escapeAttr(item.icon || "flask-conical")}"></i><h2>${escapeHtml(item.name)}</h2><p>${escapeHtml(item.description)}</p></article>`)
      .join("");
  }

  async function init() {
    if (document.querySelector("[data-publication-list]")) {
      renderPublications(await loadJson("content/publications.json", window.ZUO_PUBLICATIONS));
    }
    if (document.querySelector("[data-people-list]")) {
      renderPeople(await loadJson("content/people.json", window.ZUO_PEOPLE));
    }
    if (document.querySelector("[data-news-list]")) {
      renderNews(await loadJson("content/news.json", window.ZUO_NEWS));
    }
    if (document.querySelector("[data-research-list]")) {
      renderResearch(await loadJson("content/research.json", window.ZUO_RESEARCH));
    }
    if (document.querySelector("[data-contact-rows]") || document.querySelector("[data-contact-profiles]")) {
      renderContact(await loadJson("content/contact.json", window.ZUO_CONTACT));
    }
    if (document.querySelector("[data-photo-list]")) {
      renderPhotos(await loadJson("content/photos.json", window.ZUO_PHOTOS));
    }
    if (document.querySelector("[data-facility-list]")) {
      renderFacilities(await loadJson("content/facilities.json", window.ZUO_FACILITIES));
    }
    refreshIcons();
  }

  init();
})();
