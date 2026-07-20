(() => {
    function waitForElem(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== "undefined") ? callback(elements) : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    function injectBadge() {
        waitForElem(".product-form__quantity-and-buy-buttons-wrapper", ([target]) => {
            if (document.querySelector(".ab--customer-fav-badge")) return;
            target.insertAdjacentHTML("beforebegin", `<div class="ab--customer-fav-badge"><span>Customer Favorite: High Yield Rate</span></div>`);
        });
    }

    function mainJs([body]) {
        if (!body.classList.contains("ab--pdp-reinforce-badge")) {
            body.classList.add("ab--pdp-reinforce-badge");
        }

        injectBadge();
    }

    waitForElem("body", mainJs);
})();
