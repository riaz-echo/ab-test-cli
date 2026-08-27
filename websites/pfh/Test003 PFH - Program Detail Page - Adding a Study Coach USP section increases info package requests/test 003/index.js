(() => {
    const TEST_CLASS = "ab-t003-v1";
    const PREFIX = "ab-t003";

    const IMAGE_SRC = "https://assets-manager.abtasty.com/8d2a191170a55164917c790c6a928716/account/bildschirmfoto-2026-08-19-um-133422-1.png";

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

    const USP_LIST = [`Du bist keine Matrikelnummer in einer Datenbank, sondern <strong>bekommst einen Study Coach</strong>, der jederzeit an deiner Seite ist. <strong>Mit Durchwahl</strong> - vom ersten Tag bis zur Abschlussprüfung dieselbe Study Coach.`, `<strong>Kein Vertrag, der weiterläuft, wenn dein Leben sich ändert.</strong> Bei Krankheit, Kurzarbeit oder Arbeitslosigkeit kannst du das Zeitmodell wechseln oder den Vertrag anpassen.`, `Deine Frage landet nicht in einer Warteschlange oder bei KI.<br>Die Lehrenden deines Moduls <strong>antworten innerhalb von 48 Stunden</strong>. Nicht irgendwer, nicht irgendwann.`];

    function waitForElem(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== "undefined") ? callback(elements) : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    function buildSection() {
        const section = document.createElement("section");
        section.className = `${PREFIX}__section`;

        section.innerHTML = `
      <div class="${PREFIX}__inner">
        <div class="${PREFIX}__content">
          <div class="${PREFIX}__col ${PREFIX}__col--text">
            <span class="${PREFIX}__eyebrow">${SHIELD_SVG}Was uns wirklich unterscheidet</span>
            <h2 class="${PREFIX}__title">Manche Hochschulen haben Hunderttausende Studierende.<br>Wir kennen unsere mit Namen.</h2>
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
            <img class="${PREFIX}__image" src="${IMAGE_SRC}" alt="Jetzt bis zu 1.650 € Rabatt zum Studienstart sichern" loading="lazy">
          </div>
        </div>
        <div class="${PREFIX}__actions">
          <button type="button" class="${PREFIX}__cta">Infomaterial anfordern <span class="${PREFIX}__cta-arrow">&raquo;</span></button>
        </div>
      </div>
    `;

        return section;
    }

    function insertSection() {
        if (document.querySelector(`.${PREFIX}__section`)) return;

        const hero = document.querySelector(".paragraph--type--hero-banner");
        console.log("hero: ", hero);
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

    function mainJs([body]) {
        console.log("Test003 PFH ");
        body.classList.add(TEST_CLASS);

        waitForElem(".paragraph--type--hero-banner", () => {
            insertSection();
            clickFunction();
        });
    }

    waitForElem("body", mainJs);
})();
