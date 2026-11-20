(async () => {
    const TEST_CONFIG = {
        client: "Converted",
        project: "One Day Test",
        site_url: "https://onedaytests.com",
        test_name: "ODT032 - Membership page: plan comparison and membership details above the plan cards",
        page_initials: "AB-ODT032",
        test_variation: 1,
        test_version: 0.0003,
    };

    const { page_initials, test_variation, test_version } = TEST_CONFIG;

    const DATA = {
        plans: [
            {
                id: "performance_plan",
                radioValue: "Performance Plan",
                name: "PERFORMANCE",
                tests: "2 x Ultimate Performance blood tests a year",
                description: "59 biomarkers + vitals in each test",
                pricePerYear: 349,
                pricePerMonth: 29,
                savingText: "Save £291 vs buying separately",
                ctaLabel: "Select performance",
                isPopular: false,
            },
            {
                id: "longevity_plan",
                radioValue: "Longevity Plan",
                name: "LONGEVITY",
                tests: "2 x Ultimate Longevity blood tests a year",
                description: "74 biomarkers + vitals in each test. Adds Lp(a), ApoA/B, homocysteine and more.",
                pricePerYear: 499,
                pricePerMonth: 42,
                savingText: "Save £380 vs buying separately",
                ctaLabel: "Select longevity",
                isPopular: true,
            },
        ],
        includes: ["2 clinic appointments", "2 online GP consultations", "2 BMI and blood pressure checks", "10% off any other test"],
        steps: [
            { title: "Pick a plan and billing period.", text: "Pay upfront for 12 or 6 months." },
            { title: "Get your codes by email straight away.", text: "100% discount codes for everything in your plan." },
            { title: "Book whenever suits you.", text: "Tests, clinic visits and GP calls, in any order, within your plan period." },
        ],
        trust: ["In-house UKAS-accredited lab", "Approved NHS pathology supplier", "CQC regulated", "40+ of our own clinics, not outsourced"],
    };

    const ASSETS = {
        check_svg: /* HTML */ `
            <svg class="ab-odt032-include__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 10.5L7.5 15L17 5.5" stroke="#3C9342" stroke-width="2.55" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        `,
    };

    // Existing "DIRECT-TO-LAB HEALTH MONITORING" slideshow hero (.slideshow-slide__image-wrapper) - the test replaces it
    const HERO_SECTION = '#site-main > .slideshow--section[id*="sp_dynamic_slideshow_h1"]';

    async function waitForElementAsync(predicate, timeout = 20000, frequency = 150) {
        const startTime = Date.now();

        return new Promise((resolve, reject) => {
            if (typeof predicate === "function" && predicate()) {
                return resolve(true);
            }

            const interval = setInterval(() => {
                const elapsed = Date.now() - startTime;

                if (elapsed >= timeout) {
                    clearInterval(interval);
                    return reject(new Error(`Timeout of ${timeout}ms reached while waiting for condition: ${predicate.toString()}`));
                }

                if (typeof predicate === "function" && predicate()) {
                    clearInterval(interval);
                    return resolve(true);
                }
            }, frequency);
        });
    }

    function q(s, o) {
        return o ? s.querySelector(o) : document.querySelector(s);
    }

    function qq(s, o) {
        return o ? [...s.querySelectorAll(o)] : [...document.querySelectorAll(s)];
    }

    function planCardTemplate({ id, name, tests, description, pricePerYear, pricePerMonth, savingText, ctaLabel, isPopular }) {
        return /* HTML */ `
            <div class="ab-odt032-plan${isPopular ? " ab-odt032-plan--popular" : ""}">
                ${isPopular ? `<div class="ab-odt032-plan__badge">MOST POPULAR</div>` : ""}
                <div class="ab-odt032-plan__top">
                    <h3 class="ab-odt032-plan__name">${name}</h3>
                    <div class="ab-odt032-plan__tests">${tests}</div>
                    <div class="ab-odt032-plan__desc">${description}</div>
                </div>
                <div class="ab-odt032-plan__price">
                    <div class="ab-odt032-plan__amount">£${pricePerYear}<small> / year</small></div>
                    <div class="ab-odt032-plan__period">Equivalent to £${pricePerMonth} / month, paid upfront</div>
                    <div class="ab-odt032-plan__saving">✓ ${savingText}</div>
                </div>
                <div class="ab-odt032-plan__cta" role="button" tabindex="0" data-plan="${id}">${ctaLabel}</div>
            </div>
        `;
    }

    function topBlockTemplate() {
        return /* HTML */ `
            <div class="ab-odt032">
                <section class="ab-odt032-hero">
                    <div class="ab-odt032-container">
                        <h1 class="ab-odt032-hero__title">DIRECT-TO-LAB <span>HEALTH MONITORING</span></h1>
                        <p class="ab-odt032-hero__subtitle">
                            Two lab blood tests a year, GP and clinic appointments, and 10% off any other test. Paid upfront, booked whenever suits you.
                        </p>
                        <h2 class="ab-odt032-heading">CHOOSE YOUR PLAN</h2>
                        <div class="ab-odt032-plans">${DATA.plans.map(planCardTemplate).join("")}</div>
                    </div>
                </section>

                <section class="ab-odt032-terms">
                    <div class="ab-odt032-container">
                        <div class="ab-odt032-terms__title">BOTH PLANS INCLUDE, PER YEAR:</div>
                        <ul class="ab-odt032-includes">
                            ${DATA.includes.map((text) => `<li class="ab-odt032-include">${ASSETS.check_svg}<span>${text}</span></li>`).join("")}
                        </ul>
                        <p class="ab-odt032-terms__text">
                            <strong>Billed upfront every 12 or 6 months - you choose below.</strong>
                            Renews automatically unless you cancel. Cancel any time in your account: no minimum term, and your benefits stay active until
                            your next billing date.
                        </p>
                    </div>
                </section>

                <section class="ab-odt032-how">
                    <div class="ab-odt032-container">
                        <h2 class="ab-odt032-heading">HOW YOUR MEMBERSHIP <span>WORKS</span></h2>
                        <div class="ab-odt032-steps">
                            ${DATA.steps
                                .map(
                                    ({ title, text }, index) => /* HTML */ `
                                        <div class="ab-odt032-step">
                                            <div class="ab-odt032-step__number">${index + 1}</div>
                                            <div class="ab-odt032-step__content">
                                                <div class="ab-odt032-step__title">${title}</div>
                                                <div class="ab-odt032-step__text">${text}</div>
                                            </div>
                                        </div>
                                    `,
                                )
                                .join("")}
                        </div>
                        <ul class="ab-odt032-trust">${DATA.trust.map((text) => `<li>${text}</li>`).join("")}</ul>
                    </div>
                </section>
            </div>
        `;
    }

    function selectPlan(planId) {
        const plan = DATA.plans.find((item) => item.id === planId);
        if (!plan) return;

        q(`.odt-radio-button__label input[value="${plan.radioValue}"]`)?.click();

        q(".shopify-section.product--section .product-details")?.scrollIntoView({
            behavior: "smooth",
            block: window.innerWidth < 901 ? "start" : "center",
        });
    }

    function init() {
        if (window[page_initials] === true) return;
        q("body").classList.add(page_initials, `${page_initials}--v${test_variation}`, `${page_initials}--version:${test_version}`);
        window[page_initials] = true;

        // New design takes the place of the old slideshow hero
        const heroSection = q(HERO_SECTION);
        heroSection.insertAdjacentHTML("afterend", topBlockTemplate());
        heroSection.classList.add("ab-odt032-hidden");

        qq(".ab-odt032-plan__cta").forEach((cta) => {
            cta.addEventListener("click", () => selectPlan(cta.dataset.plan));
            cta.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    selectPlan(cta.dataset.plan);
                }
            });
        });
    }

    function checkForItems() {
        return !!(q(`body:not(.${page_initials}):not(.${page_initials}--v${test_variation})`) && q(HERO_SECTION));
    }

    try {
        // Fast polling: this test changes the top of the page, so apply it as early as possible
        await waitForElementAsync(checkForItems, 20000, 25);
        init();
    } catch (error) {
        return false;
    }
})();
