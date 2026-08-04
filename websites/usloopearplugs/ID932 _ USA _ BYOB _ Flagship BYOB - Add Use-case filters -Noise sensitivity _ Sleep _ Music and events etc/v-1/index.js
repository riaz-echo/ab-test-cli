(() => {
    const AB = "AB-ID932";
    const ICON_BASE = "https://us.loopearplugs.com/cdn/shop/files/";

    const SWITCH = ["switch", "switch-2-tomorrowland", "mclaren"];
    const EXPERIENCE_PARTNERSHIPS = ["experience-2-tomorrowland", "coachella"];
    const LINK = ["link", "loop-link-coachella", "link-tomorrowland"];

    const useCaseObj = {
        "Noise sensitivity": {
            icon: `${ICON_BASE}Icon_grid_24x24_4.svg?crop=center&height=24&v=1728570292&width=24`,
            items: ["engage", "engage-plus", ...SWITCH, ...LINK],
        },
        Sleep: {
            icon: `${ICON_BASE}Icon_grid_24x24_eb11e522-168c-4bd8-8b4c-276d915a84d9.svg?crop=center&height=24&v=1727878225&width=24`,
            items: ["dream"],
        },
        "Music & events": {
            icon: `${ICON_BASE}Icon_grid_24x24_5.svg?crop=center&height=24&v=1728570476&width=24`,
            items: ["experience", "experience-plus", ...SWITCH, ...EXPERIENCE_PARTNERSHIPS, ...LINK],
        },
        Focus: {
            icon: `${ICON_BASE}Icon_grid_24x24_3.svg?crop=center&height=24&v=1728570237&width=24`,
            items: ["quiet", ...SWITCH, ...LINK],
        },
        "Social gatherings": {
            icon: `${ICON_BASE}Icon_grid_24x24_2.svg?crop=center&height=24&v=1728570076&width=24`,
            items: ["engage", "engage-plus", ...SWITCH, ...LINK],
        },
        Parenting: {
            icon: `${ICON_BASE}Icon_grid_24x24_67d0bf7c-e043-44aa-a3ca-a83c63d297eb.svg?crop=center&height=24&v=1728569976&width=24`,
            items: ["engage", "engage-plus", ...SWITCH, ...LINK],
        },
        Travel: {
            icon: `${ICON_BASE}Icon_grid_24x24_1.svg?crop=center&height=24&v=1728570028&width=24`,
            items: ["quiet", ...SWITCH, ...LINK],
        },
        "Playtime & schooltime": {
            icon: `${ICON_BASE}Icon_grid_24x24_6.svg?crop=center&height=24&v=1728635882&width=24`,
            items: ["engage-kids", ...LINK],
        },
        Motorcycling: {
            icon: `${ICON_BASE}Icons_18ef2b84-6629-466b-9253-df5b02c6f1ac.svg?crop=center&height=24&v=1728569816&width=24`,
            items: ["experience", "experience-plus", ...SWITCH, ...EXPERIENCE_PARTNERSHIPS, ...LINK],
        },
    };

    let activeUseCase = "";

    function waitForElem(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== "undefined") ? callback(elements) : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    function tagProducts() {
        document.querySelectorAll(".byob .byob-product-card").forEach((card) => {
            if (card.dataset.abHandle) return;
            const href = card.querySelector("a[href*='/products/']")?.getAttribute("href") || "";
            const handle = href.split("/products/")[1]?.split(/[?#]/)[0];
            if (!handle) return;
            card.dataset.abHandle = handle;
            card.classList.add(`${AB}-card`);
        });
    }

    function applyFilter() {
        const items = useCaseObj[activeUseCase]?.items;

        document.querySelectorAll(`.byob .${AB}-card`).forEach((card) => {
            const index = items ? items.indexOf(card.dataset.abHandle) : -1;
            const visible = !items || index !== -1;
            card.classList.toggle(`${AB}-card--hidden`, !visible);
            card.style.order = items && visible ? index : "";
        });

        document.querySelectorAll(".byob .byob-products__collection").forEach((collection) => {
            const hasVisible = collection.querySelector(`.${AB}-card:not(.${AB}-card--hidden)`);
            collection.classList.toggle(`${AB}-collection--hidden`, !hasVisible);
        });
    }

    function selectChip(useCase) {
        activeUseCase = activeUseCase === useCase ? "" : useCase;

        document.querySelectorAll(`.${AB}-chip`).forEach((chip) => {
            const isActive = chip.dataset.abUsecase === activeUseCase;
            chip.setAttribute("aria-checked", isActive);
            chip.setAttribute("tabindex", isActive ? "0" : "-1");
        });

        applyFilter();
    }

    function buildChips() {
        if (document.querySelector(`.${AB}-filters`)) return;

        const chips = Object.entries(useCaseObj)
            .map(
                ([useCase, {icon}], index) => `
        <button type="button" class="${AB}-chip" role="radio" aria-checked="false" tabindex="${index === 0 ? 0 : -1}" data-ab-usecase="${useCase}">
          <img class="${AB}-chip__icon" src="${icon}" alt="" width="24" height="24" loading="lazy" />
          <span>${useCase}</span>
        </button>`
            )
            .join("");

        const wrapper = document.createElement("div");
        wrapper.className = `${AB}-filters`;
        wrapper.setAttribute("role", "radiogroup");
        wrapper.setAttribute("aria-label", "Filter by Use case");
        wrapper.innerHTML = chips;

        const section = document.createElement("div");
        section.className = `${AB}-section`;
        section.appendChild(wrapper);

        document.querySelector(".byob .byob-products").insertAdjacentElement("afterbegin", section);

        wrapper.addEventListener("click", (e) => {
            const chip = e.target.closest(`.${AB}-chip`);
            if (chip) selectChip(chip.dataset.abUsecase);
        });
    }

    function ensureChips() {
        const host = document.querySelector(".byob .byob-products");
        if (!host) return;

        const section = document.querySelector(`.${AB}-section`);
        if (!section) {
            buildChips();
            return;
        }
        if (host.firstElementChild !== section) {
            host.insertAdjacentElement("afterbegin", section);
        }
    }

    function observeProducts() {
        const observer = new MutationObserver(() => {
            markBody();
            tagProducts();
            ensureChips();
            applyFilter();
        });
        observer.observe(document.querySelector(".byob .byob-products"), {childList: true, subtree: true});
    }

    function markBody() {
        document.body?.classList.add(AB);
    }

    function mainJs() {
        console.log(`Fired: ${AB}`);

        markBody();
        tagProducts();
        buildChips();
        observeProducts();
    }

    function onReady(callback) {
        if (document.readyState === "complete") return callback();
        window.addEventListener("load", callback, {once: true});
    }

    onReady(() => {
        markBody();
        waitForElem(".byob .byob-products", mainJs);
    });
})();
