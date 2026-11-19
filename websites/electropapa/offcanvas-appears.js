(function () {
    const TEST_KEY = "CONVERT_TEST040_BUCKETED";
    const CART_OFFCANVAS = "body > .offcanvas.cart-offcanvas";

    function q(s, o) {
        return o ? s.querySelector(o) : document.querySelector(s);
    }

    function waitForPromise(predicate) {
        return new Promise((resolve) => {
            if (predicate()) {
                return resolve();
            }

            new MutationObserver((mutationList, observer) => {
                if (predicate()) {
                    observer.disconnect();
                    resolve();
                }
            }).observe(q("body"), {childList: true, subtree: false});
        });
    }

    try {
        if (!q("body")) {
            throw new Error("No body");
        }

        if (window[TEST_KEY]) {
            return true;
        }

        // Start the observer once per page, but return false right away
        if (!window[TEST_KEY + "_WAITING"]) {
            window[TEST_KEY + "_WAITING"] = true;

            waitForPromise(() => !!q(CART_OFFCANVAS)).then(() => {
                window[TEST_KEY] = true;
                convert_recheck_experiment();
            });
        }

        return false;
    } catch (error) {
        convert_recheck_experiment();
        return false;
    }
})();