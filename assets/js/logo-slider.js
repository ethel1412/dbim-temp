
(function () {
    "use strict";

    function initImportantLinksSlider() {
        const slider = document.querySelector(".important-links-slider");
        if (!slider || slider.dataset.initialized === "true") return;

        const windowEl = slider.querySelector(".important-links-slider-window");
        const track = slider.querySelector(".important-links-slider-track");
        const prev = slider.querySelector(".important-links-slider-prev");
        const next = slider.querySelector(".important-links-slider-next");

        if (!windowEl || !track || !prev || !next) return;

        slider.dataset.initialized = "true";

        const getStep = () => {
            const card = track.querySelector(".important-links-card");
            if (!card) return 160;

            const styles = window.getComputedStyle(track);
            const gap = parseFloat(styles.columnGap || styles.gap) || 0;

            return card.getBoundingClientRect().width + gap;
        };

        function slide(direction) {
            // Stop automatic ticker animation when manually navigating
            track.style.animation = "none";

            const maxScroll = Math.max(
                0,
                track.scrollWidth - windowEl.clientWidth
            );

            let position =
                (parseFloat(track.dataset.position) || 0) +
                direction * getStep();

            if (position > maxScroll) position = 0;
            if (position < 0) position = maxScroll;

            track.dataset.position = position;
            track.style.transform = `translateX(-${position}px)`;
            track.style.transition = "transform 0.4s ease";
        }

        prev.addEventListener("click", () => slide(-1));
        next.addEventListener("click", () => slide(1));
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initImportantLinksSlider);
    } else {
        initImportantLinksSlider();
    }
})();
