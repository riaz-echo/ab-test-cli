(() => {
    const CONFIG = {
        selectors: {
            formWrapper: ".product-form__quantity-and-buy-buttons-wrapper",
            qtyInput: ".quantity-input-wrapper--product-form input[data-quantity-input], input.product-form__input--quantity",
            qtyButtons: "[data-add-quantity], [data-subtract-quantity]",
            optionSelect: "select.dynamic-variant-input, select[data-index^='option']",
            optionChip: ".product__chip.selected[data-option-value], .dynamic-variant-button.selected[data-option-value]",
            optionButton: ".product__chip[data-option-value], .dynamic-variant-button[data-option-value], [data-option-buttons] [data-button]",
            variantInput: "#productdatalayerVariant",
            savingsHead: ".productsavingtable .optionHead > div:first-child",
            atcButton: "[data-add-to-cart]",
            atcText: "[data-add-to-cart-text]",
            soldOut: ".product-form__cart-submit[aria-disabled='true']",
            variantButton: ".dynamic-variant-button",
            uom: ".prodinfoGreenbar .prodUom",
        },

        limits: {
            maxQuantity: 100,
        },

        classes: {
            body: "ab-dbc-v1",
        },

        copy: {
            atcTemplate: "Add {count} {unit} to Cart",
            defaultAtcText: "Add to Cart",
            defaultUnit: "Items",
        },

        patterns: {
            ownText: /^Add \d+ .+ to Cart$/i,
            pack: /(\d{1,3}(?:,\d{3})+|\d+)\s*([A-Za-z][A-Za-z-]*)/g,
            notAUnit: /^(cm|mm|m|in|inch|inches|ft|feet|foot|lb|lbs|pound|pounds|oz|ounce|ounces|g|gr|gram|grams|kg|ml|l|liter|liters|litre|litres|gal|gallon|gallons|qt|quart|quarts|pt|pint|pints|yr|yrs|year|years|month|months|week|weeks|day|days|hr|hrs|hour|hours|x)$/i,
            savingsUnit: /#\s*of\s+(.+)/i,
            optionLevel: /(?:option|dynamic-option-)(\d+)/i,
        },

        timing: {
            poll: 500,
            wait: 10000,
            settle: 150,
        },

        observer: {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["class", "value", "selected", "data-option-value", "disabled", "aria-disabled"],
        },
    };

    CONFIG.selectors.optionAny = `${CONFIG.selectors.optionSelect}, ${CONFIG.selectors.optionChip}`;

    const state = {
        observer: null,
        renderScheduled: false,
        settleTimer: null,
        pollTimer: null,
    };

    function waitForElem(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== "undefined") ? callback(elements) : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency, frequency), frequency);
    }

    function parsePack(text) {
        const source = String(text || "");
        const name = source.split("|")[0];
        let measured = null;

        for (const match of source.matchAll(CONFIG.patterns.pack)) {
            const count = parseInt(match[1].replace(/,/g, ""), 10);
            if (count <= 0) continue;
            if (!CONFIG.patterns.notAUnit.test(match[2])) return { count, unit: match[2] };
            if (measured) continue;

            const after = name.slice(match.index + match[0].length);
            if (/[A-Za-z]/.test(after)) measured = { count, unit: match[2], measured: true };
        }

        return measured;
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
        const singular = singularize(String(unit || CONFIG.copy.defaultUnit).trim());
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

    function isForeign(element, ownForm) {
        const form = element.closest("form");
        return !!form && form !== ownForm;
    }

    function getOptionLevel(element) {
        const attrs = [element.getAttribute("data-index"), element.getAttribute("data-product-option"), element.id, element.getAttribute("class")];
        const wrap = element.closest("[data-product-option], [data-index]");

        if (wrap && wrap !== element) attrs.push(wrap.getAttribute("data-index"), wrap.getAttribute("data-product-option"));

        for (const attr of attrs) {
            const match = attr && String(attr).match(CONFIG.patterns.optionLevel);
            if (match) return parseInt(match[1], 10);
        }

        return 1;
    }

    function getCandidates(wrapper) {
        const scope = closestContaining(wrapper, CONFIG.selectors.optionAny);
        const candidates = [];
        if (!scope) return candidates;

        const ownForm = wrapper.closest("form");

        scope.querySelectorAll(CONFIG.selectors.optionChip).forEach((chip) => {
            if (isForeign(chip, ownForm)) return;
            candidates.push({ text: chip.getAttribute("data-option-value"), level: getOptionLevel(chip), priority: 2 });
        });

        scope.querySelectorAll(CONFIG.selectors.optionSelect).forEach((select) => {
            if (isForeign(select, ownForm)) return;
            const option = select.options[select.selectedIndex];
            candidates.push({ text: option ? option.value || option.textContent : select.value, level: getOptionLevel(select), priority: 1 });
        });

        const variant = wrapper.querySelector(CONFIG.selectors.variantInput) || (isForeign(scope, ownForm) ? null : scope.querySelector(CONFIG.selectors.variantInput));
        if (variant) candidates.push({ text: variant.value, level: 0, priority: 0 });

        return candidates;
    }

    function getOwnText(element) {
        return Array.from(element.childNodes)
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => node.textContent)
            .join(" ")
            .trim();
    }

    function isMultiSku(wrapper) {
        const scope = closestContaining(wrapper, CONFIG.selectors.variantButton);
        if (!scope) return false;

        const ownForm = wrapper.closest("form");
        return Array.from(scope.querySelectorAll(CONFIG.selectors.variantButton)).some((button) => !isForeign(button, ownForm));
    }

    function getUomPack(wrapper) {
        const scope = closestContaining(wrapper, CONFIG.selectors.uom);
        const uom = scope && scope.querySelector(CONFIG.selectors.uom);
        if (!uom || isForeign(uom, wrapper.closest("form"))) return null;

        return parsePack(getOwnText(uom));
    }

    function getPack(wrapper) {
        if (isMultiSku(wrapper)) return getVariantPack(wrapper);
        return getUomPack(wrapper) || getVariantPack(wrapper);
    }

    function getVariantPack(wrapper) {
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
        const scope = closestContaining(wrapper, CONFIG.selectors.savingsHead);
        const head = scope && scope.querySelector(CONFIG.selectors.savingsHead);
        const match = head && !isForeign(head, wrapper.closest("form")) ? head.textContent.trim().match(CONFIG.patterns.savingsUnit) : null;
        return match ? match[1].trim() : CONFIG.copy.defaultUnit;
    }

    function getQuantity(wrapper) {
        const input = wrapper.querySelector(CONFIG.selectors.qtyInput);
        const value = input ? parseInt(input.value, 10) : NaN;
        return value >= 1 ? value : 1;
    }

    function getState(wrapper, quantity) {
        const pack = getPack(wrapper);

        if (!pack) return { total: quantity, unit: formatUnit(getFallbackUnit(wrapper), quantity) };

        const total = pack.count * quantity;
        return { total, unit: pack.measured ? pack.unit : formatUnit(pack.unit, total) };
    }

    function isActive(wrapper, quantity) {
        return quantity <= CONFIG.limits.maxQuantity && !wrapper.querySelector(CONFIG.selectors.soldOut);
    }

    function setButtonText(button, label, text) {
        if (label.textContent.trim() !== text) label.textContent = text;
        if (button.getAttribute("aria-label") !== text) button.setAttribute("aria-label", text);
    }

    function renderWrapper(wrapper) {
        const button = wrapper.querySelector(CONFIG.selectors.atcButton);
        const label = button && button.querySelector(CONFIG.selectors.atcText);
        if (!button || !label) return;

        const current = label.textContent.trim();
        const available = (button.getAttribute("data-lang-available") || CONFIG.copy.defaultAtcText).trim();
        const isOwn = CONFIG.patterns.ownText.test(current);
        const quantity = getQuantity(wrapper);

        if (!isActive(wrapper, quantity)) {
            if (isOwn) setButtonText(button, label, available);
            return;
        }

        if (button.disabled || (current !== available && !isOwn)) return;

        const { total, unit } = getState(wrapper, quantity);
        setButtonText(button, label, CONFIG.copy.atcTemplate.replace("{count}", total).replace("{unit}", unit));
    }

    function markBody() {
        try {
            if (!document.body.classList.contains(CONFIG.classes.body)) document.body.classList.add(CONFIG.classes.body);
        } catch (error) {}
    }

    function resumeObserver() {
        try {
            if (!state.observer) return;
            state.observer.takeRecords();
            state.observer.observe(document.body, CONFIG.observer);
        } catch (error) {}
    }

    function renderAll() {
        if (state.observer) state.observer.disconnect();

        try {
            markBody();
            document.querySelectorAll(CONFIG.selectors.formWrapper).forEach(renderWrapper);
        } catch (error) {
        } finally {
            resumeObserver();
        }
    }

    function scheduleRender(delay) {
        if (delay) {
            clearTimeout(state.settleTimer);
            state.settleTimer = setTimeout(renderAll, delay);
            return;
        }

        if (state.renderScheduled) return;

        state.renderScheduled = true;
        requestAnimationFrame(() => {
            state.renderScheduled = false;
            renderAll();
        });
    }

    function bindEvents() {
        const onFieldEvent = (event) => {
            const target = event.target;
            if (target && target.matches && target.matches(`${CONFIG.selectors.qtyInput}, ${CONFIG.selectors.optionSelect}`)) scheduleRender();
        };

        document.addEventListener("input", onFieldEvent, true);
        document.addEventListener("change", onFieldEvent, true);

        document.addEventListener(
            "click",
            (event) => {
                const target = event.target;
                if (!target || !target.closest || !target.closest(`${CONFIG.selectors.qtyButtons}, ${CONFIG.selectors.optionButton}`)) return;
                scheduleRender();
                scheduleRender(CONFIG.timing.settle);
            },
            true
        );

        window.addEventListener("popstate", () => scheduleRender(CONFIG.timing.settle));
        state.pollTimer = setInterval(renderAll, CONFIG.timing.poll);
    }

    function startObserver() {
        try {
            state.observer = new MutationObserver(() => scheduleRender());
            resumeObserver();
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
        waitForElem(`${CONFIG.selectors.formWrapper} ${CONFIG.selectors.atcButton} ${CONFIG.selectors.atcText}`, startTest, 1, false, CONFIG.timing.wait);
    }

    waitForElem("body", mainJs);
})();
