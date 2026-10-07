(() => {
  const CONFIG = {
    selectors: {
      buyBox: ".product-detail-buy-box",
      atcForm: "form.product-amount-input",
      row: ".product-detail-attribute-row",
      availableIcon: ".delivery-times .available-icon",
      deliveryTimes: ".delivery-times",
    },
    classes: {
      body: "ab-t007-v2",
      note: "ab-t007-delivery",
      row: "ab-t007-delivery-row",
    },
    copy: {
      text: "Lieferzeit: <strong>2–4 Werktage</strong>",
    },
    notAvailable: /nicht|not/i,
  };

  const TRUCK_ICON = `<svg class="${CONFIG.classes.note}__icon" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g stroke="#1B509F" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"><path d="M14.666 2.75H0.916016V14.6667H14.666V2.75Z"/><path d="M14.666 7.33398H18.3327L21.0827 10.084V14.6673H14.666V7.33398Z"/><path d="M5.04167 19.2493C6.30732 19.2493 7.33333 18.2233 7.33333 16.9577C7.33333 15.692 6.30732 14.666 5.04167 14.666C3.77601 14.666 2.75 15.692 2.75 16.9577C2.75 18.2233 3.77601 19.2493 5.04167 19.2493Z"/><path d="M16.9577 19.2493C18.2233 19.2493 19.2493 18.2233 19.2493 16.9577C19.2493 15.692 18.2233 14.666 16.9577 14.666C15.692 14.666 14.666 15.692 14.666 16.9577C14.666 18.2233 15.692 19.2493 16.9577 19.2493Z"/></g></svg>`;

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

  function isAvailableNow(buyBox) {
    const icon = buyBox.querySelector(CONFIG.selectors.availableIcon);
    if (!icon) return false;
    const label = buyBox.querySelector(CONFIG.selectors.deliveryTimes);
    return !CONFIG.notAvailable.test(label ? label.textContent : "");
  }

  function render() {
    const buyBox = document.querySelector(CONFIG.selectors.buyBox);
    const form = buyBox && buyBox.querySelector(CONFIG.selectors.atcForm);
    const anchor = form && (form.closest(CONFIG.selectors.row) || form);
    const existing = document.querySelector(`.${CONFIG.classes.row}`);

    if (!anchor || !isAvailableNow(buyBox)) {
      if (existing) existing.remove();
      return;
    }

    if (existing && existing.previousElementSibling === anchor) return;

    if (existing) existing.remove();
    anchor.insertAdjacentHTML(
      "afterend",
      `<div class="product-detail-attribute-row ${CONFIG.classes.row}"><div class="${CONFIG.classes.note}">${TRUCK_ICON}<span class="${CONFIG.classes.note}__text">${CONFIG.copy.text}</span></div></div>`
    );
  }

  function observe() {
    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        observer.disconnect();
        render();
        observer.observe(document.body, { childList: true, subtree: true });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function mainJs() {
    if (document.body.classList.contains(CONFIG.classes.body)) return;
    document.body.classList.add(CONFIG.classes.body);

    render();
    observe();
  }

  waitForElem(`${CONFIG.selectors.buyBox} ${CONFIG.selectors.atcForm}`, mainJs);
})();
