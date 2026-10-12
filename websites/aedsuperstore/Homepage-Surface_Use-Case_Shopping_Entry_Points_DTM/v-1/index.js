(() => {
  const ANCHOR = ".home-page-content .products-section";
  const PREFIX = "ab-org";

  const ICON_ATTRS =
    'width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"';
  const STROKE = 'stroke="#1E91D6" stroke-width="2" stroke-linecap="round"';

  const ICONS = {
    church: `<svg ${ICON_ATTRS}><path d="M12.4998 11.2503H17.5002M15 8.75044V15.0001M17.5002 26.2494V22.4997C17.5002 21.8367 17.2368 21.2008 16.7679 20.732C16.299 20.2632 15.6631 19.9998 15 19.9998C14.3369 19.9998 13.701 20.2632 13.2321 20.732C12.7632 21.2008 12.4998 21.8367 12.4998 22.4997V26.2494M22.5006 11.2503L26.9009 13.9339C27.0841 14.0454 27.2356 14.2022 27.3407 14.3891C27.4457 14.5761 27.501 14.7869 27.501 15.0013V23.7496C27.501 24.4126 27.2376 25.0484 26.7687 25.5173C26.2998 25.9861 25.6639 26.2494 25.0008 26.2494H4.99919C4.3361 26.2494 3.70016 25.9861 3.23128 25.5173C2.76241 25.0484 2.49899 24.4126 2.49899 23.7496V15.0013C2.49903 14.7869 2.55424 14.5761 2.65933 14.3891C2.76442 14.2022 2.91584 14.0454 3.09904 13.9339L7.49939 11.2503M7.49939 26.25V8.751C7.49928 8.56324 7.54149 8.37787 7.62286 8.20865C7.70423 8.03944 7.82269 7.89072 7.96943 7.77356L14.2199 2.77509C14.4417 2.59809 14.7171 2.50179 15.0008 2.50201C15.2846 2.50224 15.5598 2.59898 15.7813 2.77634L22.0318 7.77606C22.178 7.89308 22.296 8.04145 22.3771 8.2102C22.4583 8.37895 22.5005 8.56377 22.5006 8.751V26.25" ${STROKE}/></svg>`,
    home: `<svg ${ICON_ATTRS}><path d="M18.75 26.249V16.249C18.75 15.9175 18.6183 15.5995 18.3839 15.3651C18.1495 15.1307 17.8315 14.999 17.5 14.999H12.5C12.1685 14.999 11.8505 15.1307 11.6161 15.3651C11.3817 15.5995 11.25 15.9175 11.25 16.249V26.249M3.75 12.4996C3.74991 12.1359 3.82917 11.7766 3.98223 11.4467C4.1353 11.1169 4.3585 10.8243 4.63625 10.5896L13.3862 3.08959C13.8375 2.70823 14.4092 2.49899 15 2.49899C15.5908 2.49899 16.1625 2.70823 16.6138 3.08959L25.3638 10.5896C25.6415 10.8243 25.8647 11.1169 26.0178 11.4467C26.1708 11.7766 26.2501 12.1359 26.25 12.4996V23.7496C26.25 24.4126 25.9866 25.0485 25.5178 25.5174C25.0489 25.9862 24.413 26.2496 23.75 26.2496H6.25C5.58696 26.2496 4.95107 25.9862 4.48223 25.5174C4.01339 25.0485 3.75 24.4126 3.75 23.7496V12.4996Z" ${STROKE}/></svg>`,
    responder: `<svg ${ICON_ATTRS}><rect x="11" y="4" width="8" height="22" rx="2" stroke="#1E91D6" stroke-width="2"/><rect x="4" y="11" width="22" height="8" rx="2" stroke="#1E91D6" stroke-width="2"/></svg>`,
    school: `<svg ${ICON_ATTRS}><path d="M17.5002 26.25V22.5C17.5002 21.837 17.2368 21.2011 16.7679 20.7323C16.2991 20.2634 15.6631 20.0001 15 20.0001C14.3369 20.0001 13.701 20.2634 13.2321 20.7323C12.7632 21.2011 12.4998 21.837 12.4998 22.5V26.25M22.5006 6.25018V26.25M4.99922 7.50011L13.8824 2.76266C14.2295 2.58926 14.6121 2.49899 15 2.49899C15.388 2.49899 15.7706 2.58926 16.1176 2.76266L25.0008 7.50011M7.49942 13.7501L3.09907 16.4338C2.91587 16.5454 2.76445 16.7021 2.65936 16.8891C2.55428 17.076 2.49906 17.2869 2.49902 17.5013V23.75C2.49902 24.4131 2.76244 25.0489 3.23131 25.5178C3.70019 25.9866 4.33613 26.25 4.99922 26.25H25.0008C25.6639 26.25 26.2999 25.9866 26.7687 25.5178C27.2376 25.0489 27.501 24.4131 27.501 23.75V17.5001C27.5008 17.2858 27.4455 17.0752 27.3404 16.8885C27.2353 16.7018 27.084 16.5452 26.901 16.4338L22.5006 13.7501M7.49942 6.25018V26.25M17.5002 11.2501C17.5002 12.6308 16.3808 13.7501 15 13.7501C13.6192 13.7501 12.4998 12.6308 12.4998 11.2501C12.4998 9.86943 13.6192 8.75016 15 8.75016C16.3808 8.75016 17.5002 9.86943 17.5002 11.2501Z" ${STROKE}/></svg>`,
    business: `<svg ${ICON_ATTRS}><defs><clipPath id="${PREFIX}-awning"><rect x="4" y="7.31" width="22" height="5"/></clipPath></defs><g clip-path="url(#${PREFIX}-awning)" stroke="#1E91D6" stroke-width="2"><circle cx="7.75" cy="7.31" r="4"/><circle cx="15.25" cy="7.31" r="4"/><circle cx="22.75" cy="7.31" r="4"/></g><rect x="4" y="6.31" width="22" height="20" rx="2" stroke="#1E91D6" stroke-width="2"/><rect x="10" y="18" width="10" height="8" stroke="#1E91D6" stroke-width="2"/></svg>`,
    aviation: `<svg ${ICON_ATTRS}><path d="M20 13.7504L22.25 24.0004C22.375 24.6254 22.125 25.1254 21.625 25.5004L21 25.7504C20.375 26.0004 19.75 25.8754 19.375 25.3754L15 18.7504L11.25 21.2504V25.0004L10 26.2504L7.5 22.5004L3.75 20.0004L5 18.7504H8.75L11.25 15.0004L4.625 10.6254C4.125 10.2504 4 9.62537 4.25 9.00037L4.625 8.37537C4.875 7.87537 5.375 7.62537 6 7.75037L16.25 10.0004L20.625 5.62537C22.5 3.75037 25 3.12537 26.25 3.75037C26.875 5.00037 26.25 7.50037 24.375 9.37537L20 13.7504Z" ${STROKE}/></svg>`,
    corporations: `<svg ${ICON_ATTRS}><path d="M12.4998 15H17.5002M12.4998 10H17.5002M17.5002 26.25V22.5C17.5002 21.837 17.2368 21.2011 16.7679 20.7322C16.2991 20.2634 15.6631 20 15 20C14.3369 20 13.701 20.2634 13.2321 20.7322C12.7632 21.2011 12.4998 21.837 12.4998 22.5V26.25M7.49942 12.5H4.99922C4.33613 12.5 3.70019 12.7634 3.23131 13.2322C2.76244 13.7011 2.49902 14.337 2.49902 15V23.75C2.49902 24.413 2.76244 25.0489 3.23131 25.5178C3.70019 25.9866 4.33613 26.25 4.99922 26.25H25.0008C25.6639 26.25 26.2999 25.9866 26.7687 25.5178C27.2376 25.0489 27.501 24.413 27.501 23.75V11.25C27.501 10.587 27.2376 9.95107 26.7687 9.48223C26.2999 9.01339 25.6639 8.75 25.0008 8.75H22.5006M7.49942 26.25V6.25C7.49942 5.58696 7.76284 4.95107 8.23172 4.48223C8.70059 4.01339 9.33653 3.75 9.99962 3.75H20.0004C20.6635 3.75 21.2995 4.01339 21.7683 4.48223C22.2372 4.95107 22.5006 5.58696 22.5006 6.25V26.25" ${STROKE}/></svg>`,
    sports: `<svg ${ICON_ATTRS}><path d="M12.9163 17.0073V18.6165C12.9124 18.9556 12.8168 19.2881 12.6388 19.582C12.4607 19.8759 12.2062 20.1214 11.8995 20.2951C11.2485 20.7531 10.7189 21.3491 10.3529 22.0356C9.98683 22.7222 9.79438 23.4803 9.79083 24.2499M17.0837 17.0073V18.6165C17.0876 18.9556 17.1832 19.2881 17.3612 19.582C17.5393 19.8759 17.7938 20.1214 18.1005 20.2951C18.7515 20.7531 19.2811 21.3491 19.6471 22.0356C20.0132 22.7222 20.2056 23.4803 20.2092 24.2499M21.251 11.4054H22.8137C23.5045 11.4054 24.167 11.1447 24.6555 10.6807C25.1439 10.2167 25.4183 9.58733 25.4183 8.93112C25.4183 8.2749 25.1439 7.64556 24.6555 7.18155C24.167 6.71754 23.5045 6.45686 22.8137 6.45686H21.251M21.251 11.4054C21.251 12.9803 20.5924 14.4907 19.4201 15.6043C18.2478 16.718 16.6579 17.3436 15 17.3436C13.3421 17.3436 11.7522 16.718 10.5799 15.6043C9.40758 14.4907 8.749 12.9803 8.749 11.4054M21.251 11.4054V5.46715C21.251 5.20467 21.1412 4.95293 20.9459 4.76733C20.7505 4.58172 20.4855 4.47745 20.2092 4.47745H9.79083C9.51452 4.47745 9.24953 4.58172 9.05414 4.76733C8.85876 4.95293 8.749 5.20467 8.749 5.46715V11.4054M8.749 11.4054H7.18625C6.49547 11.4054 5.83298 11.1447 5.34453 10.6807C4.85608 10.2167 4.58167 9.58733 4.58167 8.93112C4.58167 8.2749 4.85608 7.64556 5.34453 7.18155C5.83298 6.71754 6.49547 6.45686 7.18625 6.45686H8.749M6.66533 24.2715H23.3347" ${STROKE}/></svg>`,
  };

  const CHEVRON = `<svg class="${PREFIX}__chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M1 1l4 4 4-4" stroke="#0D21A1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const BASE = "https://www.aedsuperstore.com";
  const CATEGORIES = [
    { key: "business", label: "Business", href: `${BASE}/small-business-value-packages.html` },
    { key: "school", label: "School", href: `${BASE}/school-and-community-value-packages.html` },
    { key: "church", label: "Church", href: `${BASE}/church-worship-value-packages.html` },
    { key: "sports", label: "Sports", href: `${BASE}/sports-value-packages.html` },
    { key: "home", label: "Home", href: `${BASE}/home-value-packages.html` },
    { key: "responder", label: "Responder", href: `${BASE}/mobile-responder-value-packages.html` },
    { key: "aviation", label: "Aviation", href: `${BASE}/aviation-value-packages.html` },
    { key: "corporations", label: "Corporations", href: `${BASE}/corporate-value-packages.html` },
  ];
  const VISIBLE_ON_MOBILE = 4;

  const TEXT = {
    title: "Shop by Organization",
    more: "Show More Categories",
    less: "Show Less Categories",
  };

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

  function tileHtml({ key, label, href }) {
    return `
      <a class="${PREFIX}__tile" href="${href}" data-org="${key}">
        <span class="${PREFIX}__icon">${ICONS[key]}</span>
        <span class="${PREFIX}__label">${label}</span>
      </a>`;
  }

  function sectionHtml() {
    const primary = CATEGORIES.slice(0, VISIBLE_ON_MOBILE).map(tileHtml).join("");
    const extra = CATEGORIES.slice(VISIBLE_ON_MOBILE).map(tileHtml).join("");

    return `
      <section class="${PREFIX}" aria-labelledby="${PREFIX}-title">
        <div class="container ${PREFIX}__container">
          <h2 class="${PREFIX}__title" id="${PREFIX}-title">${TEXT.title}</h2>
          <div class="${PREFIX}__grid">${primary}</div>
          <div class="${PREFIX}__more" id="${PREFIX}-more">
            <div class="${PREFIX}__more-inner">
              <div class="${PREFIX}__grid">${extra}</div>
            </div>
          </div>
          <button type="button" class="${PREFIX}__toggle" aria-expanded="false" aria-controls="${PREFIX}-more">
            <span class="${PREFIX}__toggle-text">${TEXT.more}</span>${CHEVRON}
          </button>
        </div>
      </section>`;
  }

  function bindToggle(section) {
    const toggle = section.querySelector(`.${PREFIX}__toggle`);
    const toggleText = toggle.querySelector(`.${PREFIX}__toggle-text`);

    toggle.addEventListener("click", () => {
      const expanded = !section.classList.contains("is-expanded");
      section.classList.toggle("is-expanded", expanded);
      toggle.setAttribute("aria-expanded", String(expanded));
      toggleText.textContent = expanded ? TEXT.less : TEXT.more;
    });
  }

  function mainJs([anchor]) {
    if (document.querySelector(`.${PREFIX}`)) return;

    anchor.insertAdjacentHTML("beforebegin", sectionHtml());
    bindToggle(document.querySelector(`.${PREFIX}`));
    document.body.classList.add(`${PREFIX}-ready`);
  }

  waitForElem(ANCHOR, mainJs);
})();
