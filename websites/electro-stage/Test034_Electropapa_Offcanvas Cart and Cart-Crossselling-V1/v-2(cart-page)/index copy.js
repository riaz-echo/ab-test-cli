import testInfo from "./info.json" assert { type: "json" };

(() => {
    const TEST_ID = "Test034";
    const VARIANT_ID = "V2";
    const BODY_CLASS = "ab--t034-v2";

    /* ------------------------------------------------------------------ *
     * Config
     * ------------------------------------------------------------------ */
    const LOCALE_PREFIX = "/de"; // sales channel url prefix of this store
    const RECOMMENDATION_URL = `${LOCALE_PREFIX}/widgets/elio-data-discovery/cart-recommendations`;
    // No ?offcanvas=1 here: this posts as a real navigation, and that flag makes
    // the endpoint answer with the sidecart fragment instead of the cart page.
    const ADD_TO_CART_URL = `${LOCALE_PREFIX}/checkout/line-item/add`;

    // The shop's own cross-selling block on the cart page. Its slider is hidden
    // by CSS and our list is appended alongside it, inside the same wrapper.
    const WRAPPER_SELECTOR = ".checkout .elio-cart-recommendation-wrapper";

    const HEADLINE = "Weitere passende Produkte";
    const ADD_TO_CART_LABEL = "In den Warenkorb";

    const ADD_TO_CART_ICON = `
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <path d="M1.9 7.7h4.5V5.5h4.6v2.2h7v12.3h-16z"></path>
            <path d="M20.4 2.4v4.5"></path>
            <path d="M18.2 4.6h4.4"></path>
        </svg>`;

    /* ------------------------------------------------------------------ *
     * Utils
     * ------------------------------------------------------------------ */
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

    // Shopware's own way of initialising plugins on freshly inserted markup —
    // this is what wires up the wishlist buttons we carry over from the response.
    function initShopwarePlugins() {
        try {
            if (window.PluginManager && typeof window.PluginManager.initializePlugins === "function") {
                window.PluginManager.initializePlugins();
            }
        } catch (error) {
            console.error(`${TEST_ID}-${VARIANT_ID} plugin initialisation failed`, error);
        }
    }

    /* ------------------------------------------------------------------ *
     * Recommendation data
     * ------------------------------------------------------------------ */
    let recommendationsPromise = null;

    function getRecommendationUrl() {
        try {
            const wrapper = document.querySelector(WRAPPER_SELECTOR);
            const url = wrapper && wrapper.getAttribute("data-elio-cart-recommendation-url");
            if (url) return url;
        } catch (error) {
            /* fall through to the constructed url */
        }

        return RECOMMENDATION_URL;
    }

    // The widget answers with the stock product-box slider. We keep the pieces
    // the design needs and rebuild the card ourselves — the native "Details"
    // button goes, but unlike v-1 the wishlist button is carried over as-is.
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
                    const wishlist = card.querySelector(".product-wishlist");

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
                        wishlistHtml: wishlist ? wishlist.outerHTML : "",
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

    // Fetched once per page load and cached: the list is kept in sync with the
    // cart locally, so it never reshuffles under the user.
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
                recommendationsPromise = null; // allow a retry
                return [];
            });

        return recommendationsPromise;
    }

    /* ------------------------------------------------------------------ *
     * Cart state
     * ------------------------------------------------------------------ */
    // Both the product id and the product number are collected so a
    // recommendation matches no matter which one the cart markup exposes.
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

            // The line item id also sits in the remove / quantity form actions.
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

    /* ------------------------------------------------------------------ *
     * Rendering
     * ------------------------------------------------------------------ */
    function buildCardHtml(product) {
        const url = product.url || "#";
        const srcset = product.imageSrcset ? ` srcset="${product.imageSrcset}" sizes="240px"` : "";

        return `
            <div class="ab--cs-card" data-ab-product-id="${product.id}" data-ab-product-number="${product.productNumber || ""}">
                <div class="ab--cs-media">
                    <a class="ab--cs-image" href="${url}" title="${product.name}" tabindex="-1">
                        <img class="ab--cs-image-el" src="${product.imageSrc}"${srcset} alt="${product.name}" loading="lazy" />
                    </a>

                    ${product.wishlistHtml}
                </div>

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

    // Single source of truth: a recommendation is visible while its product is
    // not in the cart. Adding hides it, removing it from the cart brings it back.
    function syncSectionWithCart() {
        try {
            const section = document.querySelector(".ab--cs-section");
            if (!section) return;

            const cartKeys = getCartKeys();
            let visibleCount = 0;

            section.querySelectorAll(".ab--cs-card").forEach((card) => {
                const id = card.getAttribute("data-ab-product-id");
                const productNumber = card.getAttribute("data-ab-product-number");
                // The page is always freshly rendered by the time this runs, so
                // the cart markup alone decides — no optimistic state to hold.
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

                // Binds the wishlist buttons we carried over from the response.
                initShopwarePlugins();
                syncSectionWithCart();
            } catch (error) {
                console.error(`${TEST_ID}-${VARIANT_ID} card rendering failed`, error);
            }
        });
    }

    /* ------------------------------------------------------------------ *
     * Layout
     * ------------------------------------------------------------------ */
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

    /* ------------------------------------------------------------------ *
     * Add to cart
     * ------------------------------------------------------------------ *
     *
     * APPROACH: native form POST, which loads the whole cart page fresh.
     *
     * This is deliberately the crudest option, and it is isolated in the one
     * function below so it can be swapped without touching anything else.
     *
     * What was tried before, and why it is gone:
     *   1. fetch() the add, then location.reload(). The add went through, but
     *      the reloaded page did not reliably come back carrying the new line
     *      item, so the product only showed up later.
     *   2. The same, with a loading overlay on the cart table to cover the gap.
     *      That only hid the wait — the data underneath was still stale.
     *
     * Letting the browser post the form removes the race entirely: the server
     * handles the add and answers with the cart page that already contains the
     * product, in a single navigation. No second request, nothing to sync.
     *
     * To move to an in-page update later, replace this function alone — the
     * cross-sell list is driven by whatever the cart markup reports, so it
     * needs no changes of its own.
     */
    function addToCart(productId, button) {
        if (!productId) return;

        try {
            // Disabled purely so an impatient second click cannot post twice
            // while the navigation is starting.
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

    /* ------------------------------------------------------------------ *
     * Bindings
     * ------------------------------------------------------------------ */
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

    // The shop fills its recommendation wrapper asynchronously and may re-render
    // it, so the layout is re-applied whenever our section goes missing from it.
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

    /* ------------------------------------------------------------------ *
     * Main
     * ------------------------------------------------------------------ */
    function mainJs([body]) {
        try {
            console.table({ ID: testInfo.id, Variation: testInfo.name });
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
