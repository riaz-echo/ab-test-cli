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
    const CART_PAGE_PATH = /\/checkout\/cart(?:[/?#]|$)/;
    const MOBILE_QUERY = "(max-width: 767px)";

    const CART_FORM_ACTION = /\/checkout\/(line-item|promotion)\//;

    const OFFCANVAS_HEADLINE = "Passendes Zubehör";
    const CART_PAGE_HEADLINE = "Weitere passende Produkte";
    const CART_PAGE_HEADLINE_MOBILE = "Darf es noch passendes Zubehör sein?";
    const ADD_TO_CART_LABEL = "In den Warenkorb";
    const ADD_TO_CART_UNAVAILABLE_LABEL = "Derzeit nicht verfügbar";

    const ADD_TO_CART_ICON = `
        <span class="ab--cs-atc-icon-wrap">
            <span class="icon icon-bag" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                    <path d="M5.892 3c.5523 0 1 .4477 1 1s-.4477 1-1 1H3.7895a1 1 0 0 0-.9986.9475l-.7895 15c-.029.5515.3946 1.0221.9987 1.0525h17.8102c.5523 0 1-.4477.9986-1.0525l-.7895-15A1 1 0 0 0 20.0208 5H17.892c-.5523 0-1-.4477-1-1s.4477-1 1-1h2.1288c1.5956 0 2.912 1.249 2.9959 2.8423l.7894 15c.0035.0788.0035.0788.0042.1577 0 1.6569-1.3432 3-3 3H3c-.079-.0007-.079-.0007-.1577-.0041-1.6546-.0871-2.9253-1.499-2.8382-3.1536l.7895-15C.8775 4.249 2.1939 3 3.7895 3H5.892zm4 2c0 .5523-.4477 1-1 1s-1-.4477-1-1V3c0-1.6569 1.3432-3 3-3h2c1.6569 0 3 1.3431 3 3v2c0 .5523-.4477 1-1 1s-1-.4477-1-1V3c0-.5523-.4477-1-1-1h-2c-.5523 0-1 .4477-1 1v2z" fill="currentColor" fill-rule="evenodd" />
                </svg>
            </span>
            <span class="ab--cs-atc-plus" aria-hidden="true">+</span>
        </span>
    `;

    function logInfo(message) {
        console.log(`%cAB%c${TEST_ID}`, "color: white; background: rgb(0, 0, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", "margin-left: 8px; color: white; background: rgb(0, 57, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", message);
    }

    function waitForElem(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== "undefined") ? callback(elements) : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    function isMobile() {
        return window.matchMedia(MOBILE_QUERY).matches;
    }

    function isCartPage() {
        return CART_PAGE_PATH.test(window.location.pathname);
    }

    function initShopwarePlugins() {
        try {
            if (window.PluginManager && typeof window.PluginManager.initializePlugins === "function") {
                window.PluginManager.initializePlugins();
            } else {
                console.warn(`[AB${TEST_ID}] window.PluginManager.initializePlugins not available - native Shopware controls will not rebind`, window.PluginManager);
            }
        } catch (error) {
            console.error(`[AB${TEST_ID}] initShopwarePlugins failed`, error);
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
        } catch (error) {}

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
                    const availableSoon = !!card.querySelector(".badge-available-soon, .badge-sold-out");

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
                        availableSoon,
                    });
                } catch (error) {}
            });
        } catch (error) {}

        return products;
    }

    function fetchRecommendations(url) {
        if (recommendationsCache.has(url)) {
            return recommendationsCache.get(url);
        }

        const promise = fetch(url, {
            method: "GET",
            credentials: "same-origin",
            cache: "no-store",
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
            .then((products) => {
                if (!products.length) recommendationsCache.delete(url);
                return products;
            })
            .catch((error) => {
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
        const atcLabel = product.availableSoon ? ADD_TO_CART_UNAVAILABLE_LABEL : ADD_TO_CART_LABEL;
        const atcDisabled = product.availableSoon ? " disabled" : "";
        const atcClass = product.availableSoon ? "ab--cs-atc ab--cs-atc--unavailable" : "ab--cs-atc";

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

                    <button type="button" class="${atcClass}" data-ab-add-to-cart="${product.id}" title="${atcLabel}" aria-label="${atcLabel}"${atcDisabled}>
                        ${ADD_TO_CART_ICON}
                    </button>
                </div>
            </div>`;
    }

    function buildOffcanvasColumn() {
        const column = document.createElement("div");
        column.className = "ab--cs-column ab--cs-column--empty";
        column.innerHTML = `
            <h3 class="ab--cs-headline">${OFFCANVAS_HEADLINE}</h3>
            <div class="ab--cs-list"></div>`;

        return column;
    }

    function isOffcanvasLoading(offcanvas) {
        const loader = offcanvas.querySelector(".offcanvas-body > .loader");
        return !!(loader && loader.offsetParent !== null);
    }

    function syncOffcanvasWithCart(offcanvas, retriesLeft = 6) {
        try {
            const column = offcanvas.querySelector(".ab--cs-column");
            if (!column) return;
            if (isOffcanvasLoading(offcanvas)) {
                if (retriesLeft > 0) {
                    setTimeout(() => syncOffcanvasWithCart(offcanvas, retriesLeft - 1), 150);
                }
                return;
            }

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
        } catch (error) {}
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
            } catch (error) {}
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
        } catch (error) {}
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
            console.error(`[AB${TEST_ID}] applyOffcanvasLayout failed`, error);
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
        } catch (error) {}

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
        } catch (error) {}
    }

    function getOffcanvasCartUrl() {
        try {
            const routed = window.router && window.router["frontend.cart.offcanvas"];
            if (routed) return routed;
        } catch (error) {}

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

            rebindOffcanvasNativeControls(offcanvas);
            initShopwarePlugins();
            applyOffcanvasLayout();
            renderingOwnPanel = false;

            return true;
        } catch (error) {
            console.error(`[AB${TEST_ID}] renderOffcanvasCart failed`, error);
            renderingOwnPanel = false;
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
            .catch(() => false);
    }

    function submitCartForm(form) {
        const action = form.getAttribute("action");
        if (!action) return Promise.resolve();

        return fetch(action, {
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
            .then(() => refreshSideCart())
            .catch(() => {});
    }

    function rebindOffcanvasNativeControls(offcanvas) {
        try {
            const closeButton = offcanvas.querySelector(".js-offcanvas-close");
            if (closeButton) {
                closeButton.addEventListener("click", () => {
                    if (window.bootstrap && window.bootstrap.Offcanvas) {
                        const instance = window.bootstrap.Offcanvas.getInstance(offcanvas) || window.bootstrap.Offcanvas.getOrCreateInstance(offcanvas);
                        if (instance) instance.hide();
                    }
                });
            }
        } catch (error) {}
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
                } catch (error) {}
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
        } catch (error) {}
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
        const atcLabel = product.availableSoon ? ADD_TO_CART_UNAVAILABLE_LABEL : ADD_TO_CART_LABEL;
        const atcDisabled = product.availableSoon ? " disabled" : "";
        const atcClass = product.availableSoon ? "ab--cs-atc ab--cs-atc--unavailable" : "ab--cs-atc";

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

                    <button type="button" class="${atcClass}" data-ab-add-to-cart="${product.id}" title="${atcLabel}" aria-label="${atcLabel}"${atcDisabled}>
                        ${ADD_TO_CART_ICON}
                    </button>
                </div>
            </div>`;
    }

    function buildCartPageSection() {
        const section = document.createElement("div");
        section.className = "ab--cs-section";
        const headline = isMobile() ? CART_PAGE_HEADLINE_MOBILE : CART_PAGE_HEADLINE;
        section.innerHTML = `
            <h3 class="ab--cs-headline">${headline}</h3>
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

    function bindCartPageSliderDrag(list) {
        let pointerId = null;
        let isMouseDrag = false;
        let dragging = false;
        let dragged = false;
        let startX = 0;
        let startScrollLeft = 0;
        const DRAG_THRESHOLD = 6;

        list.addEventListener("pointerdown", (event) => {
            if (event.pointerType !== "mouse") return;

            pointerId = event.pointerId;
            isMouseDrag = true;
            dragging = false;
            dragged = false;
            startX = event.clientX;
            startScrollLeft = list.scrollLeft;
        });

        list.addEventListener("pointermove", (event) => {
            if (event.pointerId !== pointerId || !isMouseDrag) return;

            const delta = event.clientX - startX;

            if (!dragging) {
                if (Math.abs(delta) <= DRAG_THRESHOLD) return;
                dragging = true;
                dragged = true;
                list.setPointerCapture(pointerId);
                list.classList.add("ab--cs-list--dragging");
            }

            event.preventDefault();
            list.scrollLeft = startScrollLeft - delta;
        });

        const endDrag = (event) => {
            if (event.pointerId !== pointerId) return;
            pointerId = null;
            isMouseDrag = false;
            dragging = false;
            list.classList.remove("ab--cs-list--dragging");
        };

        list.addEventListener("pointerup", endDrag);
        list.addEventListener("pointercancel", endDrag);

        list.addEventListener(
            "click",
            (event) => {
                if (!dragged) return;
                dragged = false;
                event.preventDefault();
                event.stopPropagation();
            },
            true
        );
    }

    function setupCartPageSlider(section) {
        if (!section) return;
        const list = section.querySelector(".ab--cs-list");
        if (!list || list._abSliderInit) return;
        list._abSliderInit = true;

        bindCartPageSliderDrag(list);

        const onScroll = () => updateCartPageArrows(section);
        list.addEventListener("scroll", onScroll, {passive: true});
        window.addEventListener("resize", onScroll, {passive: true});
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
        } catch (error) {}
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
            } finally {
                markWrapperReady();
            }
        });
    }

    function applyCartPageLayout(allowCreation = false) {
        try {
            if (!isCartPage()) return;

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
        } catch (error) {}
    }

    function buildLineItemFields(productId) {
        return {
            [`lineItems[${productId}][id]`]: productId,
            [`lineItems[${productId}][referencedId]`]: productId,
            [`lineItems[${productId}][quantity]`]: 1,
            [`lineItems[${productId}][type]`]: "product",
            [`lineItems[${productId}][stackable]`]: 1,
            [`lineItems[${productId}][removable]`]: 1,
        };
    }

    function submitAddToCartForm(productId, redirectTo) {
        const fields = {
            ...buildLineItemFields(productId),
            redirectTo,
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
    }

    function refreshSideCart() {
        const offCanvasCart = window.PluginManager.getPluginInstances("OffCanvasCart").find((item) => item.el == document.querySelector(".header-cart"));
        offCanvasCart._registerEvents();
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
            Object.entries(buildLineItemFields(productId)).forEach(([name, value]) => {
                formData.append(name, value);
            });
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
                .then((html) => {
                    markPendingAdd(productId);
                    if (card) card.classList.add("ab--cs-card--hidden");

                    if (!renderOffcanvasCart(html)) refreshOffcanvasCart();

                    refreshSideCart();

                    refreshCartWidget();
                })
                .catch(() => {
                    pendingAdds.delete(productId);
                })
                .finally(() => {
                    if (button) {
                        button.classList.remove("ab--cs-atc--loading");
                        button.disabled = false;
                    }
                });
        } else {
            try {
                submitAddToCartForm(productId, "frontend.checkout.cart.page");
            } catch (error) {
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
                        list.scrollBy({left: -scrollAmount, behavior: "smooth"});
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
                        list.scrollBy({left: scrollAmount, behavior: "smooth"});
                    }
                    return;
                }

                const addButton = event.target.closest("[data-ab-add-to-cart]");
                if (!addButton) return;

                event.preventDefault();
                addToCart(addButton.getAttribute("data-ab-add-to-cart"), addButton);
            } catch (error) {}
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

                    if (isCartPage()) {
                        deduplicateCartPageWrappers();
                        const cartWrapper = document.querySelector(CART_PAGE_WRAPPER_SELECTOR);
                        if (cartWrapper) {
                            const existingSection = cartWrapper.querySelector(".ab--cs-section");
                            if (existingSection) {
                                syncCartPageWithCart();
                            } else {
                                applyCartPageLayout(false);
                            }
                        }
                    }
                } catch (error) {}
            });
        });

        observer.observe(document.body, {childList: true, subtree: true});
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

            if (isCartPage()) {
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
            }
        } catch (error) {}
    }

    waitForElem("body", mainJs);
})();
