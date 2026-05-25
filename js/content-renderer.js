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

  function isVisible(item) {
    return item?.visible !== false;
  }

  function visibleItems(items) {
    return (items || []).filter(isVisible);
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

  function setText(selector, value) {
    const target = document.querySelector(selector);
    if (target && value !== undefined) target.textContent = value;
  }

  function setMeta(name, value) {
    if (!value) return;
    let target = document.querySelector(`meta[name="${name}"]`);
    if (!target) {
      target = document.createElement("meta");
      target.setAttribute("name", name);
      document.head.appendChild(target);
    }
    target.setAttribute("content", value);
  }

  function isExternalUrl(url) {
    return /^https?:\/\//i.test(String(url || ""));
  }

  function assetUrl(url) {
    const value = String(url || "");
    if (value.startsWith("/assets/")) return value.slice(1);
    return value;
  }

  function paragraphsHtml(value) {
    return String(value || "")
      .split(/\n+/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
      .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
      .join("");
  }

  function buttonHtml(button, fallbackStyle = "primary") {
    if (!button || button.visible === false || !button.label || !button.url) return "";
    const safeStyle = button.style === "ghost" ? "ghost" : fallbackStyle;
    const icon = button.icon ? `<i data-lucide="${escapeAttr(button.icon)}"></i>` : "";
    const target = isExternalUrl(button.url) ? ` target="_blank" rel="noreferrer"` : "";
    return `<a class="button ${safeStyle}" href="${escapeAttr(button.url)}"${target}>${icon}${escapeHtml(button.label)}</a>`;
  }

  function buttonFromFields(source) {
    return buttonHtml({
      visible: source.visible,
      label: source.buttonLabel,
      url: source.buttonUrl,
      style: source.buttonStyle,
      icon: source.buttonIcon
    });
  }

  function choiceClass(prefix, value, allowed, fallback) {
    const safeValue = allowed.includes(value) ? value : fallback;
    return `${prefix}-${safeValue}`;
  }

  const imagePositions = ["center", "top", "bottom", "left", "right"];

  function positionValue(value) {
    const positions = {
      top: "center top",
      bottom: "center bottom",
      left: "left center",
      right: "right center",
      center: "center center"
    };
    return positions[value] || positions.center;
  }

  function imageDisplayClasses(baseClass, source = {}, options = {}) {
    const sizeField = options.sizeField || "imageHeight";
    const fitField = options.fitField || "imageFit";
    const positionField = options.positionField || "imagePosition";
    const sizePrefix = options.sizePrefix || "image-height";
    const sizes = options.sizes || ["short", "standard", "tall"];
    const fallbackSize = options.fallbackSize || "standard";
    const fallbackFit = options.fallbackFit || "cover";
    return [
      baseClass,
      choiceClass(sizePrefix, source[sizeField], sizes, fallbackSize),
      choiceClass("fit", source[fitField], ["contain", "cover"], fallbackFit),
      choiceClass("pos", source[positionField], imagePositions, "center")
    ].join(" ");
  }

  function applyHeroControls(heroSection, hero = {}, options = {}) {
    const heightFallback = options.heightFallback || "standard";
    heroSection.classList.remove("hero-height-compact", "hero-height-standard", "hero-height-tall");
    heroSection.classList.add(choiceClass("hero-height", hero.heroHeight, ["compact", "standard", "tall"], heightFallback));
    heroSection.style.backgroundPosition = positionValue(hero.backgroundPosition);
    heroSection.style.backgroundSize = hero.backgroundSize === "contain" ? "contain" : "cover";
    heroSection.style.backgroundRepeat = "no-repeat";
  }

  function renderSite(data) {
    if (!data) return;

    if (data.theme?.primaryColor) document.documentElement.style.setProperty("--red", data.theme.primaryColor);
    if (data.theme?.primaryDarkColor) document.documentElement.style.setProperty("--red-dark", data.theme.primaryDarkColor);

    const brand = document.querySelector(".brand");
    if (brand && data.brand) {
      brand.href = data.brand.homeUrl || "index.html";
      brand.setAttribute("aria-label", `${data.brand.groupName || "Zuo Group"} home`);
      const mark = brand.querySelector(".brand-mark");
      const name = brand.querySelector(".brand-text strong");
      const subtitle = brand.querySelector(".brand-text span");
      if (mark && data.brand.logoImage) {
        mark.style.backgroundImage = `url("${String(data.brand.logoImage).replace(/"/g, '\\"')}")`;
      }
      if (name) name.textContent = data.brand.groupName || "";
      if (subtitle) subtitle.textContent = data.brand.subtitle || "";
    }

    const nav = document.querySelector(".site-nav");
    if (nav && Array.isArray(data.navigation)) {
      const pageKey = document.body.dataset.page;
      nav.innerHTML = visibleItems(data.navigation)
        .map((item) => `<a class="${item.pageKey === pageKey ? "active" : ""}" href="${escapeAttr(item.url)}">${escapeHtml(item.label)}</a>`)
        .join("");
    }

    const footer = document.querySelector(".site-footer");
    if (footer && data.footer) {
      const links = visibleItems(data.footer.links)
        .map((link) => `<a href="${escapeAttr(link.url)}"${isExternalUrl(link.url) ? ' target="_blank" rel="noreferrer"' : ""}>${escapeHtml(link.label)}</a>`)
        .join("");
      footer.innerHTML = `<div><strong>${escapeHtml(data.footer.groupName)}</strong><p>${escapeHtml(data.footer.affiliation)}</p></div>${links ? `<div class="footer-links">${links}</div>` : ""}`;
    }
  }

  function renderHero(data) {
    const hero = data?.hero;
    if (!hero) return;

    const heroSection = document.querySelector("[data-page-hero]");
    const eyebrow = document.querySelector("[data-hero-eyebrow]");
    const title = document.querySelector("[data-hero-title]");
    const subtitle = document.querySelector("[data-hero-subtitle]");
    const actions = document.querySelector("[data-hero-actions]");

    if (heroSection) {
      heroSection.hidden = hero.show === false;
      if (hero.show === false) return;
      heroSection.classList.remove("hero-size-compact", "hero-size-normal", "hero-size-large", "hero-align-left", "hero-align-center");
      heroSection.classList.add(`hero-size-${hero.titleSize || "normal"}`);
      heroSection.classList.add(`hero-align-${hero.textAlignment || "left"}`);
      applyHeroControls(heroSection, hero);
      if (hero.backgroundImage) {
        const backgroundUrl = assetUrl(hero.backgroundImage).replace(/"/g, '\\"');
        heroSection.style.backgroundImage = `linear-gradient(120deg, rgba(16, 24, 32, 0.92), rgba(23, 32, 42, 0.78)), url("${backgroundUrl}")`;
      }
    }

    if (eyebrow && hero.eyebrow !== undefined) eyebrow.textContent = hero.eyebrow;
    if (title && hero.title !== undefined) title.textContent = hero.title;
    if (subtitle && hero.subtitle !== undefined) subtitle.textContent = hero.subtitle;
    if (actions) {
      actions.innerHTML = visibleItems(hero.buttons).map((button) => buttonHtml(button)).join("");
      actions.hidden = !actions.innerHTML;
    }
  }

  function renderEditableBlocks(blocks, targetSelector, classPrefix = "news") {
    const target = document.querySelector(targetSelector);
    if (!target) return;

    target.innerHTML = visibleItems(blocks)
      .map((block) => {
        if (block.type === "image") {
          const image = block.image ? `<img class="${imageDisplayClasses("editable-block-image", block)}" src="${escapeAttr(assetUrl(block.image))}" alt="${escapeAttr(block.title || "Image")}" />` : "";
          return `<article class="${classPrefix}-block image-block">${image}<div><h2>${escapeHtml(block.title)}</h2><p>${escapeHtml(block.text)}</p>${buttonFromFields(block)}</div></article>`;
        }

        if (block.type === "button") {
          return `<article class="${classPrefix}-block button-block"><div><h2>${escapeHtml(block.title)}</h2><p>${escapeHtml(block.text)}</p></div>${buttonFromFields(block)}</article>`;
        }

        return `<article class="${classPrefix}-block text-block"><h2>${escapeHtml(block.title)}</h2><p>${escapeHtml(block.text)}</p>${buttonFromFields(block)}</article>`;
      })
      .join("");
  }

  function renderHome(data) {
    if (!data) return;

    if (data.seo?.title) document.title = data.seo.title;
    setMeta("description", data.seo?.description);
    setMeta("keywords", data.seo?.keywords);

    const hero = data.hero || {};
    const heroSection = document.querySelector("[data-home-hero]");
    if (heroSection) {
      heroSection.hidden = hero.show === false;
      heroSection.classList.toggle("hero-align-center", hero.textAlignment === "center");
      applyHeroControls(heroSection, hero, { heightFallback: "tall" });
      const media = heroSection.querySelector("[data-home-hero-image]");
      if (media) {
        media.className = imageDisplayClasses("hero-media", {
          imageFit: hero.backgroundSize,
          imagePosition: hero.backgroundPosition,
          imageHeight: "standard"
        });
        if (hero.backgroundImage) media.src = assetUrl(hero.backgroundImage);
      }
      setText("[data-home-hero-eyebrow]", hero.eyebrow);
      setText("[data-home-hero-title]", hero.title);
      setText("[data-home-hero-statement]", hero.statement);
      setText("[data-home-hero-copy]", hero.copy);
      const actions = heroSection.querySelector("[data-home-hero-actions]");
      if (actions) actions.innerHTML = visibleItems(hero.buttons).map((button) => buttonHtml(button, "primary")).join("");
    }

    const metrics = document.querySelector("[data-home-metrics]");
    if (metrics) {
      metrics.hidden = data.metrics?.show === false || !visibleItems(data.metrics?.items).length;
      metrics.innerHTML = visibleItems(data.metrics?.items)
        .map((item) => `<div><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></div>`)
        .join("");
    }

    const focus = document.querySelector("[data-home-focus]");
    if (focus) {
      focus.hidden = data.focus?.show === false;
      setText("[data-home-focus-eyebrow]", data.focus?.eyebrow);
      setText("[data-home-focus-text]", data.focus?.text);
      const image = focus.querySelector("[data-home-focus-image]");
      if (image) {
        image.className = imageDisplayClasses("research-focus-image", data.focus, { fallbackFit: "contain" });
        if (data.focus?.image) image.src = assetUrl(data.focus.image);
        if (data.focus?.imageAlt !== undefined) image.alt = data.focus.imageAlt;
      }
      const link = focus.querySelector("[data-home-focus-link]");
      if (link) {
        link.textContent = data.focus?.linkLabel || "";
        link.href = data.focus?.linkUrl || "#";
        link.hidden = !data.focus?.linkLabel || !data.focus?.linkUrl;
      }
    }

    const guide = document.querySelector("[data-home-guide]");
    if (guide) {
      guide.hidden = data.guide?.show === false;
      setText("[data-home-guide-eyebrow]", data.guide?.eyebrow);
      setText("[data-home-guide-title]", data.guide?.title);
      const cards = guide.querySelector("[data-home-guide-cards]");
      if (cards) {
        cards.innerHTML = visibleItems(data.guide?.cards)
          .map((card) => `<a class="nav-card" href="${escapeAttr(card.url || "#")}"><span>${escapeHtml(card.number)}</span><h3>${escapeHtml(card.title)}</h3><p>${escapeHtml(card.text)}</p></a>`)
          .join("");
      }
    }

    const joinBand = document.querySelector("[data-home-join]");
    if (joinBand) {
      joinBand.hidden = data.joinBand?.show === false;
      setText("[data-home-join-eyebrow]", data.joinBand?.eyebrow);
      setText("[data-home-join-title]", data.joinBand?.title);
      const button = joinBand.querySelector("[data-home-join-button]");
      if (button) {
        button.href = data.joinBand?.buttonUrl || "#";
        button.innerHTML = `${data.joinBand?.buttonIcon ? `<i data-lucide="${escapeAttr(data.joinBand.buttonIcon)}"></i>` : ""}${escapeHtml(data.joinBand?.buttonLabel || "")}`;
        button.hidden = !data.joinBand?.buttonLabel || !data.joinBand?.buttonUrl;
      }
    }
  }

  function publicationLinks(item, labels = {}) {
    const links = [];
    const doiLabel = item.doiButtonLabel || labels.doi || "DOI";
    const journalLabel = item.journalButtonLabel || labels.journal || "Journal";

    if (item.doiUrl) {
      links.push(`<a href="${escapeAttr(item.doiUrl)}" target="_blank" rel="noreferrer">${escapeHtml(doiLabel)}</a>`);
    } else if (item.doiLabel) {
      links.push(`<span>${escapeHtml(item.doiLabel)}</span>`);
    }

    if (item.journalUrl) {
      links.push(`<a href="${escapeAttr(item.journalUrl)}" target="_blank" rel="noreferrer">${escapeHtml(journalLabel)}</a>`);
    }

    return links.length ? `<div class="pub-links">${links.join("")}</div>` : "";
  }

  function renderPublicationSectionHeading(selector, section) {
    const target = document.querySelector(selector);
    if (!target || !section) return;
    target.hidden = section.show === false;
    const eyebrow = target.querySelector(".eyebrow");
    const title = target.querySelector("h2");
    if (eyebrow) eyebrow.textContent = section.eyebrow || "";
    if (title) title.textContent = section.title || "";
  }

  function renderPublications(data) {
    renderHero(data);
    renderPublicationSectionHeading("[data-publication-independent-heading]", data?.sections?.independent);
    renderPublicationSectionHeading("[data-publication-prior-heading]", data?.sections?.prior);

    const independentSection = document.querySelector("[data-publication-independent-section]");
    const priorSection = document.querySelector("[data-publication-prior-section]");
    if (independentSection && data?.sections?.independent) independentSection.hidden = data.sections.independent.show === false;
    if (priorSection && data?.sections?.prior) priorSection.hidden = data.sections.prior.show === false;

    const list = document.querySelector("[data-publication-list]");
    const prior = document.querySelector("[data-prior-publications]");

    if (data && list) {
      let currentYear = "";
      list.innerHTML = visibleItems(data.independent)
        .map((item, index) => {
          const yearHeading = item.year !== currentYear ? `<h3 class="year-heading">${escapeHtml(item.year)}</h3>` : "";
          currentYear = item.year;
          const color = item.tocColor || colors[index % colors.length];
          const tocWidth = choiceClass("toc-width", item.tocWidth, ["small", "standard", "wide"], "standard");
          const tocHeight = choiceClass("toc-height", item.tocHeight, ["short", "standard", "tall"], "standard");
          const tocFit = choiceClass("fit", item.tocFit, ["contain", "cover"], "contain");
          const tocPosition = choiceClass("pos", item.tocPosition, ["center", "top", "bottom", "left", "right"], "center");
          const tocBackground = choiceClass("bg", item.tocBackground, ["white", "light", "transparent"], "white");
          const toc = item.tocImage
            ? `<div class="toc-box image ${tocHeight} ${tocFit} ${tocPosition} ${tocBackground}"><img src="${escapeAttr(assetUrl(item.tocImage))}" alt="${escapeAttr(item.title)} TOC graphic" /></div>`
            : `<div class="toc-box ${escapeAttr(color)}"><span>${escapeHtml(item.tocLabel || "TOC pending")}</span></div>`;
          return `${yearHeading}
          <article class="publication-item ${tocWidth}">
            ${toc}
            <div>
              <span class="pub-year">${escapeHtml(item.year)}</span>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.authors)}</p>
              <p class="citation"><em>${escapeHtml(item.journal)}</em> <strong>${escapeHtml(item.year)}</strong>, ${escapeHtml(item.details)}</p>
              ${publicationLinks(item, data.linkLabels)}
            </div>
          </article>`;
        })
        .join("");
    }

    if (data && prior) {
      prior.innerHTML = visibleItems(data.prior)
        .map((item) => `<li><strong>${escapeHtml(item.title)}</strong> ${escapeHtml(item.authors)} <em>${escapeHtml(item.journal)}</em> <strong>${escapeHtml(item.year)}</strong>, ${escapeHtml(item.details)}</li>`)
        .join("");
    }
  }

  function renderPeople(data) {
    renderHero(data);
    const target = document.querySelector("[data-people-list]");
    const groups = Array.isArray(data) ? data : data?.groups;
    if (!groups || !target) return;

    target.innerHTML = visibleItems(groups)
      .map((group) => {
        const members = visibleItems(group.members);
        const body = members.length
          ? members
              .map((member) => {
                if (member.featured) {
                  const tags = (member.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
                  const photoClasses = imageDisplayClasses("person-photo", member, {
                    sizeField: "photoSize",
                    fitField: "photoFit",
                    positionField: "photoPosition",
                    sizePrefix: "photo-size",
                    sizes: ["small", "standard", "large"],
                    fallbackSize: "standard"
                  });
                  const photo = member.photo ? `<img class="${photoClasses}" src="${escapeAttr(assetUrl(member.photo))}" alt="${escapeAttr(member.name)}" />` : "";
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
                if (member.photo) {
                  const photoClasses = imageDisplayClasses("person-photo", member, {
                    sizeField: "photoSize",
                    fitField: "photoFit",
                    positionField: "photoPosition",
                    sizePrefix: "photo-size",
                    sizes: ["small", "standard", "large"],
                    fallbackSize: "standard"
                  });
                  return `<article class="person-placeholder person-with-photo">
                    <img class="${photoClasses}" src="${escapeAttr(assetUrl(member.photo))}" alt="${escapeAttr(member.name)}" />
                    <div><strong>${escapeHtml(member.name)}</strong><span>${escapeHtml(detail)}</span></div>
                  </article>`;
                }
                return `<div class="person-placeholder"><strong>${escapeHtml(member.name)}</strong><span>${escapeHtml(detail)}</span></div>`;
              })
              .join("")
          : `<p class="muted-text">${escapeHtml(group.note || "To be updated.")}</p>`;

        const isPrincipalInvestigator = String(group.category || "").toLowerCase().includes("principal investigator");
        const wrappedBody = members.some((member) => member.featured) || !members.length ? body : `<div class="placeholder-grid">${body}</div>`;
        if (isPrincipalInvestigator && group.note) {
          return `<div class="people-category pi-category">
            <h2>${escapeHtml(group.category)}</h2>
            <div class="pi-profile-layout">
              ${wrappedBody}
              <article class="pi-bio-card">
                <p class="eyebrow">Biography</p>
                ${paragraphsHtml(group.note)}
              </article>
            </div>
          </div>`;
        }
        return `<div class="people-category"><h2>${escapeHtml(group.category)}</h2>${wrappedBody}</div>`;
      })
      .join("");
  }

  function renderNews(data) {
    const target = document.querySelector("[data-news-list]");
    const items = Array.isArray(data) ? data : data?.items;
    renderHero(data);
    renderEditableBlocks(data?.blocks, "[data-news-blocks]", "news");
    if (!items || !target) return;

    target.innerHTML = visibleItems(items)
      .map((item) => {
        const image = item.image ? `<img class="${imageDisplayClasses("news-item-image", item)}" src="${escapeAttr(assetUrl(item.image))}" alt="${escapeAttr(item.title)}" />` : "";
        return `<article class="${image ? "has-image" : ""}">${image}<div><time>${escapeHtml(item.date)}</time><h2>${escapeHtml(item.title)}</h2><p>${escapeHtml(item.text)}</p>${buttonFromFields(item)}</div></article>`;
      })
      .join("");
  }

  function renderResearch(data) {
    renderHero(data);
    const target = document.querySelector("[data-research-list]");
    if (!data?.topics || !target) return;

    target.innerHTML = visibleItems(data.topics)
      .map((topic) => `<article class="research-feature">
        <span class="card-number">${escapeHtml(topic.number)}</span>
        <h2>${escapeHtml(topic.titleLine1)}<br />${escapeHtml(topic.titleLine2)}</h2>
        <p>${escapeHtml(topic.text)}</p>
      </article>`)
      .join("");
  }

  function renderContact(data) {
    renderHero(data);
    const rowsTarget = document.querySelector("[data-contact-rows]");
    const profilesTarget = document.querySelector("[data-contact-profiles]");
    const section = document.querySelector("[data-contact-section]");
    if (!data) return;

    if (section) {
      section.hidden = data.section?.show === false;
      setText("[data-contact-section-eyebrow]", data.section?.eyebrow);
      setText("[data-contact-section-title]", data.section?.title);
    }

    if (rowsTarget) {
      rowsTarget.innerHTML = visibleItems(data.rows)
        .map((row) => {
          const value = row.type === "email"
            ? `<a href="mailto:${escapeAttr(row.value)}">${escapeHtml(row.value)}</a>`
            : `<p>${escapeHtml(row.value)}</p>`;
          return `<div class="contact-row"><span>${escapeHtml(row.label)}</span>${value}</div>`;
        })
        .join("");
    }

    if (profilesTarget) {
      profilesTarget.innerHTML = visibleItems(data.profiles)
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
    renderHero(data);
    const target = document.querySelector("[data-photo-list]");
    if (!data?.photos || !target) return;

    target.innerHTML = visibleItems(data.photos)
      .map((photo) => {
        const classes = [
          photo.large ? "photo-tile large" : "photo-tile",
          choiceClass("photo-height", photo.imageHeight, ["short", "standard", "tall"], "standard"),
          choiceClass("bg-fit", photo.imageFit, ["contain", "cover"], "cover"),
          choiceClass("bg-pos", photo.imagePosition, imagePositions, "center")
        ].join(" ");
        const image = photo.image ? ` style="background-image: linear-gradient(rgba(16, 24, 32, 0.28), rgba(16, 24, 32, 0.28)), url('${escapeAttr(assetUrl(photo.image))}')"` : "";
        return `<div class="${classes}"${image}><span>${escapeHtml(photo.title)}</span><small>${escapeHtml(photo.caption)}</small></div>`;
      })
      .join("");
  }

  function renderFacilities(data) {
    renderHero(data);
    const target = document.querySelector("[data-facility-list]");
    if (!data?.items || !target) return;

    target.innerHTML = visibleItems(data.items)
      .map((item) => {
        const image = item.image ? `<img class="${imageDisplayClasses("info-card-image", item)}" src="${escapeAttr(assetUrl(item.image))}" alt="${escapeAttr(item.name)}" />` : "";
        return `<article class="info-card">${image}<i data-lucide="${escapeAttr(item.icon || "flask-conical")}"></i><h2>${escapeHtml(item.name)}</h2><p>${escapeHtml(item.description)}</p>${buttonFromFields(item)}</article>`;
      })
      .join("");
  }

  function renderResources(data) {
    renderHero(data);
    const target = document.querySelector("[data-resource-list]");
    if (!target) return;
    target.innerHTML = visibleItems(data?.items)
      .map((item) => `<article class="info-card"><i data-lucide="${escapeAttr(item.icon || "book-open")}"></i><h2>${escapeHtml(item.title)}</h2><p>${escapeHtml(item.description)}</p>${buttonFromFields(item)}</article>`)
      .join("");
  }

  function renderJoin(data) {
    renderHero(data);
    const intro = document.querySelector("[data-join-intro]");
    if (intro) {
      intro.hidden = data?.intro?.show === false;
      setText("[data-join-eyebrow]", data?.intro?.eyebrow);
      setText("[data-join-title]", data?.intro?.title);
      const paragraphs = intro.querySelector("[data-join-paragraphs]");
      if (paragraphs) {
        paragraphs.innerHTML = (data?.intro?.paragraphs || []).map((text) => `<p>${escapeHtml(text)}</p>`).join("");
      }
      const button = intro.querySelector("[data-join-button]");
      if (button) {
        button.href = data?.intro?.buttonUrl || "#";
        button.innerHTML = `${data?.intro?.buttonIcon ? `<i data-lucide="${escapeAttr(data.intro.buttonIcon)}"></i>` : ""}${escapeHtml(data?.intro?.buttonLabel || "")}`;
        button.hidden = !data?.intro?.buttonLabel || !data?.intro?.buttonUrl;
      }
    }
    renderEditableBlocks(data?.blocks, "[data-join-blocks]", "news");
  }

  async function init() {
    renderSite(await loadJson("content/site.json", window.ZUO_SITE));

    if (document.querySelector("[data-home-hero]")) {
      renderHome(await loadJson("content/home.json", window.ZUO_HOME));
    }
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
    if (document.querySelector("[data-resource-list]")) {
      renderResources(await loadJson("content/resources.json", window.ZUO_RESOURCES));
    }
    if (document.querySelector("[data-join-intro]") || document.querySelector("[data-join-blocks]")) {
      renderJoin(await loadJson("content/join.json", window.ZUO_JOIN));
    }
    refreshIcons();
  }

  init();
})();
