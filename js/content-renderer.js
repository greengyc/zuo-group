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

  function renderPublications() {
    const data = window.ZUO_PUBLICATIONS;
    const list = document.querySelector("[data-publication-list]");
    const prior = document.querySelector("[data-prior-publications]");

    if (data && list) {
      let currentYear = "";
      list.innerHTML = data.independent
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
      prior.innerHTML = data.prior
        .map((item) => `<li><strong>${escapeHtml(item.title)}</strong> ${escapeHtml(item.authors)} <em>${escapeHtml(item.journal)}</em> <strong>${escapeHtml(item.year)}</strong>, ${escapeHtml(item.details)}</li>`)
        .join("");
    }
  }

  function renderPeople() {
    const data = window.ZUO_PEOPLE;
    const target = document.querySelector("[data-people-list]");
    if (!data || !target) return;

    target.innerHTML = data
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

  function renderNews() {
    const data = window.ZUO_NEWS;
    const target = document.querySelector("[data-news-list]");
    if (!data || !target) return;

    target.innerHTML = data
      .map((item) => `<article><time>${escapeHtml(item.date)}</time><h2>${escapeHtml(item.title)}</h2><p>${escapeHtml(item.text)}</p></article>`)
      .join("");
  }

  renderPublications();
  renderPeople();
  renderNews();
})();
