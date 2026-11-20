(() => {
  const TEST_CLASS = "ab-t006-v1";
  const PREFIX = "ab-t006";
  const SECTION_SEL = ".paragraph--type--request-information";
  const FORM_SEL = `${SECTION_SEL} .request-info-inner form`;
  const PRIVACY_HREF = "/pfh/site/privacy-policy";

  const COPY = {
    consent:
      "Ich bin damit einverstanden, persönliche Studientipps und exklusive Angebote per E-Mail, Telefon oder WhatsApp zu erhalten – plus 4&nbsp;Wochen E-Campus gratis. Abmeldung jederzeit möglich. *",
    notePrefix: "Mit dem Absenden bestätigst du die ",
    noteSuffix: ".",
  };

  const LINKED_CONSENTS = ["whatsapp_consent", "request_test_access"];
  const MERGED_WRAPPERS = [".webform-whatsapp-wrapper", ".webform-request-test-access-wrapper"];

  function waitForElem(predicate, callback, timer = 15000, frequency = 100) {
    if (timer <= 0) return;
    if (predicate()) {
      callback();
    } else {
      setTimeout(() => waitForElem(predicate, callback, timer - frequency), frequency);
    }
  }

  const isShown = (el) => !!el && el.getClientRects().length > 0;

  const createPrivacyLink = () => {
    const wrapper = document.createElement("span");
    wrapper.className = "ajax-wrapper";
    wrapper.innerHTML = `<a class="use-ajax privacy-policy-link" data-dialog-options='{"width":950, "dialogClass": "privacy-policy-dialog"}' data-dialog-type="modal" href="${PRIVACY_HREF}">Hinweise zum Datenschutz</a>`;
    return wrapper;
  };

  const syncConsents = (form) => {
    const consent = form.querySelector('input[name="datenschutz"]');
    if (!consent) return;

    LINKED_CONSENTS.forEach((name) => {
      const input = form.querySelector(`input[name="${name}"]`);
      if (!input) return;
      const checked = consent.checked && isShown(input.closest(".js-form-item"));
      if (input.checked !== checked) input.checked = checked;
    });
  };

  const applyConsent = (inner) => {
    MERGED_WRAPPERS.forEach((sel) => {
      const wrapper = inner.querySelector(`:scope > ${sel}`);
      if (!wrapper || wrapper.classList.contains(`${PREFIX}-merged`)) return;
      wrapper.classList.add(`${PREFIX}-merged`);
      wrapper.setAttribute("aria-hidden", "true");
      wrapper.querySelectorAll("input").forEach((input) => input.setAttribute("tabindex", "-1"));
    });

    const wrapper = inner.querySelector(":scope > .webform-datenschutz-wrapper");
    const item = wrapper && wrapper.querySelector(".form-item-datenschutz");
    const label = item && item.querySelector(".form-check-label");
    if (!label) return null;

    const post = inner.querySelector(":scope > .webform-receive-info-package-wrapper");
    const hasPost = isShown(post);
    if (post) post.classList.toggle(`${PREFIX}-post`, hasPost);
    wrapper.classList.add(`${PREFIX}-consent`);
    wrapper.classList.toggle(`${PREFIX}-consent--divider`, hasPost);

    let link = null;
    if (!label.hasAttribute(`data-${PREFIX}`)) {
      link = label.querySelector(".ajax-wrapper") || label.querySelector(".privacy-policy-link");
      if (link) link.remove();
      label.setAttribute(`data-${PREFIX}`, "");
      label.innerHTML = COPY.consent;
      item.classList.remove("form-switch");
    }
    return link;
  };

  const applyActions = (inner, link) => {
    const actions = inner.querySelector(":scope > .actions-wrapper");
    if (!actions) return;
    actions.classList.add(`${PREFIX}-actions`);

    if (actions.querySelector(`.${PREFIX}-note`)) return;

    const note = document.createElement("p");
    note.className = `${PREFIX}-note`;
    note.append(COPY.notePrefix, link || createPrivacyLink(), COPY.noteSuffix);
    actions.appendChild(note);

    if (!link && window.Drupal && typeof window.Drupal.attachBehaviors === "function") {
      window.Drupal.attachBehaviors(note, window.drupalSettings);
    }
  };

  const applyForm = (form) => {
    const inner = form.querySelector(".webform-request-info-inner");
    if (!inner) return;

    form.classList.add(PREFIX);
    const link = applyConsent(inner);
    applyActions(inner, link);
    syncConsents(form);
  };

  const getForms = () => [...document.querySelectorAll(FORM_SEL)].filter((form) => form.querySelector('input[name="datenschutz"]'));

  let scheduled = false;
  const run = () => {
    scheduled = false;
    getForms().forEach(applyForm);
  };
  const scheduleRun = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(run);
  };

  const onChange = (e) => {
    const form = e.target.closest && e.target.closest(`form.${PREFIX}`);
    if (form) syncConsents(form);
  };

  waitForElem(
    () => document.querySelector(`body:not(.${TEST_CLASS})`) && getForms().length > 0,
    () => {
      document.body.classList.add(TEST_CLASS);
      run();
      document.addEventListener("change", onChange);
      document.addEventListener("mousedown", onChange, true);
      document.addEventListener("keydown", onChange, true);
      new MutationObserver(scheduleRun).observe(document.body, { childList: true, subtree: true });
    }
  );
})();
