(function () {
  /* ==========================================================================
     PFH-005  —  Landingpages - Reduce content (v-1)
     Hero / seals / fact boxes taken over from PFH-002, single-step info
     package form taken over from PFH-004.
     ========================================================================== */
  const globalVariables = {
    testName: "PFH-005",
    pageInitials: "AB-EXP-PFH-005",
    testVariation: 1,
  };

  function waitForElem(predicate, callback, timer = 15000, frequency = 100) {
    if (timer <= 0) return;
    if (typeof predicate === "function" && predicate()) {
      callback();
    } else {
      setTimeout(
        () => waitForElem(predicate, callback, timer - frequency),
        frequency
      );
    }
  }

  const isMaster = /\/lp\/fernstudium\/master\//i.test(window.location.pathname);

  const faIcon = (name) => `
    <svg class="svg-inline--fa fa-w-16">
      <use xlink:href="/libraries/fontawesome/sprites/light.svg#${name}"></use>
    </svg>
  `;

  const testAssets = {
    starIcon: `<svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.30963 5.55859L9.33209 5.62793H14.9092L10.4561 8.86328L10.3975 8.90625L10.42 8.97559L12.1202 14.2109L7.66705 10.9746L7.60846 10.9316L7.54987 10.9746L3.09576 14.2109L4.79694 8.97559L4.8194 8.90625L4.7608 8.86328L0.307678 5.62793H5.88483L5.90729 5.55859L7.60846 0.322266L9.30963 5.55859Z" fill="#E1FF00" stroke="#FF9C9C" stroke-width="0.2"/>
</svg>
`,
    ctaArrows: `<svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_233_2341)">
<g clip-path="url(#clip1_233_2341)">
<path d="M11.3688 8.26561L6.78127 12.8906C6.6344 13.0375 6.3969 13.0375 6.25002 12.8906L5.63127 12.2719C5.4844 12.125 5.4844 11.8875 5.63127 11.7406L9.3344 7.99999L5.63127 4.25936C5.4844 4.11249 5.4844 3.87499 5.63127 3.72811L6.25002 3.10936C6.3969 2.96249 6.6344 2.96249 6.78127 3.10936L11.3688 7.73436C11.5156 7.88124 11.5156 8.11874 11.3688 8.26561ZM6.36877 7.73436L1.78127 3.10936C1.6344 2.96249 1.3969 2.96249 1.25002 3.10936L0.631274 3.72811C0.484399 3.87499 0.484399 4.11249 0.631274 4.25936L4.3344 7.99999L0.631274 11.7406C0.484399 11.8875 0.484399 12.125 0.631274 12.2719L1.25002 12.8906C1.3969 13.0375 1.6344 13.0375 1.78127 12.8906L6.36877 8.26561C6.51565 8.11874 6.51565 7.88124 6.36877 7.73436Z" fill="white"/>
</g>
</g>
<defs>
<clipPath id="clip0_233_2341">
<rect width="12" height="16" fill="white"/>
</clipPath>
<clipPath id="clip1_233_2341">
<rect width="12" height="16" fill="white"/>
</clipPath>
</defs>
</svg>
`,
    checkMarkIcon: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.3334 5.34998L8.25002 15.1583L3.66669 10.7" stroke="#57AD46" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
  };

  // Hero badge + fact boxes differ between the Bachelor and Master landing pages
  const CONTENT = {
    bachelor: {
      badge: "Ohne NC oder Abitur",
      factBoxes: [
        {
          icon: "user-group", // "user-friends" (PFH-002) is not in the site sprite
          title: "Wir begleiten dich",
          text: `Die Study Coaches sowie die Professor:innen der PFH
            <strong>unterstützen dich ab dem Einstieg in das Fernstudium</strong>
            bis zum erfolgreichen Abschluss. Das Team steht dir
            <strong>jederzeit beratend</strong> zur Seite.`,
        },
        {
          icon: "award",
          title: "Staatlich anerkannt",
          text: `Das Fernstudium der PFH ist voll <strong>akkreditiert</strong> und
            <strong>staatlich anerkannt</strong>. <br/>Als TOP Fernstudienanbieter
            zählen wir zu den <strong>beliebtesten Fernhochschulen</strong> Deutschlands.`,
        },
        {
          icon: "user-check",
          title: "Flexibel &amp; ohne Abitur",
          text: `Lerne wann und wo es in deinen Alltag passt – <strong>ohne NC</strong>
            und ohne Präsenzpflicht. Mit <strong>echten Fallbeispielen</strong>
            aus der Praxis bietet dir das Fernstudium eine
            <strong>besondere Praxisnähe</strong>.`,
        },
      ],
    },
    master: {
      badge: "BAföG-förderungsfähig",
      factBoxes: [
        {
          icon: "shuffle",
          title: "Flexibilität",
          text: `Ort und Ablauf des Studiums sind <strong>frei wählbar</strong>, genauso wie
            <strong>individuelle Vertiefungsmöglichkeiten</strong> im Laufe des Fernstudiums.`,
        },
        {
          icon: "chart-line",
          title: "100% Erfolg",
          text: `Ein ausgezeichnetes und <strong>praxisorientiertes Studium</strong> führt dich
            zum Erfolg – mit <strong>Ansprechpartnern an deiner Seite</strong>.`,
        },
        {
          icon: "shield-check",
          title: "0% Risiko",
          text: `<strong>4 Wochen kostenfreies Probestudium</strong> ohne jegliche Verpflichtungen,
            <strong>vielseitige Betreuung</strong> durch Study Coaches, Professoren und Dozenten.`,
        },
      ],
    },
  };

  const pageContent = isMaster ? CONTENT.master : CONTENT.bachelor;

  const createHeroBannerAfterTitleContentHTML = () => {
    const layout = /* HTML */`
        <div class="hero-banner-body">
            <div class="hero-banner-rating">
                <div class="hero-banner-rating__stars">
                    ${testAssets.starIcon}
                    ${testAssets.starIcon}
                    ${testAssets.starIcon}
                    ${testAssets.starIcon}
                    ${testAssets.starIcon}
                </div>
                <span class="hero-banner-rating__score"><strong>4,6/5 Bewertung</strong></span>
                <p class="hero-banner-rating__source">*Fernstudium Direkt &nbsp;&nbsp; (1582 Bewertungen)</p>
            </div>

            <p class="hero-banner-description">
                Flexibel, staatlich anerkannt und mit persönlicher Betreuung
            </p>

            <a href="#anchor-position--request-information-1"  class="hero-banner-cta">
                Infomaterial anfordern ${testAssets.ctaArrows}
            </a>

            <ul class="hero-banner-trust-list">
                <li class="hero-banner-trust-list__item">
                    ${testAssets.checkMarkIcon} Kostenlos
                </li>
                <li class="hero-banner-trust-list__item">
                    ${testAssets.checkMarkIcon} Unverbindlich
                </li>
                <li class="hero-banner-trust-list__item">
                    ${testAssets.checkMarkIcon} in 2 Minuten
                </li>
            </ul>
        </div>
    `

    return layout;
  }

  const createNewFactBoxSectionHTML = () => {
    const layout = /*HTML */`
    <section class="fact-box-section paragraph paragraph--type--fact-box paragraph--view-mode--default">
      <div class="container clearfix">
      <div class="fact-box-section__container">
        ${pageContent.factBoxes
          .map(
            ({ icon, title, text }) => `
        <div class="fact-box-section__item">
          <div class="fact-box-section__header">
            ${faIcon(icon)}
            <h3 class="fact-box-section__title">${title}</h3>
          </div>
          <p class="fact-box-section__text">
            ${text}
          </p>
        </div>`
          )
          .join("")}
      </div>
      </div>
    </section>
  `;
    return layout;
  };

  const isDeviceMobile = () => window.innerWidth <= 768;

  const addCss = (href) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  };

  const loadScript = (src) =>
    new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });

  if (isDeviceMobile()) {
    addCss('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css');
    addCss('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css');
  }

  const initiateOwlCarousel = async () => {
    if (!window.jQuery) {
      await loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js'
      );
    }

    // Load Owl Carousel
    await loadScript(
      'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js'
    );

    const owlCarouselEl = document.querySelector(
      'div[data-type-anchor="anchor-position--logo-teaser-1"] .field--name-field-logo-image'
    );

    if (!owlCarouselEl) return;

    owlCarouselEl.classList.add('owl-carousel');

    window.jQuery(owlCarouselEl).owlCarousel({
      loop: false,
      margin: 8,
      nav: false,
      dots: false,
      autoplay: false,
      touchDrag: true,
      mouseDrag: true,
      responsiveRefreshRate: 0,
      smartSpeed: 400,       // smoother animation on release
      dragEndSpeed: 300,     // smoother drag release
      fluidSpeed: true,      // fluid drag feel
      pullDrag: true,        // allow over-dragging at edges
      freeDrag: false,
      items: 3,
      stagePadding: 20,
    });
  }

  /* --------------------------------------------------------------------------
     Info package form (PFH-004 design, single step: only the Datenschutz
     checkbox stays — course is preselected + hidden by the LP itself)
     -------------------------------------------------------------------------- */
  const FORM_PREFIX = "ab-t005";
  const FORM_SECTION_SEL = ".paragraph--type--request-information";
  const FORM_SEL = `${FORM_SECTION_SEL} .request-info-inner form`;

  const BROCHURE_FALLBACK = "/sites/default/files/styles/brochure/public/2021-11/infomaterial.png.webp?h=75022471&itok=Plnoxe30";
  const BROCHURE_ALT = "Infobroschüre „Dein Weg – dein Studium“ der PFH";

  const FORM_COPY = {
    headline: "Gewinne Klarheit mit unserem kostenlosen Infopaket",
    subline: "Alles Wichtige verständlich und kompakt für dich zusammengefasst",
    cta: "Jetzt Infopaket sichern",
    required: "* Pflichtfeld",
    secure: "Deine Daten werden sicher übertragen",
  };

  // Visible label above each field + new placeholder (select: the empty option)
  const FIELDS = [
    { key: "course-session", label: "Wann möchtest du voraussichtlich starten?*", placeholder: "Studienstart unverbindlich wählen" },
    { key: "salutation", label: "Anrede*", placeholder: "Anrede" },
    { key: "first-name", label: "Vorname*", placeholder: "Vorname" },
    { key: "last-name", label: "Nachname*", placeholder: "Nachname" },
    { key: "email-address", label: "E-Mail*", placeholder: "E-Mail-Adresse*" },
    { key: "telephone-number", label: "Telefonnummer*", placeholder: "Für eventuelle Rückfragen" },
  ];

  // Line breaks follow the Figma design per breakpoint
  const BENEFITS = {
    desktop: ["Alle Infos zu Studieninhalten,<br>Ablauf und Professor:innen", "Klarheit zu Berufs- und<br>Entwicklungschancen", "Überblick über Finanzierungs-<br>und Förderungsmöglichkeiten"],
    mobile: ["Alle Infos zu Studieninhalten,<br>Ablauf und Professor:innen", "Klarheit zu Berufs- und<br>Entwicklungschancen", "Überblick über Finanzierungs- und<br>Förderungsmöglichkeiten"],
  };

  const formAssets = {
    checkDesktop: `<svg class="${FORM_PREFIX}-benefits__icon" width="40" height="30" viewBox="0 0 40 30" fill="none" aria-hidden="true"><path d="M3 15L14 26L37 3" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    checkMobile: `<svg class="${FORM_PREFIX}-benefits__icon" width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true"><path d="M1.35 7L6.3 11.95L16.65 1.6" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    lock: `<svg class="${FORM_PREFIX}-secure__icon" width="22" height="24" viewBox="0 0 22 24" fill="none" aria-hidden="true"><rect x="2" y="10" width="18" height="12" rx="2" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M6 10V7a5 5 0 0 1 10 0v3" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  };

  const createBenefitsHTML = (variant, brochureSrc) => {
    const check = variant === "desktop" ? formAssets.checkDesktop : formAssets.checkMobile;

    return /* HTML */ `
      <div class="${FORM_PREFIX}-benefits ${FORM_PREFIX}-benefits--${variant}">
        <img class="${FORM_PREFIX}-benefits__brochure" src="${brochureSrc}" alt="${BROCHURE_ALT}" width="313" height="420">
        <ul class="${FORM_PREFIX}-benefits__list">
          ${BENEFITS[variant]
            .map(
              (text) => `
            <li class="${FORM_PREFIX}-benefits__item">
              ${check}<span class="${FORM_PREFIX}-benefits__text">${text}</span>
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

  // Headline + subline (+ benefit box on mobile) wrapped in one intro block
  const applyIntro = (content, brochureSrc) => {
    if (content.querySelector(`.${FORM_PREFIX}-intro`)) return;

    const headline = getOrCreateHeading(content, "request-info-section-headline");
    const subline = getOrCreateHeading(content, "request-info-section-subline");
    headline.textContent = FORM_COPY.headline;
    subline.textContent = FORM_COPY.subline;

    const intro = document.createElement("div");
    intro.className = `${FORM_PREFIX}-intro`;
    intro.append(headline, subline);
    intro.insertAdjacentHTML("beforeend", createBenefitsHTML("mobile", brochureSrc));
    content.insertAdjacentElement("afterbegin", intro);
  };

  // Benefit aside next to the form on desktop
  const applyAside = (section, brochureSrc) => {
    const inner = section.querySelector(".request-info-inner");
    let media = inner.querySelector(".request-info-media-desktop") || inner.querySelector(".request-info-media");
    if (!media) {
      media = document.createElement("div");
      media.className = "request-info-media request-info-media-desktop";
      inner.appendChild(media);
    }
    if (media.querySelector(`.${FORM_PREFIX}-benefits`)) return;

    media.insertAdjacentHTML("beforeend", createBenefitsHTML("desktop", brochureSrc));
  };

  // Idempotent: re-run after Drupal AJAX replaces parts of the form
  const applyForm = (form) => {
    const inner = form.querySelector(".webform-request-info-inner");
    if (!inner) return;

    // Studienstart first
    const courseWrapper = inner.querySelector(".webform-course-list-and-session-wrapper");
    if (courseWrapper && inner.firstElementChild !== courseWrapper) inner.prepend(courseWrapper);

    FIELDS.forEach(({ key, label, placeholder }) => {
      const fieldset = inner.querySelector(`.form-item-${key}`);
      const control = fieldset && fieldset.querySelector("select, input");
      if (!control) return;

      fieldset.classList.add(`${FORM_PREFIX}-field`, `${FORM_PREFIX}-field--${key}`);
      if (!fieldset.querySelector(`.${FORM_PREFIX}-label`)) {
        fieldset.insertAdjacentHTML("afterbegin", `<label class="${FORM_PREFIX}-label" for="${control.id}">${label}</label>`);
      }

      if (control.tagName === "SELECT") {
        const option = control.querySelector('option[value=""]');
        if (option && option.textContent !== placeholder) option.textContent = placeholder;
      } else if (control.getAttribute("placeholder") !== placeholder) {
        control.setAttribute("placeholder", placeholder);
      }
    });

    // Only the visible text changes — the button's value stays, Drupal uses it to detect the trigger
    const button = form.querySelector(".webform-button--submit");
    if (button && !button.hasAttribute(`data-${FORM_PREFIX}`)) {
      button.setAttribute(`data-${FORM_PREFIX}`, "");
      button.textContent = FORM_COPY.cta;
    }

    const actions = inner.querySelector(".actions-wrapper");
    if (actions && !actions.querySelector(`.${FORM_PREFIX}-required`)) {
      actions.insertAdjacentHTML(
        "beforeend",
        /* HTML */ `
          <p class="${FORM_PREFIX}-required">${FORM_COPY.required}</p>
          <p class="${FORM_PREFIX}-secure">${formAssets.lock}<span>${FORM_COPY.secure}</span></p>
        `
      );
    }
  };

  const applyFormSection = (section) => {
    if (!section) return;
    const content = section.querySelector(".request-info-content");
    const form = section.querySelector(".request-info-inner form");
    if (!content || !form) return;

    section.classList.add(FORM_PREFIX);
    const brochureSrc = getBrochureSrc(section);
    applyIntro(content, brochureSrc);
    applyAside(section, brochureSrc);
    applyForm(form);
  };

  let formScheduled = false;
  const runForm = () => {
    formScheduled = false;
    document.querySelectorAll(FORM_SEL).forEach((form) => applyFormSection(form.closest(FORM_SECTION_SEL)));
  };
  const scheduleFormRun = () => {
    if (formScheduled) return;
    formScheduled = true;
    requestAnimationFrame(runForm);
  };

  const initForm = () => {
    runForm();
    new MutationObserver(scheduleFormRun).observe(document.body, { childList: true, subtree: true });
  };

  const init = () => {

    // Modifications in Hero Banner
    const heroBannerContentEl = document.querySelector('.hero-banner-content');
    const heroBannerHeadlineEl = heroBannerContentEl.querySelector('.hero-banner-headline');
    const heroBannerTextEl = document.querySelector('.hero-banner-content .hero-banner-text');

    // "Psychologie Fernstudium, Bachelor" -> "Psychologie" / "Bachelor Fernstudium"
    const headlineMatch = heroBannerHeadlineEl.textContent.trim().match(/^(.+?)\s+Fernstudium,\s*(Bachelor|Master)$/i);
    if (headlineMatch) {
      heroBannerHeadlineEl.replaceChildren(headlineMatch[1], document.createElement('br'), `${headlineMatch[2]} Fernstudium`);
    }

    heroBannerHeadlineEl.insertAdjacentHTML('beforebegin', /* HTML */`
        <div class="hero-banner-badge-wrapper">
            <span class="hero-banner-badge">${pageContent.badge}</span>
        </div>
    `);
    heroBannerHeadlineEl.insertAdjacentHTML('afterend', createHeroBannerAfterTitleContentHTML());

    if(heroBannerTextEl){
      heroBannerHeadlineEl.insertAdjacentElement('afterend',heroBannerTextEl);
    }
    // hanndle hero banner cta click
    document.querySelector('.hero-banner-cta')?.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('#anchor-position--request-information-1')?.classList?.add('change-top-pfh005');
      setTimeout(() => {
        document.querySelector('#anchor-position--request-information-1')?.classList?.remove('change-top-pfh005');
      }, 1000)

      document.querySelector('#anchor-position--request-information-1')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });

    // Auszeichnungen und Akkreditierungen section replace
    const awardsSectionEl = document.querySelector('div[data-type-anchor="anchor-position--logo-teaser-1"]');
    const factBoxSectionEl = document.querySelector('div[data-type-anchor="anchor-position--fact-box-1"]');
    if (awardsSectionEl && factBoxSectionEl) {
      factBoxSectionEl.insertAdjacentElement('beforebegin', awardsSectionEl);
    }

    // Insert new factbox
    if (factBoxSectionEl) {
      const newFactBoxSectionHTML = createNewFactBoxSectionHTML();
      factBoxSectionEl.insertAdjacentHTML('afterend', newFactBoxSectionHTML);
    }

    // Course description (editorial) below the form — every other long-form section is hidden in CSS
    const editorialSectionEl = document.querySelector('div[data-type-anchor="anchor-position--editorial-1"]');
    const formSectionEl = document.querySelector('div[data-type-anchor="anchor-position--request-information-1"]');
    if (editorialSectionEl) {
      formSectionEl.insertAdjacentElement('afterend', editorialSectionEl);
    }

    if (isDeviceMobile()) {
      initiateOwlCarousel();
    }

    initForm();
  };

  const hasAllElements = () => {
    const headerEl = document.querySelector('header#header');
    const heroBannerHeadlineEl = document.querySelector('.hero-banner-content .hero-banner-headline');
    const awardsSectionEl = document.querySelector('div[data-type-anchor="anchor-position--logo-teaser-1"]');
    const factBoxSectionEl = document.querySelector('div[data-type-anchor="anchor-position--fact-box-1"]');
    const formSectionEl = document.querySelector('div[data-type-anchor="anchor-position--request-information-1"]');

    if (headerEl && heroBannerHeadlineEl && awardsSectionEl && factBoxSectionEl && formSectionEl && document.querySelector(FORM_SEL) && document.readyState === 'complete') {
      return true;
    } else {
      return false;
    }
  };

  const pageInitials = globalVariables.pageInitials;

  waitForElem(
    () => document.querySelector(`body:not(.${pageInitials})`) && hasAllElements(),
    () => {
      document.querySelector("body").classList.add(pageInitials);
      init();
    }
  );

})();
