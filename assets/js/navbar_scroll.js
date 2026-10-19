(function () {
    function initNavbar() {
        const navbar = document.querySelector("nav.main-navbar");

        if (!navbar || navbar.dataset.scrollFixInitialised === "true") {
            return !!navbar;
        }

        navbar.dataset.scrollFixInitialised = "true";

        const placeholder = document.createElement("div");
        placeholder.className = "main-navbar-placeholder";
        placeholder.setAttribute("aria-hidden", "true");

        navbar.parentNode.insertBefore(placeholder, navbar);

        let navbarTop =
            navbar.getBoundingClientRect().top + window.scrollY;

        function updateNavbar() {
            const shouldFix = window.scrollY >= navbarTop;

            navbar.classList.toggle("is-fixed", shouldFix);
            placeholder.classList.toggle("is-visible", shouldFix);
            placeholder.style.height = navbar.offsetHeight + "px";
        }

        window.addEventListener("scroll", updateNavbar, {
            passive: true
        });

        window.addEventListener("resize", function () {
            if (!navbar.classList.contains("is-fixed")) {
                navbarTop =
                    navbar.getBoundingClientRect().top + window.scrollY;
            }

            updateNavbar();
        });

        updateNavbar();
        return true;
    }

    function start() {
        if (initNavbar()) return;

        // Handles a navbar inserted dynamically into the page.
        const observer = new MutationObserver(function () {
            if (initNavbar()) observer.disconnect();
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start, {
            once: true
        });
    } else {
        start();
    }
})();
