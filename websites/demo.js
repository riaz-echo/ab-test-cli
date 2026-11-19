(() => {
    window.__ab_variant = "v1_VC129";
    const testInfo = {
        id: "VC129",
        name: "CART Cart Take 2 - SET UP TEST",
        variation: 1,
    };

    const TEST_ID = "VC129";
    const VARIANT_ID = "V1"; /* V1, V2, V3 */

    function logInfo(message) {
        console.log(`%cAcadia%c${TEST_ID}-${VARIANT_ID}`, "color: white; background: rgb(0, 0, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", "margin-left: 8px; color: white; background: rgb(0, 57, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", message);
    }

    logInfo("fired");

    function waitForElem(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== "undefined") ? callback(elements) : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }
    function updateCartItemLayout() {
        waitForElem("section#bag .bag-item.js-bag-item .bag-item__variants .bag-item__variant", () => {
            document.querySelectorAll("section#bag .bag-item.js-bag-item").forEach((bagItem) => {
                let updatedText = "";
                bagItem.querySelectorAll(".bag-item__variants .bag-item__variant").forEach((variant, key, variantList) => {
                    if (variant?.innerText?.includes("Color")) {
                        let color = variant.innerText?.split("Color:")[1]?.trim();

                        updatedText += color;
                        // variant.closest('.bag-item.js-bag-item').querySelector('.bag-item__title a').innerText = variant.closest('.bag-item.js-bag-item').querySelector('.bag-item__title a').innerText + ' ' + updatedText;
                    }

                    if (variant?.innerText?.includes("Size")) {
                        let size = variant.innerText?.split("Size:")[1]?.trim();

                        updatedText = updatedText?.length > 0 ? updatedText + " / " + size : size;
                    }

                    if (key === variantList.length - 1) {
                        if (!variant.closest(".bag-item.js-bag-item").querySelector(".bag-item__desc").classList.contains("ab--updated-title")) {
                            variant.closest(".bag-item.js-bag-item").querySelector(".bag-item__desc").classList.add("ab--updated-title");
                            variant.closest(".bag-item.js-bag-item").querySelector(".bag-item__title").insertAdjacentHTML("afterend", `<span class="ab--variant-text">${updatedText}</span>`);

                            if (testInfo.variation >= 3) {
                                !document.body.classList.contains("ab--variation-3") && document.body.classList.add("ab--variation-3");
                                if (!variant.closest(".bag-item.js-bag-item").querySelector(".bag-item__title a").querySelector(".ab--remove-button")) {
                                    variant.closest(".bag-item.js-bag-item").querySelector(".bag-item__title a").insertAdjacentHTML("afterend", `<i class="ab--remove-button"></i>`);
                                }
                            }
                        }
                    }
                });
            });
        });
    }

    function updateCartTitleSection() {
        if (testInfo.variation >= 4) {
            !document.body.classList.contains("ab--variation-4") && document.body.classList.add("ab--variation-4");

            waitForElem("form#bagForm > header.bag__header .bag__title", () => {
                if (!document.querySelector("form#bagForm > header.bag__header").querySelector(".ab--close-button")) {
                    document.querySelector("form#bagForm > header.bag__header .bag__title").insertAdjacentHTML("afterend", `<i class="ab--close-button"></i>`);
                }

                if (document.querySelector("form#bagForm > header.bag__header .bag__title span")) {
                    fetchCartData().then(function (bagCount) {
                        // let timer = setInterval(() => {
                        let bagItemCount = document.querySelector("form#bagForm > header.bag__header .bag__title .js-bag-count")?.innerHTML?.trim();
                        document.querySelector(".ab--bag-title")?.remove();

                        if (bagCount) {
                            bagItemCount = bagCount;
                        }
                        document.querySelector("form#bagForm > header.bag__header .bag__title").insertAdjacentHTML("afterend", "<div class='ab--bag-title'>SHOPPING BAG <span class='ab--bag-count-number'>(" + bagItemCount + ")</span></div>");
                    });
                }
            });
        }
    }

    function fetchCartData() {
        return fetch("/cart.js")
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(function (data) {
                return data.item_count;
            })
            .catch(function (error) {
                console.error("Fetch error:", error);
                return false;
            });
    }

    function clickFunction() {
        document.body.addEventListener("click", (e) => {
            if (e.target.closest(".ab--remove-button")) {
                fireGA4Event("VC129_Removeclick", "X icon");
                e.target.closest(".bag-item.js-bag-item")?.querySelector(".bag-item__remove")?.click();
            }

            if (e.target.closest(".bag-item__remove") && e.isTrusted) {
                fireGA4Event("VC129_Removeclick", "Remove");
            }

            if (e.target.closest(".ab--close-button")) {
                document.querySelector("button#cart-drawer-close")?.click();
            }

            if (e.target.closest(".cart-drawer-overlay") || e.target.closest("button#cart-drawer-close")) {
                document.querySelector(".cart-drawer").classList.remove("observed");
            }
        });
    }

    function observeMiniCart(selector) {
        waitForElem(selector, () => {
            const observer = new MutationObserver((mutations) => {
                updateCartItemLayout();
                if (selector == ".bag__cart-count .js-bag-count") {
                    updateCartTitleSection();
                }
                if (selector == ".cart-drawer" && !document.querySelector(".cart-drawer").classList.contains("inactive") && !document.querySelector(".cart-drawer").classList.contains("observed")) {
                    document.querySelector(".cart-drawer").classList.add("observed");
                    fireGA4Event("VC129_ViewCart");
                }
            });

            let config = {
                childList: true,
            };
            if (selector == ".cart-drawer") {
                config = {
                    attributes: true,
                    attributeFilter: ["class"],
                };
            }

            observer.observe(document.querySelector(selector), config);
        });
    }

    function fireGA4Event(eventName, eventLabel = "") {
        window.dataLayer = window.dataLayer || [];

        window.dataLayer.push({
            event: "GA4event",
            "ga4-event-name": "cro_event",
            "ga4-event-p1-name": "event_category",
            "ga4-event-p1-value": eventName,
            "ga4-event-p2-name": "event_label",
            "ga4-event-p2-value": eventLabel,
        });
    }

    function mainJs([body]) {
        if (testInfo.variation >= 2) {
            !document.body.classList.contains("ab--variation-2") && document.body.classList.add("ab--variation-2");
        }

        clickFunction();
        observeMiniCart(".cart-drawer");

        if (testInfo.variation >= 1) {
            updateCartTitleSection();
            updateCartItemLayout();
            observeMiniCart(".bag__cart-count .js-bag-count");
            observeMiniCart("section#bag #bagContent .bag__items-wrapper");
        }
    }

    waitForElem("body", mainJs);
})();

