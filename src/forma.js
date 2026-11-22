/*! Forma by FSA v@@VERSION@@ — comportements des classes fx-*. Aucune dépendance.
 *  À charger dans <head> SANS defer : le thème mémorisé est appliqué avant le premier rendu,
 *  le reste se branche au chargement du document par délégation d'événements.
 *
 *  Thème         <button data-fx-theme-toggle>         bascule clair/sombre, mémorise, aria-pressed
 *  Menu latéral  <button data-fx-sidebar-toggle>       réduit/déplie .fx-shell (tiroir sous 1024 px)
 *  Menu          <button data-fx-menu="id-du-menu">    ouvre/ferme, flèches, Échap, clic dehors
 *  Fenêtre       <button data-fx-open="id-du-dialog">  ouvre un <dialog class="fx-modal|fx-drawer">
 *                <button data-fx-close>                ferme le <dialog> parent ; clic sur le voile aussi
 *  Événement     document « forma:themechange » { detail: { theme } } à chaque changement de thème
 */
(function () {
  "use strict";
  var root = document.documentElement;
  var KEY_THEME = "forma-theme";
  var KEY_SIDEBAR = "forma-sidebar";
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  var narrow = window.matchMedia ? window.matchMedia("(max-width: 1023.98px)") : null;

  function store(key, value) {
    try {
      if (value === undefined) return window.localStorage.getItem(key);
      window.localStorage.setItem(key, value);
    } catch (e) { /* stockage indisponible : le comportement reste, sans mémoire */ }
    return null;
  }

  /* ---------- Thème ---------- */

  function currentTheme() {
    var set = root.getAttribute("data-forma-theme");
    if (set === "light" || set === "dark") return set;
    if (root.getAttribute("data-forma-skin") === "lab") return mq && mq.matches ? "dark" : "light";
    return mq && !mq.matches ? "light" : "dark"; // Foundation : sombre par défaut
  }

  function syncThemeButtons() {
    var dark = currentTheme() === "dark";
    var buttons = document.querySelectorAll("[data-fx-theme-toggle]");
    for (var i = 0; i < buttons.length; i++) buttons[i].setAttribute("aria-pressed", dark ? "true" : "false");
  }

  function announceTheme() {
    syncThemeButtons();
    document.dispatchEvent(new CustomEvent("forma:themechange", { detail: { theme: currentTheme() } }));
  }

  var saved = store(KEY_THEME);
  if (saved === "light" || saved === "dark") root.setAttribute("data-forma-theme", saved);

  if (mq) {
    var onSystem = function () { if (!root.hasAttribute("data-forma-theme")) announceTheme(); };
    if (mq.addEventListener) mq.addEventListener("change", onSystem); else if (mq.addListener) mq.addListener(onSystem);
  }

  function toggleTheme() {
    var next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-forma-theme", next);
    store(KEY_THEME, next);
    announceTheme();
  }

  /* ---------- Menu latéral ---------- */

  function shellOf(el) { return (el && el.closest(".fx-shell")) || document.querySelector(".fx-shell"); }

  function syncSidebar(shell) {
    if (!shell) return;
    var open = narrow && narrow.matches ? shell.hasAttribute("data-nav-open") : !shell.hasAttribute("data-collapsed");
    var buttons = shell.querySelectorAll("[data-fx-sidebar-toggle]");
    for (var i = 0; i < buttons.length; i++) buttons[i].setAttribute("aria-expanded", open ? "true" : "false");
  }

  function toggleSidebar(button) {
    var shell = shellOf(button);
    if (!shell) return;
    if (narrow && narrow.matches) {
      if (shell.hasAttribute("data-nav-open")) shell.removeAttribute("data-nav-open");
      else shell.setAttribute("data-nav-open", "");
    } else {
      if (shell.hasAttribute("data-collapsed")) shell.removeAttribute("data-collapsed");
      else shell.setAttribute("data-collapsed", "");
      store(KEY_SIDEBAR, shell.hasAttribute("data-collapsed") ? "collapsed" : "expanded");
    }
    syncSidebar(shell);
  }

  /* ---------- Menus ---------- */

  var openMenu = null; // { trigger, menu }

  function items(menu) { return menu.querySelectorAll("[role='menuitem']:not([disabled])"); }

  function closeMenu(focusTrigger) {
    if (!openMenu) return;
    openMenu.menu.hidden = true;
    openMenu.trigger.setAttribute("aria-expanded", "false");
    if (focusTrigger) openMenu.trigger.focus();
    openMenu = null;
  }

  function toggleMenu(trigger) {
    var menu = document.getElementById(trigger.getAttribute("data-fx-menu"));
    if (!menu) return;
    var wasOpen = openMenu && openMenu.menu === menu;
    closeMenu(false);
    if (wasOpen) return;
    menu.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    trigger.setAttribute("aria-controls", menu.id);
    openMenu = { trigger: trigger, menu: menu };
    var first = items(menu)[0];
    if (first) first.focus();
  }

  function moveInMenu(step) {
    var list = items(openMenu.menu);
    if (!list.length) return;
    var i = Array.prototype.indexOf.call(list, document.activeElement);
    list[(i + step + list.length) % list.length].focus();
  }

  /* ---------- Fenêtres et tiroirs (<dialog> natif) ---------- */

  function openDialog(trigger, returnTo) {
    var dialog = document.getElementById(trigger.getAttribute("data-fx-open"));
    if (!dialog || typeof dialog.showModal !== "function" || dialog.open) return;
    // Ouvert depuis un menu (qui se referme) : rendre le focus au bouton du menu, pas à l'item masqué.
    if (returnTo) dialog.addEventListener("close", function () { returnTo.focus(); }, { once: true });
    dialog.showModal();
  }

  /* ---------- Branchements ---------- */

  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target : e.target.parentElement;
    if (!t) return;
    var el, menuTrigger = null;
    if (openMenu) {
      var inMenu = openMenu.menu.contains(t);
      if (inMenu) menuTrigger = openMenu.trigger;
      if (!inMenu && !openMenu.trigger.contains(t)) closeMenu(false);
      else if (inMenu && t.closest("[role='menuitem']")) closeMenu(!t.closest("[data-fx-open]"));
    }
    if ((el = t.closest("[data-fx-theme-toggle]"))) return toggleTheme();
    if ((el = t.closest("[data-fx-sidebar-toggle]"))) return toggleSidebar(el);
    if ((el = t.closest("[data-fx-menu]"))) return toggleMenu(el);
    if ((el = t.closest("[data-fx-open]"))) return openDialog(el, menuTrigger);
    if ((el = t.closest("[data-fx-close]"))) { var d = el.closest("dialog"); if (d) d.close(); return; }
    if (t.matches("dialog.fx-modal, dialog.fx-drawer")) { // clic sur le voile, hors du cadre
      var r = t.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) t.close();
      return;
    }
    if (t.matches(".fx-shell__scrim")) { var s = shellOf(t); if (s) { s.removeAttribute("data-nav-open"); syncSidebar(s); } }
  });

  document.addEventListener("keydown", function (e) {
    if (openMenu) {
      if (e.key === "Escape") { e.preventDefault(); closeMenu(true); }
      else if (e.key === "ArrowDown") { e.preventDefault(); moveInMenu(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); moveInMenu(-1); }
      else if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        var list = items(openMenu.menu);
        if (list.length) list[e.key === "Home" ? 0 : list.length - 1].focus();
      }
      else if (e.key === "Tab") closeMenu(false);
      return;
    }
    if (e.key === "Escape") {
      var shell = document.querySelector(".fx-shell[data-nav-open]");
      if (shell) { shell.removeAttribute("data-nav-open"); syncSidebar(shell); }
    }
  });

  function init() {
    var shells = document.querySelectorAll(".fx-shell");
    var pref = store(KEY_SIDEBAR);
    var medium = window.matchMedia && window.matchMedia("(min-width: 1024px) and (max-width: 1279.98px)").matches;
    var collapsed = pref ? pref === "collapsed" : medium; // 1024–1279 px : réduit par défaut
    for (var i = 0; i < shells.length; i++) {
      if (collapsed) shells[i].setAttribute("data-collapsed", "");
      syncSidebar(shells[i]);
    }
    if (narrow) {
      var onNarrow = function () { for (var j = 0; j < shells.length; j++) { shells[j].removeAttribute("data-nav-open"); syncSidebar(shells[j]); } };
      if (narrow.addEventListener) narrow.addEventListener("change", onNarrow); else if (narrow.addListener) narrow.addListener(onNarrow);
    }
    syncThemeButtons();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.Forma = { version: "@@VERSION@@", theme: currentTheme, toggleTheme: toggleTheme };
})();
