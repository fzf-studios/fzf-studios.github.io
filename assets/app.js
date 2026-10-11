(function () {
  "use strict";

  var STORAGE_KEY = "fzf.lang";
  var SUPPORTED = ["ru", "en"];

  var dict = {
    en: {
      "meta.title": "Freedom Interactive Studios — Indie games",
      "hero.eyebrow": "Indie game studio",
      "hero.title": "Imagination knows no bounds.",
      "hero.lead": "We create exciting indie games set in our own unique universe. Join us for extraordinary stories and adventures.",
      "hero.cta": "Our games",
      "hero.play": "Google Play",
      "hero.discord": "Join Discord",
      "games.title": "Our games",
      "games.sub": "Free to download on Android.",
      "tag.idle": "Idle",
      "tag.tycoon": "Tycoon",
      "tag.vampires": "Vampires",
      "tag.puzzle": "Classic",
      "tag.duo": "1–2 players",
      "vampire.desc": "Build your vampire empire and grow it while you're away.",
      "ttt.name": "Tic-Tac-Toe",
      "ttt.desc": "Classic Tic-Tac-Toe. Play with a friend on one device or against AI.",
      "game.play": "Get it on Google Play",
      "game.privacy": "Privacy policy",
      "about.title": "About the studio",
      "about.text": "Freedom Interactive Studios is an independent studio. We build our games with care for atmosphere and details, and keep them fair to players.",
      "foot.legal": "Legal information",
      "foot.contact": "Contact"
    },
    ru: {
      "meta.title": "Freedom Interactive Studios — Инди-игры",
      "hero.eyebrow": "Студия инди-игр",
      "hero.title": "Фантазия не знает границ.",
      "hero.lead": "Мы создаём увлекательные инди-игры в нашей собственной вселенной. Присоединяйтесь к необычным историям и приключениям.",
      "hero.cta": "Наши игры",
      "hero.play": "Google Play",
      "hero.discord": "Наш Discord",
      "games.title": "Наши игры",
      "games.sub": "Бесплатно на Android.",
      "tag.idle": "Айдл",
      "tag.tycoon": "Тайкун",
      "tag.vampires": "Вампиры",
      "tag.puzzle": "Классика",
      "tag.duo": "1–2 игрока",
      "vampire.desc": "Постройте вампирскую империю и развивайте её даже пока вас нет в игре.",
      "ttt.name": "Крестики-Нолики",
      "ttt.desc": "Классические крестики-нолики. Играйте с другом на одном устройстве или с ИИ.",
      "game.play": "Скачать в Google Play",
      "game.privacy": "Политика конфиденциальности",
      "about.title": "О студии",
      "about.text": "Freedom Interactive Studios — независимая студия. Мы делаем игры с вниманием к атмосфере и деталям и стараемся, чтобы они были честными по отношению к игрокам.",
      "foot.legal": "Юридическая информация",
      "foot.contact": "Контакты"
    }
  };

  function safeGet() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function safeSet(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* storage unavailable */ }
  }

  function detect() {
    var fromQuery = new URLSearchParams(location.search).get("lang");
    if (SUPPORTED.indexOf(fromQuery) >= 0) return fromQuery;

    var stored = safeGet();
    if (SUPPORTED.indexOf(stored) >= 0) return stored;

    var langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || "en"];
    for (var i = 0; i < langs.length; i++) {
      var code = String(langs[i]).slice(0, 2).toLowerCase();
      if (code === "ru" || code === "uk" || code === "be" || code === "kk") return "ru";
      if (code === "en") return "en";
    }
    return "en";
  }

  function apply(lang) {
    var table = dict[lang];
    document.documentElement.lang = lang;
    document.title = table["meta.title"];

    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var value = table[nodes[i].getAttribute("data-i18n")];
      if (value !== undefined) nodes[i].textContent = value;
    }

    var buttons = document.querySelectorAll(".lang button");
    for (var j = 0; j < buttons.length; j++) {
      var active = buttons[j].getAttribute("data-lang") === lang;
      buttons[j].setAttribute("aria-pressed", active ? "true" : "false");
    }
  }

  function bindFallbacks() {
    var images = document.querySelectorAll(".icon img");
    images.forEach(function (img) {
      var fallback = img.previousElementSibling;
      var hide = function () { img.style.display = "none"; };
      var loaded = function () { if (fallback) fallback.style.display = "none"; };
      img.addEventListener("error", hide);
      img.addEventListener("load", loaded);
      if (img.complete) {
        if (img.naturalWidth === 0) hide(); else loaded();
      }
    });
  }

  document.querySelector(".lang").addEventListener("click", function (event) {
    var button = event.target.closest("button[data-lang]");
    if (!button) return;
    var lang = button.getAttribute("data-lang");
    safeSet(lang);
    apply(lang);
  });

  document.getElementById("year").textContent = String(new Date().getFullYear());
  apply(detect());
  bindFallbacks();
})();
