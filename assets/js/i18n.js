// ── i18n strings ──────────────────────────────────────────────────────────────
let lang = "ja";
let strings = {};

function setLang(l) {
  lang = l;
  document.getElementById("btn-en").classList.toggle("active", l === "en");
  document.getElementById("btn-ja").classList.toggle("active", l === "ja");
  // data-i18n 属性の更新（strings がロード済みの場合のみ）
  if (strings[l]) {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (strings[l][key] !== undefined) el.innerHTML = strings[l][key];
    });
  }
  renderProjects();
}
