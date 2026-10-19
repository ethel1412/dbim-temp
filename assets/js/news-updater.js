(function () {
    "use strict";

    const NOTIFICATIONS_PAGE = "notifications.html";
    const WHATS_NEW_LIMIT = 4;

    const whatsNewBox = document.querySelector(".whats-new-box");

    if (!whatsNewBox) {
        return;
    }

    function getDocumentUrl(href, pageUrl) {
        try {
            return new URL(href, pageUrl).href;
        } catch (error) {
            return "#";
        }
    }

    function createWhatsNewItem(notice) {
        const link = document.createElement("a");

        link.className = "whats-new-item";
        link.href = notice.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        const text = document.createElement("span");
        text.textContent = notice.subject;

        const arrow = document.createElement("img");
        arrow.src = "../assets/icons/chevron_right.svg";
        arrow.alt = "";
        arrow.setAttribute("aria-hidden", "true");

        link.append(text, arrow);

        return link;
    }

    // Load notices from notifications.html.
    fetch(NOTIFICATIONS_PAGE, { cache: "no-cache" })
        .then(function (response) {
            if (!response.ok) {
                throw new Error(
                    "Unable to load notifications.html: HTTP " +
                    response.status
                );
            }

            return response.text();
        })
        .then(function (html) {
            const parser = new DOMParser();
            const documentPage = parser.parseFromString(
                html,
                "text/html"
            );

            const pageUrl = new URL(
                NOTIFICATIONS_PAGE,
                window.location.href
            );

            const notices = Array.from(
                documentPage.querySelectorAll("table tbody tr")
            )
                .map(function (row) {
                    const cells = row.querySelectorAll("td");

                    if (cells.length < 3) {
                        return null;
                    }

                    const documentLink = cells[1].querySelector("a");

                    const subject = cells[2].textContent
                        .replace(/\s+/g, " ")
                        .trim();

                    const href = documentLink
                        ? documentLink.getAttribute("href")
                        : null;

                    if (!href || !subject) {
                        return null;
                    }

                    return {
                        subject: subject,
                        url: getDocumentUrl(href, pageUrl)
                    };
                })
                .filter(Boolean);

            // Clear existing What's New items.
            whatsNewBox.replaceChildren();

            if (notices.length === 0) {
                const message = document.createElement("p");
                message.textContent =
                    "No new updates are currently available.";

                whatsNewBox.appendChild(message);
                return;
            }

            // Populate only What's New.
            notices
                .slice(0, WHATS_NEW_LIMIT)
                .forEach(function (notice) {
                    whatsNewBox.appendChild(
                        createWhatsNewItem(notice)
                    );
                });

            console.info(
                "What's New updated:",
                Math.min(notices.length, WHATS_NEW_LIMIT),
                "items displayed."
            );
        })
        .catch(function (error) {
            console.error("What's New updater error:", error);

            whatsNewBox.replaceChildren();

            const message = document.createElement("p");
            message.textContent =
                "Updates could not be loaded. Please try again later.";

            whatsNewBox.appendChild(message);
        });
})();
