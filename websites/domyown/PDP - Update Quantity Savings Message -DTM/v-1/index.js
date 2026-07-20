(() => {
    const BODY_CLASS = "AB-pdp-qty-savings";
    const BUY_MORE_RE = /Buy\s+\d+\s+or more/i;

    let contentObserver = null;

    function debounce(fn, wait) {
        let t;
        return function () {
            clearTimeout(t);
            t = setTimeout(fn, wait);
        };
    }

    function parsePrice(str) {
        const num = parseFloat(String(str).replace(/[^0-9.]/g, ""));
        return isNaN(num) ? 0 : num;
    }

    function getPriceContainers() {
        const titleEls = [...document.querySelectorAll("div")].filter((el) => el.children.length === 0 && el.textContent.trim().replace(/\.$/, "") === "Price/Ea");
        return titleEls.map((el) => el.parentElement).filter(Boolean);
    }

    function addSavingsNote(p, basePrice) {
        const priceEl = BUY_MORE_RE.test(p.textContent) ? p.querySelector("span:not(.AB-savings-text)") : null;
        const breakPrice = priceEl ? parsePrice(priceEl.textContent) : 0;
        const savings = basePrice - breakPrice;

        if (breakPrice && savings > 0) {
            const savingsEl = document.createElement("span");
            savingsEl.className = "AB-savings-text";
            savingsEl.textContent = ` (save $${savings.toFixed(2)} per unit)`;
            priceEl.insertAdjacentElement("afterend", savingsEl);
        }
    }

    function applySavings() {
        const containers = getPriceContainers();

        containers.forEach((container) => {
            const baseEl = container.querySelector("#price-block .current-price") || container.querySelector(".current-price");
            const breaks = container.querySelectorAll(".price-breaks p");
            const basePrice = baseEl ? parsePrice(baseEl.textContent) : 0;

            if (basePrice && breaks.length) {
                container.querySelectorAll(".AB-savings-text").forEach((el) => el.remove());
                breaks.forEach((p) => addSavingsNote(p, basePrice));
            }
        });
    }

    function safeApply(roots) {
        if (contentObserver) contentObserver.disconnect();
        applySavings();
        if (contentObserver && roots) {
            roots.forEach((root) => contentObserver.observe(root, { childList: true, subtree: true, characterData: true }));
        }
    }

    function init() {
        const containers = getPriceContainers();

        if (containers.length) {
            document.body.classList.contains(BODY_CLASS) || document.body.classList.add(BODY_CLASS);

            const run = debounce(() => safeApply(getPriceContainers()), 60);

            const grid = document.querySelector("#products-grid");
            if (grid) {
                new MutationObserver(run).observe(grid, {
                    attributes: true,
                    attributeFilter: ["data-selected-products-id"],
                });
            }

            const qtyArea = document.querySelector(".add-to-cart-area") || document.querySelector("#add-to-cart-area");
            if (qtyArea) {
                new MutationObserver(run).observe(qtyArea, {
                    childList: true,
                    subtree: true,
                    characterData: true,
                    attributes: true,
                });
            }

            contentObserver = new MutationObserver(run);
            containers.forEach((container) => contentObserver.observe(container, { childList: true, subtree: true, characterData: true }));

            safeApply(containers);
        }
    }

    if (document.readyState === "complete") {
        init();
    } else {
        window.addEventListener("load", init);
    }
})();
