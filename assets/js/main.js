// ── SVG icons ─────────────────────────────────────────────────────────────────
const icons = {
  externalLink: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
  book: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  play: `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
  ytPlay: `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
};

// ── YouTube helpers ───────────────────────────────────────────────────────────
function ytThumb(id) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}
function activateYT(el, id) {
  el.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1" allowfullscreen allow="autoplay"></iframe>`;
}
function resolveAudioUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.pathname.endsWith("/player.html")) {
      const src = parsed.searchParams.get("src");
      if (src) return src;
    }
  } catch (error) {
    console.warn("Unable to resolve audio URL", error);
  }
  return url;
}

function getLocalizedText(value, locale, fallback = "") {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    return value[locale] || value.en || value["ja"] || fallback;
  }
  return fallback;
}

// ── Card builder ──────────────────────────────────────────────────────────────
function buildCard(p, featured) {
  const t = strings[lang];
  const desc = p.description[lang] || p.description["en"];
  const sectionLabel = (t.sections && t.sections[p.category]) || p.category;
  const cardLabel = getLocalizedText(p.cardLabel, lang, sectionLabel);

  // Media
  let mediaPart = "";
  if (p.media.type === "youtube") {
    const id = p.media.id;
    mediaPart = `
<div class="card-media yt-thumb" onclick="activateYT(this,'${id}')" role="button" tabindex="0"
      onkeydown="if(event.key==='Enter')activateYT(this,'${id}')"
      aria-label="動画を再生">
  <img src="${ytThumb(id)}" alt="${p.title}" loading="lazy" width="480" height="270">
  <div class="yt-play">${icons.ytPlay}</div>
</div>`;
  } else if (p.media.type === "image") {
    const alt =
      (p.media.alt && (p.media.alt[lang] || p.media.alt["en"])) || p.title;
    mediaPart = `
<div class="card-media">
  <img src="${p.media.src}" alt="${alt}" loading="lazy" width="480" height="270">
</div>`;
  } else if (p.media.type === "audio_demo") {
    const samples = p.media.samples
      .map((s) => {
        const label = s.label[lang] || s.label["en"];
        const src = resolveAudioUrl(s.url);
        return `<div class="audio-sample">
  <span class="audio-label">${label}</span>
  <audio controls preload="metadata" class="audio-player">
    <source src="${src}" type="audio/mpeg" />
    Your browser does not support the audio element.
  </audio>
</div>`;
      })
      .join("");
    mediaPart = `<div class="audio-media">${samples}</div>`;
  }

  // Tags
  let tagsPart = "";
  if (p.tags && p.tags.length) {
    tagsPart = `<div class="card-tags">${p.tags.map((tg) => `<span class="card-tag">${tg}</span>`).join("")}</div>`;
  }

  // Footer links
  let linkParts = [];
  if (p.links.repo) {
    linkParts.push(
      `<a href="${p.links.repo}" target="_blank" rel="noopener noreferrer" class="card-link">${icons.externalLink} ${t.labels["code"]}</a>`,
    );
  }
  if (p.links.notebook) {
    linkParts.push(
      `<a href="${p.links.notebook}" target="_blank" rel="noopener noreferrer" class="card-link">${icons.externalLink} ${t.labels["notebook"]}</a>`,
    );
  }
  if (p.links.readme) {
    const rm = p.links.readme;
    const readmeUrl =
      rm && typeof rm === "object" ? (rm[lang] ?? rm["en"] ?? "") : rm;
    if (readmeUrl) {
      linkParts.push(
        `<a href="${readmeUrl}" target="_blank" rel="noopener noreferrer" class="card-link">${icons.book} ${t.labels["readme"]}</a>`,
      );
    }
  }
  if (p.links.competition) {
    linkParts.push(
      `<a href="${p.links.competition}" target="_blank" rel="noopener noreferrer" class="card-link">${icons.externalLink} ${t.labels["competition"]}</a>`,
    );
  }

  return `
<article class="card${featured ? " card-featured" : ""}" data-slug="${p.slug}">
${mediaPart}
<div class="card-body">
  <span class="card-category">${cardLabel}</span>
  <h3 class="card-title">${p.title}</h3>
  <p class="card-desc">${desc}</p>
  ${tagsPart}
</div>
${linkParts.length ? `<footer class="card-footer">${linkParts.join("")}</footer>` : ""}
</article>`;
}

// ── Render ────────────────────────────────────────────────────────────────────
const CATEGORY_ORDER = ["web", "android", "line", "deep-learning", "others"];

let projectsData = [];

function renderProjects() {
  const root = document.getElementById("projects-root");
  if (!projectsData.length) {
    root.innerHTML = "";
    return;
  }

  const t = strings[lang];
  const byCategory = {};
  CATEGORY_ORDER.forEach((c) => (byCategory[c] = []));
  projectsData.forEach((p) => {
    if (!byCategory[p.category]) byCategory[p.category] = [];
    byCategory[p.category].push(p);
  });

  let html = "";
  CATEGORY_ORDER.forEach((cat) => {
    const items = byCategory[cat];
    if (!items || !items.length) return;
    const sectionLabel = (t.sections && t.sections[cat]) || cat;
    const orderedItems = [...items].sort(
      (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
    );

    let cards = "";
    orderedItems.forEach((p, i) => {
      cards += buildCard(p, i === 0 && orderedItems.length > 1);
    });

    html += `
<section class="section" aria-labelledby="cat-${cat}">
  <div class="section-header">
    <div class="section-accent" aria-hidden="true"></div>
    <h2 class="section-title" id="cat-${cat}">${sectionLabel}</h2>
    <span class="section-badge">${orderedItems.length}</span>
  </div>
  <div class="bento-grid">${cards}</div>
</section>`;
  });

  root.innerHTML = html;
}

// ── Load data ─────────────────────────────────────────────────────────────────
Promise.all([
  fetch("assets/data/strings.json").then((r) => r.json()),
  fetch("assets/data/projects.json").then((r) => r.json()),
]).then(([str, projects]) => {
  strings = str;
  projectsData = projects;
  setLang(lang);
});
