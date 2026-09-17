(() => {
    const TEST_ID = "Test034";
    const VARIANT_ID = "V2";
    const BODY_CLASS = "ab--t034-v2";

    const LOCALE_PREFIX = "/de";
    const RECOMMENDATION_URL = `${LOCALE_PREFIX}/widgets/elio-data-discovery/cart-recommendations`;
    const ADD_TO_CART_URL = `${LOCALE_PREFIX}/checkout/line-item/add`;

    const WRAPPER_SELECTOR = ".checkout .elio-cart-recommendation-wrapper";

    const HEADLINE = "Weitere passende Produkte";
    const ADD_TO_CART_LABEL = "In den Warenkorb";

    const ADD_TO_CART_ICON = `
        <svg
            viewBox="0 0 24 24"
            width="80"
            height="80"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            focusable="false"
            style="color:#fff;"
        >
            <path d="
            M6.3 7.5
            H4.1
            C3.1 7.5 2.4 8.3 2.4 9.3
            L1.9 17.6
            C1.9 18.7 2.8 19.5 3.9 19.5
            H17.9
            C19 19.5 19.9 18.7 19.9 17.6
            L19.4 9.3
            C19.4 8.3 18.7 7.5 17.7 7.5
            H15.4
            " />

            <path d="
            M7.1 7.5
            V5.6
            C7.1 4.4 8 3.5 9.2 3.5
            H11.1
            C12.3 3.5 13.2 4.4 13.2 5.6
            V7.5
            " />

            <path d="M20.2 2.5V6.7" />
            <path d="M18.1 4.6H22.3" />
        </svg>`;

    function logInfo(message) {
        console.log(`%cAB%c${TEST_ID}-${VARIANT_ID}`, "color: white; background: rgb(0, 0, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", "margin-left: 8px; color: white; background: rgb(0, 57, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", message);
    }

    function waitForElem(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== "undefined") ? callback(elements) : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    function getCsrfToken() {
        try {
            const input = document.querySelector('input[name="_csrf_token"]');
            if (input && input.value) return input.value;

            const meta = document.querySelector('meta[name="csrf-token"]');
            if (meta && meta.content) return meta.content;
        } catch (error) {
            console.error(`${TEST_ID}-${VARIANT_ID} csrf lookup failed`, error);
        }

        return null;
    }

    function initShopwarePlugins() {
        try {
            if (window.PluginManager && typeof window.PluginManager.initializePlugins === "function") {
                window.PluginManager.initializePlugins();
            }
        } catch (error) {
            console.error(`${TEST_ID}-${VARIANT_ID} plugin initialisation failed`, error);
        }
    }

    let recommendationsPromise = null;

    function getRecommendationUrl() {
        try {
            const wrapper = document.querySelector(WRAPPER_SELECTOR);
            const url = wrapper && wrapper.getAttribute("data-elio-cart-recommendation-url");
            if (url) return url;
        } catch (error) {
            return;
        }

        return RECOMMENDATION_URL;
    }

    function parseRecommendations(html) {
        const products = [];

        try {
            const doc = new DOMParser().parseFromString(html, "text/html");

            doc.querySelectorAll(".product-slider-item .card.product-box").forEach((card) => {
                try {
                    const info = JSON.parse(card.getAttribute("data-product-information") || "{}");
                    const listingBox = card.querySelector("[data-elio-data-discovery-product-number]");
                    const link = card.querySelector(".product-name") || card.querySelector(".product-image-link");
                    const image = card.querySelector("img.product-image");
                    const price = card.querySelector(".product-price");
                    const rating = card.querySelector(".product-review-rating");

                    const imageWrapper = card.querySelector(".product-image-wrapper");

                    if (!info.id) return;

                    products.push({
                        id: info.id,
                        productNumber: listingBox ? listingBox.getAttribute("data-elio-data-discovery-product-number") : "",
                        name: info.name || (link ? link.textContent.trim() : ""),
                        url: link ? link.getAttribute("href") : "",
                        imageSrc: image ? image.getAttribute("src") : "",
                        imageSrcset: image ? image.getAttribute("srcset") : "",
                        priceText: price ? price.textContent.trim() : "",
                        ratingHtml: rating ? rating.outerHTML : "",
                        imageWrapperHtml: imageWrapper ? imageWrapper.outerHTML : "",
                    });
                } catch (error) {
                    console.error(`${TEST_ID}-${VARIANT_ID} could not parse a recommendation card`, error);
                }
            });
        } catch (error) {
            console.error(`${TEST_ID}-${VARIANT_ID} could not parse the recommendation response`, error);
        }

        return products;
    }

    function getRecommendations() {
        if (recommendationsPromise) return recommendationsPromise;

        recommendationsPromise = fetch(getRecommendationUrl(), {
            method: "GET",
            credentials: "same-origin",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                Accept: "text/html, */*",
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error(`Recommendation request failed with ${response.status}`);
                return response.text();
            })
            .then((html) => parseRecommendations(html))
            .catch((error) => {
                console.error(`${TEST_ID}-${VARIANT_ID} recommendation fetch failed`, error);
                recommendationsPromise = null;
                return [];
            });

        return recommendationsPromise;
    }

    function getCartKeys() {
        const keys = new Set();

        try {
            document.querySelectorAll(".line-item-remove-button[data-product-id]").forEach((node) => {
                keys.add(node.getAttribute("data-product-id"));
            });

            document.querySelectorAll(".hidden-line-item[data-id]").forEach((node) => {
                keys.add(node.getAttribute("data-id"));
            });

            document.querySelectorAll(".discoga4-checkout-hidden-line-item[data-sku]").forEach((node) => {
                keys.add(node.getAttribute("data-sku"));
            });

            document.querySelectorAll('form[action*="/checkout/line-item/"]').forEach((form) => {
                const action = form.getAttribute("action") || "";
                const match = action.match(/\/checkout\/line-item\/(?:delete|change-quantity)\/([^/?#]+)/);
                if (match) keys.add(match[1]);
            });
        } catch (error) {
            console.error(`${TEST_ID}-${VARIANT_ID} could not read the cart line items`, error);
        }

        return keys;
    }

    function buildCardHtml(product) {
        const url = product.url || "#";
        const srcset = product.imageSrcset ? ` srcset="${product.imageSrcset}" sizes="240px"` : "";

        const media =
            product.imageWrapperHtml ||
            `<div class="product-image-wrapper">
                <a class="product-image-link" href="${url}" title="${product.name}" tabindex="-1">
                    <img class="product-image" src="${product.imageSrc}"${srcset} alt="${product.name}" loading="lazy" />
                </a>
            </div>`;

        return `
            <div class="ab--cs-card" data-ab-product-id="${product.id}" data-ab-product-number="${product.productNumber || ""}">
                ${media}

                <a class="ab--cs-name" href="${url}" title="${product.name}">${product.name}</a>

                <div class="ab--cs-bottom">
                    <div class="ab--cs-meta">
                        <span class="ab--cs-price">${product.priceText}</span>
                        <div class="ab--cs-rating">${product.ratingHtml}</div>
                    </div>

                    <button type="button" class="ab--cs-atc" data-ab-add-to-cart="${product.id}" title="${ADD_TO_CART_LABEL}" aria-label="${ADD_TO_CART_LABEL}">
                        ${ADD_TO_CART_ICON}
                    </button>
                </div>
            </div>`;
    }

    function buildSection() {
        const section = document.createElement("div");
        section.className = "ab--cs-section";
        section.innerHTML = `
            <h3 class="ab--cs-headline">${HEADLINE}</h3>
            <div class="ab--cs-list"></div>`;

        return section;
    }

    function markWrapperReady() {
        const wrapper = document.querySelector(WRAPPER_SELECTOR);
        if (wrapper) wrapper.classList.add("ab--cs-ready");
    }

    function syncSectionWithCart() {
        try {
            const section = document.querySelector(".ab--cs-section");
            if (!section) return;

            const cartKeys = getCartKeys();
            let visibleCount = 0;

            section.querySelectorAll(".ab--cs-card").forEach((card) => {
                const id = card.getAttribute("data-ab-product-id");
                const productNumber = card.getAttribute("data-ab-product-number");
                const inCart = cartKeys.has(id) || (!!productNumber && cartKeys.has(productNumber));

                card.classList.toggle("ab--cs-card--hidden", inCart);
                if (!inCart) visibleCount += 1;
            });

            section.classList.toggle("ab--cs-section--empty", visibleCount === 0);

            window.__ab034v2 = {
                cartKeys: Array.from(cartKeys),
                visibleCount,
            };
        } catch (error) {
            console.error(`${TEST_ID}-${VARIANT_ID} cart sync failed`, error);
        }
    }

    function renderCards() {
        getRecommendations().then((products) => {
            try {
                const section = document.querySelector(".ab--cs-section");
                if (!section) return;

                const list = section.querySelector(".ab--cs-list");
                if (!list || list.children.length) return;

                list.innerHTML = products.map(buildCardHtml).join("");

                initShopwarePlugins();
                syncSectionWithCart();
            } catch (error) {
                console.error(`${TEST_ID}-${VARIANT_ID} card rendering failed`, error);
            } finally {
                markWrapperReady();
            }
        });
    }

    function applyLayout() {
        try {
            const wrapper = document.querySelector(WRAPPER_SELECTOR);
            if (!wrapper) return;

            wrapper.classList.add("ab--cs-wrapper");

            if (!wrapper.querySelector(".ab--cs-section")) {
                wrapper.appendChild(buildSection());
            }

            renderCards();
            syncSectionWithCart();
        } catch (error) {
            console.error(`${TEST_ID}-${VARIANT_ID} layout failed`, error);
        }
    }

    function addToCart(productId, button) {
        if (!productId) return;

        try {
            if (button) {
                button.classList.add("ab--cs-atc--loading");
                button.disabled = true;
            }

            const fields = {
                [`lineItems[${productId}][id]`]: productId,
                [`lineItems[${productId}][referencedId]`]: productId,
                [`lineItems[${productId}][quantity]`]: 1,
                [`lineItems[${productId}][type]`]: "product",
                [`lineItems[${productId}][stackable]`]: 1,
                [`lineItems[${productId}][removable]`]: 1,
                redirectTo: "frontend.checkout.cart.page",
            };

            const csrf = getCsrfToken();
            if (csrf) fields._csrf_token = csrf;

            const form = document.createElement("form");
            form.method = "post";
            form.action = ADD_TO_CART_URL;
            form.style.display = "none";

            Object.keys(fields).forEach((name) => {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = name;
                input.value = fields[name];
                form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();
        } catch (error) {
            console.error(`${TEST_ID}-${VARIANT_ID} add to cart failed`, error);

            if (button) {
                button.classList.remove("ab--cs-atc--loading");
                button.disabled = false;
            }
        }
    }

    function bindClicks() {
        document.body.addEventListener("click", (event) => {
            try {
                const addButton = event.target.closest("[data-ab-add-to-cart]");
                if (!addButton) return;

                event.preventDefault();
                addToCart(addButton.getAttribute("data-ab-add-to-cart"), addButton);
            } catch (error) {
                console.error(`${TEST_ID}-${VARIANT_ID} click handler failed`, error);
            }
        });
    }

    function observeWrapper() {
        let scheduled = false;

        const observer = new MutationObserver(() => {
            if (scheduled) return;

            scheduled = true;
            window.requestAnimationFrame(() => {
                scheduled = false;

                try {
                    const wrapper = document.querySelector(WRAPPER_SELECTOR);
                    if (!wrapper) return;

                    if (wrapper.querySelector(".ab--cs-section")) {
                        syncSectionWithCart();
                        return;
                    }

                    applyLayout();
                } catch (error) {
                    console.error(`${TEST_ID}-${VARIANT_ID} observer failed`, error);
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function mainJs([body]) {
        try {
            logInfo("fired");

            if (!body.classList.contains(BODY_CLASS)) body.classList.add(BODY_CLASS);

            bindClicks();
            observeWrapper();

            waitForElem(WRAPPER_SELECTOR, applyLayout);
        } catch (error) {
            console.error(`${TEST_ID}-${VARIANT_ID} init failed`, error);
        }
    }

    waitForElem("body", mainJs);
})();
