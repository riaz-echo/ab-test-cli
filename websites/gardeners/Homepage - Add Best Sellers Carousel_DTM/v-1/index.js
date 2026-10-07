(() => {
    const TEST_ID = "HOME_BEST_SELLERS";
    const VARIANT_ID = "V1";

    const PRODUCTS = [
        {
            "Product Name": "Elevated Cedar Planter Box, 2' x 4'",
            "Price": 249.99,
            "Original Price": null,
            "Sale": 0,
            "Price Prefix": null,
            "Image URL": "https://www.gardeners.com/cdn/shop/files/8587823_8459-tif.jpg?v=1758828480&width=1300",
            "URL": "https://www.gardeners.com/products/grow-box-planter-box",
            "Exclusive Badge": false,
            "Design by GSC Badge": true,
            "Rating": 4.5,
            "Reviews": 337,
        },
        {
            "Product Name": "Deep Root™ Cedar Raised Beds, 4' Wide (14.5\" D)",
            "Price": 197.99,
            "Original Price": 219.99,
            "Sale": 0.1,
            "Price Prefix": "from",
            "Image URL": "https://www.gardeners.com/cdn/shop/files/8587812_7058-tif.jpg?v=1758830431&width=1300",
            "URL": "https://www.gardeners.com/products/deep-root-cedar-raised-beds-4ft",
            "Exclusive Badge": false,
            "Design by GSC Badge": true,
            "Rating": 4.7,
            "Reviews": 232,
        },
        {
            "Product Name": "Deep Root™ Cedar Raised Beds, 2' Wide (14.5\" D)",
            "Price": 134.99,
            "Original Price": 149.99,
            "Sale": 0.1,
            "Price Prefix": "from",
            "Image URL": "https://www.gardeners.com/cdn/shop/files/8587800_0377-tif.jpg?v=1758829895&width=1800",
            "URL": "https://www.gardeners.com/products/deep-root-cedar-raised-garden-beds",
            "Exclusive Badge": false,
            "Design by GSC Badge": true,
            "Rating": 4.7,
            "Reviews": 114,
        },
        {
            "Product Name": "Tomato Cages, Set of 4",
            "Price": 76.49,
            "Original Price": 89.99,
            "Sale": 0.15,
            "Price Prefix": "from",
            "Image URL": "https://www.gardeners.com/cdn/shop/files/8587040_RD_001E_tomato-cages-tif.png?v=1758287991&width=1800",
            "URL": "https://www.gardeners.com/products/tomato-cages",
            "Exclusive Badge": true,
            "Design by GSC Badge": false,
            "Rating": 4.6,
            "Reviews": 1949,
        },
        {
            "Product Name": "Chicken Wire Cloche",
            "Price": 29.69,
            "Original Price": null,
            "Sale": 0,
            "Price Prefix": null,
            "Image URL": "https://www.gardeners.com/cdn/shop/files/8614517_0058.jpg?v=1758827994&width=1300",
            "URL": "https://www.gardeners.com/products/chicken-wire-cloche-vs-sku",
            "Exclusive Badge": false,
            "Design by GSC Badge": true,
            "Rating": 4.8,
            "Reviews": 757,
        },
        {
            "Product Name": "Colorful Gorilla Tubs®, 11 Gallon",
            "Price": 24.99,
            "Original Price": null,
            "Sale": 0,
            "Price Prefix": null,
            "Image URL": "https://www.gardeners.com/cdn/shop/files/35-592_0029_colorful-tubtrug-11-gallon.jpg?v=1758558859&width=1600",
            "URL": "https://www.gardeners.com/products/colorful-garden-tub",
            "Exclusive Badge": false,
            "Design by GSC Badge": false,
            "Rating": 4.9,
            "Reviews": 2216,
        },
        {
            "Product Name": "Titan™ Squash Tunnel",
            "Price": 99.99,
            "Original Price": null,
            "Sale": 0,
            "Price Prefix": null,
            "Image URL": "https://www.gardeners.com/cdn/shop/files/8596276_01EMP-tif.jpg?v=1758828714&width=1300",
            "URL": "https://www.gardeners.com/products/titan-squash-tunnel",
            "Exclusive Badge": true,
            "Design by GSC Badge": false,
            "Rating": 4.5,
            "Reviews": 354,
        },
        {
            "Product Name": "2' x 4' Arch Trellis for Planter Boxes",
            "Price": 199.99,
            "Original Price": null,
            "Sale": 0,
            "Price Prefix": null,
            "Image URL": "https://www.gardeners.com/cdn/shop/files/8612976_10238.jpg?v=1758829891&width=1300",
            "URL": "https://www.gardeners.com/products/arch-trellis-for-2-foot-x-4-foot-planter-box",
            "Exclusive Badge": false,
            "Design by GSC Badge": true,
            "Rating": 4.5,
            "Reviews": 16,
        },
        {
            "Product Name": "Snip-n-Drip™ Soaker Hose System",
            "Price": 44.99,
            "Original Price": null,
            "Sale": 0,
            "Price Prefix": null,
            "Image URL": "https://www.gardeners.com/cdn/shop/files/40205_999_3-4.jpg?v=1758827954&width=800",
            "URL": "https://www.gardeners.com/products/snip-n-drip-soaker-hose-watering-system",
            "Exclusive Badge": true,
            "Design by GSC Badge": false,
            "Rating": 4.3,
            "Reviews": 573,
        },
        {
            "Product Name": "Potting Mix, 20 Qts.",
            "Price": 19.99,
            "Original Price": null,
            "Sale": 0,
            "Price Prefix": null,
            "Image URL": "https://www.gardeners.com/cdn/shop/files/8592211_001E-tif.jpg?v=1758559724&width=1300",
            "URL": "https://www.gardeners.com/products/potting-soil-mix-20-quarts",
            "Exclusive Badge": true,
            "Design by GSC Badge": false,
            "Rating": 4.9,
            "Reviews": 374,
        },
    ];

    const BODY_CLASS = "ab--home-best-sellers";
    const SECTION_CLASS = "ab--bs-section";
    const HERO_SELECTOR = ".main section .collection-list";
    const HEADING_TEXT = "Shop Our Best Sellers";

    const BADGES = {
        designedByGsc: {
            key: "gsc",
            src: "https://cdn.shopify.com/s/files/1/0770/9032/4705/files/4159555.png",
            alt: "Designed by GSC",
        },
        exclusive: {
            key: "exclusive",
            src: "https://cdn.shopify.com/s/files/1/0770/9032/4705/files/badge_product_exclusive.webp?v=1758723375",
            alt: "Exclusive",
        },
    };

    const SVG = {
        arrow: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 12.4016H11.5H23M23 12.4016L13.8 3M23 12.4016L13.8 21.8032" stroke="currentColor" stroke-width="1.75"/></svg>`,
    };

    function logInfo(message) {
        console.log(`%c%c${TEST_ID}-${VARIANT_ID}`, "color: white; background: rgb(0, 0, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", "margin-left: 8px; color: white; background: rgb(0, 57, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", message);
    }

    function waitForElem(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== "undefined") ? callback(elements) : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    function addBodyClass() {
        try {
            !document.body.classList.contains(BODY_CLASS) && document.body.classList.add(BODY_CLASS);
            return document.body.classList.contains(BODY_CLASS);
        } catch (error) {
            console.error(`${TEST_ID}-${VARIANT_ID} addBodyClass error:`, error);
            return false;
        }
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function formatPrice(value) {
        const number = Number(value);
        if (!Number.isFinite(number)) return "";
        return `$${number.toFixed(2)}`;
    }

    function normalizeProduct(raw, index) {
        return {
            index,
            name: raw["Product Name"] || "",
            price: raw["Price"],
            originalPrice: raw["Original Price"],
            sale: Number(raw["Sale"]) || 0,
            pricePrefix: raw["Price Prefix"] || "",
            image: raw["Image URL"] || "",
            url: raw["URL"] || "",
            exclusiveBadge: !!raw["Exclusive Badge"],
            designedByGscBadge: !!raw["Design by GSC Badge"],
            rating: Number(raw["Rating"]) || 0,
            reviews: Number(raw["Reviews"]) || 0,
        };
    }

    function buildBadgesHtml(product) {
        const badges = [];
        product.designedByGscBadge && badges.push(BADGES.designedByGsc);
        product.exclusiveBadge && badges.push(BADGES.exclusive);
        if (!badges.length) return "";

        const items = badges.map((badge) => `<img class="ab--bs-badge ab--bs-badge--${badge.key}" loading="lazy" src="${escapeHtml(badge.src)}" alt="${escapeHtml(badge.alt)}" />`).join("");
        return `<div class="ab--bs-badges">${items}</div>`;
    }

    function getStarFill(rating, index) {
        const remaining = Math.max(0, Math.min(1, rating - index));
        return Math.round(remaining * 4) * 25;
    }

    function buildStarsHtml(rating) {
        const stars = [0, 1, 2, 3, 4].map((index) => `<span class="ab--bs-star ab--bs-star--${getStarFill(rating, index)}" aria-hidden="true"></span>`).join("");

        return `<span class="ab--bs-stars" role="img" aria-label="Rated ${rating} out of 5 stars">${stars}</span>`;
    }

    function buildRatingHtml(product) {
        if (!product.rating) return "";

        return `<div class="ab--bs-rating">
        ${buildStarsHtml(product.rating)}
        <span class="ab--bs-rating-text">${product.rating} | ${product.reviews} Reviews</span>
      </div>`;
    }

    function buildPriceHtml(product) {
        const isOnSale = product.originalPrice !== null && product.originalPrice !== undefined && Number(product.originalPrice) > Number(product.price);
        const prefix = product.pricePrefix ? `<span class="ab--bs-price-prefix">${escapeHtml(product.pricePrefix)}</span>` : "";
        const original = isOnSale ? `<s class="ab--bs-price-original">${formatPrice(product.originalPrice)}</s>` : "";
        const current = `<span class="ab--bs-price-current${isOnSale ? " is-sale" : ""}">${formatPrice(product.price)}</span>`;
        const saving = product.sale > 0 ? `<div class="ab--bs-save">Save up to ${Math.round(product.sale * 100)}%</div>` : "";

        return `<div class="ab--bs-price${isOnSale ? " is-sale" : ""}">${prefix}${original}${current}</div>${saving}`;
    }

    function buildProductHtml(product) {
        const name = escapeHtml(product.name);
        const url = escapeHtml(product.url);

        return `<div class="ab--bs-item" data-ab-item data-index="${product.index}" data-url="${url}" data-title="${name}">
        <div class="ab--bs-media">
          <a class="ab--bs-image-link" href="${url}" aria-label="${name}" draggable="false">
            <img class="ab--bs-image" loading="lazy" src="${escapeHtml(product.image)}" alt="${name}" draggable="false" />
          </a>
          ${buildBadgesHtml(product)}
        </div>
        <div class="ab--bs-meta">
          <h3 class="ab--bs-title"><a href="${url}" draggable="false">${name}</a></h3>
          ${buildRatingHtml(product)}
          ${buildPriceHtml(product)}
        </div>
      </div>`;
    }

    function buildSectionHtml(products) {
        const items = products.map(buildProductHtml).join("");

        return `<section class="${SECTION_CLASS}" aria-label="${HEADING_TEXT}">
        <div class="ab--bs-inner">
          <h2 class="ab--bs-heading">${HEADING_TEXT}</h2>
          <div class="ab--bs-carousel" data-ab-carousel>
            <div class="ab--bs-track" data-ab-track>${items}</div>
            <button type="button" class="ab--bs-nav ab--bs-nav--prev" data-ab-prev title="Previous" aria-label="Previous products" hidden>${SVG.arrow}</button>
            <button type="button" class="ab--bs-nav ab--bs-nav--next" data-ab-next title="Next" aria-label="Next products" hidden>${SVG.arrow}</button>
          </div>
          <div class="ab--bs-dots" data-ab-dots role="tablist" aria-label="Carousel pages"></div>
        </div>
      </section>`;
    }


    function initCarousel(section) {
        const carousel = section.querySelector("[data-ab-carousel]");
        const track = section.querySelector("[data-ab-track]");
        const prevButton = section.querySelector("[data-ab-prev]");
        const nextButton = section.querySelector("[data-ab-next]");
        const dotsWrapper = section.querySelector("[data-ab-dots]");
        const items = Array.from(track.querySelectorAll("[data-ab-item]"));
        if (!items.length) return;

        const state = {perView: 1, pageWidth: 0, totalPages: 1, currentPage: 0};
        let scrollRaf = null;

        function getGap() {
            const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap);
            return Number.isFinite(gap) ? gap : 0;
        }

        function getMaxScroll() {
            return Math.max(0, track.scrollWidth - track.clientWidth);
        }

        function measure() {
            const gap = getGap();
            const itemWidth = items[0].getBoundingClientRect().width || 1;
            const perView = Math.max(1, Math.round((track.clientWidth + gap) / (itemWidth + gap)));

            state.perView = perView;
            state.pageWidth = perView * (itemWidth + gap);
            state.totalPages = Math.max(1, Math.ceil(items.length / perView));
        }

        function getCurrentPage() {
            const maxScroll = getMaxScroll();
            if (maxScroll <= 0) return 0;
            if (track.scrollLeft >= maxScroll - 1) return state.totalPages - 1;
            return Math.min(state.totalPages - 1, Math.round(track.scrollLeft / state.pageWidth));
        }

        function renderDots() {
            dotsWrapper.innerHTML = "";
            if (state.totalPages <= 1) return;

            for (let index = 0; index < state.totalPages; index++) {
                const dot = document.createElement("button");
                dot.type = "button";
                dot.className = "ab--bs-dot";
                dot.setAttribute("role", "tab");
                dot.setAttribute("aria-label", `Go to page ${index + 1}`);
                dot.dataset.page = index;
                dotsWrapper.appendChild(dot);
            }
        }

        function updateControls() {
            const maxScroll = getMaxScroll();
            const scrollable = maxScroll > 1;
            state.currentPage = getCurrentPage();

            prevButton.hidden = !scrollable || track.scrollLeft <= 1;
            nextButton.hidden = !scrollable || track.scrollLeft >= maxScroll - 1;
            carousel.dataset.scrollable = scrollable ? "true" : "false";

            Array.from(dotsWrapper.children).forEach((dot, index) => {
                const isActive = index === state.currentPage;
                dot.classList.toggle("is-selected", isActive);
                dot.setAttribute("aria-selected", isActive ? "true" : "false");
            });
        }

        function scrollToPage(page) {
            const target = Math.max(0, Math.min(state.totalPages - 1, page));
            const left = Math.min(getMaxScroll(), target * state.pageWidth);
            track.scrollTo({left, behavior: "smooth"});
        }

        function refresh() {
            const previousPages = state.totalPages;
            measure();
            previousPages !== state.totalPages && renderDots();
            updateControls();
        }

        prevButton.addEventListener("click", () => scrollToPage(state.currentPage - 1));
        nextButton.addEventListener("click", () => scrollToPage(state.currentPage + 1));

        dotsWrapper.addEventListener("click", (event) => {
            const dot = event.target.closest(".ab--bs-dot");
            dot && scrollToPage(parseInt(dot.dataset.page, 10));
        });

        track.addEventListener("scroll", () => {
            if (scrollRaf) return;
            scrollRaf = requestAnimationFrame(() => {
                scrollRaf = null;
                updateControls();
            });
        }, {passive: true});

        initDragScroll(track);

        if ("ResizeObserver" in window) {
            new ResizeObserver(refresh).observe(track);
        } else {
            window.addEventListener("resize", refresh);
        }

        measure();
        renderDots();
        updateControls();
    }

    function initDragScroll(track) {
        const MOVE_DELTA_TO_PREVENT_CLICK = 3;
        let isDown = false;
        let startX = 0;
        let startScroll = 0;
        let moved = false;

        track.addEventListener("mousedown", (event) => {
            if (window.matchMedia("(pointer: coarse)").matches) return;
            isDown = true;
            moved = false;
            startX = event.pageX;
            startScroll = track.scrollLeft;
            track.classList.add("is-mouse-down");
        });

        track.addEventListener("mousemove", (event) => {
            if (!isDown) return;
            const delta = event.pageX - startX;
            if (Math.abs(delta) >= MOVE_DELTA_TO_PREVENT_CLICK) {
                moved = true;
                track.classList.add("is-dragging");
            }
            event.preventDefault();
            track.scrollLeft = startScroll - delta;
        });

        const release = () => {
            isDown = false;
            track.classList.remove("is-mouse-down");
            setTimeout(() => track.classList.remove("is-dragging"), 0);
        };

        track.addEventListener("mouseup", release);
        track.addEventListener("mouseleave", () => isDown && release());

        track.addEventListener("click", (event) => {
            if (!moved) return;
            event.preventDefault();
            event.stopPropagation();
            moved = false;
        }, true);
    }

    function insertSection(collection_list, products) {
        try {
            if (document.querySelector(`.${SECTION_CLASS}`)) return null;

            const anchor = collection_list.closest("section.shopify-section") || collection_list;
            anchor.insertAdjacentHTML("beforebegin", buildSectionHtml(products));

            const section = document.querySelector(`.${SECTION_CLASS}`);
            logInfo(`Best sellers carousel inserted with ${products.length} products`);
            return section;
        } catch (error) {
            console.error(`${TEST_ID}-${VARIANT_ID} insertSection error:`, error);
            return null;
        }
    }

    function initBestSellers() {
        const products = (Array.isArray(PRODUCTS) ? PRODUCTS : []).map(normalizeProduct).filter((product) => product.name && product.url);
        if (!products.length) {
            logInfo("No products to render");
            return;
        }

        waitForElem(HERO_SELECTOR, ([collection_list]) => {
            const section = insertSection(collection_list, products);
            if (!section) return;

            initCarousel(section);
        });
    }

    function mainJs([body]) {
        try {
            logInfo("fired");

            if (!addBodyClass()) return;

            initBestSellers();
        } catch (error) {
            console.error(`${TEST_ID}-${VARIANT_ID} mainJs error:`, error);
        }
    }

    waitForElem("body", mainJs);
})();
