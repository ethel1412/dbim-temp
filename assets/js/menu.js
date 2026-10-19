(function () {
    const MOBILE_BREAKPOINT = 992;

    function getMenu() {
        return document.getElementById('mainMenu');
    }

    function getToggle() {
        return document.getElementById('mobileMenuToggle');
    }

    function isMobile() {
        return window.innerWidth < MOBILE_BREAKPOINT;
    }

    function getTopItems(menu) {
        return Array.from(menu.querySelectorAll(':scope > li'));
    }

    function getTopLinks(menu) {
        return getTopItems(menu)
            .map(item => item.querySelector(':scope > a'))
            .filter(Boolean);
    }

    function getSubmenu(item) {
        return item?.querySelector(':scope > .dropdown-menu') || null;
    }

    function getSubmenuLinks(item) {
        const submenu = getSubmenu(item);

        return submenu
            ? Array.from(submenu.querySelectorAll('a'))
                .filter(link => !link.hasAttribute('disabled'))
            : [];
    }

    function setSubmenu(item, open) {
        if (!item) return;

        const link = item.querySelector(':scope > a');

        item.classList.toggle('submenu-open', open);

        if (link && item.classList.contains('has-dropdown')) {
            link.setAttribute('aria-haspopup', 'true');
            link.setAttribute('aria-expanded', String(open));
        }
    }

    function closeSubmenus(menu, exceptItem = null) {
        if (!menu) return;

        menu.querySelectorAll(':scope > li.has-dropdown').forEach(item => {
            if (item !== exceptItem) {
                setSubmenu(item, false);
            }
        });
    }

    function setMobileMenu(menu, toggle, open, returnFocus = false) {
        if (!menu || !toggle) return;

        menu.classList.toggle('is-open', open);

        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute(
            'aria-label',
            open ? 'Close navigation menu' : 'Open navigation menu'
        );

        if (!open) {
            closeSubmenus(menu);
        }

        if (returnFocus) {
            toggle.focus();
        }
    }

    document.addEventListener('click', function (event) {
        const toggle = event.target.closest('#mobileMenuToggle');

        if (toggle) {
            const menu = getMenu();

            if (!menu) {
                console.error('Navbar: #mainMenu not found.');
                return;
            }

            const open = !menu.classList.contains('is-open');
            setMobileMenu(menu, toggle, open);
            return;
        }

        const link = event.target.closest(
            'nav.main-navbar .main-menu > li.has-dropdown > a'
        );

        if (!link || !isMobile()) return;

        const menu = getMenu();
        const item = link.closest('li.has-dropdown');
        const submenu = getSubmenu(item);
        if (!menu || !submenu) return;
        if (!item.classList.contains('submenu-open')) {
            event.preventDefault();
            closeSubmenus(menu, item);
            setSubmenu(item, true);
        }
    });

    // ------------------------------------------------
    // KEYBOARD NAVIGATION
    // ------------------------------------------------

    document.addEventListener('keydown', function (event) {
        const menu = getMenu();
        const toggle = getToggle();

        if (!menu) return;

        const navbar = menu.closest('nav.main-navbar');
        if (!navbar) return;

        const target = event.target;

        const topLink = target.closest(
            '#mainMenu > li > a'
        );

        const submenuLink = target.closest(
            '#mainMenu > li > .dropdown-menu a'
        );

        const topLinks = getTopLinks(menu);

        const currentItem = topLink
            ? topLink.closest('li')
            : submenuLink?.closest('#mainMenu > li');

        // Escape: close submenu first, then mobile menu.
        if (event.key === 'Escape') {
            const openItem = currentItem?.classList.contains('has-dropdown') &&
                currentItem.classList.contains('submenu-open')
                ? currentItem
                : menu.querySelector(
                    ':scope > li.has-dropdown.submenu-open'
                );

            if (openItem) {
                event.preventDefault();
                setSubmenu(openItem, false);

                const parentLink = openItem.querySelector(':scope > a');
                if (parentLink) parentLink.focus();

                return;
            }

            if (isMobile() && menu.classList.contains('is-open')) {
                event.preventDefault();
                setMobileMenu(menu, toggle, false, true);
            }

            return;
        }

        // Arrow keys only control the menu when focus is on a menu link.
        if (!topLink && !submenuLink) return;

        // Left / Right: move between top-level links.
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();

            const currentTopLink = currentItem?.querySelector(':scope > a');
            const index = topLinks.indexOf(currentTopLink);

            if (index === -1 || !topLinks.length) return;

            const step = event.key === 'ArrowRight' ? 1 : -1;
            const nextIndex = (index + step + topLinks.length) %
                topLinks.length;

            closeSubmenus(menu);
            topLinks[nextIndex].focus();
            return;
        }

        // Down from a top-level link opens its submenu.
        if (event.key === 'ArrowDown' && topLink) {
            const links = getSubmenuLinks(currentItem);

            if (links.length) {
                event.preventDefault();
                closeSubmenus(menu, currentItem);
                setSubmenu(currentItem, true);
                links[0].focus();
            } else {
                const index = topLinks.indexOf(topLink);

                if (index < topLinks.length - 1) {
                    event.preventDefault();
                    topLinks[index + 1].focus();
                }
            }

            return;
        }

        // Up from a top-level dropdown opens it at the last submenu item.
        if (event.key === 'ArrowUp' && topLink) {
            const links = getSubmenuLinks(currentItem);

            if (links.length) {
                event.preventDefault();
                closeSubmenus(menu, currentItem);
                setSubmenu(currentItem, true);
                links[links.length - 1].focus();
            }

            return;
        }

        // Up / Down: move through submenu links.
        if (submenuLink &&
            (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
            const item = submenuLink.closest('#mainMenu > li');
            const links = getSubmenuLinks(item);
            const index = links.indexOf(submenuLink);

            if (!links.length || index === -1) return;

            event.preventDefault();

            const step = event.key === 'ArrowDown' ? 1 : -1;
            const nextIndex = (index + step + links.length) % links.length;

            links[nextIndex].focus();
        }
    });

    // ------------------------------------------------
    // RESIZE — reset mobile state when switching to
    // desktop, and keep ARIA states synchronized
    // ------------------------------------------------

    function handleResize() {
        const menu = getMenu();
        const toggle = getToggle();

        if (!menu || !toggle) return;

        if (!isMobile()) {
            setMobileMenu(menu, toggle, false);
        } else {
            closeSubmenus(menu);
        }
    }

    window.addEventListener('resize', handleResize);

    // ------------------------------------------------
    // INITIAL ARIA STATE — safe for dynamic markup
    // ------------------------------------------------

    function initialiseNavbar() {
        const menu = getMenu();
        const toggle = getToggle();

        if (!menu || !toggle) return;

        menu.querySelectorAll(':scope > li.has-dropdown').forEach(item => {
            const link = item.querySelector(':scope > a');

            if (link) {
                link.setAttribute('aria-haspopup', 'true');

                if (!link.hasAttribute('aria-expanded')) {
                    link.setAttribute('aria-expanded', 'false');
                }
            }
        });

        toggle.setAttribute(
            'aria-expanded',
            String(menu.classList.contains('is-open'))
        );
    }

    initialiseNavbar();

    document.addEventListener('DOMContentLoaded', initialiseNavbar);

    const observer = new MutationObserver(function () {
        initialiseNavbar();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();
