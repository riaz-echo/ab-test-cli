(() => {
    /* ==========================================================================
       PFH-002  —  base test 
       ========================================================================== */
    const globalVariables = {
        testName: "PFH-002",
        pageInitials: "AB-EXP-PFH-002",
        testVariation: 1,
    };

    function waitForElem(predicate, callback, timer = 15000, frequency = 100) {
        if (timer <= 0) return;
        if (typeof predicate === "function" && predicate()) {
            callback();
        } else {
            setTimeout(() => waitForElem(predicate, callback, timer - frequency), frequency);
        }
    }

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
        factBoxIcon_1: `
    <svg class="svg-inline--fa fa-w-16">
    <use xlink:href="/libraries/fontawesome/sprites/light.svg#user-friends"></use>
  </svg>
`,
        factBoxIcon_2: `
<svg class="svg-inline--fa fa-w-16">
    <use xlink:href="/libraries/fontawesome/sprites/light.svg#award"></use>
  </svg>

`,
        factBoxIcon_3: `<svg class="svg-inline--fa fa-w-16">
    <use xlink:href="/libraries/fontawesome/sprites/light.svg#user-check"></use>
  </svg>
`,
    };

    const createHeroBannerAfterTitleContentHTML = () => {
        const layout = /* HTML */ `
            <div class="hero-banner-body">
                <div class="hero-banner-rating">
                    <div class="hero-banner-rating__stars">${testAssets.starIcon} ${testAssets.starIcon} ${testAssets.starIcon} ${testAssets.starIcon} ${testAssets.starIcon}</div>
                    <span class="hero-banner-rating__score"><strong>4,6/5 Bewertung</strong></span>
                    <p class="hero-banner-rating__source">*Fernstudium Direkt &nbsp;&nbsp; (1582 Bewertungen)</p>
                </div>

                <p class="hero-banner-description">Flexibel, staatlich anerkannt und mit persönlicher Betreuung</p>

                <a href="#anchor-position--request-information-1" class="hero-banner-cta">Infomaterial anfordern ${testAssets.ctaArrows}</a>

                <ul class="hero-banner-trust-list">
                    <li class="hero-banner-trust-list__item">${testAssets.checkMarkIcon} Kostenlos</li>
                    <li class="hero-banner-trust-list__item">${testAssets.checkMarkIcon} Unverbindlich</li>
                    <li class="hero-banner-trust-list__item">${testAssets.checkMarkIcon} in 2 Minuten</li>
                </ul>
            </div>
        `;

        return layout;
    };

    const createNewFactBoxSectionHTML = () => {
        const layout = /*HTML */ `
    <section class="fact-box-section paragraph paragraph--type--fact-box paragraph--view-mode--default">
      <div class="container clearfix">
      <div class="fact-box-section__container">

        <div class="fact-box-section__item">
          <div class="fact-box-section__header">
            ${testAssets.factBoxIcon_1}
            <h3 class="fact-box-section__title">Wir begleiten dich</h3>
          </div>
          <p class="fact-box-section__text">
            Die Study Coaches sowie die Professor:innen der PFH
            <strong>unterstützen dich ab dem Einstieg in das Fernstudium</strong>
            bis zum erfolgreichen Abschluss. Das Team steht dir
            <strong>jederzeit beratend</strong> zur Seite.
          </p>
        </div>

        <div class="fact-box-section__item">
          <div class="fact-box-section__header">
            ${testAssets.factBoxIcon_2}
            <h3 class="fact-box-section__title">Staatlich anerkannt</h3>
          </div>
          <p class="fact-box-section__text">
            Das Fernstudium der PFH ist voll <strong>akkreditiert</strong> und
            <strong>staatlich anerkannt</strong>. <br/>Als TOP Fernstudienanbieter
            zählen wir zu den <strong>beliebtesten Fernhochschulen</strong> Deutschlands.
          </p>
        </div>

        <div class="fact-box-section__item">
          <div class="fact-box-section__header">
            ${testAssets.factBoxIcon_3}
            <h3 class="fact-box-section__title">Flexibel &amp; ohne Abitur</h3>
          </div>
          <p class="fact-box-section__text">
            Lerne wann und wo es in deinen Alltag passt – <strong>ohne NC</strong>
            und ohne Präsenzpflicht. Mit <strong>echten Fallbeispielen</strong>
            aus der Praxis bietet dir das Fernstudium eine
            <strong>besondere Praxisnähe</strong>.
          </p>
        </div>

      </div>
      </div>
    </section>
  `;
        return layout;
    };

    const isDeviceMobile = () => window.innerWidth <= 768;

    const addCss = (href) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
    };

    const loadScript = (src) =>
        new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });

    if (isDeviceMobile()) {
        addCss("https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css");
        addCss("https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css");
    }

    const initiateOwlCarousel = async () => {
        if (!window.jQuery) {
            await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js");
        }

        // Load Owl Carousel
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js");

        const owlCarouselEl = document.querySelector('div[data-type-anchor="anchor-position--logo-teaser-1"] .field--name-field-logo-image');

        if (!owlCarouselEl) return;

        owlCarouselEl.classList.add("owl-carousel");

        window.jQuery(owlCarouselEl).owlCarousel({
            loop: false,
            margin: 8,
            nav: false,
            dots: false,
            autoplay: false,
            touchDrag: true,
            mouseDrag: true,
            responsiveRefreshRate: 0,
            stagePadding: 0,
            items: 3, // whole number for snap points
            smartSpeed: 400, // smoother animation on release
            dragEndSpeed: 300, // smoother drag release
            fluidSpeed: true, // fluid drag feel
            pullDrag: true, // allow over-dragging at edges
            freeDrag: false,
            items: 3,
            stagePadding: 20,
        });
    };

    const init = () => {
        // Modifications in Hero Banner
        const heroBannerContentEl = document.querySelector(".hero-banner-content");
        const heroBannerHeadlineEl = heroBannerContentEl.querySelector(".hero-banner-headline");
        const heroBannerTextEl = document.querySelector(".hero-banner-content .hero-banner-text");
        heroBannerHeadlineEl.insertAdjacentHTML(
            "beforebegin",
            /* HTML */ `
                <div class="hero-banner-badge-wrapper">
                    <span class="hero-banner-badge">Ohne NC oder Abitur</span>
                </div>
            `
        );
        heroBannerHeadlineEl.insertAdjacentHTML("afterend", createHeroBannerAfterTitleContentHTML());

        if (heroBannerTextEl) {
            heroBannerHeadlineEl.insertAdjacentElement("afterend", heroBannerTextEl);
        }
        // hanndle hero banner cta click
        document.querySelector(".hero-banner-cta")?.addEventListener("click", (e) => {
            e.preventDefault();
            document.querySelector("#anchor-position--request-information-1")?.classList?.add("change-top-pfh002");
            setTimeout(() => {
                document.querySelector("#anchor-position--request-information-1")?.classList?.remove("change-top-pfh002");
            }, 1000);

            document.querySelector("#anchor-position--request-information-1")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });

        // Auszeichnungen und Akkreditierungen section replace
        const awardsSectionEl = document.querySelector('div[data-type-anchor="anchor-position--logo-teaser-1"]');
        const factBoxSectionEl = document.querySelector('div[data-type-anchor="anchor-position--fact-box-1"]');
        if (awardsSectionEl && factBoxSectionEl) {
            factBoxSectionEl.insertAdjacentElement("beforebegin", awardsSectionEl);
        }

        // Insert new factbox
        if (factBoxSectionEl) {
            const newFactBoxSectionHTML = createNewFactBoxSectionHTML();
            factBoxSectionEl.insertAdjacentHTML("afterend", newFactBoxSectionHTML);
        }

        // Changing position of the editorial section & sommer special section
        const editorialSectionEl = document.querySelector('div[data-type-anchor="anchor-position--editorial-1"]');
        const formSectionEl = document.querySelector('div[data-type-anchor="anchor-position--request-information-1"]');
        const sommerSectionEl = document.querySelector('div[data-type-anchor="anchor-position--text-with-picture-1"]');
        const differenceVideoEl = document.querySelector('div[data-type-anchor="anchor-position--hero-banner-1"] ~ .paragraph--type--video');

        if (differenceVideoEl) {
            formSectionEl.insertAdjacentElement("afterend", differenceVideoEl);
        }
        if (isDeviceMobile()) {
            if (editorialSectionEl) {
                formSectionEl.insertAdjacentElement("afterend", editorialSectionEl);
            }
            if (sommerSectionEl) {
                formSectionEl.insertAdjacentElement("afterend", sommerSectionEl);
            }
        } else {
            if (sommerSectionEl) {
                formSectionEl.insertAdjacentElement("afterend", sommerSectionEl);
            }
            if (editorialSectionEl) {
                formSectionEl.insertAdjacentElement("afterend", editorialSectionEl);
            }
        }

        // hide sections
        const dein_infomaterial_sectionEl = [...document.querySelectorAll('div[data-type-anchor="anchor-position--hero-banner-1"] ~ div.paragraph.paragraph--type--bullet-point-list-in-columns')].find((item) => item.querySelector("h2.bullet-list--headline")?.textContent?.toLowerCase().includes("dein infomaterial - kostenlos & unverbindlich"));

        const dein_weg_in_die_sectionEl = [...document.querySelectorAll('div[data-type-anchor="anchor-position--hero-banner-1"] ~ .paragraph--space-size--half')].find((item) => item.querySelector("h2.bullet-list--headline")?.textContent?.toLowerCase().includes("dein weg in die"));

        if (dein_weg_in_die_sectionEl) {
            dein_weg_in_die_sectionEl.classList.add("hide-item-pfh-002");
        }
        if (dein_infomaterial_sectionEl) {
            dein_infomaterial_sectionEl.classList.add("hide-item-pfh-002");
        }

        // Changes in the study facts block
        const studyFactsSectionEl = document.querySelector('div[data-type-anchor="anchor-position--fact-1"]');
        if (studyFactsSectionEl) {
            [...studyFactsSectionEl.querySelectorAll(".field__items > .field__item")].forEach((item) => {
                const icon = item.querySelector(".fontawesome-icon > svg");
                const headline = item.querySelector(".fact-content > h4.fact-headline");
                headline.insertAdjacentElement("afterbegin", icon.cloneNode(true));
            });
        }
        if (isDeviceMobile()) {
            initiateOwlCarousel();
        }
    };

    const hasAllElements = () => {
        const headerEl = document.querySelector("header#header");
        const heroBannerHeadlineEl = document.querySelector(".hero-banner-content .hero-banner-headline");
        const awardsSectionEl = document.querySelector('div[data-type-anchor="anchor-position--logo-teaser-1"]');
        const factBoxSectionEl = document.querySelector('div[data-type-anchor="anchor-position--fact-box-1"]');
        const formSectionEl = document.querySelector('div[data-type-anchor="anchor-position--request-information-1"]');

        if (headerEl && heroBannerHeadlineEl && awardsSectionEl && factBoxSectionEl && formSectionEl && document.readyState === "complete") {
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

    /* ==========================================================================
       PFH-003  —  Study Coach USP section
       ========================================================================== */
    const TEST_CLASS = "ab-t003-v1";
    const PREFIX = "ab-t003";

    const PC_IMAGE_SRC = "https://www.pfh.de/sites/default/files/images/visuals/pfh-herbstrabatt-fs-visual-desktop.jpg";
    const MOBILE_IMAGE_SRC = "https://www.pfh.de/sites/default/files/images/visuals/pfh-herbstrabatt-fs-visual-mobile.jpg";

    const CHECK_SVG = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<mask id="path-1-inside-1_1404_648" fill="white">
<path d="M18 0L5.625 18L0 9.81818"/>
</mask>
<path d="M19.6481 1.13306C20.2739 0.222846 20.0433 -1.02231 19.1331 -1.64808C18.2228 -2.27385 16.9777 -2.04327 16.3519 -1.13306L18 0L19.6481 1.13306ZM5.625 18L3.97692 19.1331L5.625 21.5303L7.27308 19.1331L5.625 18ZM1.64808 8.68512C1.02231 7.77491 -0.222846 7.54433 -1.13306 8.1701C-2.04327 8.79587 -2.27385 10.041 -1.64808 10.9512L0 9.81818L1.64808 8.68512ZM18 0L16.3519 -1.13306L3.97692 16.8669L5.625 18L7.27308 19.1331L19.6481 1.13306L18 0ZM5.625 18L7.27308 16.8669L1.64808 8.68512L0 9.81818L-1.64808 10.9512L3.97692 19.1331L5.625 18Z" fill="#1D9E75" mask="url(#path-1-inside-1_1404_648)"/>
</svg>
`;

    const SHIELD_SVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.25 2.95703V8C15.25 8.98327 14.8409 9.92604 14.1553 10.8174C13.4686 11.7101 12.5351 12.5101 11.5703 13.1855C10.6094 13.8582 9.64331 14.3898 8.91504 14.7539C8.5519 14.9355 8.24955 15.0742 8.04004 15.167C8.02647 15.173 8.01278 15.178 8 15.1836C7.98722 15.178 7.97353 15.173 7.95996 15.167C7.75045 15.0742 7.4481 14.9355 7.08496 14.7539C6.35669 14.3898 5.39056 13.8582 4.42969 13.1855C3.46486 12.5101 2.53143 11.7101 1.84473 10.8174C1.1591 9.92604 0.75 8.98327 0.75 8V2.95703L8 0.783203L15.25 2.95703Z" stroke="#133B89" stroke-width="1.5" stroke-linecap="round"/>
</svg>
`;

    const CTA_ARROWS_SVG = `<svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.3688 8.26561L6.78127 12.8906C6.6344 13.0375 6.3969 13.0375 6.25002 12.8906L5.63127 12.2719C5.4844 12.125 5.4844 11.8875 5.63127 11.7406L9.3344 7.99999L5.63127 4.25936C5.4844 4.11249 5.4844 3.87499 5.63127 3.72811L6.25002 3.10936C6.3969 2.96249 6.6344 2.96249 6.78127 3.10936L11.3688 7.73436C11.5156 7.88124 11.5156 8.11874 11.3688 8.26561ZM6.36877 7.73436L1.78127 3.10936C1.6344 2.96249 1.3969 2.96249 1.25002 3.10936L0.631274 3.72811C0.484399 3.87499 0.484399 4.11249 0.631274 4.25936L4.3344 7.99999L0.631274 11.7406C0.484399 11.8875 0.484399 12.125 0.631274 12.2719L1.25002 12.8906C1.3969 13.0375 1.6344 13.0375 1.78127 12.8906L6.36877 8.26561C6.51565 8.11874 6.51565 7.88124 6.36877 7.73436Z" fill="white"/>
</svg>
`;

    const USP_LIST = [`Du bist keine Matrikelnummer in einer Datenbank, sondern <strong>bekommst einen Study Coach</strong>, der jederzeit an deiner Seite ist. <strong>Mit Durchwahl</strong> - vom ersten Tag bis zur Abschlussprüfung derselbe Study Coach.`, `<strong>Kein Vertrag, der weiterläuft, wenn dein Leben sich ändert</strong> - im Job, in der Familie oder einfach im Alltag. Du kannst das Zeitmodell wechseln oder den Vertrag ruhen lassen.`, `Deine Frage landet nicht in einer Warteschlange oder bei einer KI.<br><strong>Unser Fachfragen-Team antwortet innerhalb von 48 Stunden.</strong> Nicht irgendwer, nicht irgendwann.`];

    function buildSection() {
        const section = document.createElement("section");
        section.className = `${PREFIX}__section`;

        section.innerHTML = `
      <div class="${PREFIX}__inner">
        <div class="${PREFIX}__content">
          <div class="${PREFIX}__col ${PREFIX}__col--text">
            <span class="${PREFIX}__eyebrow">${SHIELD_SVG}Was uns wirklich unterscheidet</span>
            <h2 class="${PREFIX}__title">Manche Hochschulen haben Hunderttausend Studierende.<br>Wir kennen unsere mit Namen.</h2>
            <ul class="${PREFIX}__list">
              ${USP_LIST.map(
                  (item) => `
                <li class="${PREFIX}__item">
                  <span class="${PREFIX}__check-wrap">${CHECK_SVG}</span>
                  <p class="${PREFIX}__item-text">${item}</p>
                </li>`
              ).join("")}
            </ul>
          </div>
          <div class="${PREFIX}__col ${PREFIX}__col--media">
            <img class="${PREFIX}__image" src="${isDeviceMobile ? MOBILE_IMAGE_SRC : PC_IMAGE_SRC}" alt="Jetzt bis zu 1.650 € Rabatt zum Studienstart sichern" loading="lazy">
          </div>
        </div>
        <div class="${PREFIX}__actions">
          <button type="button" class="${PREFIX}__cta">Infomaterial anfordern <span class="${PREFIX}__cta-arrow">${CTA_ARROWS_SVG}</span></button>
        </div>
      </div>
    `;

        return section;
    }

    function insertSection() {
        if (document.querySelector(`.${PREFIX}__section`)) return;

        const hero = document.querySelector(".paragraph--type--hero-banner");
        if (!hero) return;

        hero.insertAdjacentElement("afterend", buildSection());
    }

    function clickFunction() {
        document.body.addEventListener("click", (e) => {
            if (!e.target.closest(`.${PREFIX}__cta`)) return;

            e.preventDefault();

            const originalCta = document.querySelector(`a.cta-information-material:not(.${PREFIX}__cta)`);
            originalCta && originalCta.click();
        });
    }

    function mainJs() {
        document.body.classList.add(TEST_CLASS);

        waitForElem(
            () => document.querySelector(".paragraph--type--hero-banner"),
            () => {
                insertSection();
                clickFunction();
            }
        );
    }
    waitForElem(() => document.querySelector("body.AB-EXP-PFH-002"), mainJs);
})();
