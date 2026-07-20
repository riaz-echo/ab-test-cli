(() => {
    const testInfo = {
        id: "pdp-qty-savings",
        name: "PDP - Update Quantity Savings Message [DTM]",
        variation: 1,
        version: "001",
    };

    const TEST_ID = "pdp-qty-savings";
    const VARIANT_ID = "V1";
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

    function getPriceContainer() {
        const offers = document.querySelector("#product-page-offers");
        const titleEl = offers
            ? [...offers.querySelectorAll("div")].find((el) => el.children.length === 0 && el.textContent.trim().replace(/\.$/, "") === "Price/Ea")
            : null;
        return titleEl ? titleEl.parentElement : null;
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
        const container = getPriceContainer();
        const baseEl = container && (container.querySelector("#price-block .current-price") || container.querySelector(".current-price"));
        const breaks = container ? container.querySelectorAll(".price-breaks p") : [];
        const basePrice = baseEl ? parsePrice(baseEl.textContent) : 0;

        if (basePrice && breaks.length) {
            container.querySelectorAll(".AB-savings-text").forEach((el) => el.remove());
            breaks.forEach((p) => addSavingsNote(p, basePrice));
        }
    }

    function safeApply(root) {
        if (contentObserver) contentObserver.disconnect();
        applySavings();
        if (contentObserver && root) {
            contentObserver.observe(root, { childList: true, subtree: true, characterData: true });
        }
    }

    function init() {
        const offers = document.querySelector("#product-page-offers");

        if (offers) {
            document.body.classList.contains(BODY_CLASS) || document.body.classList.add(BODY_CLASS);

            const run = debounce(() => safeApply(offers), 60);

            const grid = document.querySelector("#products-grid");
            if (grid) {
                new MutationObserver(run).observe(grid, {
                    attributes: true,
                    attributeFilter: ["data-selected-products-id"],
                });
            }

            contentObserver = new MutationObserver(run);
            contentObserver.observe(offers, { childList: true, subtree: true, characterData: true });

            safeApply(offers);
        }
    }

    if (document.readyState === "complete") {
        init();
    } else {
        window.addEventListener("load", init);
    }
})();
