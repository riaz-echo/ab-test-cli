(() => {
    const TEST_ID = "PDP_DELIVERY_OPTIONS";
    const BODY_CLASS = `AB--${TEST_ID}`;

    function waitForElem(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== "undefined") ? callback(elements) : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    const logos = {
        blueRibbon: `https://cdn-3.convertexperiments.com/uf/100412165/10043124/medal_6a574837ccc03.png`,
        premium: `https://cdn-3.convertexperiments.com/uf/100412165/10043124/vector-1_6a5743c92e5fb.png`,
        truck: `https://cdn-3.convertexperiments.com/uf/100412165/10043124/vector_6a57465a3c0bf.png`,
    };

    const inactiveLogos = {
        blueRibbon: `https://cdn-3.convertexperiments.com/uf/100412165/10043124/medal-1_6a5748c3dfd4a.png`,
        premium: `https://cdn-3.convertexperiments.com/uf/100412165/10043124/vector-3_6a5748f7aaa63.png`,
        truck: `https://cdn-3.convertexperiments.com/uf/100412165/10043124/vector-2_6a574889874b9.png`,
    };

    function renderIcon(opt) {
        const url = (opt.active ? logos[opt.key] : inactiveLogos[opt.key]) || "";
        if (!url) return "";
        return `<img class="AB--delivery__img" src="${url.trim()}" alt="" loading="lazy" />`;
    }

    const DELIVERY_OPTIONS = [
        { key: "blueRibbon", label: "Blue Ribbon Delivery", eta: "2-3 business days" },
        { key: "premium", label: "Premium Delivery", eta: "1-2 business days" },
        { key: "truck", label: "Truck Delivery", eta: "5-7 business days" },
    ];

    const CONTAINER = ".single_product_details_area .single_product_desc eve-delivery-icons";
    const OLD_ICONS = `${CONTAINER} img.delivery-icon`;

    function loaderMarkup() {
        return `<div class="AB--delivery__loader"><span class="AB--delivery__spinner"></span></div>`;
    }

    function deliveryMarkup(states) {
        const rows = states.map((opt) => `
            <li class="AB--delivery__item AB--delivery__item--${opt.key} ${opt.active ? "is-active" : "is-inactive"}">
                <span class="AB--delivery__icon">${renderIcon(opt)}</span>
                <span class="AB--delivery__label">${opt.label}</span>
                <span class="AB--delivery__eta">${opt.active ? opt.eta : "Not available"}</span>
            </li>`).join("");
        return `
        <div class="AB--delivery__wrap">
            <div class="AB--delivery__title">Delivery Options</div>
            <ul class="AB--delivery__list">${rows}</ul>
        </div>`;
    }

    function renderDelivery() {
        if (!document.body.classList.contains(BODY_CLASS)) return;

        waitForElem(CONTAINER, ([root]) => {
            if (root.querySelector(".AB--delivery__wrap")) return;

            root.insertAdjacentHTML("beforeend", loaderMarkup());

            waitForElem(OLD_ICONS, (imgs) => {
                const oldIcons = [...imgs];
                const states = DELIVERY_OPTIONS.map((opt) => {
                    const img = oldIcons.find((i) => (i.getAttribute("alt") || "").trim() === opt.key);
                    return { ...opt, active: !!img && img.classList.contains("delivery-active") };
                });

                requestAnimationFrame(() => {
                    root.querySelector(".AB--delivery__loader")?.remove();
                    root.insertAdjacentHTML("beforeend", deliveryMarkup(states));
                });
            }, DELIVERY_OPTIONS.length);
        });
    }

    function mainJs([body]) {
        if (window[TEST_ID] === true) return;
        window[TEST_ID] = true;

        body.classList.add(BODY_CLASS);
        renderDelivery();
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
