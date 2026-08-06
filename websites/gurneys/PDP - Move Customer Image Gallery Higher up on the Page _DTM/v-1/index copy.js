(() => {
    const BODY_CLASS = "ab--pdp-gallery-move";
    const MOVED_CLASS = "ab--gallery-moved";
    const FALLBACK_CLASS = "ab--gallery-fallback";
    const GALLERY = "#rowgallery .yotpo .yotpo-slider-wrapper";
    const TITLE = "#rowgallery .yotpo-slider-title";
    const NEW_TITLE = "See Customer Photos & Videos";
    const OWN_TITLE_CLASS = "ab--gallery-title";
    const SECTION_CLASS = "ab--gallery-section";
    const TITLE_CLASSES = ["ff-heading", "bold", "textaligncenter", "fs-heading-3-base", "font_heading_base"];

    function waitForElem(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25, onTimeout) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return onTimeout && onTimeout();
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== "undefined") ? callback(elements) : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency, frequency, onTimeout), frequency);
    }

    function fallback() {
        document.body.classList.add(FALLBACK_CLASS);
    }

    function buildSection(snapshotBox) {
        const section = document.createElement("div");
        section.className = [SECTION_CLASS, ...snapshotBox.classList].filter((name) => name !== "visualdetailsbox").join(" ");

        const inner = document.createElement("div");
        inner.className = "section-fullwidth-inner";
        section.appendChild(inner);

        snapshotBox.insertAdjacentElement("beforebegin", section);
        return inner;
    }

    function setTitle(title) {
        const header = title.closest(".yotpo-pictures-gallery-header-wrapper") || title.parentElement;
        if (header.querySelector(`.${OWN_TITLE_CLASS}`)) return;

        const heading = document.createElement("h3");
        heading.className = [OWN_TITLE_CLASS, ...TITLE_CLASSES].join(" ");
        heading.textContent = NEW_TITLE;
        header.insertAdjacentElement("afterbegin", heading);

        new MutationObserver(() => setTitle(title)).observe(header, { childList: true });
    }

    function moveGallery() {
        const slider = document.querySelector(GALLERY);
        const gallery = slider && slider.closest("#rowgallery");
        if (!gallery || gallery.classList.contains(MOVED_CLASS)) return;

        waitForElem(
            ".visualdetailsbox",
            (boxes) => {
                const snapshotBox = [...boxes].find((box) => /product\s*snapshot/i.test(box.textContent || ""));
                if (!snapshotBox) return fallback();
                buildSection(snapshotBox).appendChild(gallery);
                gallery.classList.add(MOVED_CLASS);
                requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
            },
            1,
            false,
            10000,
            25,
            fallback
        );
    }

    function initTest() {
        waitForElem(
            TITLE,
            ([title]) => {
                setTitle(title);
                moveGallery();
            },
            1,
            false,
            15000,
            25,
            fallback
        );
    }

    function onBodyClassReady() {
        initTest();

        if (document.readyState !== "complete") {
            window.addEventListener("load", moveGallery, { once: true });
        }
    }

    function mainJs([body]) {
        if (!body.classList.contains(BODY_CLASS)) {
            body.classList.add(BODY_CLASS);
        }

        waitForElem(`body.${BODY_CLASS}`, onBodyClassReady);
    }

    waitForElem("body", mainJs);
})();
