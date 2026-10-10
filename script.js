(function () {
  "use strict";

  var root = document.documentElement;
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     1. Light / dark theme toggle
     --------------------------------------------------------- */
  var themeBtn = document.getElementById("theme-toggle");

  function getTheme() {
    return (
      root.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    );
  }

  function updateThemeLabel() {
    themeBtn.setAttribute(
      "aria-label",
      getTheme() === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );
  }

  themeBtn.addEventListener("click", function () {
    var next = getTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    updateThemeLabel();
  });

  updateThemeLabel();

  /* ---------------------------------------------------------
     2. Mobile menu
     --------------------------------------------------------- */
  var menuBtn = document.getElementById("menu-toggle");
  var nav = document.getElementById("site-nav");

  function setMenu(open) {
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  menuBtn.addEventListener("click", function () {
    setMenu(!nav.classList.contains("open"));
  });

  // Close the menu after tapping a link
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });

  // Close the menu with the Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });

  /* ---------------------------------------------------------
     3. Hero: the API response appears line by line
     --------------------------------------------------------- */
  var lines = document.querySelectorAll("#api-body .line");

  if (!prefersReducedMotion) {
    lines.forEach(function (line) { line.classList.add("pending"); });

    lines.forEach(function (line, index) {
      setTimeout(function () {
        line.classList.remove("pending");
      }, 300 + index * 90);
    });
  }

  /* ---------------------------------------------------------
     4. Highlight the nav link of the section you are reading
     --------------------------------------------------------- */
  var links = Array.prototype.slice.call(nav.querySelectorAll("a"));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (a) { a.removeAttribute("aria-current"); });
          var active = links.find(function (a) {
            return a.getAttribute("href") === "#" + entry.target.id;
          });
          if (active) active.setAttribute("aria-current", "true");
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sections.forEach(function (section) { observer.observe(section); });
  }

  /* ---------------------------------------------------------
     5. Copy email button
     --------------------------------------------------------- */
  var copyBtn = document.getElementById("copy-email");

  copyBtn.addEventListener("click", function () {
    var email = copyBtn.getAttribute("data-email");

    function done(message) {
      copyBtn.textContent = message;
      setTimeout(function () { copyBtn.textContent = "Copy email"; }, 2000);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(
        function () { done("Email copied"); },
        function () { done("Copy failed. Select the email above."); }
      );
    } else {
      done("Copy failed. Select the email above.");
    }
  });

  /* ---------------------------------------------------------
     6. Footer year
     --------------------------------------------------------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
