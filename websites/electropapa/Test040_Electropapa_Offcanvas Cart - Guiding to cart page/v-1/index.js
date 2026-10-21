(() => {
  const BODY_CLASS = "ab-test040";
  const ACTIONS_SELECTOR = ".offcanvas .offcanvas-body .offcanvas-cart-actions";
  const CTA_SELECTOR = "a.begin-checkout-btn";
  const CTA_CLASS = "ab-t040-cta";
  const CTA_TEXT = "Zum Warenkorb";
  const CART_URL = "/de/checkout/cart";

  function waitForElem(
    waitFor,
    callback,
    minElements = 1,
    isVariable = false,
    timer = 10000,
    frequency = 25
  ) {
    let elements = isVariable
      ? window[waitFor]
      : document.querySelectorAll(waitFor);
    if (timer <= 0) return;
    (!isVariable && elements.length >= minElements) ||
    (isVariable && typeof window[waitFor] !== "undefined")
      ? callback(elements)
      : setTimeout(
          () =>
            waitForElem(
              waitFor,
              callback,
              minElements,
              isVariable,
              timer - frequency
            ),
          frequency
        );
  }

  function updateCta(actions) {
    const cta = actions.querySelector(CTA_SELECTOR) || actions.querySelector(`.${CTA_CLASS}`);
    if (!cta) return;

    if (!cta.classList.contains(CTA_CLASS)) {
      cta.classList.add(CTA_CLASS);
      cta.classList.remove("begin-checkout-btn");
    }
    if (cta.getAttribute("href") !== CART_URL) cta.setAttribute("href", CART_URL);
    if (cta.getAttribute("title") !== CTA_TEXT) cta.setAttribute("title", CTA_TEXT);
    if (cta.textContent.trim() !== CTA_TEXT) cta.textContent = CTA_TEXT;
  }

  function applyChanges() {
    try {
      const actions = document.querySelector(ACTIONS_SELECTOR);
      if (!actions) return;

      if (!document.body.classList.contains(BODY_CLASS)) {
        document.body.classList.add(BODY_CLASS);
      }

      updateCta(actions);
    } catch (error) {}
  }

  function mainJs([body]) {
    try {
      if (!body) return;

      const observer = new MutationObserver(applyChanges);
      observer.observe(body, { childList: true, subtree: true });

      applyChanges();
    } catch (error) {}
  }

  waitForElem("body", mainJs);
})();