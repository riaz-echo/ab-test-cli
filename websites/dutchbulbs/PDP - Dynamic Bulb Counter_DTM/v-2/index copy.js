(() => {
    const FORM_WRAPPER = ".product-form__quantity-and-buy-buttons-wrapper";
    const QTY_LABEL = ".quantity-input-wrapper__labels .quantity-input-wrapper__label, .product-form__quantity label.product__label";
    const QTY_INPUT = ".quantity-input-wrapper--product-form input[data-quantity-input], input.product-form__input--quantity";
    const QTY_BUTTONS = "[data-add-quantity], [data-subtract-quantity]";
    const OPTION_SELECT = "select.dynamic-variant-input, select[data-index^='option']";
    const OPTION_CHIP = ".product__chip.selected[data-option-value], .dynamic-variant-button.selected[data-option-value]";
    const OPTION_ANY = `${OPTION_SELECT}, ${OPTION_CHIP}`;
    const OPTION_BUTTON = ".product__chip[data-option-value], .dynamic-variant-button[data-option-value], [data-option-buttons] [data-button]";
    const VARIANT_INPUT = "#productdatalayerVariant";
    const SAVINGS_HEAD = ".productsavingtable .optionHead > div:first-child";

    const BODY_CLASS = "ab-dbc-v2";
    const COPY_CLASS = "ab-dbc-copy";
    const COPY_TEMPLATE = "(You're adding {count} {unit} to cart)";
    const DEFAULT_UNIT = "Items";
    const PACK_PATTERN = /(\d{1,3}(?:,\d{3})+|\d+)\s*([A-Za-z][A-Za-z-]*)/g;
    const NOT_A_UNIT = /^(cm|mm|m|in|inch|inches|ft|feet|foot|lb|lbs|pound|pounds|oz|ounce|ounces|g|gr|gram|grams|kg|ml|l|liter|liters|litre|litres|gal|gallon|gallons|qt|quart|quarts|pt|pint|pints|yr|yrs|year|years|month|months|week|weeks|day|days|hr|hrs|hour|hours|x)$/i;
    const POLL_INTERVAL = 500;
    const WAIT_TIMEOUT = 10000;

    let observer = null;
    let renderScheduled = false;

    function waitForElem(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== "undefined") ? callback(elements) : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency, frequency), frequency);
    }

    function parsePack(text) {
        const source = String(text || "");
        const pattern = new RegExp(PACK_PATTERN.source, "gi");
        let match;
        let measuredCount = 0;

        while ((match = pattern.exec(source))) {
            const count = parseInt(match[1].replace(/,/g, ""), 10);
            if (count <= 0) continue;
            if (!NOT_A_UNIT.test(match[2])) return { count, unit: match[2] };
            if (!measuredCount) measuredCount = count;
        }

        if (measuredCount) {
            const name = source.split("|")[0];
            const last = name.match(/([A-Za-z][A-Za-z-]*)\s*$/);
            if (last && !NOT_A_UNIT.test(last[1])) return { count: measuredCount, unit: last[1] };
        }

        return null;
    }

    function matchCase(sample, word) {
        return sample === sample.toUpperCase() && sample.length > 1 ? word.toUpperCase() : word;
    }

    function singularize(word) {
        if (/ies$/i.test(word)) return word.replace(/ies$/i, matchCase(word, "y"));
        if (/(ch|sh|x|ss)es$/i.test(word)) return word.replace(/es$/i, "");
        if (/[^s]s$/i.test(word)) return word.replace(/s$/i, "");
        return word;
    }

    function pluralize(word) {
        if (/(ch|sh|x|ss|s)$/i.test(word)) return word + matchCase(word, "es");
        if (/[^aeiou]y$/i.test(word)) return word.replace(/y$/i, matchCase(word, "ies"));
        return word + matchCase(word, "s");
    }

    function formatUnit(unit, count) {
        const singular = singularize(String(unit || DEFAULT_UNIT).trim());
        return count === 1 ? singular : pluralize(singular);
    }

    function closestContaining(wrapper, selector) {
        let node = wrapper;

        while (node) {
            if (node.querySelector && node.querySelector(selector)) return node;
            if (node === document.body) return null;
            node = node.parentElement;
        }

        return null;
    }

    function isForeign(element, wrapper) {
        const ownForm = wrapper.closest("form");
        const form = element.closest("form");
        return !!form && form !== ownForm;
    }

    function getOptionLevel(element) {
        const attrs = [element.getAttribute("data-index"), element.getAttribute("data-product-option"), element.id, element.getAttribute("class")];
        const wrap = element.closest("[data-product-option], [data-index]");

        if (wrap && wrap !== element) attrs.push(wrap.getAttribute("data-index"), wrap.getAttribute("data-product-option"));

        for (const attr of attrs) {
            const match = attr && String(attr).match(/(?:option|dynamic-option-)(\d+)/i);
            if (match) return parseInt(match[1], 10);
        }

        return 1;
    }

    function getCandidates(wrapper) {
        const scope = closestContaining(wrapper, OPTION_ANY);
        const candidates = [];
        if (!scope) return candidates;

        scope.querySelectorAll(OPTION_CHIP).forEach((chip) => {
            if (isForeign(chip, wrapper)) return;
            candidates.push({ text: chip.getAttribute("data-option-value"), level: getOptionLevel(chip), priority: 2 });
        });

        scope.querySelectorAll(OPTION_SELECT).forEach((select) => {
            if (isForeign(select, wrapper)) return;
            const option = select.options[select.selectedIndex];
            candidates.push({ text: option ? option.value || option.textContent : select.value, level: getOptionLevel(select), priority: 1 });
        });

        const variant = wrapper.querySelector(VARIANT_INPUT) || (isForeign(scope, wrapper) ? null : scope.querySelector(VARIANT_INPUT));
        if (variant) candidates.push({ text: variant.value, level: 0, priority: 0 });

        return candidates;
    }

    function getPack(wrapper) {
        const parsed = [];

        getCandidates(wrapper).forEach((candidate) => {
            const pack = parsePack(candidate.text);
            if (pack) parsed.push({ pack, level: candidate.level, priority: candidate.priority });
        });

        if (!parsed.length) return null;

        parsed.sort((a, b) => b.level - a.level || b.priority - a.priority);
        return parsed[0].pack;
    }

    function getFallbackUnit(wrapper) {
        const scope = closestContaining(wrapper, SAVINGS_HEAD);
        const head = scope && scope.querySelector(SAVINGS_HEAD);
        const match = head && !isForeign(head, wrapper) ? head.textContent.trim().match(/#\s*of\s+(.+)/i) : null;
        return match ? match[1].trim() : DEFAULT_UNIT;
    }

    function getQuantity(wrapper) {
        const input = wrapper.querySelector(QTY_INPUT);
        const value = input ? parseInt(input.value, 10) : NaN;
        return value >= 1 ? value : 1;
    }

    function getState(wrapper) {
        const quantity = getQuantity(wrapper);
        const pack = getPack(wrapper);
        const total = pack ? pack.count * quantity : quantity;

        return { total, unit: formatUnit(pack ? pack.unit : getFallbackUnit(wrapper), total) };
    }

    function renderWrapper(wrapper) {
        const label = wrapper.querySelector(QTY_LABEL);
        if (!label) return;

        const { total, unit } = getState(wrapper);
        const text = COPY_TEMPLATE.replace("{count}", total).replace("{unit}", unit.toLowerCase());

        let copy = label.querySelector(`.${COPY_CLASS}`);

        if (!copy) {
            copy = document.createElement("span");
            copy.className = COPY_CLASS;
            label.appendChild(document.createTextNode(" "));
            label.appendChild(copy);
        }

        if (copy.textContent !== text) copy.textContent = text;
    }

    function markBody() {
        try {
            if (!document.body.classList.contains(BODY_CLASS)) document.body.classList.add(BODY_CLASS);
        } catch (error) {}
    }

    function renderAll() {
        try {
            markBody();
            document.querySelectorAll(FORM_WRAPPER).forEach(renderWrapper);
        } catch (error) {}
    }

    function scheduleRender(delay) {
        if (delay) return setTimeout(renderAll, delay);
        if (renderScheduled) return;

        renderScheduled = true;
        requestAnimationFrame(() => {
            renderScheduled = false;
            renderAll();
        });
    }

    function bindEvents() {
        const onFieldEvent = (event) => {
            const target = event.target;
            if (target && target.matches && target.matches(`${QTY_INPUT}, ${OPTION_SELECT}`)) scheduleRender();
        };

        document.addEventListener("input", onFieldEvent, true);
        document.addEventListener("change", onFieldEvent, true);

        document.addEventListener(
            "click",
            (event) => {
                const target = event.target;
                if (!target || !target.closest || !target.closest(`${QTY_BUTTONS}, ${OPTION_BUTTON}`)) return;
                scheduleRender();
                scheduleRender(150);
            },
            true
        );

        window.addEventListener("popstate", () => scheduleRender(150));
        setInterval(renderAll, POLL_INTERVAL);
    }

    function startObserver() {
        try {
            observer = new MutationObserver(() => scheduleRender());
            observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "value", "selected", "data-option-value"] });
        } catch (error) {}
    }

    function startTest() {
        try {
            renderAll();
            bindEvents();
            startObserver();
        } catch (error) {}
    }

    function mainJs() {
        markBody();
        waitForElem(`${FORM_WRAPPER} ${QTY_INPUT}`, startTest, 1, false, WAIT_TIMEOUT);
    }

    waitForElem("body", mainJs);
})();
