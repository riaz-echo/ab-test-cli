(() => {
    const TEST_ID = "Test034";
    const BODY_CLASS = "ab-test034";

    const LOCALE_PREFIX = "/de";
    const OFFCANVAS_RECOMMENDATION_URL = `${LOCALE_PREFIX}/widgets/elio-data-discovery/cart-recommendations?offcanvas=1`;
    const CART_PAGE_RECOMMENDATION_FALLBACK_URL = `${LOCALE_PREFIX}/widgets/elio-data-discovery/cart-recommendations`;
    const ADD_TO_CART_OFFCANVAS_URL = `${LOCALE_PREFIX}/checkout/line-item/add?offcanvas=1`;
    const ADD_TO_CART_PAGE_URL = `${LOCALE_PREFIX}/checkout/line-item/add`;

    const OFFCANVAS_SELECTOR = ".offcanvas.cart-offcanvas";
    const CART_PAGE_WRAPPER_SELECTOR = ".checkout .elio-cart-recommendation-wrapper";
    const MOBILE_QUERY = "(max-width: 767px)";

    const REFRESH_OFFCANVAS_AFTER_ADD = true;
    const CART_FORM_ACTION = /\/checkout\/(line-item|promotion)\//;

    const OFFCANVAS_HEADLINE = "Passendes Zubehör";
    const CART_PAGE_HEADLINE = "Weitere passende Produkte";
    const ADD_TO_CART_LABEL = "In den Warenkorb";

    const OFFCANVAS_ATC_ICON = `
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
        </svg>
    `;

    const CART_PAGE_ATC_ICON = `
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <path d="M1.9 7.7h4.5V5.5h4.6v2.2h7v12.3h-16z"></path>
            <path d="M20.4 2.4v4.5"></path>
            <path d="M18.2 4.6h4.4"></path>
        </svg>
    `;

    function logInfo(message) {
        console.log(
            `%cAB%c${TEST_ID}`,
            "color: white; background: rgb(0, 0, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;",
            "margin-left: 8px; color: white; background: rgb(0, 57, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;",
            message
        );
    }

    function waitForElem(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== "undefined")
            ? callback(elements)
            : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    function isMobile() {
        return window.matchMedia(MOBILE_QUERY).matches;
    }

    function initShopwarePlugins() {
        try {
            if (window.PluginManager && typeof window.PluginManager.initializePlugins === "function") {
                window.PluginManager.initializePlugins();
            }
        } catch (error) {
            console.error(`${TEST_ID} plugin initialisation failed`, error);
        }
    }

    function getCartKeys(container = document) {
        const keys = new Set();

        try {
            container.querySelectorAll(".hidden-line-item[data-id]").forEach((node) => {
                keys.add(node.getAttribute("data-id"));
            });

            container.querySelectorAll(".discoga4-checkout-hidden-line-item[data-sku]").forEach((node) => {
                keys.add(node.getAttribute("data-sku"));
            });

            container.querySelectorAll(".line-item-remove-button[data-product-id]").forEach((node) => {
                keys.add(node.getAttribute("data-product-id"));
            });

            container.querySelectorAll('form[action*="/checkout/line-item/"]').forEach((form) => {
                const action = form.getAttribute("action") || "";
                const match = action.match(/\/checkout\/line-item\/(?:delete|change-quantity)\/([^/?#]+)/);
                if (match) keys.add(match[1]);
            });
        } catch (error) {
            console.error(`${TEST_ID} could not read cart line items`, error);
        }

        return keys;
    }

    const recommendationsCache = new Map();

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
                    console.error(`${TEST_ID} could not parse a recommendation card`, error);
                }
            });
        } catch (error) {
            console.error(`${TEST_ID} could not parse recommendation response`, error);
        }

        return products;
    }

    function fetchRecommendations(url) {
        if (recommendationsCache.has(url)) {
            return recommendationsCache.get(url);
        }

        const promise = fetch(url, {
            method: "GET",
            credentials: "same-origin",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                Accept: "text/html, */*",
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error(`Recommendation request failed with ${response.status}`);
                logInfo(`Recommendation fetch succeeded for ${url}`);
                return response.text();
            })
            .then((html) => parseRecommendations(html))
            .catch((error) => {
                console.error(`${TEST_ID} recommendation fetch failed for ${url}`, error);
                recommendationsCache.delete(url);
                return [];
            });

        recommendationsCache.set(url, promise);
        return promise;
    }


    let panelGeneration = 0; 
    let renderingOwnPanel = false;
    let ownsPanel = false;
    const pendingAdds = new Map();

    function markPendingAdd(productId) {
        pendingAdds.set(productId, panelGeneration);
    }

    function resolvePendingAdd(productId, inCart) {
        if (inCart) {
            pendingAdds.delete(productId);
            return false;
        }

        if (!pendingAdds.has(productId)) return false;

        if (pendingAdds.get(productId) < panelGeneration) {
            pendingAdds.delete(productId);
            return false;
        }

        return true;
    }

    function buildOffcanvasCardHtml(product) {
        const url = product.url || "#";
        const srcset = product.imageSrcset ? ` srcset="${product.imageSrcset}" sizes="200px"` : "";

        return `
            <div class="ab--cs-card" data-ab-product-id="${product.id}" data-ab-product-number="${product.productNumber || ""}">
                <a class="ab--cs-image" href="${url}" title="${product.name}" tabindex="-1">
                    <img class="ab--cs-image-el" src="${product.imageSrc}"${srcset} alt="${product.name}" loading="lazy" />
                </a>

                <a class="ab--cs-name" href="${url}" title="${product.name}">${product.name}</a>

                <div class="ab--cs-bottom">
                    <div class="ab--cs-meta">
                        <span class="ab--cs-price">${product.priceText}</span>
                        <div class="ab--cs-rating">${product.ratingHtml}</div>
                    </div>

                    <button type="button" class="ab--cs-atc" data-ab-add-to-cart="${product.id}" title="${ADD_TO_CART_LABEL}" aria-label="${ADD_TO_CART_LABEL}">
                        ${OFFCANVAS_ATC_ICON}
                    </button>
                </div>
            </div>`;
    }

    function buildOffcanvasColumn() {
        const column = document.createElement("div");
        column.className = "ab--cs-column";
        column.innerHTML = `
            <h3 class="ab--cs-headline">${OFFCANVAS_HEADLINE}</h3>
            <div class="ab--cs-list"></div>`;

        return column;
    }

    function syncOffcanvasWithCart(offcanvas) {
        try {
            const column = offcanvas.querySelector(".ab--cs-column");
            if (!column) return;

            const cartKeys = getCartKeys(offcanvas);
            let visibleCount = 0;

            column.querySelectorAll(".ab--cs-card").forEach((card) => {
                const id = card.getAttribute("data-ab-product-id");
                const productNumber = card.getAttribute("data-ab-product-number");
                const inCart = cartKeys.has(id) || (!!productNumber && cartKeys.has(productNumber));

                const stillPending = resolvePendingAdd(id, inCart);
                const hidden = inCart || stillPending;

                card.classList.toggle("ab--cs-card--hidden", hidden);
                if (!hidden) visibleCount += 1;
            });

            column.classList.toggle("ab--cs-column--empty", visibleCount === 0);

            window.__ab034 = window.__ab034 || {};
            window.__ab034.sidecart = {
                cartKeys: Array.from(cartKeys),
                pendingAdds: Array.from(pendingAdds.keys()),
                panelGeneration,
                ownsPanel,
                visibleCount,
            };
        } catch (error) {
            console.error(`${TEST_ID} sidecart sync failed`, error);
        }
    }

    function renderOffcanvasCards(offcanvas) {
        fetchRecommendations(OFFCANVAS_RECOMMENDATION_URL).then((products) => {
            try {
                const column = offcanvas.querySelector(".ab--cs-column");
                if (!column) return;

                const list = column.querySelector(".ab--cs-list");
                if (!list || list.children.length) return;

                list.innerHTML = products.map(buildOffcanvasCardHtml).join("");
                syncOffcanvasWithCart(offcanvas);
            } catch (error) {
                console.error(`${TEST_ID} sidecart card rendering failed`, error);
            }
        });
    }

    function placeOffcanvasColumn(offcanvas, column) {
        try {
            const body = offcanvas.querySelector(".offcanvas-body");
            const cartColumn = offcanvas.querySelector(".ab--cart-column");
            const mobile = isMobile();

            offcanvas.classList.toggle("ab--offcanvas--mobile", mobile);
            offcanvas.classList.toggle("ab--offcanvas--desktop", !mobile);

            if (mobile) {
                if (!body) return;

                const footer = body.querySelector(".offcanvas-cart-footer");
                if (footer) {
                    if (column.nextElementSibling !== footer) footer.parentNode.insertBefore(column, footer);
                } else if (column.parentNode !== body) {
                    body.appendChild(column);
                }

                return;
            }

            if (cartColumn && column.nextElementSibling !== cartColumn) {
                offcanvas.insertBefore(column, cartColumn);
            }
        } catch (error) {
            console.error(`${TEST_ID} sidecart column placement failed`, error);
        }
    }

    function applyOffcanvasLayout() {
        try {
            const offcanvas = document.querySelector(OFFCANVAS_SELECTOR);
            if (!offcanvas) return;

            const header = offcanvas.querySelector(".offcanvas-header");
            const body = offcanvas.querySelector(".offcanvas-body");
            if (!body) return;

            if (body.querySelector(".header-main, .nav-main, .footer-main, header.header, footer.footer")) {
                logInfo("sidecart returned holding a full page, skipping layout");
                return;
            }

            offcanvas.classList.add("ab--offcanvas");

            let cartColumn = offcanvas.querySelector(".ab--cart-column");
            if (!cartColumn) {
                panelGeneration += 1;
                ownsPanel = renderingOwnPanel;

                cartColumn = document.createElement("div");
                cartColumn.className = "ab--cart-column";
                body.parentNode.insertBefore(cartColumn, header || body);
                if (header) cartColumn.appendChild(header);
                cartColumn.appendChild(body);
            }

            let column = offcanvas.querySelector(".ab--cs-column");
            if (!column) {
                column = buildOffcanvasColumn();
                offcanvas.insertBefore(column, cartColumn);
            }

            placeOffcanvasColumn(offcanvas, column);
            renderOffcanvasCards(offcanvas);
            syncOffcanvasWithCart(offcanvas);
        } catch (error) {
            console.error(`${TEST_ID} sidecart layout failed`, error);
        }
    }

    function findPluginInstances(pluginName, elementSelector) {
        const found = [];

        try {
            const manager = window.PluginManager;
            if (!manager) return found;

            if (typeof manager.getPluginInstances === "function") {
                const instances = manager.getPluginInstances(pluginName);

                if (instances && typeof instances.forEach === "function") {
                    instances.forEach((instance) => {
                        if (instance && typeof instance === "object") found.push(instance);
                    });
                }
            }

            if (!found.length && elementSelector && typeof manager.getPluginInstanceFromElement === "function") {
                document.querySelectorAll(elementSelector).forEach((element) => {
                    const instance = manager.getPluginInstanceFromElement(element, pluginName);
                    if (instance) found.push(instance);
                });
            }
        } catch (error) {
            console.error(`${TEST_ID} could not read "${pluginName}" plugin`, error);
        }

        return found;
    }

    function refreshCartWidget() {
        try {
            const widgets = findPluginInstances("CartWidget", ".header-cart, [data-cart-widget]");

            if (widgets.length) {
                widgets.forEach((widget) => {
                    if (typeof widget.fetch === "function") widget.fetch();
                });

                return;
            }

            if (document.$emitter && typeof document.$emitter.publish === "function") {
                document.$emitter.publish("Cart/onLineItemAdded");
            }
        } catch (error) {
            console.error(`${TEST_ID} cart widget refresh failed`, error);
        }
    }

    function getOffcanvasCartUrl() {
        try {
            const routed = window.router && window.router["frontend.cart.offcanvas"];
            if (routed) return routed;
        } catch (error) { }

        return `${LOCALE_PREFIX}/checkout/offcanvas`;
    }

    function renderOffcanvasCart(html) {
        try {
            const offcanvas = document.querySelector(OFFCANVAS_SELECTOR);
            if (!offcanvas || !html) return false;

            const doc = new DOMParser().parseFromString(html, "text/html");
            const incoming = doc.querySelector(".offcanvas");
            const body = doc.querySelector(".offcanvas-body");

            if (!incoming && !body) {
                logInfo("offcanvas response was not a cart panel, keeping current");
                return false;
            }

            renderingOwnPanel = true;
            offcanvas.innerHTML = incoming ? incoming.innerHTML : html;

            initShopwarePlugins();
            applyOffcanvasLayout();
            renderingOwnPanel = false;

            return true;
        } catch (error) {
            renderingOwnPanel = false;
            console.error(`${TEST_ID} offcanvas render failed`, error);
            return false;
        }
    }

    function refreshOffcanvasCart() {
        return fetch(getOffcanvasCartUrl(), {
            method: "GET",
            credentials: "same-origin",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                Accept: "text/html, */*",
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error(`Offcanvas cart request failed with ${response.status}`);
                return response.text();
            })
            .then((html) => renderOffcanvasCart(html))
            .catch((error) => {
                console.error(`${TEST_ID} offcanvas refresh failed`, error);
                return false;
            });
    }

    function submitCartForm(form) {
        const action = form.getAttribute("action");
        if (!action) return;

        fetch(action, {
            method: "POST",
            body: new FormData(form),
            credentials: "include",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                Accept: "text/html, */*",
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error(`Cart form request failed with ${response.status}`);
                return refreshOffcanvasCart();
            })
            .then(() => refreshCartWidget())
            .catch((error) => {
                console.error(`${TEST_ID} cart form submit failed`, error);
            });
    }

    function bindCartForms() {
        document.addEventListener(
            "submit",
            (event) => {
                try {
                    if (!ownsPanel) return;

                    const form = event.target;
                    if (!form || form.tagName !== "FORM" || !form.closest(OFFCANVAS_SELECTOR)) return;
                    if (!CART_FORM_ACTION.test(form.getAttribute("action") || "")) return;

                    event.preventDefault();
                    event.stopPropagation();

                    submitCartForm(form);
                } catch (error) {
                    console.error(`${TEST_ID} cart form handler failed`, error);
                }
            },
            true
        );
    }

    function observeBreakpoint() {
        try {
            const query = window.matchMedia(MOBILE_QUERY);
            const handler = () => {
                const offcanvas = document.querySelector(OFFCANVAS_SELECTOR);
                const column = offcanvas && offcanvas.querySelector(".ab--cs-column");
                if (offcanvas && column) placeOffcanvasColumn(offcanvas, column);
            };

            if (typeof query.addEventListener === "function") {
                query.addEventListener("change", handler);
            } else if (typeof query.addListener === "function") {
                query.addListener(handler);
            }
        } catch (error) {
            console.error(`${TEST_ID} breakpoint listener failed`, error);
        }
    }

    function getCartPageRecommendationUrl() {
        try {
            const wrapper = document.querySelector(CART_PAGE_WRAPPER_SELECTOR);
            const url = wrapper && wrapper.getAttribute("data-elio-cart-recommendation-url");
            if (url) return url;
        } catch (error) {
            return CART_PAGE_RECOMMENDATION_FALLBACK_URL;
        }

        return CART_PAGE_RECOMMENDATION_FALLBACK_URL;
    }

    function buildCartPageCardHtml(product) {
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
                        ${CART_PAGE_ATC_ICON}
                    </button>
                </div>
            </div>`;
    }

    function buildCartPageSection() {
        const section = document.createElement("div");
        section.className = "ab--cs-section";
        section.innerHTML = `
            <h3 class="ab--cs-headline">${CART_PAGE_HEADLINE}</h3>
            <div class="ab--cs-slider-container">
                <button type="button" class="ab--cs-arrow ab--cs-arrow--prev" aria-label="Vorherige" title="Vorherige" disabled>
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
                <div class="ab--cs-list"></div>
                <button type="button" class="ab--cs-arrow ab--cs-arrow--next" aria-label="Nächste" title="Nächste">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </div>`;

        return section;
    }

    function updateCartPageArrows(section) {
        if (!section) return;
        const list = section.querySelector(".ab--cs-list");
        const prevBtn = section.querySelector(".ab--cs-arrow--prev");
        const nextBtn = section.querySelector(".ab--cs-arrow--next");
        if (!list || !prevBtn || !nextBtn) return;

        const maxScroll = list.scrollWidth - list.clientWidth;
        if (maxScroll <= 5) {
            prevBtn.disabled = true;
            nextBtn.disabled = true;
            prevBtn.classList.add("ab--cs-arrow--disabled");
            nextBtn.classList.add("ab--cs-arrow--disabled");
            return;
        }

        const scrollLeft = list.scrollLeft;
        const isAtStart = scrollLeft <= 5;
        const isAtEnd = scrollLeft >= maxScroll - 5;

        prevBtn.disabled = isAtStart;
        nextBtn.disabled = isAtEnd;
        prevBtn.classList.toggle("ab--cs-arrow--disabled", isAtStart);
        nextBtn.classList.toggle("ab--cs-arrow--disabled", isAtEnd);
    }

    function setupCartPageSlider(section) {
        if (!section) return;
        const list = section.querySelector(".ab--cs-list");
        if (!list || list._abSliderInit) return;
        list._abSliderInit = true;

        const onScroll = () => updateCartPageArrows(section);
        list.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        setTimeout(onScroll, 100);
        setTimeout(onScroll, 500);
    }

    function deduplicateCartPageWrappers() {
        const wrappers = document.querySelectorAll(".checkout .elio-cart-recommendation-wrapper");
        if (wrappers.length <= 1) return;

        let activeWrapper = Array.from(wrappers).find((w) => w.querySelector(".ab--cs-section"));
        if (!activeWrapper) {
            activeWrapper = Array.from(wrappers).find((w) => w.hasAttribute("data-elio-cart-recommendation")) || wrappers[0];
        }

        wrappers.forEach((w) => {
            if (w !== activeWrapper) {
                w.remove();
            }
        });
    }

    function getOrCreateCartPageWrapper(allowCreation = false) {
        deduplicateCartPageWrappers();

        let wrapper = document.querySelector(CART_PAGE_WRAPPER_SELECTOR);
        if (wrapper) return wrapper;

        wrapper = document.querySelector(".checkout .elio-cart-recommendation-wrapper");
        if (wrapper) return wrapper;

        if (allowCreation) {
            const checkoutContainer = document.querySelector(".checkout .checkout-container");
            if (checkoutContainer) {
                wrapper = document.createElement("div");
                wrapper.className = "elio-cart-recommendation-wrapper ab--fallback-wrapper";
                checkoutContainer.insertAdjacentElement("afterend", wrapper);
                return wrapper;
            }

            const checkout = document.querySelector(".checkout");
            if (checkout) {
                wrapper = document.createElement("div");
                wrapper.className = "elio-cart-recommendation-wrapper ab--fallback-wrapper";
                checkout.appendChild(wrapper);
                return wrapper;
            }
        }

        return null;
    }

    function markWrapperReady() {
        deduplicateCartPageWrappers();
        document.querySelectorAll(".checkout .elio-cart-recommendation-wrapper").forEach((wrapper) => {
            wrapper.classList.add("ab--cs-ready");
            wrapper.classList.remove("ab--cs-loading");
        });
    }

    function syncCartPageWithCart() {
        try {
            const section = document.querySelector(".ab--cs-section");
            if (!section) return;

            const cartKeys = getCartKeys(document);
            let visibleCount = 0;

            section.querySelectorAll(".ab--cs-card").forEach((card) => {
                const id = card.getAttribute("data-ab-product-id");
                const productNumber = card.getAttribute("data-ab-product-number");
                const inCart = cartKeys.has(id) || (!!productNumber && cartKeys.has(productNumber));

                card.classList.toggle("ab--cs-card--hidden", inCart);
                if (!inCart) visibleCount += 1;
            });

            section.classList.toggle("ab--cs-section--empty", visibleCount === 0);
            updateCartPageArrows(section);

            window.__ab034 = window.__ab034 || {};
            window.__ab034.cartPage = {
                cartKeys: Array.from(cartKeys),
                visibleCount,
            };
        } catch (error) {
            console.error(`${TEST_ID} cart page sync failed`, error);
        }
    }

    function renderCartPageCards() {
        const url = getCartPageRecommendationUrl();
        fetchRecommendations(url).then((products) => {
            try {
                const section = document.querySelector(".ab--cs-section");
                if (!section) return;

                const list = section.querySelector(".ab--cs-list");
                if (!list || list.children.length) return;

                list.innerHTML = products.map(buildCartPageCardHtml).join("");

                initShopwarePlugins();
                syncCartPageWithCart();
                setupCartPageSlider(section);
            } catch (error) {
                console.error(`${TEST_ID} cart page card rendering failed`, error);
            } finally {
                markWrapperReady();
            }
        });
    }

    function applyCartPageLayout(allowCreation = false) {
        try {
            deduplicateCartPageWrappers();

            const wrapper = getOrCreateCartPageWrapper(allowCreation);
            if (!wrapper) return;

            wrapper.classList.add("ab--cs-wrapper");
            if (!wrapper.classList.contains("ab--cs-ready")) {
                wrapper.classList.add("ab--cs-loading");
            }

            if (!wrapper.querySelector(".ab--cs-section")) {
                wrapper.appendChild(buildCartPageSection());
            }

            renderCartPageCards();
            syncCartPageWithCart();
        } catch (error) {
            console.error(`${TEST_ID} cart page layout failed`, error);
        }
    }


    function addToCart(productId, button) {
        if (!productId || (button && button.classList.contains("ab--cs-atc--loading"))) return;

        const isOffcanvas = button && !!button.closest(OFFCANVAS_SELECTOR);

        if (button) {
            button.classList.add("ab--cs-atc--loading");
            button.disabled = true;
        }

        if (isOffcanvas) {
            const card = button.closest(".ab--cs-card");

            const formData = new FormData();
            formData.append(`lineItems[${productId}][id]`, productId);
            formData.append(`lineItems[${productId}][referencedId]`, productId);
            formData.append(`lineItems[${productId}][quantity]`, 1);
            formData.append(`lineItems[${productId}][type]`, "product");
            formData.append(`lineItems[${productId}][stackable]`, 1);
            formData.append(`lineItems[${productId}][removable]`, 1);
            formData.append("redirectTo", "frontend.cart.offcanvas");

            fetch(ADD_TO_CART_OFFCANVAS_URL, {
                method: "POST",
                body: formData,
                credentials: "include",
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    Accept: "text/html, application/json",
                },
            })
                .then((response) => {
                    if (!response.ok) throw new Error(`Add to cart failed with ${response.status}`);
                    return response.text();
                })
                .then(() => {
                    markPendingAdd(productId);
                    if (card) card.classList.add("ab--cs-card--hidden");

                    if (REFRESH_OFFCANVAS_AFTER_ADD) refreshOffcanvasCart();

                    refreshCartWidget();
                    applyOffcanvasLayout();
                })
                .catch((error) => {
                    pendingAdds.delete(productId);
                    console.error(`${TEST_ID} add to cart failed`, error);
                })
                .finally(() => {
                    if (button) {
                        button.classList.remove("ab--cs-atc--loading");
                        button.disabled = false;
                    }
                });
        } else {
            try {
                const fields = {
                    [`lineItems[${productId}][id]`]: productId,
                    [`lineItems[${productId}][referencedId]`]: productId,
                    [`lineItems[${productId}][quantity]`]: 1,
                    [`lineItems[${productId}][type]`]: "product",
                    [`lineItems[${productId}][stackable]`]: 1,
                    [`lineItems[${productId}][removable]`]: 1,
                    redirectTo: "frontend.checkout.cart.page",
                };

                const form = document.createElement("form");
                form.method = "post";
                form.action = ADD_TO_CART_PAGE_URL;
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
                console.error(`${TEST_ID} cart page add to cart failed`, error);

                if (button) {
                    button.classList.remove("ab--cs-atc--loading");
                    button.disabled = false;
                }
            }
        }
    }

    function bindClicks() {
        document.body.addEventListener("click", (event) => {
            try {
                const prevArrow = event.target.closest(".ab--cs-arrow--prev");
                if (prevArrow) {
                    event.preventDefault();
                    const section = prevArrow.closest(".ab--cs-section");
                    const list = section && section.querySelector(".ab--cs-list");
                    if (list) {
                        const scrollAmount = Math.max(230, Math.floor(list.clientWidth * 0.75));
                        list.scrollBy({ left: -scrollAmount, behavior: "smooth" });
                    }
                    return;
                }

                const nextArrow = event.target.closest(".ab--cs-arrow--next");
                if (nextArrow) {
                    event.preventDefault();
                    const section = nextArrow.closest(".ab--cs-section");
                    const list = section && section.querySelector(".ab--cs-list");
                    if (list) {
                        const scrollAmount = Math.max(230, Math.floor(list.clientWidth * 0.75));
                        list.scrollBy({ left: scrollAmount, behavior: "smooth" });
                    }
                    return;
                }

                const addButton = event.target.closest("[data-ab-add-to-cart]");
                if (!addButton) return;

                event.preventDefault();
                addToCart(addButton.getAttribute("data-ab-add-to-cart"), addButton);
            } catch (error) {
                console.error(`${TEST_ID} click handler failed`, error);
            }
        });
    }

    function observeMutations() {
        let scheduled = false;

        const observer = new MutationObserver(() => {
            if (scheduled) return;

            scheduled = true;
            window.requestAnimationFrame(() => {
                scheduled = false;

                try {
                    const offcanvas = document.querySelector(OFFCANVAS_SELECTOR);
                    if (offcanvas) {
                        if (offcanvas.querySelector(".ab--cs-column") && offcanvas.querySelector(".ab--cart-column")) {
                            syncOffcanvasWithCart(offcanvas);
                        } else {
                            applyOffcanvasLayout();
                        }
                    }

                    deduplicateCartPageWrappers();
                    const cartWrapper = document.querySelector(CART_PAGE_WRAPPER_SELECTOR) || document.querySelector(".checkout .elio-cart-recommendation-wrapper");
                    if (cartWrapper) {
                        const existingSection = cartWrapper.querySelector(".ab--cs-section");
                        if (existingSection) {
                            syncCartPageWithCart();
                        } else {
                            applyCartPageLayout(false);
                        }
                    }
                } catch (error) {
                    console.error(`${TEST_ID} observer failed`, error);
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function mainJs([body]) {
        try {
            logInfo("fired");

            if (!body.classList.contains(BODY_CLASS)) {
                body.classList.add(BODY_CLASS);
            }

            bindClicks();
            bindCartForms();
            observeBreakpoint();
            observeMutations();

            applyOffcanvasLayout();

            if (document.querySelector(CART_PAGE_WRAPPER_SELECTOR)) {
                applyCartPageLayout(false);
            } else {
                waitForElem(CART_PAGE_WRAPPER_SELECTOR, () => applyCartPageLayout(false), 1, false, 3000);
                setTimeout(() => {
                    if (!document.querySelector(".ab--cs-section") && document.querySelector(".checkout")) {
                        applyCartPageLayout(true);
                    }
                }, 3100);
            }
        } catch (error) {
            console.error(`${TEST_ID} init failed`, error);
        }
    }

    waitForElem("body", mainJs);
})();
