(() => {
    const BODY_CLASS = "ab--cart-cross-sell";
    const SECTION_CLASS = "ab--cross-sell";
    const ANCHOR = ".cart.cart-page .row .product-info";
    const CART_CONTAINER = ".cart.cart-page";
    const SECTION_TITLE = "Gear Up for Your Next Round";
    const ADD_TO_CART_ACTION = "/on/demandware.store/Sites-DunlopSportsUS-Site/en_US/Cart-AddProduct";
    const CART_URL = "/cart";
    const MINI_CART_URL = "/on/demandware.store/Sites-DunlopSportsUS-Site/en_US/Cart-MiniCartShow";
    const MINI_CART_POPOVER = "#miniCartPopover";
    const MINI_CART_COUNT = ".minicart-quantity";
    const TOTALS_SELECTORS = [".grand-total", ".shipping-cost", ".tax-total", ".order-discount-total", ".shipping-discount-total"];
    const DISCOUNT_ROWS = [".order-discount", ".shipping-discount"];
    const SCROLL_FLAG = "ab--cross-sell-scroll-top";
    const READY_CLASS = "ab--is-ready";

    let renderedSignature = null;

    const crossSellProducts = [
        {
            image: "https://us.dunlopsports.com/on/demandware.static/-/Sites-masterCatalog_DunlopSports/default/dwaca1a630/images/large/SX25-Balls-ZSTR9-DIAMOND3-Pure-White-2.jpg",
            name: "Z-STAR DIAMOND Golf Balls - Pure White",
            price: "$54.99",
            star_review: "4.9",
            review_count: "143",
            SKU: "10360244",
            url: "https://us.dunlopsports.com/srixon/jj-spauns-witb/z-star-diamond-golf-balls/10360244.html",
        },
        {
            image: "https://us.dunlopsports.com/on/demandware.static/-/Sites-masterCatalog_DunlopSports/default/dw7d157c49/images/large/QSTR-TOUR-6_Pkg_White_FLIP.jpg",
            name: "Q-STAR TOUR Golf Balls - Pure White",
            price: "$39.99",
            star_review: "4.9",
            review_count: "83",
            SKU: "10369840",
            url: "https://us.dunlopsports.com/srixon/balls/q-star-series/q-star-tour/q-star-tour-golf-balls/10369840.html",
        },
        {
            image: "https://us.dunlopsports.com/on/demandware.static/-/Sites-masterCatalog_DunlopSports/default/dw1779566b/images/large/SX25-Balls-SF14-Soft-White-1.jpg",
            name: "SOFT FEEL Golf Balls - Soft White",
            price: "$24.99",
            star_review: "4.5",
            review_count: "111",
            SKU: "10352300",
            url: "https://us.dunlopsports.com/srixon/balls/soft-feel-series/soft-feel/soft-feel-golf-balls/10352300.html",
        },
    ];

    function waitForElem(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25, onTimeout) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return onTimeout && onTimeout();
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== "undefined") ? callback(elements) : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency, frequency, onTimeout), frequency);
    }

    function scrollToTopAfterReload() {
        sessionStorage.setItem(SCROLL_FLAG, "1");
        window.history.scrollRestoration = "manual";
    }

    function restoreScrollPosition() {
        if (sessionStorage.getItem(SCROLL_FLAG) !== "1") return;
        sessionStorage.removeItem(SCROLL_FLAG);

        window.history.scrollRestoration = "manual";

        const toTop = () => window.scrollTo(0, 0);
        toTop();
        window.addEventListener("load", () => requestAnimationFrame(toTop), { once: true });
    }

    function renderCart() {
        return fetch(CART_URL, {
            credentials: "include",
            headers: { "X-Requested-With": "XMLHttpRequest" },
        })
            .then((response) => {
                if (!response.ok) throw new Error(response.status);
                return response.text();
            })
            .then((html) => {
                const doc = new DOMParser().parseFromString(html, "text/html");
                const freshCards = doc.querySelectorAll(ANCHOR);
                const cards = document.querySelectorAll(ANCHOR);
                if (!freshCards.length || !cards.length) throw new Error("cart markup missing");

                cards[0].parentElement.innerHTML = freshCards[0].parentElement.innerHTML;
                return doc;
            });
    }

    function updateTotals(doc) {
        TOTALS_SELECTORS.forEach((selector) => {
            const fresh = doc.querySelector(selector);
            const current = document.querySelector(selector);
            if (fresh && current) current.textContent = fresh.textContent;
        });

        DISCOUNT_ROWS.forEach((selector) => {
            const fresh = doc.querySelector(selector);
            const current = document.querySelector(selector);
            if (fresh && current) current.className = fresh.className;
        });

        const freshPromos = doc.querySelector(".coupons-and-promos");
        const promos = document.querySelector(".coupons-and-promos");
        if (freshPromos && promos) promos.innerHTML = freshPromos.innerHTML;

        const freshKlarna = doc.querySelector("klarna-placement[data-purchase-amount]");
        const klarna = document.querySelector("klarna-placement[data-purchase-amount]");
        if (freshKlarna && klarna) klarna.setAttribute("data-purchase-amount", freshKlarna.getAttribute("data-purchase-amount"));
        if (window.Klarna && window.Klarna.OnsiteMessaging) window.Klarna.OnsiteMessaging.refresh();
    }

    // The count in the navbar is only half the mini cart: the popover keeps the line items the
    // theme rendered on page load, so it has to be refilled or it still shows the old basket.
    function updateMiniCart(doc) {
        const popover = document.querySelector(MINI_CART_POPOVER);
        if (!popover) return Promise.resolve();

        const freshCount = doc.querySelector(MINI_CART_COUNT);
        const count = document.querySelector(MINI_CART_COUNT);
        if (freshCount && count) count.textContent = freshCount.textContent;

        // The cart page we already fetched carries the whole document, popover included.
        const fresh = doc.querySelector(MINI_CART_POPOVER);
        if (fresh) {
            popover.innerHTML = fresh.innerHTML;
            return Promise.resolve();
        }

        // Unless the theme injects it only after its own Cart-MiniCartShow call.
        return fetch(MINI_CART_URL, {
            credentials: "include",
            headers: { "X-Requested-With": "XMLHttpRequest" },
        })
            .then((response) => {
                if (!response.ok) throw new Error(response.status);
                return response.text();
            })
            .then((html) => {
                const parsed = new DOMParser().parseFromString(html, "text/html");
                // The endpoint may answer with the popover itself or with its contents alone.
                const source = parsed.querySelector(MINI_CART_POPOVER) || parsed.body;
                popover.innerHTML = source.innerHTML;
            });
    }

    function notifyTheme(data) {
        if (!window.jQuery) return;
        window.jQuery(".minicart").trigger("count:update", data);
        window.jQuery("body").trigger("cart:update");
    }

    function buildStars(rating) {
        const value = parseFloat(rating) || 0;
        let stars = "";
        for (let i = 1; i <= 5; i++) {
            stars += value >= i - 0.3 ? "★" : "☆";
        }
        return stars;
    }

    function buildCard(product) {
        const href = product.url || product[" url"] || "#";

        const card = document.createElement("div");
        card.className = "ab--product-card";
        card.innerHTML = `
            <a href="${href}" class="ab--product-image">
                <img src="${product.image}" alt="${product.name}" width="170" height="170">
            </a>
            <h3 class="ab--product-title">
                <a href="${href}">${product.name}</a>
            </h3>
            <div class="ab--product-price">${product.price}</div>
            <div class="ab--product-rating">
                <span class="ab--stars">${buildStars(product.star_review)}</span>
                <span class="ab--rating">${product.star_review}</span>
                <span class="ab--reviews">${product.review_count} Reviews</span>
            </div>
            <button type="button" class="ab--add-to-cart" data-pid="${product.SKU}">ADD TO CART</button>
        `;

        card.querySelector(".ab--add-to-cart").addEventListener("click", (event) => addToCart(event.currentTarget));
        return card;
    }

    function addToCart(button) {
        if (button.disabled) return;

        const pid = button.getAttribute("data-pid");
        const label = button.textContent;
        button.disabled = true;
        button.classList.add("ab--is-loading");
        button.textContent = "ADDING...";

        const body = new URLSearchParams({
            pid: pid,
            stockPID: pid,
            quantity: "1",
            options: "[]",
            lineParams: "{}",
        }).toString();

        let added = false;
        let rendered = false;
        let cartData = null;

        fetch(ADD_TO_CART_ACTION, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
            },
            body: body,
        })
            .then((response) => {
                if (!response.ok) throw new Error(response.status);
                return response.json();
            })
            .then((data) => {
                if (data && data.error) throw new Error(data.message || "add to cart failed");
                added = true;
                cartData = data;
                button.textContent = "ADDED";
                return renderCart();
            })
            .then((doc) => {
                rendered = true;
                syncSection();
                window.scrollTo({ top: 0, behavior: "smooth" });
                updateTotals(doc);
                notifyTheme(cartData);
                return updateMiniCart(doc);
            })
            .catch((error) => {
                if (rendered) return console.warn("[ab--cross-sell] cart updated, follow-up failed:", error);
                if (added) {
                    scrollToTopAfterReload();
                    return window.location.reload();
                }
                button.disabled = false;
                button.classList.remove("ab--is-loading");
                button.textContent = label;
            });
    }

    function buildSection(products) {
        const section = document.createElement("div");
        section.className = SECTION_CLASS;

        const heading = document.createElement("h2");
        heading.className = "ab--cross-sell-title";
        heading.textContent = SECTION_TITLE;
        section.appendChild(heading);

        const grid = document.createElement("div");
        grid.className = "ab--product-grid ab--product-slider";
        products.forEach((product) => grid.appendChild(buildCard(product)));
        section.appendChild(grid);

        return section;
    }

    function getCartPids() {
        const owned = [...document.querySelectorAll(`${ANCHOR} [data-pid]`)];
        return new Set(owned.map((element) => element.getAttribute("data-pid")));
    }

    function getAvailableProducts() {
        const cartPids = getCartPids();
        return crossSellProducts.filter((product) => !cartPids.has(product.SKU));
    }

    function syncSection() {
        const products = getAvailableProducts();
        const signature = products.map((product) => product.SKU).join(",");
        const current = document.querySelector(`.${SECTION_CLASS}`);
        if (current && signature === renderedSignature) return;

        renderedSignature = signature;
        if (current) current.remove();

        const cards = document.querySelectorAll(ANCHOR);
        if (!products.length || !cards.length) return;

        const section = buildSection(products);
        cards[cards.length - 1].insertAdjacentElement("afterend", section);
        requestAnimationFrame(() => section.classList.add(READY_CLASS));
    }

    function startTest(body) {
        if (!body.classList.contains(BODY_CLASS)) {
            body.classList.add(BODY_CLASS);
        }

        syncSection();

        new MutationObserver(syncSection).observe(document.querySelector(CART_CONTAINER), { childList: true, subtree: true });
    }

    function mainJs([body]) {
        restoreScrollPosition();
        waitForElem(ANCHOR, () => startTest(body), 1, false, 15000);
    }

    waitForElem("body", mainJs);
})();
