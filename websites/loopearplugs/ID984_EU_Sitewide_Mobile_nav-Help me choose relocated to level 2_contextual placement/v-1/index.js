(() => {
    const AB = "AB-ID984";

    const HOST_DRAWERS = ["shop-by-product-drawer", "shop-by-need-drawer"];

    const HMC_DRAWER_ID = "link-group-drawer";
    const HMC_TRIGGER = `.links_submenu-trigger button[aria-controls="${HMC_DRAWER_ID}"]`;

    const BACK_BTN = ".navigation-header_back";
    const CLOSE_BTN = ".navigation-header_close";
    const LOGO = ".navigation-header .mobile_nav-logo";
    const HIDDEN = "set_hidden";

    let originDrawerId = "";
    let subDepth = 0;

    function resetOrigin() {
        originDrawerId = "";
        subDepth = 0;
    }

    var waitForElem = (waitFor, callback, minElements = 1, isVariable = false, timer = 30000, frequency = 100) => {
        const elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        const conditionMet = isVariable ? typeof window[waitFor] !== "undefined" : elements.length >= minElements;
        conditionMet ? callback(elements) : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    };

    function isVisible(element) {
        return !!element && element.offsetParent !== null;
    }

    function getOriginalHMCBtn() {
        return document.querySelector(HMC_TRIGGER);
    }

    function hideOriginalHMCBtn() {
        const row = getOriginalHMCBtn()?.closest(".menu-drawer_item");
        if (row) row.classList.add(`${AB}-original-hidden`);
    }

    function buildHMCbtn(drawerId) {
        const source = getOriginalHMCBtn()?.closest(".menu-drawer_item");
        if (!source) return null;

        const item = source.cloneNode(true);
        item.classList.remove(`${AB}-original-hidden`);
        item.classList.add(`${AB}-item`);
        item.removeAttribute("id");

        const button = item.querySelector("button");
        if (!button) return null;
        button.classList.add(`${AB}-trigger`);
        button.removeAttribute("aria-controls");
        button.removeAttribute("data-block-id");
        button.setAttribute("aria-expanded", "false");
        button.dataset.abOrigin = drawerId;

        const list = document.createElement("ul");
        list.className = `menu-drawer_list ${AB}-list shrink-0`;
        list.setAttribute("role", "list");
        list.appendChild(item);

        return list;
    }

    function addHelpMeChoose() {
        HOST_DRAWERS.forEach((drawerId) => {
            const drawer = document.getElementById(drawerId);
            if (!drawer) return;

            let list = drawer.querySelector(`:scope > .${AB}-list`);
            if (!list) {
                list = buildHMCbtn(drawerId);
                if (!list) return;
            }
            if (drawer.lastElementChild !== list) drawer.appendChild(list);
        });
    }

    function toggleLogo(hidden) {
        document.querySelectorAll(LOGO).forEach((logo) => logo.classList.toggle(HIDDEN, hidden));
    }

    function showDrawer(drawerId) {
        const drawer = document.getElementById(drawerId);
        if (!drawer) return;
        drawer.classList.remove(HIDDEN);
        drawer.style.display = "";
    }

    function hideDrawer(drawerId) {
        const drawer = document.getElementById(drawerId);
        if (!drawer) return;
        drawer.style.display = "none";
    }

    function returnToDrawer(drawerId) {
        toggleLogo(true);

        const trigger = document.querySelector(`[aria-controls="${drawerId}"]:not(.${AB}-trigger)`);
        if (trigger) {
            trigger.setAttribute("aria-expanded", "false");
            trigger.click();
        }

        hideDrawer(HMC_DRAWER_ID);
        showDrawer(drawerId);

        verifyDrawer(drawerId);
    }

    function verifyDrawer(drawerId, attempt = 0) {
        if (attempt >= 10) return toggleLogo(false);

        setTimeout(() => {
            if (isVisible(document.getElementById(drawerId))) return;
            toggleLogo(true);
            hideDrawer(HMC_DRAWER_ID);
            showDrawer(drawerId);
            verifyDrawer(drawerId, attempt + 1);
        }, 50);
    }

    function bindEvents() {
        document.addEventListener(
            "click",
            (e) => {
                const newTrigger = e.target.closest(`.${AB}-trigger`);
                if (newTrigger) {
                    e.preventDefault();
                    e.stopPropagation();
                    originDrawerId = newTrigger.dataset.abOrigin || "";
                    subDepth = 0;
                    getOriginalHMCBtn()?.click();
                    return;
                }

                if (e.target.closest(BACK_BTN)) {
                    if (subDepth > 0) {
                        subDepth--;
                        return;
                    }
                    if (!originDrawerId) return;

                    const origin = originDrawerId;
                    resetOrigin();
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    returnToDrawer(origin);
                    return;
                }

                if (e.target.closest(CLOSE_BTN)) resetOrigin();

                const deeperTrigger = e.target.closest(`.mobile-menu-drawer [aria-controls], #${HMC_DRAWER_ID} [aria-controls]`);
                if (originDrawerId && deeperTrigger && deeperTrigger.getAttribute("aria-controls") !== HMC_DRAWER_ID) subDepth++;

                if (e.target.closest(".menu-drawer_item, .navigation-header")) {
                    hideOriginalHMCBtn();
                    addHelpMeChoose();
                }
            },
            true
        );

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") resetOrigin();
        });
    }

    function markBody() {
        document.body?.classList.add(AB);
    }

    function mainJs() {
        markBody();
        hideOriginalHMCBtn();
        addHelpMeChoose();
        bindEvents();
        console.log("AB-ID984: mainJs");
    }

    function onReady(callback) {
        if (document.readyState === "complete") return callback();
        window.addEventListener("load", callback, {once: true});
    }

    onReady(() => {
        markBody();
        waitForElem(HMC_TRIGGER, mainJs);
    });
})();
