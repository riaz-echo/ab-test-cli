(() => {
    const CART_ITEMS = ".cart-section .cart.page .cart__form .cart__form-main-content .cart__form-items";
    const CART_ITEM = ".cart__form-item[data-input-item]";
    const HEADER_ITEM = ".checkout_header";
    const PREORDER_NODES = ".ieshipnow, .ieshipdate";

    const CLASSES = {
        READY: "ab-opt-ready",
        ITEM: "ab-opt-item",
        DESKTOP: "ab-opt-desktop",
        MOBILE: "ab-opt-mobile",
        PREORDER: "ab-opt-preorder",
    };

    const PREORDER_TEXT = "Preorder: Order now and shipping starts in {month}";
    const MONTH_TOKEN = "{month}";
    const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const QUANTITY_LABEL = "Quantity";
    const FONT_ID = "ab-opt-font";
    const FONT_HREF = "https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400;500;600;700&display=swap";
    const WAIT_TIMEOUT = 7000;

    let observer = null;
    let applyScheduled = false;
    let resizeBound = false;

    function waitForElem(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25, onTimeout) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return onTimeout && onTimeout();
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== "undefined") ? callback(elements) : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency, frequency, onTimeout), frequency);
    }

    function markReady() {
        try {
            document.body.classList.add(CLASSES.READY);
        } catch (error) {}
    }

    function loadFont() {
        try {
            if (document.getElementById(FONT_ID)) return;

            const head = document.head || document.documentElement;

            ["https://fonts.googleapis.com", "https://fonts.gstatic.com"].forEach((origin) => {
                const preconnect = document.createElement("link");
                preconnect.rel = "preconnect";
                preconnect.href = origin;
                preconnect.crossOrigin = "anonymous";
                head.appendChild(preconnect);
            });

            const link = document.createElement("link");
            link.id = FONT_ID;
            link.rel = "stylesheet";
            link.href = FONT_HREF;
            head.appendChild(link);
        } catch (error) {}
    }

    function syncLayoutMode(root) {
        try {
            const probe = root.querySelector(`${CART_ITEM} .cart-form-price-total .mob_show_imp`);
            const isMobile = probe ? window.getComputedStyle(probe).display !== "none" : window.matchMedia("(max-width: 767px)").matches;

            root.classList.toggle(CLASSES.MOBILE, isMobile);
            root.classList.toggle(CLASSES.DESKTOP, !isMobile);
        } catch (error) {}
    }

    function movePriceBelowTitle(item) {
        const info = item.querySelector(".cart__form-item-info");
        const source = item.querySelector(".cart__form-item-price-container .cart__form-item-price-wrapper .cart__form-item-price");
        if (!info || !source) return;

        let holder = info.querySelector(".ab-opt-price");

        if (!holder) {
            holder = document.createElement("div");
            holder.className = "ab-opt-price ff-product-price fs-body-100";

            const value = source.cloneNode(true);
            value.className = "ab-opt-price-value";
            value.removeAttribute("data-is-sale");
            holder.appendChild(value);

            const anchor = info.querySelector(".cart__form-item-variant") || info.querySelector(".cart__form-item-title");
            anchor ? anchor.insertAdjacentElement("afterend", holder) : info.prepend(holder);
        }

        const value = holder.querySelector(".ab-opt-price-value");
        if (value && value.innerHTML !== source.innerHTML) value.innerHTML = source.innerHTML;
    }

    function moveQuantityIntoPriceColumn(item) {
        const container = item.querySelector(".cart__form-item-price-container");
        const quantity = item.querySelector(".cart__form-item-quantity-wrapper");
        if (!container || !quantity) return;

        const total = container.querySelector(".cart-form-price-total");

        if (total) {
            if (quantity.parentElement !== container || quantity.nextElementSibling !== total) {
                total.insertAdjacentElement("beforebegin", quantity);
            }
            return;
        }

        if (quantity.parentElement !== container) container.appendChild(quantity);
    }

    function resolvePreorderText(item) {
        if (!PREORDER_TEXT.includes(MONTH_TOKEN)) return PREORDER_TEXT;

        const input = item.querySelector('input[id^="shiprange"]');
        const parts = input && input.value ? input.value.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})/) : null;
        if (!parts) return "";

        const month = MONTHS[parseInt(parts[1], 10) - 1];
        return month ? PREORDER_TEXT.replace(MONTH_TOKEN, month) : "";
    }

  
    function addPreorderLine(item) {
        const info = item.querySelector(".cart__form-item-info");
        if (!info) return;

        const themeLine = [...item.querySelectorAll(PREORDER_NODES)].some((node) => node.textContent.trim().toLowerCase().includes("preorder"));
        if (themeLine) return;

        const text = resolvePreorderText(item);
        let line = info.querySelector(`.${CLASSES.PREORDER}`);

        if (!text) {
            if (line) line.remove();
            return;
        }

        if (!line) {
            line = document.createElement("p");
            line.className = `${CLASSES.PREORDER} fs-body-75 t-opacity-70`;
        }

        if (line.textContent !== text) line.textContent = text;
        if (line.parentElement !== info || line !== info.lastElementChild) info.appendChild(line);
    }

    function decorateHeader(root) {
        const header = root.querySelector(HEADER_ITEM);
        if (!header) return;

        const cells = header.querySelectorAll(".cart__form-item-price-container .cart__form-item-price-wrapper");
        if (cells.length && cells[0].textContent.trim() !== QUANTITY_LABEL) cells[0].textContent = QUANTITY_LABEL;
    }

    function decorateItem(item) {
        movePriceBelowTitle(item);
        addPreorderLine(item);
        moveQuantityIntoPriceColumn(item);
        item.classList.add(CLASSES.ITEM);
    }

    function applyChanges() {
        if (observer) observer.disconnect();

        try {
            const root = document.querySelector(CART_ITEMS);

            if (root) {
                decorateHeader(root);
                root.querySelectorAll(CART_ITEM).forEach(decorateItem);
                syncLayoutMode(root);
            }
        } catch (error) {}
        markReady();
        startObserver();
    }

    function scheduleApply() {
        if (applyScheduled) return;
        applyScheduled = true;
        requestAnimationFrame(() => {
            applyScheduled = false;
            applyChanges();
        });
    }

    function startObserver() {
        try {
            if (!observer) observer = new MutationObserver(scheduleApply);

            observer.takeRecords();
            observer.observe(document.body, { childList: true, subtree: true });
        } catch (error) {}
    }

    function bindResize() {
        if (resizeBound) return;
        resizeBound = true;

        window.addEventListener("resize", () => {
            const root = document.querySelector(CART_ITEMS);
            if (root) syncLayoutMode(root);
        });
    }

    function startTest() {
        try {
            applyChanges();
            bindResize();
        } catch (error) {}
    }

    function mainJs() {
        waitForElem(`${CART_ITEMS} ${CART_ITEM}`, startTest, 1, false, WAIT_TIMEOUT, 25, markReady);
    }

    loadFont();
    waitForElem("body", mainJs);
})();
