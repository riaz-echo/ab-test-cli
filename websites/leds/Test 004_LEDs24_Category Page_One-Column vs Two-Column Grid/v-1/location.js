/**
 * Return true, if the page is part of the targeting rules
 * and false if they are not.
 * Optionally return a Promise, which resolves to true or false.
 */
async function waitForElementAsync(predicate, timeout = 10000, frequency = 50) {
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

return waitForElementAsync(() => window.dfPageType == "category")
    .then(() => true)

    .catch(() => false);
