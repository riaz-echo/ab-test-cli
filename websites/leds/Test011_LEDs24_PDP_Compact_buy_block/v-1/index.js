(() => {
    const CONFIG = {
        selectors: {
            buy: ".is-ctl-product .product-detail-buy",
            orderNumber: ".product-detail-headline > .container",
            ups: ".k2p-ups-container",
            requiredWrapper: ".swp-productoptions-product--sections-required-wrapper",
            optionLabel: ".swp-productoptions-product--group__optionsWrapper .form-check.option-image .productoptions-info-section label.form-check-label",
            infoText: ".swp-productoptions-product--section-required-info > div",
            recoHeading: "#swp-productoptions--input-wrapper > .mt-4",
        },
        classes: {
            body: "ab-t011-v1",
            orderNumberOrig: "ab-t011-ordernumber-orig",
            orderNumber: "ab-t011-ordernumber",
            opt: "ab-t011-opt",
            recoHeading: "ab-t011-reco-heading",
            recoText: "ab-t011-reco-text",
        },
        texts: {
            info: "Anschlussfertig geliefert: Ihre gewählten Kabel werden direkt am Streifen montiert.",
            reco: "Optional: passendes Zubehör direkt mitbestellen.",
        },
    };

    function waitForElem(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== "undefined") ? callback(elements) : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text) node.textContent = text;
        return node;
    }

    function renderOrderNumber(buy) {
        const original = buy.querySelector(CONFIG.selectors.orderNumber);
        const ups = buy.querySelector(CONFIG.selectors.ups);
        let moved = buy.querySelector(`.${CONFIG.classes.orderNumber}`);
        const source = original && original.querySelector(".col-12");
        const text = source ? source.textContent.replace(/\s+/g, " ").trim() : "";

        if (!text || !ups) {
            if (moved) moved.remove();
            if (original) original.classList.remove(CONFIG.classes.orderNumberOrig);
            return;
        }

        original.classList.add(CONFIG.classes.orderNumberOrig);
        if (!moved || moved.previousElementSibling !== ups) {
            if (moved) moved.remove();
            moved = el("div", CONFIG.classes.orderNumber);
            ups.insertAdjacentElement("afterend", moved);
        }
        if (moved.textContent !== text) moved.textContent = text;
    }

    function splitOption(text) {
        const value = text.replace(/[ \t\r\n]+/g, " ").trim();
        let match = value.match(/^(.+?)\s*\|\s*(.+?)\s*\(([^()]+)\)$/);
        if (match) return {name: match[1], size: match[2], price: match[3]};
        match = value.match(/^(.+?)\s*\(([^()]+)\)$/);
        if (match) return {name: match[1], size: "", price: match[2]};
        return null;
    }

    function renderOptionLabels(buy) {
        const wrapper = buy.querySelector(CONFIG.selectors.requiredWrapper);
        if (!wrapper) return;

        wrapper.querySelectorAll(CONFIG.selectors.optionLabel).forEach((label) => {
            if (label.querySelector(`.${CONFIG.classes.opt}`)) return;
            const option = splitOption(label.textContent);
            if (!option) return;

            const c = CONFIG.classes.opt;
            const box = el("span", c);
            const name = el("span", `${c}__name`, option.name);
            const meta = el("span", `${c}__meta`);

            if (option.size) {
                name.appendChild(el("span", `${c}__desk`, ` | ${option.size}`));
                meta.appendChild(el("span", `${c}__mob`, `${option.size} · `));
            }
            meta.appendChild(el("span", `${c}__desk`, `(${option.price})`));
            meta.appendChild(el("span", `${c}__mob`, option.price));

            box.append(name, meta);
            label.textContent = "";
            label.appendChild(box);
        });
    }

    function renderTexts(buy) {
        const info = buy.querySelector(CONFIG.selectors.infoText);
        if (info && /anschlussbereit/i.test(info.textContent) && info.textContent.trim() !== CONFIG.texts.info) {
            info.textContent = CONFIG.texts.info;
        }

        const heading = buy.querySelector(CONFIG.selectors.recoHeading);
        if (heading) heading.classList.add(CONFIG.classes.recoHeading);
        const intro = heading && heading.querySelector("h3") && heading.nextElementSibling;
        if (intro && intro.tagName === "P" && intro.textContent.trim() !== CONFIG.texts.reco) {
            intro.textContent = CONFIG.texts.reco;
            intro.classList.add(CONFIG.classes.recoText);
        }
    }

    function render() {
        const buy = document.querySelector(CONFIG.selectors.buy);
        if (!buy) return;

        renderOrderNumber(buy);
        renderOptionLabels(buy);
        renderTexts(buy);
    }

    function observe() {
        let scheduled = false;
        const observer = new MutationObserver(() => {
            if (scheduled) return;
            scheduled = true;
            requestAnimationFrame(() => {
                scheduled = false;
                observer.disconnect();
                render();
                observer.observe(document.body, {childList: true, subtree: true});
            });
        });
        observer.observe(document.body, {childList: true, subtree: true});
    }

    function mainJs() {
        if (document.body.classList.contains(CONFIG.classes.body)) return;
        document.body.classList.add(CONFIG.classes.body);

        render();
        observe();
    }

    waitForElem(CONFIG.selectors.buy, mainJs);
})();
