

function isExcludedElement(element) {

            if (!element || !element.closest) return true;
    
            if (
    
                element.closest("#uw-main") ||
    
                element.classList.contains("uwaw-features__item__name") ||
    
                element.classList.contains("ux4g-text-spacing") ||
    
                element.classList.contains("feature-image") ||
    
                element.classList.contains("icon_global") ||
    
                element.classList.contains("copyright-text") ||
    
                element.classList.contains("ux4g-copy")
    
            ) {
    
                return true;
    
            }
    
            if (
    
                [
    
                    "SCRIPT", "DIV", "LINK", "HTML",
    
                    "HEAD", "BODY", "STYLE", "META"
    
                ].includes(element.tagName) ||
    
                element.tagName.toLowerCase() === "svg"
    
            ) {
    
                return true;
    
            }
    
            return false;
    
          }
    
          // ============================================
    
          // TEXT SIZE INCREASE / DECREASE
    
          // ============================================
    
          (function () {
    
            "use strict";
    
            const MAX_STEPS = 4;
    
            const STEP_SIZE = 2;
    
            const config = {
    
                increase: {
    
                    button: "btn-s9",
    
                    item: "featureItem",
    
                    steps: "featureSteps",
    
                    tick: "tickIcon",
    
                    storage: "bt-clickCount",
    
                    direction: 1
    
                },
    
                decrease: {
    
                    button: "btn-small-text",
    
                    item: "featureItem-st",
    
                    steps: "featureSteps-st",
    
                    tick: "tickIcon-st",
    
                    storage: "st-clickCount",
    
                    direction: -1
    
                }
    
            };
    
            let mode = null;
    
            let step = 0;
    
            let originalsSaved = false;
    
            function skip(element) {
    
                return (
    
                    element.closest("#uw-main") !== null ||
    
                    element.closest("#uw-widget-custom-trigger") !== null ||
    
                    [
    
                        "SCRIPT", "STYLE", "LINK", "META",
    
                        "HEAD", "HTML", "BODY", "SVG"
    
                    ].includes(element.tagName)
    
                );
    
            }
    
            function saveOriginals() {
    
                if (originalsSaved) return;
    
                document.querySelectorAll("body *").forEach(function (el) {
    
                    if (skip(el)) return;
    
                    const size = parseFloat(getComputedStyle(el).fontSize);
    
                    if (!Number.isFinite(size)) return;
    
                    el.dataset.textSizeOriginal = String(size);
    
                    el.dataset.textSizeInline =
    
                        el.style.getPropertyValue("font-size");
    
                    el.dataset.textSizePriority =
    
                        el.style.getPropertyPriority("font-size");
    
                });
    
                originalsSaved = true;
    
            }
    
            function restoreOriginals() {
    
                document.querySelectorAll("[data-text-size-original]").forEach(
    
                    function (el) {
    
                        const inlineSize = el.dataset.textSizeInline || "";
    
                        const priority = el.dataset.textSizePriority || "";
    
                        if (inlineSize) {
    
                            el.style.setProperty(
    
                                "font-size",
    
                                inlineSize,
    
                                priority
    
                            );
    
                        } else {
    
                            el.style.removeProperty("font-size");
    
                        }
    
                        delete el.dataset.textSizeOriginal;
    
                        delete el.dataset.textSizeInline;
    
                        delete el.dataset.textSizePriority;
    
                    }
    
                );
    
                originalsSaved = false;
    
            }
    
            function applySize() {
    
                saveOriginals();
    
                const delta = step * STEP_SIZE * config[mode].direction;
    
                document.querySelectorAll("body *").forEach(function (el) {
    
                    if (skip(el)) return;
    
                    const original = parseFloat(el.dataset.textSizeOriginal);
    
                    if (!Number.isFinite(original)) return;
    
                    el.style.setProperty(
    
                        "font-size",
    
                        Math.max(8, original + delta) + "px",
    
                        "important"
    
                    );
    
                });
    
            }
    
            function updateUI() {
    
                Object.keys(config).forEach(function (key) {
    
                    const itemConfig = config[key];
    
                    const active = mode === key && step > 0;
    
                    const button = document.getElementById(itemConfig.button);
    
                    const item = document.getElementById(itemConfig.item);
    
                    const steps = document.getElementById(itemConfig.steps);
    
                    const tick = document.getElementById(itemConfig.tick);
    
                    if (item) {
    
                        item.classList.toggle("feature-active", active);
    
                    }
    
                    if (tick) {
    
                        tick.style.display = active ? "inline-block" : "none";
    
                    }
    
                    if (steps) {
    
                        steps.classList.toggle("featureSteps-visible", active);
    
                        steps.innerHTML = "";
    
                        if (active) {
    
                            for (let i = 0; i < MAX_STEPS; i++) {
    
                                const span = document.createElement("span");
    
                                span.className =
    
                                    (i < step ? "active " : "") +
    
                                    "step uwaw-features__step";
    
                                steps.appendChild(span);
    
                            }
    
                        }
    
                    }
    
                    if (button) {
    
                        button.setAttribute("aria-pressed", String(active));
    
                        button.setAttribute(
    
                            "data-uw-reader-content",
    
                            active ? step : 0
    
                        );
    
                        button.disabled =
    
                            mode !== null && step > 0 && mode !== key;
    
                    }
    
                    localStorage.setItem(
    
                        itemConfig.storage,
    
                        String(key === mode ? step : 0)
    
                    );
    
                    localStorage.setItem(
    
                        itemConfig.storage.replace("-clickCount", "-size"),
    
                        String(key === mode ? step * STEP_SIZE : 0)
    
                    );
    
                    localStorage.setItem(
    
                        itemConfig.storage.replace(
    
                            "-clickCount",
    
                            "-buttonClicked"
    
                        ),
    
                        String(key === mode && step > 0)
    
                    );
    
                });
    
            }
    
            window.changeTextSize = function (direction) {
    
                const requestedMode =
    
                    direction > 0 ? "increase" : "decrease";
    
                if (mode && mode !== requestedMode && step > 0) {
    
                    restoreOriginals();
    
                    mode = null;
    
                    step = 0;
    
                }
    
                if (!mode) {
    
                    mode = requestedMode;
    
                }
    
                step++;
    
                if (step > MAX_STEPS) {
    
                    restoreOriginals();
    
                    mode = null;
    
                    step = 0;
    
                    updateUI();
    
                    return;
    
                }
    
                applySize();
    
                updateUI();
    
            };
    
            window.resetFontSizes = function () {
    
                restoreOriginals();
    
                mode = null;
    
                step = 0;
    
                updateUI();
    
            };
    
            function initTextSize() {
    
                const increase = document.getElementById("btn-s9");
    
                const decrease = document.getElementById("btn-small-text");
    
                if (!increase || !decrease) {
                    return;
    
                }
    
                const savedIncrease = Math.min(
    
                    MAX_STEPS,
    
                    Math.max(
    
                        0,
    
                        Number(localStorage.getItem("bt-clickCount")) || 0
    
                    )
    
                );
    
                const savedDecrease = Math.min(
    
                    MAX_STEPS,
    
                    Math.max(
    
                        0,
    
                        Number(localStorage.getItem("st-clickCount")) || 0
    
                    )
    
                );
    
                if (savedIncrease > 0) {
    
                    mode = "increase";
    
                    step = savedIncrease;
    
                    applySize();
    
                } else if (savedDecrease > 0) {
    
                    mode = "decrease";
    
                    step = savedDecrease;
    
                    applySize();
    
                }
    
                updateUI();
    
            }
    
            if (document.readyState === "loading") {
    
                document.addEventListener(
    
                    "DOMContentLoaded",
    
                    initTextSize,
    
                    { once: true }
    
                );
    
            } else {
    
                initTextSize();
    
            }
    
          })();
    
          // ============================================
    
          // LETTER SPACING
    
          // ============================================
    
          let letterSpacing = 0;
    
          let clickCountText = 0;
    
          const localStorageSpacingCount =
    
            localStorage.getItem("ts-clickCount");
    
          if (localStorageSpacingCount) {
    
            clickCountText = parseInt(localStorageSpacingCount, 10) || 0;
    
          }
    
          function increaseAndReset() {
    
            clickCountText++;
    
            const featureItem = document.getElementById("featureItem-ts");
    
            const featureSteps = document.getElementById("featureSteps-ts");
    
            const tickIcon = document.getElementById("tickIcon-ts");
    
            localStorage.setItem("ts-clickCount", clickCountText);
    
            localStorage.setItem("ts-buttonClicked", true);
    
            if (clickCountText === 4) {
    
                letterSpacing = 0;
    
                clickCountText = 0;
    
                if (featureItem) {
    
                    featureItem.classList.remove("feature-active");
    
                }
    
                if (featureSteps) {
    
                    featureSteps.classList.remove("featureSteps-visible");
    
                    featureSteps.innerHTML = "";
    
                }
    
                if (tickIcon) {
    
                    tickIcon.style.display = "none";
    
                }
    
                localStorage.setItem("ts-clickCount", 0);
    
                localStorage.setItem("ts-buttonClicked", false);
    
                resetLetterspacing();
    
                return;
    
            }
    
            if (clickCountText === 1) {
    
                if (featureItem) {
    
                    featureItem.classList.add("feature-active");
    
                }
    
                if (featureSteps) {
    
                    featureSteps.classList.add("featureSteps-visible");
    
                }
    
            }
    
            if (featureSteps) {
    
                featureSteps.innerHTML = "";
    
                for (let i = 0; i < 3; i++) {
    
                    const span = document.createElement("span");
    
                    span.className =
    
                        (i < clickCountText ? "active " : "") +
    
                        "step uwaw-features__step";
    
                    featureSteps.appendChild(span);
    
                }
    
            }
    
            if (tickIcon) {
    
                tickIcon.style.display = "inline-block";
    
            }
    
            letterSpacing += 2;
    
            applyLetterSpacing();
    
          }
    
          function decreaseSpacing() {
    
            letterSpacing -= 5;
    
            applyLetterSpacing();
    
          }
    
          function applyLetterSpacing() {
    
            const elements = document.querySelectorAll(
    
                "*:not(.uw-widget-custom-trigger, .uw-widget-custom-trigger span)"
    
            );
    
            elements.forEach(function (element) {
    
                if (isExcludedElement(element)) return;
    
                const current = parseFloat(
    
                    window.getComputedStyle(element).letterSpacing
    
                );
    
                const currentSize = Number.isNaN(current) ? 0 : current;
    
                const newSize = currentSize + 2;
    
                element.style.setProperty(
    
                    "letter-spacing",
    
                    newSize + "px",
    
                    "important"
    
                );
    
                localStorage.setItem("ts-spacing", String(newSize));
    
            });
    
          }
    
          function resetLetterspacing() {
    
            const elements = document.querySelectorAll(
    
                "*:not(.uw-widget-custom-trigger, .uw-widget-custom-trigger span)"
    
            );
    
            elements.forEach(function (element) {
    
                element.style.letterSpacing = "";
    
            });
    
            localStorage.setItem("ts-spacing", "");
    
            localStorage.setItem("ts-clickCount", "0");
    
            localStorage.setItem("ts-buttonClicked", "false");
    
          }
    
          document.addEventListener("DOMContentLoaded", function () {
    
            const featureItem = document.getElementById("featureItem-ts");
    
            const featureSteps = document.getElementById("featureSteps-ts");
    
            const tickIcon = document.getElementById("tickIcon-ts");
    
            const spacingState =
    
                JSON.parse(localStorage.getItem("ts-buttonClicked") || "false");
    
            const spacingClickState =
    
                parseInt(localStorage.getItem("ts-clickCount"), 10) || 0;
    
            const spacingSizeState = localStorage.getItem("ts-spacing");
    
            if (spacingState) {
    
                if (tickIcon) {
    
                    tickIcon.style.display = "inline-block";
    
                }
    
                if (featureItem) {
    
                    featureItem.classList.add("feature-active");
    
                }
    
                if (featureSteps) {
    
                    featureSteps.classList.add("featureSteps-visible");
    
                    featureSteps.innerHTML = "";
    
                    for (let i = 0; i < 3; i++) {
    
                        const span = document.createElement("span");
    
                        span.className =
    
                            (i < spacingClickState ? "active " : "") +
    
                            "step uwaw-features__step";
    
                        featureSteps.appendChild(span);
    
                    }
    
                }
    
                if (spacingSizeState !== null && spacingSizeState !== "") {
    
                    document.querySelectorAll(
    
                        "*:not(.uw-widget-custom-trigger, .uw-widget-custom-trigger span)"
    
                    ).forEach(function (element) {
    
                        if (!isExcludedElement(element)) {
    
                            element.style.setProperty(
    
                                "letter-spacing",
    
                                spacingSizeState + "px",
    
                                "important"
    
                            );
    
                        }
    
                    });
    
                }
    
            }
    
          });
    
          // ============================================
    
          // DARK CONTRAST AND SATURATION STYLES
    
          // ============================================
    
          (function installAccessibilityControlStyles() {
    
            if (document.getElementById("ux4g-custom-control-styles")) {
    
                return;
    
            }
    
            const style = document.createElement("style");
    
            style.id = "ux4g-custom-control-styles";
    
            style.textContent = `
    
            /* =========================================
    
               UX4G DARK CONTRAST
    
            ========================================= */
    
            /* Base page colours */
    
            html.ux4g-dark-contrast,
    
            html.ux4g-dark-contrast body {
    
                background: #000 !important;
    
                background-color: #000 !important;
    
                color: #ffff00 !important;
    
            }
    
            /* Turn page backgrounds black, including nested wrappers */
    
            html.ux4g-dark-contrast body *:not(#uw-main):not(#uw-main *) {
    
                background-color: #000 !important;
    
                background-image: none !important;
    
                border-color: #ffff00 !important;
    
            }
    
            /* Yellow text throughout the webpage */
    
            html.ux4g-dark-contrast body *:not(#uw-main):not(#uw-main *) {
    
                color: #ffff00 !important;
    
                -webkit-text-fill-color: #ffff00 !important;
    
            }
    
            /* Links */
    
            html.ux4g-dark-contrast body a,
    
            html.ux4g-dark-contrast body a:visited {
    
                color: #ffff00 !important;
    
                -webkit-text-fill-color: #ffff00 !important;
    
                text-decoration: underline !important;
    
            }
    
            /* Navigation text */
    
            html.ux4g-dark-contrast body nav *,
    
            html.ux4g-dark-contrast body .main-navbar *,
    
            html.ux4g-dark-contrast body .navbar *,
    
            html.ux4g-dark-contrast body header nav *,
    
            html.ux4g-dark-contrast body .nav-link,
    
            html.ux4g-dark-contrast body .dropdown-toggle {
    
                color: #ffff00 !important;
    
                -webkit-text-fill-color: #ffff00 !important;
    
            }
    
            /* Search fields, form controls and buttons */
    
            html.ux4g-dark-contrast body input,
    
            html.ux4g-dark-contrast body select,
    
            html.ux4g-dark-contrast body textarea,
    
            html.ux4g-dark-contrast body button {
    
                background: #000 !important;
    
                background-color: #000 !important;
    
                color: #ffff00 !important;
    
                border: 1px solid #ffff00 !important;
    
                -webkit-text-fill-color: #ffff00 !important;
    
            }
    
            /* Preserve logos, photographs and media */
    
            html.ux4g-dark-contrast body img,
    
            html.ux4g-dark-contrast body video,
    
            html.ux4g-dark-contrast body canvas {
    
                filter: none !important;
    
            }
    
            /* Keep the accessibility panel outside page colour overrides */
    
            html.ux4g-dark-contrast #uw-main,
    
            html.ux4g-dark-contrast #uw-main * {
    
                -webkit-text-fill-color: initial;
    
            }
    
            `;
    
            (document.head || document.documentElement).appendChild(style);
    
          })();
    
          // ============================================
    
          // DARK CONTRAST
    
          // ============================================
    
          function toggleDarkContrast() {
    
            const root = document.documentElement;
    
            const button = document.getElementById("btn-contrast");
    
            const item = document.getElementById("featureItem-contrast");
    
            const tick = document.getElementById("tickIcon-contrast");
    
            const active = !root.classList.contains("ux4g-dark-contrast");
    
            root.classList.toggle("ux4g-dark-contrast", active);
    
            if (button) {
    
                button.setAttribute("aria-pressed", String(active));
    
            }
    
            if (item) {
    
                item.classList.toggle("feature-active", active);
    
            }
    
            if (tick) {
    
                tick.style.display = active ? "inline-block" : "none";
    
            }
    
            localStorage.setItem("darkContrastFeature", String(active));
    
          }
    
          document.addEventListener("DOMContentLoaded", function () {
    
            const active =
    
                localStorage.getItem("darkContrastFeature") === "true";
    
            const root = document.documentElement;
    
            const button = document.getElementById("btn-contrast");
    
            const item = document.getElementById("featureItem-contrast");
    
            const tick = document.getElementById("tickIcon-contrast");
    
            root.classList.toggle("ux4g-dark-contrast", active);
    
            if (button) {
    
                button.setAttribute("aria-pressed", String(active));
    
            }
    
            if (item) {
    
                item.classList.toggle("feature-active", active);
    
            }
    
            if (tick) {
    
                tick.style.display = active ? "inline-block" : "none";
    
            }
    
          });
    
          // ============================================
    
          // SATURATION
    
          // ============================================
    
          function toggleSaturation() {
    
            const root = document.documentElement;
    
            const button = document.getElementById("btn-saturation");
    
            const item = document.getElementById("featureItem-saturation");
    
            const tick = document.getElementById("tickIcon-saturation");
    
            const active = !root.classList.contains("ux4g-saturation");
    
            root.classList.toggle("ux4g-saturation", active);
    
            if (button) {
    
                button.setAttribute("aria-pressed", String(active));
    
            }
    
            if (item) {
    
                item.classList.toggle("feature-active", active);
    
            }
    
            if (tick) {
    
                tick.style.display = active ? "inline-block" : "none";
    
            }
    
            localStorage.setItem("saturationFeature", String(active));
    
          }
    
          function resetlineheight() {
    
            // Line-height control is not present in the current HTML.
    
            localStorage.setItem("lh-height", "0");
    
            localStorage.setItem("lh-clickCount", "0");
    
            localStorage.setItem("lh-buttonClicked", "false");
    
          }
    
          document.addEventListener("DOMContentLoaded", function () {
    
            const active =
    
                localStorage.getItem("saturationFeature") === "true";
    
            const root = document.documentElement;
    
            const button = document.getElementById("btn-saturation");
    
            const item = document.getElementById("featureItem-saturation");
    
            const tick = document.getElementById("tickIcon-saturation");
    
            root.classList.toggle("ux4g-saturation", active);
    
            if (button) {
    
                button.setAttribute("aria-pressed", String(active));
    
            }
    
            if (item) {
    
                item.classList.toggle("feature-active", active);
    
            }
    
            if (tick) {
    
                tick.style.display = active ? "inline-block" : "none";
    
            }
    
          });
    
          // ============================================
    
          // HIDE IMAGES
    
          // ============================================
    
          function toggleImages() {
    
            const root = document.documentElement;
    
            const isActive = !root.classList.contains("image-hide");
    
            root.classList.toggle("image-hide", isActive);
    
            root.id = isActive ? "imageHideBg" : "";
    
            const images = document.querySelectorAll("img");
    
            const imageVisibilityState = {};
    
            images.forEach(function (image, index) {
    
                if (isExcludedElement(image)) return;
    
                image.style.setProperty(
    
                    "visibility",
    
                    isActive ? "hidden" : "visible",
    
                    "important"
    
                );
    
                imageVisibilityState[index] =
    
                    isActive ? "hidden" : "visible";
    
            });
    
            const tick = document.getElementById("tickIcon-hi");
    
            const item = document.getElementById("featureItem-hi");
    
            if (tick) {
    
                tick.style.display = isActive ? "inline-block" : "none";
    
            }
    
            if (item) {
    
                item.classList.toggle("feature-active", isActive);
    
            }
    
            localStorage.setItem(
    
                "imageVisibilityState",
    
                JSON.stringify(imageVisibilityState)
    
            );
    
          }
    
          document.addEventListener("DOMContentLoaded", function () {
    
            const tick = document.getElementById("tickIcon-hi");
    
            const item = document.getElementById("featureItem-hi");
    
            const images = document.querySelectorAll("img");
    
            const state = JSON.parse(
    
                localStorage.getItem("imageVisibilityState") || "null"
    
            );
    
            if (!state) return;
    
            let active = false;
    
            images.forEach(function (image, index) {
    
                if (isExcludedElement(image)) return;
    
                if (state[index] === "hidden") {
    
                    image.style.setProperty(
    
                        "visibility",
    
                        "hidden",
    
                        "important"
    
                    );
    
                    active = true;
    
                }
    
            });
    
            document.documentElement.classList.toggle("image-hide", active);
    
            document.documentElement.id = active ? "imageHideBg" : "";
    
            if (tick) {
    
                tick.style.display = active ? "inline-block" : "none";
    
            }
    
            if (item) {
    
                item.classList.toggle("feature-active", active);
    
            }
    
          });
    
          // ============================================
    
          // HIGHLIGHT LINKS
    
          // ============================================
    
          function highlightLinks() {
    
            const tick = document.getElementById("tickIcon-ht");
    
            const item = document.getElementById("featureItem-ht");
    
            const active = !(
    
                item && item.classList.contains("feature-active")
    
            );
    
            document.querySelectorAll("a").forEach(function (link) {
    
                if (isExcludedElement(link)) return;
    
                if (active) {
    
                    link.style.setProperty(
    
                        "background",
    
                        "black",
    
                        "important"
    
                    );
    
                    link.style.setProperty(
    
                        "color",
    
                        "yellow",
    
                        "important"
    
                    );
    
                } else {
    
                    link.style.removeProperty("background");
    
                    link.style.removeProperty("color");
    
                }
    
            });
    
            if (tick) {
    
                tick.style.display = active ? "inline-block" : "none";
    
            }
    
            if (item) {
    
                item.classList.toggle("feature-active", active);
    
            }
    
            localStorage.setItem("highlightLinks", String(active));
    
          }
    
          document.addEventListener("DOMContentLoaded", function () {
    
            const active = localStorage.getItem("highlightLinks") === "true";
    
            if (!active) return;
    
            document.querySelectorAll("a").forEach(function (link) {
    
                if (isExcludedElement(link)) return;
    
                link.style.setProperty("background", "black", "important");
    
                link.style.setProperty("color", "yellow", "important");
    
            });
    
            const tick = document.getElementById("tickIcon-ht");
    
            const item = document.getElementById("featureItem-ht");
    
            if (tick) {
    
                tick.style.display = "inline-block";
    
            }
    
            if (item) {
    
                item.classList.add("feature-active");
    
            }
    
          });
    
          // ============================================
    
          // DEFAULT CURSOR
    
          // ============================================
    
          function toggleCursorFeature() {
    
            const root = document.documentElement;
    
            const active = !root.classList.contains("ux4g-bg-cursor");
    
            root.classList.toggle("ux4g-bg-cursor", active);
    
            const tick = document.getElementById("tickIcon-cursor");
    
            const item = document.getElementById("featureItem-Cursor");
    
            if (tick) {
    
                tick.style.display = active ? "inline-block" : "none";
    
            }
    
            if (item) {
    
                item.classList.toggle("feature-active", active);
    
            }
    
            localStorage.setItem("cursorFeatureActive", String(active));
    
          }
    
          document.addEventListener("DOMContentLoaded", function () {
    
            const active =
    
                localStorage.getItem("cursorFeatureActive") === "true";
    
            document.documentElement.classList.toggle(
    
                "ux4g-bg-cursor",
    
                active
    
            );
    
            const tick = document.getElementById("tickIcon-cursor");
    
            const item = document.getElementById("featureItem-Cursor");
    
            if (tick) {
    
                tick.style.display = active ? "inline-block" : "none";
    
            }
    
            if (item) {
    
                item.classList.toggle("feature-active", active);
    
            }
    
          });
    
          // ============================================
    
          // INVERT
    
          // ============================================
    
          function toggleInvertFeature() {
    
            const root = document.documentElement;
    
            const active = !root.classList.contains("ux4g-bg-white");
    
            root.classList.toggle("ux4g-bg-white", active);
    
            const tick = document.getElementById("tickIcon-ic");
    
            const item = document.getElementById("featureItem-ic");
    
            const button = document.getElementById("btn-invert");
    
            if (tick) {
    
                tick.style.display = active ? "inline-block" : "none";
    
            }
    
            if (item) {
    
                item.classList.toggle("feature-active", active);
    
            }
    
            if (button) {
    
                button.setAttribute("aria-pressed", String(active));
    
            }
    
            localStorage.setItem("invertFeature", String(active));
    
          }
    
          // Restore saved invert state. Click handling is delegated centrally below.
    
          document.addEventListener("DOMContentLoaded", function () {
    
              const active = localStorage.getItem("invertFeature") === "true";
    
              document.documentElement.classList.toggle("ux4g-bg-white", active);
    
              const tick = document.getElementById("tickIcon-ic");
    
              const item = document.getElementById("featureItem-ic");
    
              const button = document.getElementById("btn-invert");
    
              if (tick) tick.style.display = active ? "inline-block" : "none";
    
              if (item) item.classList.toggle("feature-active", active);
    
              if (button) button.setAttribute("aria-pressed", String(active));
    
          });
    
          // ============================================
    
          // WIDGET OPEN / CLOSE
    
          // ============================================
    
          // WIDGET OPEN / CLOSE AND ACCESSIBILITY ACTIONS
    
          // Delegated events support controls added later by header/footer fetches.
    
          function closeMain() {
    
              const panel = document.getElementById("uw-main");
    
              if (!panel) return;
    
              panel.style.setProperty("right", "-490px", "important");
    
              panel.classList.remove("accessibility-panel-open");
    
              panel.setAttribute("aria-hidden", "true");
    
              document.querySelectorAll(
    
                  "#uw-widget-custom-trigger, #uw-widget-custom-trigger2, .uw-widget-custom-trigger"
    
              ).forEach(function (trigger) {
    
                  trigger.setAttribute("aria-expanded", "false");
    
              });
    
              const trigger = document.querySelector(
    
                  "#uw-widget-custom-trigger2, #uw-widget-custom-trigger, .uw-widget-custom-trigger"
    
              );
    
              if (trigger) trigger.focus();
    
          }
    
          function openMain() {
    
              const panel = document.getElementById("uw-main");
    
              if (!panel) {
                  return;
    
              }
    
              panel.classList.remove("uwaw-initial");
    
              panel.classList.add("accessibility-panel-open");
    
              panel.style.setProperty("display", "block", "important");
    
              panel.style.setProperty("visibility", "visible", "important");
    
              panel.style.setProperty("opacity", "1", "important");
    
              panel.style.setProperty("position", "fixed", "important");
    
              panel.style.setProperty("right", "0", "important");
    
              panel.style.setProperty("left", "auto", "important");
    
              panel.style.setProperty("top", "0", "important");
    
              panel.style.setProperty("width", "min(490px, 100vw)", "important");
    
              panel.style.setProperty("height", "100vh", "important");
    
              panel.style.setProperty("max-height", "100vh", "important");
    
              panel.style.setProperty("overflow-y", "auto", "important");
    
              panel.style.setProperty("z-index", "2147483647", "important");
    
              panel.style.setProperty("transform", "none", "important");
    
              panel.setAttribute("aria-hidden", "false");
    
              document.querySelectorAll(
    
                  "#uw-widget-custom-trigger, #uw-widget-custom-trigger2, .uw-widget-custom-trigger"
    
              ).forEach(function (trigger) {
    
                  trigger.setAttribute("aria-controls", "uw-main");
    
                  trigger.setAttribute("aria-expanded", "true");
    
              });
    
          }
    
          // Keep these functions callable from other external scripts if needed.
    
          window.openAccessibility = openMain;
    
          window.openAccessibilityPanel = openMain;
    
          window.closeAccessibility = closeMain;
    
          window.closeAccessibilityPanel = closeMain;
    
          // One delegated click listener handles dynamically inserted triggers and
    
          // all panel buttons. Do not also attach separate trigger click listeners.
    
          document.addEventListener("click", function (event) {
    
              const target = event.target;
    
              if (!target || typeof target.closest !== "function") return;
    
              const trigger = target.closest(
    
                  "#uw-widget-custom-trigger, #uw-widget-custom-trigger2, .uw-widget-custom-trigger"
    
              );
    
              if (trigger) {
    
                  event.preventDefault();
    
                  openMain();
    
                  return;
    
              }
    
              const actionButton = target.closest("#uw-main [data-action]");
    
              if (!actionButton) return;
    
              const action = actionButton.dataset.action;
    
              switch (action) {
    
                  case "close-main":
    
                      event.preventDefault();
    
                      closeMain();
    
                      break;
    
                  case "toggle-dark-contrast":
    
                      toggleDarkContrast();
    
                      break;
    
                  case "toggle-invert":
    
                      toggleInvertFeature();
    
                      break;
    
                  case "toggle-saturation":
    
                      toggleSaturation();
    
                      break;
    
                  case "change-text-size":
    
                      if (typeof window.changeTextSize === "function") {
    
                          window.changeTextSize(Number(actionButton.dataset.value));
    
                      }
    
                      break;
    
                  case "highlight-links":
    
                      highlightLinks();
    
                      break;
    
                  case "toggle-images":
    
                      toggleImages();
    
                      break;
    
                  case "toggle-cursor":
    
                      toggleCursorFeature();
    
                      break;
    
                  case "reset-all":
    
                      resetAll();
    
                      break;
    
              }
    
          }, true);
    
          // Compatibility initialiser for the dynamic footer loader.
    
          // Delegated click handling works even when the trigger is added later.
    
          window.initAccessibilityWidget = function () {
    
              const panel = document.getElementById("uw-main");
    
              if (panel) {
    
                  panel.setAttribute("aria-hidden", "true");
    
                  return true;
    
              }
              return false;
    
          };
    
          if (document.readyState === "loading") {
    
              document.addEventListener("DOMContentLoaded", window.initAccessibilityWidget, { once: true });
    
          } else {
    
              window.initAccessibilityWidget();
    
          }
    
          // RESET ALL
    
          // ============================================
    
          function resetAll() {
    
            // Reset feature cards.
    
            document.querySelectorAll(".reset-feature").forEach(function (feature) {
    
                feature.classList.remove("feature-active");
    
            });
    
            // Reset tick icons.
    
            document.querySelectorAll(".reset-tick").forEach(function (tick) {
    
                tick.style.display = "none";
    
            });
    
            // Reset highlighted links.
    
            document.querySelectorAll("a").forEach(function (link) {
    
                link.style.removeProperty("background");
    
                link.style.removeProperty("color");
    
            });
    
            localStorage.setItem("highlightLinks", "false");
    
            // Restore images.
    
            document.querySelectorAll("img").forEach(function (image) {
    
                image.style.removeProperty("visibility");
    
            });
    
            localStorage.setItem("imageVisibilityState", "null");
    
            document.documentElement.classList.remove("image-hide");
    
            document.documentElement.id = "";
    
            // Reset contrast and saturation.
    
            document.documentElement.classList.remove(
    
                "ux4g-dark-contrast",
    
                "ux4g-saturation"
    
            );
    
            localStorage.setItem("darkContrastFeature", "false");
    
            localStorage.setItem("saturationFeature", "false");
    
            // Reset invert.
    
            document.documentElement.classList.remove("ux4g-bg-white");
    
            localStorage.setItem("invertFeature", "false");
    
            // Reset cursor.
    
            document.documentElement.classList.remove("ux4g-bg-cursor");
    
            localStorage.setItem("cursorFeatureActive", "false");
    
            // Reset any legacy dyslexia-font state.
    
            document.documentElement.classList.remove("ux4g-font-df");
    
            localStorage.setItem("dyslexia", "false");
    
            // Reset legacy line-height state.
    
            resetlineheight();
    
            // Reset letter spacing.
    
            resetLetterspacing();
    
            // Reset text sizes.
    
            if (typeof window.resetFontSizes === "function") {
    
                window.resetFontSizes();
    
            }
    
            const increaseButton = document.getElementById("btn-s9");
    
            const decreaseButton = document.getElementById("btn-small-text");
    
            if (increaseButton) {
    
                increaseButton.disabled = false;
    
                increaseButton.setAttribute("aria-pressed", "false");
    
            }
    
            if (decreaseButton) {
    
                decreaseButton.disabled = false;
    
                decreaseButton.setAttribute("aria-pressed", "false");
    
            }
    
            // Reset step indicators.
    
            document.querySelectorAll(".reset-steps").forEach(function (steps) {
    
                steps.innerHTML = "";
    
                steps.classList.remove("featureSteps-visible");
    
            });
    
            // Reset speech synthesis if available.
    
            resetspeech();
    
            localStorage.setItem("speak", "false");
    
            // Reset tick and pressed states for the current controls.
    
            [
    
                ["btn-contrast", "tickIcon-contrast"],
    
                ["btn-saturation", "tickIcon-saturation"],
    
                ["btn-invert", "tickIcon-ic"]
    
            ].forEach(function (ids) {
    
                const button = document.getElementById(ids[0]);
    
                const tick = document.getElementById(ids[1]);
    
                if (button) {
    
                    button.setAttribute("aria-pressed", "false");
    
                }
    
                if (tick) {
    
                    tick.style.display = "none";
    
                }
    
            });
    
            // Ensure the associated feature cards are inactive.
    
            [
    
                "featureItem-contrast",
    
                "featureItem-saturation",
    
                "featureItem-ic",
    
                "featureItem-hi",
    
                "featureItem-ht",
    
                "featureItem-Cursor"
    
            ].forEach(function (id) {
    
                const item = document.getElementById(id);
    
                if (item) {
    
                    item.classList.remove("feature-active");
    
                }
    
            });
    
          }
    
          // ============================================
    
          // SPEECH RESET
    
          // ============================================
    
          function resetspeech() {
    
            if ("speechSynthesis" in window) {
    
                window.speechSynthesis.cancel();
    
            }
    
          }
    
    
    
        function openAccessibilityPanel() {
    
            const panel = document.getElementById("uw-main");
    
            const trigger = document.getElementById("uw-widget-custom-trigger2");
    
    
    
            if (!panel) return;
    
    
    
            panel.classList.add("accessibility-panel-open");
    
    
    
            if (trigger) {
    
                trigger.setAttribute("aria-expanded", "true");
    
            }
    
        }
    
    
    
        function closeAccessibilityPanel() {
    
            const panel = document.getElementById("uw-main");
    
            const trigger = document.getElementById("uw-widget-custom-trigger2");
    
    
    
            if (!panel) return;
    
    
    
            panel.classList.remove("accessibility-panel-open");
    
    
    
            if (trigger) {
    
                trigger.setAttribute("aria-expanded", "false");
    
                trigger.focus();
    
            }
    
        }
    