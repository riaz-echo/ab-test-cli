import testInfo from "./info.json" assert { type: "json" };

(() => {
    const BODY_CLASS = "ab--cart-cross-sell";
    const SECTION_CLASS = "ab--cross-sell";
    const ANCHOR = ".cart.cart-page .row .product-info";
    const SECTION_TITLE = "Gear Up for Your Next Round";
    const ADD_TO_CART_ACTION = "/on/demandware.store/Sites-DunlopSportsUS-Site/en_US/Cart-AddProduct";

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

    // Matches the client mock: 4.8 and 4.9 render five filled stars, 4.5 renders four.
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
                <img src="${product.image}" alt="${product.name}" loading="lazy">
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
                button.textContent = "ADDED";
                // The cart page totals/line items are server rendered, so reload to reflect the new item.
                window.location.reload();
            })
            .catch(() => {
                button.disabled = false;
                button.classList.remove("ab--is-loading");
                button.textContent = label;
            });
    }

    function buildSection() {
        const section = document.createElement("div");
        section.className = SECTION_CLASS;

        const heading = document.createElement("h2");
        heading.className = "ab--cross-sell-title";
        heading.textContent = SECTION_TITLE;
        section.appendChild(heading);

        const grid = document.createElement("div");
        grid.className = "ab--product-grid ab--product-slider";
        crossSellProducts.forEach((product) => grid.appendChild(buildCard(product)));
        section.appendChild(grid);

        return section;
    }

    function insertSection(cards) {
        if (document.querySelector(`.${SECTION_CLASS}`)) return;

        const lastCard = cards[cards.length - 1];
        lastCard.insertAdjacentElement("afterend", buildSection());
    }

    function startTest(body) {
        if (!body.classList.contains(BODY_CLASS)) {
            body.classList.add(BODY_CLASS);
        }

        waitForElem(ANCHOR, insertSection, 1, false, 15000);
    }

    function mainJs([body]) {
        waitForElem(ANCHOR, () => startTest(body), 1, false, 15000);
    }

    waitForElem("body", mainJs);
})();
