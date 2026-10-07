(() => {
    const CONFIG = {
        selectors: {
            buyBox: ".product-detail-buy-box",
            atcForm: "form.product-amount-input",
            row: ".product-detail-attribute-row",
            availableIcon: ".delivery-times .available-icon",
            deliveryTimes: ".delivery-times",
        },
        classes: {
            body: "ab-t007-v1",
            note: "ab-t007-delivery",
            row: "ab-t007-delivery-row",
        },
        delivery: {
            minDays: 2,
            maxDays: 4,
            timeZone: "Europe/Berlin",
        },
        weekdays: ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."],
        notAvailable: /nicht|not/i,
    };

    const TRUCK_ICON = `<svg class="${CONFIG.classes.note}__icon" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clip-path="url(#clip0_306_3)">
    <path d="M14.6665 2.75H0.916504V14.6667H14.6665V2.75Z" stroke="#1B509F" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14.6665 7.33325H18.3332L21.0832 10.0833V14.6666H14.6665V7.33325Z" stroke="#1B509F" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M5.04167 19.2501C6.30732 19.2501 7.33333 18.2241 7.33333 16.9584C7.33333 15.6928 6.30732 14.6667 5.04167 14.6667C3.77601 14.6667 2.75 15.6928 2.75 16.9584C2.75 18.2241 3.77601 19.2501 5.04167 19.2501Z" stroke="#1B509F" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16.9582 19.2501C18.2238 19.2501 19.2498 18.2241 19.2498 16.9584C19.2498 15.6928 18.2238 14.6667 16.9582 14.6667C15.6925 14.6667 14.6665 15.6928 14.6665 16.9584C14.6665 18.2241 15.6925 19.2501 16.9582 19.2501Z" stroke="#1B509F" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
    <clipPath id="clip0_306_3">
    <rect width="22" height="22" fill="white"/>
    </clipPath>
  </defs>
</svg>
  `;

    function waitForElem(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== "undefined") ? callback(elements) : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    function getToday() {
        try {
            return new Date(new Date().toLocaleString("en-US", {timeZone: CONFIG.delivery.timeZone}));
        } catch (e) {
            return new Date();
        }
    }

    function addBusinessDays(start, days) {
        const date = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        let added = 0;

        while (added < days) {
            date.setDate(date.getDate() + 1);
            const day = date.getDay();
            if (day !== 0 && day !== 6) added++;
        }

        return date;
    }

    function formatDate(date) {
        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        return `${CONFIG.weekdays[date.getDay()]}, ${dd}.${mm}.`;
    }

    function getDeliveryText() {
        const today = getToday();
        const from = addBusinessDays(today, CONFIG.delivery.minDays);
        const to = addBusinessDays(today, CONFIG.delivery.maxDays);
        return `${formatDate(from)} – ${formatDate(to)}`;
    }

    function isAvailableNow(buyBox) {
        const icon = buyBox.querySelector(CONFIG.selectors.availableIcon);
        if (!icon) return false;
        const label = buyBox.querySelector(CONFIG.selectors.deliveryTimes);
        return !CONFIG.notAvailable.test(label ? label.textContent : "");
    }

    function render() {
        const buyBox = document.querySelector(CONFIG.selectors.buyBox);
        const form = buyBox && buyBox.querySelector(CONFIG.selectors.atcForm);
        const anchor = form && (form.closest(CONFIG.selectors.row) || form);
        const existing = document.querySelector(`.${CONFIG.classes.row}`);

        if (!anchor || !isAvailableNow(buyBox)) {
            if (existing) existing.remove();
            return;
        }

        const text = `Lieferung: <strong>${getDeliveryText()}</strong>`;

        if (existing && existing.previousElementSibling === anchor) {
            const textEl = existing.querySelector(`.${CONFIG.classes.note}__text`);
            if (textEl && textEl.innerHTML !== text) textEl.innerHTML = text;
            return;
        }

        if (existing) existing.remove();
        anchor.insertAdjacentHTML("afterend", `<div class="product-detail-attribute-row ${CONFIG.classes.row}"><div class="${CONFIG.classes.note}">${TRUCK_ICON}<span class="${CONFIG.classes.note}__text">${text}</span></div></div>`);
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

    waitForElem(`${CONFIG.selectors.buyBox} ${CONFIG.selectors.atcForm}`, mainJs);
})();
