import testInfo from "./info.json" assert { type: "json" };

(() => {
  const PREFIX = "ab-bfcm";

  const VARIANT_IFRAME_URL = {
    "optin-srixon": null, // e.g. "https://cloud.email.dunlopsports.com/optin-srixon-bfcm/"
    "optin-cleveland": null,
    "optin-xxio": null,
    "optin-dunlopracket": null,
  };

  const IMAGE_OVERRIDE = {
    "optin-srixon":
      "https://us.dunlopsports.com/on/demandware.static/-/Sites-DunlopSportsUS-Library/default/dwe6251130/srixon/2026_Q1/Balls_445x762.jpg", // testing image
    "optin-cleveland": null,
    "optin-xxio": null,
    "optin-dunlopracket": null,
  };

  const BUTTON_TEXT = "Be First to Know";
  const IFRAME_DESKTOP_BREAKPOINT = 768; // the iframe's own media query (iframe width, not window width)

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

  function getOptinKey(src) {
    const match = (src || "").match(/cloud\.email\.dunlopsports\.com\/(optin-[^/?#]+)/);
    return match ? match[1] : null;
  }

  function openModal() {
    const $ = window.jQuery;
    if ($ && $.fn && $.fn.modal) {
      $("#newsletter-signup-modal").modal("show");
      return;
    }
    const footerBtn = document.querySelector(".newsletter-signup-button");
    if (footerBtn) footerBtn.click();
  }

  function addStickyButton() {
    if (document.querySelector(`.${PREFIX}-sticky`)) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `${PREFIX}-sticky`;
    btn.setAttribute("aria-haspopup", "dialog");
    btn.setAttribute("aria-controls", "newsletter-signup-modal");
    btn.innerHTML = `<span>${BUTTON_TEXT}</span>`;
    btn.addEventListener("click", openModal);
    document.body.appendChild(btn);
  }

  function updateIframe([iframe]) {
    if (iframe.dataset.abBfcm) return;
    iframe.dataset.abBfcm = "1";

    const key = getOptinKey(iframe.getAttribute("src"));
    if (!key) return;

    const variantUrl = VARIANT_IFRAME_URL[key];
    if (variantUrl) iframe.setAttribute("src", variantUrl);

    const image = IMAGE_OVERRIDE[key];
    if (!image || variantUrl) return; // a variant page already carries its own image

    const wrap = document.createElement("div");
    wrap.className = `${PREFIX}-frame-wrap`;
    iframe.parentNode.insertBefore(wrap, iframe);
    wrap.appendChild(iframe);

    const overlay = document.createElement("div");
    overlay.className = `${PREFIX}-image`;
    overlay.style.backgroundImage = `url("${image}")`;
    wrap.appendChild(overlay);

    // Match the iframe's own layout: image left 45% (>=768px wide) or a top banner (<768px).
    const setLayout = () => {
      const isDesktop = iframe.clientWidth >= IFRAME_DESKTOP_BREAKPOINT;
      wrap.classList.toggle(`${PREFIX}-frame-wrap--desktop`, isDesktop);
    };
    setLayout();
    if (window.ResizeObserver) new ResizeObserver(setLayout).observe(iframe);
    else window.addEventListener("resize", setLayout);
  }

  function mainJs() {
    console.table({ ID: testInfo.id, Variation: testInfo.name });

    addStickyButton();
    // The site injects the iframe shortly after DOMContentLoaded.
    waitForElem("#newsletter-signup-modal .modal-body iframe", updateIframe, 1, false, 20000);
  }

  waitForElem("#newsletter-signup-modal", mainJs);
})();
