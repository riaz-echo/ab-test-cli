(() => {
    function waitForElem(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== "undefined") ? callback(elements) : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    const NEW_TEXT = "Hormones · thyroid · heart and cholesterol · vitamin D, B12 and folate · iron · liver · kidney · blood sugar · inflammation";

    function changeText(wrapper) {
        const paragraphs = [...wrapper.querySelectorAll(":scope > p")].filter((p) => p.textContent.trim());
        const trustLine = paragraphs[paragraphs.length - 1];
        if (!trustLine) return;

        trustLine.textContent = NEW_TEXT;
        trustLine.classList.add("odt106v2__coverage-line");
    }

    function mainJs([wrapper]) {
        const body = document.body;
        if (body.classList.contains("odt106v2")) return;
        body.classList.add("odt106v2");
        changeText(wrapper);
    }

    waitForElem(".key-details__wrapper", mainJs);
})();
