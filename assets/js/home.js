/* =========================================
   IMPORTANT LINKS LOGO SLIDER
   AUTO SLIDE - 5 CARDS AT A TIME
   ========================================= */

   const slider = document.querySelector(
    ".important-links-slider"
);

if (slider) {

    const track = slider.querySelector(
        ".important-links-slider-track"
    );

    const cards = Array.from(
        slider.querySelectorAll(".important-links-card")
    );

    const prev = slider.querySelector(
        ".important-links-slider-prev"
    );

    const next = slider.querySelector(
        ".important-links-slider-next"
    );

    const viewport = slider.querySelector(
        ".important-links-slider-window"
    );

    const cardsPerSlide = 5;

    let currentPage = 0;
    let autoSlide;


    /* ---------- Get Card Step ---------- */

    function getStep() {

        if (!cards.length) {
            return 0;
        }

        const card = cards[0];

        const styles = getComputedStyle(track);

        const gap = parseFloat(
            styles.columnGap || styles.gap || 0
        );

        return card.offsetWidth + gap;
    }


    /* ---------- Update Slider ---------- */

    function updateSlider() {

        if (!track || !viewport || !cards.length) {
            return;
        }

        const step = getStep();

        const moveAmount =
            step * cardsPerSlide;

        const maxPosition = Math.max(
            0,
            track.scrollWidth - viewport.clientWidth
        );

        let position =
            currentPage * moveAmount;

        position = Math.min(
            position,
            maxPosition
        );

        position = Math.max(
            0,
            position
        );

        track.style.transform =
            "translateX(-" + position + "px)";
    }


    /* ---------- Next Page ---------- */

    function nextSlide() {

        const step = getStep();

        const moveAmount =
            step * cardsPerSlide;

        const maxPosition = Math.max(
            0,
            track.scrollWidth - viewport.clientWidth
        );

        const nextPosition =
            (currentPage + 1) * moveAmount;

        if (nextPosition <= maxPosition) {

            currentPage++;

        } else {

            /* Start again from first 5 */
            currentPage = 0;

        }

        updateSlider();

    }


    /* ---------- Previous Page ---------- */

    if (prev) {

        prev.addEventListener("click", function () {

            stopAutoSlide();

            if (currentPage > 0) {

                currentPage--;

            } else {

                /* Go to last page */
                const step = getStep();

                const moveAmount =
                    step * cardsPerSlide;

                const maxPosition = Math.max(
                    0,
                    track.scrollWidth -
                    viewport.clientWidth
                );

                currentPage = Math.floor(
                    maxPosition / moveAmount
                );

            }

            updateSlider();

            startAutoSlide();

        });

    }


    /* ---------- Next Button ---------- */

    if (next) {

        next.addEventListener("click", function () {

            stopAutoSlide();

            nextSlide();

            startAutoSlide();

        });

    }


    /* ---------- Auto Slide ---------- */

    function startAutoSlide() {

        stopAutoSlide();

        autoSlide = setInterval(function () {

            nextSlide();

        }, 3000);

    }


    function stopAutoSlide() {

        if (autoSlide) {

            clearInterval(autoSlide);

            autoSlide = null;

        }

    }


    /* ---------- Pause on Hover ---------- */

    slider.addEventListener(
        "mouseenter",
        stopAutoSlide
    );

    slider.addEventListener(
        "mouseleave",
        startAutoSlide
    );


    /* ---------- Resize ---------- */

    window.addEventListener(
        "resize",
        function () {

            currentPage = 0;

            updateSlider();

        }
    );


    /* ---------- Initial ---------- */

    updateSlider();

    startAutoSlide();

}