(() => {
  const TEST_CLASS = "ab-t004-v1";
  const PREFIX = "ab-t004";
  const SECTION_SEL = ".paragraph--type--request-information";
  const FORM_SEL = `${SECTION_SEL} .request-info-inner form`;

  const BROCHURE_FALLBACK = "/sites/default/files/styles/brochure/public/2021-08/brochure.png.webp?h=795e9ced&itok=nF4VGaj6";
  const BROCHURE_ALT = "Infobroschüre „Dein Weg – dein Studium“ der PFH";

  function waitForElem(predicate, callback, timer = 15000, frequency = 100) {
    if (timer <= 0) return;
    if (typeof predicate === "function" && predicate()) {
      callback();
    } else {
      setTimeout(() => waitForElem(predicate, callback, timer - frequency), frequency);
    }
  }

  const COPY = {
    headline: "Dein Infopaket mit allen Infos und exklusiven Rabatten",
    subline: "Alles Wichtige verständlich und kompakt für dich zusammengefasst",
    cta: "Jetzt Infopaket sichern",
    required: "* Pflichtfeld",
    secure: "Deine Daten werden sicher übertragen",
  };

  const FIELDS = [
    { key: "course", label: "Für welchen Studiengang interessierst du dich?*", placeholder: "Für welchen Studiengang interessierst du dich?" },
    { key: "course-session", label: "Wann möchtest du voraussichtlich starten?*", placeholder: "Studienstart unverbindlich wählen" },
    { key: "salutation", label: "Anrede*", placeholder: "Anrede" },
    { key: "first-name", label: "Vorname*", placeholder: "Vorname" },
    { key: "last-name", label: "Nachname*", placeholder: "Nachname" },
    { key: "email-address", label: "E-Mail*", placeholder: "E-Mail-Adresse*" },
    { key: "telephone-number", label: "Telefonnummer*", placeholder: "Für eventuelle Rückfragen" },
  ];

  const STUDY_TYPE_LABEL = "Studienart*";

  const SWITCHES = [
    { key: "receive-information-package", label: "Infopaket auch per Post erhalten" },
    { key: "request-test-access", label: "E-Campus 4 Wochen kostenfrei und unverbindlich testen." },
  ];

  const ACCENT = `<span class="${PREFIX}-benefits__accent">+10&nbsp;% Extrarabatt</span>`;

  const BENEFITS = {
    desktop: ["Alle Infos zu Studieninhalten,<br>Ablauf und Professor:innen", "Klarheit zu Berufs- und<br>Entwicklungschancen", "Überblick über Finanzierungs-<br>und Förderungsmöglichkeiten", `${ACCENT} auf<br>dein Studium – nur hier`],
    mobile: ["Alle Infos zu Studieninhalten,<br>Ablauf und Professor:innen", "Klarheit zu Berufs- und<br>Entwicklungschancen", "Überblick über Finanzierungs- und<br>Förderungsmöglichkeiten", `${ACCENT} auf dein<br>Studium – nur hier`],
  };

  const testAssets = {
    checkDesktop: `<svg class="${PREFIX}-benefits__icon" width="40" height="30" viewBox="0 0 40 30" fill="none" aria-hidden="true"><path d="M3 15L14 26L37 3" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    checkMobile: `<svg class="${PREFIX}-benefits__icon" width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true"><path d="M1.35 7L6.3 11.95L16.65 1.6" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    lock: `<svg class="${PREFIX}-secure__icon" width="22" height="24" viewBox="0 0 22 24" fill="none" aria-hidden="true"><rect x="2" y="10" width="18" height="12" rx="2" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M6 10V7a5 5 0 0 1 10 0v3" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  };

  const createBenefitsHTML = (variant, brochureSrc) => {
    const check = variant === "desktop" ? testAssets.checkDesktop : testAssets.checkMobile;
    const items = BENEFITS[variant];
    const last = items.length - 1;

    return `
      <div class="${PREFIX}-benefits ${PREFIX}-benefits--${variant}">
        <img class="${PREFIX}-benefits__brochure" src="${brochureSrc}" alt="${BROCHURE_ALT}" width="313" height="420">
        <div class="${PREFIX}-badge" role="img" aria-label="Plus 10 Prozent Extrarabatt">
          <span class="${PREFIX}-badge__value" aria-hidden="true">+10&nbsp;%</span>
          <span class="${PREFIX}-badge__text" aria-hidden="true">Extrarabatt</span>
        </div>
        <ul class="${PREFIX}-benefits__list">
          ${items
            .map(
              (text, i) => `
            <li class="${PREFIX}-benefits__item${i === last ? ` ${PREFIX}-benefits__item--accent` : ""}">
              ${check}<span class="${PREFIX}-benefits__text">${text}</span>
            </li>`
            )
            .join("")}
        </ul>
      </div>
    `;
  };

  const getBrochureSrc = (section) => {
    const img = section.querySelector(".brochure-image");
    return (img && (img.currentSrc || img.getAttribute("src"))) || BROCHURE_FALLBACK;
  };

  const getOrCreateHeading = (content, className) => {
    let el = content.querySelector(`.${className}`);
    if (!el) {
      el = document.createElement("h2");
      el.className = className;
    }
    return el;
  };

  const applyIntro = (content, brochureSrc) => {
    if (content.querySelector(`.${PREFIX}-intro`)) return;

    const headline = getOrCreateHeading(content, "request-info-section-headline");
    const subline = getOrCreateHeading(content, "request-info-section-subline");
    headline.textContent = COPY.headline;
    subline.textContent = COPY.subline;

    const intro = document.createElement("div");
    intro.className = `${PREFIX}-intro`;
    intro.append(headline, subline);
    intro.insertAdjacentHTML("beforeend", createBenefitsHTML("mobile", brochureSrc));
    content.insertAdjacentElement("afterbegin", intro);
  };

  const applyAside = (section, brochureSrc) => {
    const inner = section.querySelector(".request-info-inner");
    let media = inner.querySelector(".request-info-media-desktop") || inner.querySelector(".request-info-media");
    if (!media) {
      media = document.createElement("div");
      media.className = "request-info-media request-info-media-desktop";
      inner.appendChild(media);
    }
    if (media.querySelector(`.${PREFIX}-benefits`)) return;

    media.insertAdjacentHTML("beforeend", createBenefitsHTML("desktop", brochureSrc));
  };

  const applyForm = (form) => {
    const inner = form.querySelector(".webform-request-info-inner");
    if (!inner) return;

    const studyType = inner.querySelector(".webform-study-type-wrapper .radios--wrapper");
    if (studyType) {
      if (!studyType.querySelector(`.${PREFIX}-label`)) {
        studyType.insertAdjacentHTML("afterbegin", `<span class="${PREFIX}-label">${STUDY_TYPE_LABEL}</span>`);
      }
    } else {
      const courseWrapper = inner.querySelector(".webform-course-list-and-session-wrapper");
      if (courseWrapper && inner.firstElementChild !== courseWrapper) inner.prepend(courseWrapper);
    }

    FIELDS.forEach(({ key, label, placeholder }) => {
      const fieldset = inner.querySelector(`.form-item-${key}`);
      const control = fieldset && fieldset.querySelector("select, input");
      if (!control) return;

      fieldset.classList.add(`${PREFIX}-field`, `${PREFIX}-field--${key}`);
      if (!fieldset.querySelector(`.${PREFIX}-label`)) {
        fieldset.insertAdjacentHTML("afterbegin", `<label class="${PREFIX}-label" for="${control.id}">${label}</label>`);
      }

      if (control.tagName === "SELECT") {
        const option = control.querySelector('option[value=""]');
        if (option && option.textContent !== placeholder) option.textContent = placeholder;
      } else if (control.getAttribute("placeholder") !== placeholder) {
        control.setAttribute("placeholder", placeholder);
      }
    });

    SWITCHES.forEach(({ key, label }) => {
      const labelEl = inner.querySelector(`.form-item-${key} .form-check-label`);
      if (labelEl && labelEl.textContent.trim() !== label) labelEl.textContent = label;
    });

    const button = form.querySelector(".webform-button--submit");
    if (button && !button.hasAttribute(`data-${PREFIX}`)) {
      button.setAttribute(`data-${PREFIX}`, "");
      button.textContent = COPY.cta;
    }

    const actions = inner.querySelector(".actions-wrapper");
    if (actions && !actions.querySelector(`.${PREFIX}-required`)) {
      actions.insertAdjacentHTML(
        "beforeend",
        `
          <p class="${PREFIX}-required">${COPY.required}</p>
          <p class="${PREFIX}-secure">${testAssets.lock}<span>${COPY.secure}</span></p>
        `
      );
    }
  };

  const applySection = (section) => {
    if (!section) return;
    const content = section.querySelector(".request-info-content");
    const form = section.querySelector(".request-info-inner form");
    if (!content || !form) return;

    section.classList.add(PREFIX);
    const brochureSrc = getBrochureSrc(section);
    applyIntro(content, brochureSrc);
    applyAside(section, brochureSrc);
    applyForm(form);
  };

  const isInfopaketSection = (section) =>
    !!section && (section.classList.contains(PREFIX) || /infopaket/i.test(section.querySelector(".request-info-section-headline")?.textContent || ""));

  const getInfopaketSections = () => [...document.querySelectorAll(FORM_SEL)].map((form) => form.closest(SECTION_SEL)).filter(isInfopaketSection);

  let scheduled = false;
  const run = () => {
    scheduled = false;
    getInfopaketSections().forEach(applySection);
  };
  const scheduleRun = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(run);
  };

  waitForElem(
    () => document.querySelector(`body:not(.${TEST_CLASS})`) && getInfopaketSections().length > 0,
    () => {
      document.body.classList.add(TEST_CLASS);
      run();
      new MutationObserver(scheduleRun).observe(document.body, { childList: true, subtree: true });
    }
  );
})();
