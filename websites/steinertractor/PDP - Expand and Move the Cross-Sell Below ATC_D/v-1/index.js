(() => {
    const TEST_ID = "PDP_XSELL_BELOW_SPECS";
    const BODY_CLASS = `AB--${TEST_ID}`;

    const XSELL_DESKTOP = "#related-products-desktop";
    const XSELL_BOTTOM = "#releated-products";
    const SEEN_ATTR = "data-ab-seen";
    const MOVED_ATTR = "data-ab-moved";
    const STALE_ATTR = "data-ab-stale";
    const DEFAULT_GAP = 20;
    const VARIATION_MQ = window.matchMedia("(min-width: 1024px)");

    const CHEVRON = (dir) => `
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="${dir === "prev" ? "M21.33 8L12 15.33l9.33 7.34" : "M10.67 8L20 15.33l-9.33 7.34"}"></path>
        </svg>`;

    function waitForElem(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== "undefined") ? callback(elements) : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    const MAIN_ROW = ".single_product_details_area .container > .row";

    function getMainRow(el) {
        const root = el.closest("product-detail-root") || document;
        const desc = root.querySelector(".single_product_details_area .single_product_desc");
        return desc ? desc.closest(MAIN_ROW) : null;
    }

    function getSlot(mainRow) {
        const existing = mainRow.nextElementSibling;
        if (existing && existing.classList.contains("AB--xsell-row")) return existing.querySelector(".AB--xsell-col");

        mainRow.insertAdjacentHTML("afterend", `<div class="row AB--xsell-row"><div class="col-12 AB--xsell-col"></div></div>`);
        return mainRow.nextElementSibling.querySelector(".AB--xsell-col");
    }

    function markFresh(selector) {
        const all = [...document.querySelectorAll(selector)];
        const fresh = all.filter((el) => !el.hasAttribute(SEEN_ATTR));
        if (!fresh.length) return;

        all.filter((el) => el.hasAttribute(SEEN_ATTR)).forEach((el) => el.setAttribute(STALE_ATTR, ""));
        fresh.forEach((el) => el.setAttribute(SEEN_ATTR, ""));
    }

    function getActive(selector) {
        return [...document.querySelectorAll(selector)].reverse().find((el) => !el.hasAttribute(STALE_ATTR)) || null;
    }

    function moveIn(el) {
        if (el.hasAttribute(MOVED_ATTR)) return true;

        const mainRow = getMainRow(el);
        if (!mainRow) return false;

        if (!el.abHome) {
            el.abHome = document.createComment("AB xsell home");
            el.parentNode.insertBefore(el.abHome, el);
        }

        getSlot(mainRow).appendChild(el);
        el.setAttribute(MOVED_ATTR, "");
        return true;
    }

    function moveHome(el) {
        if (!el.hasAttribute(MOVED_ATTR)) return;
        if (el.abHome && el.abHome.parentNode) el.abHome.parentNode.insertBefore(el, el.abHome);
        el.removeAttribute(MOVED_ATTR);
        restoreCopy(el);
    }

    function placeXsell() {
        markFresh(XSELL_DESKTOP);
        markFresh(XSELL_BOTTOM);

        const desktop = getActive(XSELL_DESKTOP);
        if (desktop) return moveIn(desktop) ? desktop : null;

        const bottom = getActive(XSELL_BOTTOM);
        if (!bottom) return null;

        if (VARIATION_MQ.matches) return moveIn(bottom) ? bottom : null;

        moveHome(bottom);
        return null;
    }

    function updateArrows(track, wrap) {
        const prev = wrap.querySelector(".AB--xsell__arrow--prev");
        const next = wrap.querySelector(".AB--xsell__arrow--next");
        if (!prev || !next) return;

        const maxScroll = track.scrollWidth - track.clientWidth;
        prev.disabled = track.scrollLeft <= 1;
        next.disabled = track.scrollLeft >= maxScroll - 1;
    }

    function setupCarousel(xsell) {
        const wrap = xsell.querySelector(".eve-carousel-button-wrapper");
        const track = xsell.querySelector(".eve-carousel-wrapper");
        if (!wrap || !track) return;

        if (!wrap.querySelector(".AB--xsell__arrow")) {
            wrap.insertAdjacentHTML(
                "beforeend",
                `<button type="button" class="AB--xsell__arrow AB--xsell__arrow--prev" aria-label="Previous products" disabled>${CHEVRON("prev")}</button>
                 <button type="button" class="AB--xsell__arrow AB--xsell__arrow--next" aria-label="Next products">${CHEVRON("next")}</button>`
            );

            wrap.querySelectorAll(".AB--xsell__arrow").forEach((btn) => {
                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const dir = btn.classList.contains("AB--xsell__arrow--prev") ? -1 : 1;
                    const list = track.querySelector(".eve-carousel-inner");
                    const gap = (list && parseFloat(getComputedStyle(list).columnGap)) || DEFAULT_GAP;
                    track.scrollBy({ left: dir * (track.clientWidth + gap), behavior: "smooth" });
                });
            });
        }

        if (!track.abXsellBound) {
            track.abXsellBound = true;
            ["scroll", "scrollend"].forEach((evt) => track.addEventListener(evt, () => updateArrows(track, wrap), { passive: true }));
        }

        updateArrows(track, wrap);
    }

    function updateCopy(xsell) {
        const heading = xsell.querySelector(".related-products > h5");
        if (heading && heading.textContent.trim() === "Other Customers Also Bought") {
            heading.textContent = "Customers Also Bought";
        }

        xsell.querySelectorAll(".product-buttons .btn").forEach((btn) => {
            if (btn.textContent.trim() === "Order Now") btn.textContent = "View Product";
        });

        xsell.querySelectorAll("img.related-products__img").forEach((img) => {
            const src = img.getAttribute("src") || "";
            if (src.includes("$sm$")) img.setAttribute("src", src.replace("$sm$", "$lg$"));
        });
    }

    function restoreCopy(xsell) {
        const heading = xsell.querySelector(".related-products > h5");
        if (heading && heading.textContent.trim() === "Customers Also Bought") {
            heading.textContent = "Other Customers Also Bought";
        }

        xsell.querySelectorAll(".product-buttons .btn").forEach((btn) => {
            if (btn.textContent.trim() === "View Product") btn.textContent = "Order Now";
        });

        xsell.querySelectorAll("img.related-products__img").forEach((img) => {
            const src = img.getAttribute("src") || "";
            if (src.includes("$lg$")) img.setAttribute("src", src.replace("$lg$", "$sm$"));
        });
    }

    function sync() {
        const xsell = placeXsell();
        if (!xsell) return;

        updateCopy(xsell);
        setupCarousel(xsell);
    }

    let scheduled = false;
    function scheduleSync() {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(() => {
            scheduled = false;
            sync();
        });
    }

    function mainJs([body]) {
        if (window[TEST_ID] === true) return;
        window[TEST_ID] = true;

        body.classList.add(BODY_CLASS);
        sync();

        new MutationObserver(scheduleSync).observe(body, { childList: true, subtree: true });
        window.addEventListener("resize", scheduleSync);
    }

    function init() {
        waitForElem("body", mainJs);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
