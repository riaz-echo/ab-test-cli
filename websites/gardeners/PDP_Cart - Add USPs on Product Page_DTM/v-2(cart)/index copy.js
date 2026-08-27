(() => {
    const TEST_ID = "PDP_USP";
    const VARIANT_ID = "V2";

    const BODY_CLASS = "ab--cart-usp";
    const USP_CLASS = "ab--usp-bar";

    const PLACEMENTS = [
        {
            name: "side-cart",
            modifier: "ab--usp-bar--side-cart",
            targets: [".quick-cart__main-content", ".quick-cart_main_content", ".quick-cart__item-container"],
            position: "afterbegin",
            watches: [".quick-cart__item", ".quick-cart_item", ".quick-cart__main-content"],
        },
        {
            name: "cart-page",
            modifier: "ab--usp-bar--cart-page",
            targets: [".cart__footer-inner", ".cart__footer-wrapper .cart__container", ".cart__footer .cart__container", ".cart__footer"],
            position: "afterend",
            watches: [".cart__form-main-content", ".cart__footer-wrapper", ".cart__footer"],
        },
    ];

    const SVG = {
        lifetimeGuarantee: `<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.12395 9.49993L8.70713 11.0833L11.8735 7.91655M15.8314 10.292C15.8314 14.2504 13.0609 16.2297 9.76785 17.3776C9.59542 17.4361 9.40811 17.4333 9.23749 17.3697C5.93657 16.2297 3.16602 14.2504 3.16602 10.292V4.75013C3.16602 4.54016 3.24941 4.33879 3.39787 4.19032C3.54632 4.04185 3.74766 3.95844 3.9576 3.95844C5.54078 3.95844 7.51975 3.00841 8.89711 1.80504C9.06481 1.66174 9.27814 1.58301 9.49871 1.58301C9.71929 1.58301 9.93262 1.66174 10.1003 1.80504C11.4856 3.01633 13.4567 3.95844 15.0398 3.95844C15.2498 3.95844 15.4511 4.04185 15.5996 4.19032C15.748 4.33879 15.8314 4.54016 15.8314 4.75013V10.292Z" stroke="#FF8F1C" stroke-width="1.74211" stroke-linecap="round"/>
</svg>
`,
        freeShipping: `<svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.87484 2.57754e-07C5.04405 -8.45277e-06 4.35836 -1.71592e-05 3.80011 0.0397638C3.22018 0.0810953 2.68747 0.169821 2.18845 0.392279C1.44692 0.722843 0.842302 1.24171 0.457108 1.87808C0.197886 2.30632 0.0944974 2.76348 0.0463354 3.26116C-2.2948e-05 3.74024 -1.1786e-05 4.32866 3.94012e-07 5.04164V10.4526C3.94012e-07 12.1197 1.36417 13.5132 3.18674 13.856C3.57701 14.9129 4.72928 15.6789 6.09003 15.6789C7.41585 15.6789 8.54376 14.9518 8.96178 13.9368H14.3833C14.8013 14.9518 15.9293 15.6789 17.2551 15.6789C18.6792 15.6789 19.875 14.8399 20.2079 13.7064C21.4064 13.2414 22.1768 12.1322 21.965 10.9322L21.8233 10.1298C21.4584 8.06316 20.5566 6.09344 19.1845 4.36646L19.0003 4.13458C18.244 3.18269 16.9883 2.61316 15.6458 2.61316H14.2101C14.1587 2.61316 14.1078 2.6148 14.0573 2.61802C13.9922 2.3612 13.8965 2.1152 13.753 1.87808C13.3678 1.24171 12.7632 0.722843 12.0216 0.392279C11.5226 0.169821 10.9899 0.0810953 10.41 0.0397638C9.85174 -1.71592e-05 9.166 -8.45277e-06 8.33524 2.57754e-07H5.87484ZM14.2101 4.97874C14.2101 4.99959 14.2101 5.02055 14.2101 5.04161V12.1947H14.3833C14.8013 11.1798 15.9293 10.4526 17.2551 10.4526C18.3604 10.4526 19.3282 10.9581 19.8618 11.7144C19.9526 11.5597 19.9908 11.3797 19.9579 11.1932L19.8162 10.3908C19.4969 8.58248 18.7079 6.85893 17.5072 5.34785L17.323 5.11598C16.9449 4.64003 16.317 4.35526 15.6458 4.35526H14.2101V4.97874ZM12.1801 5.07824C12.1801 4.31953 12.1792 3.80377 12.1407 3.40534C12.1031 3.01734 12.0351 2.81928 11.9515 2.68114C11.7589 2.36297 11.4566 2.10353 11.0858 1.93824C10.9249 1.86649 10.6941 1.80811 10.2419 1.77589C9.77764 1.7428 9.17666 1.74211 8.29259 1.74211H5.91748C5.03339 1.74211 4.43238 1.7428 3.96811 1.77589C3.516 1.80811 3.2852 1.86649 3.12424 1.93824C2.75348 2.10353 2.45117 2.36297 2.25856 2.68114C2.17495 2.81928 2.10693 3.01734 2.06938 3.40534C2.03082 3.80377 2.03001 4.31953 2.03001 5.07824V10.4526C2.03001 11.177 2.54522 11.7981 3.27831 12.0609C3.73716 11.1165 4.82326 10.4526 6.09003 10.4526C7.41585 10.4526 8.54376 11.1798 8.96178 12.1947H12.1801V5.07824ZM7.10503 13.0658C7.10503 12.5847 6.65061 12.1947 6.09003 12.1947C5.52946 12.1947 5.07503 12.5847 5.07503 13.0658C5.07503 13.5469 5.52946 13.9368 6.09003 13.9368C6.65061 13.9368 7.10503 13.5469 7.10503 13.0658ZM16.2401 13.0658C16.2401 12.5847 16.6945 12.1947 17.2551 12.1947C17.8157 12.1947 18.2701 12.5847 18.2701 13.0658C18.2701 13.5469 17.8157 13.9368 17.2551 13.9368C16.6945 13.9368 16.2401 13.5469 16.2401 13.0658Z" fill="#FF8F1C"/>
</svg>
`,
        designedByGardeners: `<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.6663 16.625V15.0417C12.6663 14.2018 12.3326 13.3964 11.7387 12.8025C11.1448 12.2086 10.3393 11.875 9.49933 11.875H4.74895C3.90903 11.875 3.10351 12.2086 2.5096 12.8025C1.91569 13.3964 1.58203 14.2018 1.58203 15.0417V16.625M12.6663 2.47628C13.3454 2.65232 13.9468 3.04886 14.3761 3.60366C14.8055 4.15846 15.0384 4.84011 15.0384 5.54161C15.0384 6.24312 14.8055 6.92476 14.3761 7.47956C13.9468 8.03436 13.3454 8.4309 12.6663 8.60694M17.4166 16.6249V15.0416C17.4161 14.3399 17.1826 13.6584 16.7527 13.1038C16.3228 12.5493 15.7208 12.1532 15.0414 11.9778M10.2911 5.54167C10.2911 7.29057 8.87318 8.70833 7.12414 8.70833C5.3751 8.70833 3.95722 7.29057 3.95722 5.54167C3.95722 3.79276 5.3751 2.375 7.12414 2.375C8.87318 2.375 10.2911 3.79276 10.2911 5.54167Z" stroke="#FF8F1C" stroke-width="1.74211" stroke-linecap="round"/>
</svg>
`,
        designedToLast: `<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21 10.5C21 10.7321 20.9078 10.9546 20.7437 11.1187C20.5796 11.2828 20.3571 11.375 20.125 11.375C19.8929 11.375 19.6704 11.2828 19.5063 11.1187C19.3422 10.9546 19.25 10.7321 19.25 10.5C19.2475 8.18014 18.3248 5.95602 16.6844 4.31563C15.044 2.67524 12.8199 1.75255 10.5 1.75C10.2679 1.75 10.0454 1.65781 9.88128 1.49372C9.71719 1.32962 9.625 1.10706 9.625 0.875C9.625 0.642936 9.71719 0.420376 9.88128 0.256282C10.0454 0.0921872 10.2679 0 10.5 0C13.2838 0.00301095 15.9528 1.11022 17.9213 3.0787C19.8898 5.04718 20.997 7.71615 21 10.5ZM14 11.375C14.2321 11.375 14.4546 11.2828 14.6187 11.1187C14.7828 10.9546 14.875 10.7321 14.875 10.5C14.875 10.2679 14.7828 10.0454 14.6187 9.88128C14.4546 9.71719 14.2321 9.625 14 9.625H12.0076C11.8551 9.36287 11.6371 9.14487 11.375 8.99238V6.125C11.375 5.89294 11.2828 5.67038 11.1187 5.50628C10.9546 5.34219 10.7321 5.25 10.5 5.25C10.2679 5.25 10.0454 5.34219 9.88128 5.50628C9.71719 5.67038 9.625 5.89294 9.625 6.125V8.99238C9.39293 9.126 9.19473 9.31126 9.04575 9.53379C8.89678 9.75632 8.80103 10.0102 8.76592 10.2756C8.73081 10.5411 8.75728 10.8111 8.84329 11.0647C8.92929 11.3183 9.07252 11.5488 9.26188 11.7381C9.45124 11.9275 9.68165 12.0707 9.93526 12.1567C10.1889 12.2427 10.4589 12.2692 10.7244 12.2341C10.9898 12.199 11.2437 12.1032 11.4662 11.9542C11.6887 11.8053 11.874 11.6071 12.0076 11.375H14ZM1.59863 5.936C1.42557 5.936 1.25639 5.98732 1.1125 6.08346C0.968608 6.17961 0.856457 6.31627 0.790231 6.47615C0.724004 6.63604 0.706676 6.81197 0.740438 6.9817C0.7742 7.15144 0.857536 7.30735 0.979907 7.42972C1.10228 7.55209 1.25819 7.63542 1.42792 7.66919C1.59765 7.70295 1.77359 7.68562 1.93347 7.61939C2.09336 7.55317 2.23002 7.44102 2.32616 7.29712C2.42231 7.15323 2.47363 6.98406 2.47363 6.811C2.47363 6.57894 2.38144 6.35638 2.21734 6.19228C2.05325 6.02819 1.83069 5.936 1.59863 5.936ZM1.75 10.5C1.75 10.3269 1.69868 10.1578 1.60254 10.0139C1.50639 9.86998 1.36973 9.75783 1.20985 9.69161C1.04996 9.62538 0.87403 9.60805 0.704296 9.64181C0.534563 9.67558 0.378653 9.75891 0.256282 9.88128C0.133911 10.0037 0.0505753 10.1596 0.0168133 10.3293C-0.0169488 10.499 0.000379121 10.675 0.0666058 10.8348C0.132832 10.9947 0.244983 11.1314 0.388876 11.2275C0.532769 11.3237 0.701942 11.375 0.875 11.375C1.10706 11.375 1.32962 11.2828 1.49372 11.1187C1.65781 10.9546 1.75 10.7321 1.75 10.5ZM10.5 19.25C10.3269 19.25 10.1578 19.3013 10.0139 19.3975C9.86998 19.4936 9.75783 19.6303 9.69161 19.7902C9.62538 19.95 9.60805 20.126 9.64181 20.2957C9.67558 20.4654 9.75891 20.6213 9.88128 20.7437C10.0037 20.8661 10.1596 20.9494 10.3293 20.9832C10.499 21.0169 10.675 20.9996 10.8348 20.9334C10.9947 20.8672 11.1314 20.755 11.2275 20.6111C11.3237 20.4672 11.375 20.2981 11.375 20.125C11.375 19.8929 11.2828 19.6704 11.1187 19.5063C10.9546 19.3422 10.7321 19.25 10.5 19.25ZM3.69338 2.80612C3.52032 2.80612 3.35114 2.85744 3.20725 2.95359C3.06336 3.04974 2.95121 3.18639 2.88498 3.34628C2.81875 3.50616 2.80143 3.6821 2.83519 3.85183C2.86895 4.02156 2.95229 4.17747 3.07466 4.29984C3.19703 4.42221 3.35294 4.50555 3.52267 4.53931C3.6924 4.57307 3.86834 4.55575 4.02822 4.48952C4.18811 4.42329 4.32477 4.31114 4.42091 4.16725C4.51706 4.02336 4.56838 3.85418 4.56838 3.68112C4.56838 3.44906 4.47619 3.2265 4.31209 3.06241C4.148 2.89831 3.92544 2.80612 3.69338 2.80612ZM6.80663 0.735875C6.63357 0.735875 6.46439 0.787193 6.3205 0.883339C6.17661 0.979485 6.06446 1.11614 5.99823 1.27603C5.932 1.43591 5.91468 1.61185 5.94844 1.78158C5.9822 1.95131 6.06554 2.10722 6.18791 2.22959C6.31028 2.35196 6.46619 2.4353 6.63592 2.46906C6.80565 2.50282 6.98159 2.4855 7.14147 2.41927C7.30136 2.35304 7.43801 2.24089 7.53416 2.097C7.63031 1.95311 7.68163 1.78393 7.68163 1.61088C7.68163 1.37881 7.58944 1.15625 7.42534 0.992157C7.26125 0.828062 7.03869 0.735875 6.80663 0.735875ZM1.59863 13.314C1.42557 13.314 1.25639 13.3653 1.1125 13.4615C0.968608 13.5576 0.856457 13.6943 0.790231 13.8542C0.724004 14.014 0.706676 14.19 0.740438 14.3597C0.7742 14.5294 0.857536 14.6853 0.979907 14.8077C1.10228 14.9301 1.25819 15.0134 1.42792 15.0472C1.59765 15.0809 1.77359 15.0636 1.93347 14.9974C2.09336 14.9312 2.23002 14.819 2.32616 14.6751C2.42231 14.5312 2.47363 14.3621 2.47363 14.189C2.47363 13.9569 2.38144 13.7344 2.21734 13.5703C2.05325 13.4062 1.83069 13.314 1.59863 13.314ZM3.69338 16.4439C3.52032 16.4439 3.35114 16.4952 3.20725 16.5913C3.06336 16.6875 2.95121 16.8241 2.88498 16.984C2.81875 17.1439 2.80143 17.3198 2.83519 17.4896C2.86895 17.6593 2.95229 17.8152 3.07466 17.9376C3.19703 18.06 3.35294 18.1433 3.52267 18.1771C3.6924 18.2108 3.86834 18.1935 4.02822 18.1273C4.18811 18.061 4.32477 17.9489 4.42091 17.805C4.51706 17.6611 4.56838 17.4919 4.56838 17.3189C4.56838 17.0868 4.47619 16.8643 4.31209 16.7002C4.148 16.5361 3.92544 16.4439 3.69338 16.4439ZM6.80663 18.5141C6.63357 18.5141 6.46439 18.5654 6.3205 18.6616C6.17661 18.7577 6.06446 18.8944 5.99823 19.0543C5.932 19.2142 5.91468 19.3901 5.94844 19.5598C5.9822 19.7296 6.06554 19.8855 6.18791 20.0078C6.31028 20.1302 6.46619 20.2136 6.63592 20.2473C6.80565 20.2811 6.98159 20.2637 7.14147 20.1975C7.30136 20.1313 7.43801 20.0191 7.53416 19.8752C7.63031 19.7314 7.68163 19.5622 7.68163 19.3891C7.68163 19.1571 7.58944 18.9345 7.42534 18.7704C7.26125 18.6063 7.03869 18.5141 6.80663 18.5141ZM19.4014 13.314C19.2283 13.314 19.0591 13.3653 18.9153 13.4615C18.7714 13.5576 18.6592 13.6943 18.593 13.8542C18.5268 14.014 18.5094 14.19 18.5432 14.3597C18.577 14.5294 18.6603 14.6853 18.7827 14.8077C18.905 14.9301 19.0609 15.0134 19.2307 15.0472C19.4004 15.0809 19.5763 15.0636 19.7362 14.9974C19.8961 14.9312 20.0328 14.819 20.1289 14.6751C20.2251 14.5312 20.2764 14.3621 20.2764 14.189C20.2764 14.0741 20.2537 13.9603 20.2098 13.8542C20.1658 13.748 20.1013 13.6515 20.0201 13.5703C19.9388 13.489 19.8424 13.4246 19.7362 13.3806C19.6301 13.3366 19.5163 13.314 19.4014 13.314ZM17.3066 16.4439C17.1336 16.4439 16.9644 16.4952 16.8205 16.5913C16.6766 16.6875 16.5645 16.8241 16.4982 16.984C16.432 17.1439 16.4147 17.3198 16.4484 17.4896C16.4822 17.6593 16.5655 17.8152 16.6879 17.9376C16.8103 18.06 16.9662 18.1433 17.1359 18.1771C17.3057 18.2108 17.4816 18.1935 17.6415 18.1273C17.8014 18.061 17.938 17.9489 18.0342 17.805C18.1303 17.6611 18.1816 17.4919 18.1816 17.3189C18.1816 17.204 18.159 17.0902 18.115 16.984C18.071 16.8779 18.0066 16.7814 17.9253 16.7002C17.8441 16.6189 17.7476 16.5545 17.6415 16.5105C17.5353 16.4665 17.4215 16.4439 17.3066 16.4439ZM14.1934 18.5141C14.0203 18.5141 13.8511 18.5654 13.7073 18.6616C13.5634 18.7577 13.4512 18.8944 13.385 19.0543C13.3188 19.2142 13.3014 19.3901 13.3352 19.5598C13.3689 19.7296 13.4523 19.8855 13.5747 20.0078C13.697 20.1302 13.8529 20.2136 14.0227 20.2473C14.1924 20.2811 14.3683 20.2637 14.5282 20.1975C14.6881 20.1313 14.8248 20.0191 14.9209 19.8752C15.0171 19.7314 15.0684 19.5622 15.0684 19.3891C15.0684 19.2742 15.0457 19.1604 15.0018 19.0543C14.9578 18.9481 14.8933 18.8517 14.8121 18.7704C14.7308 18.6892 14.6344 18.6247 14.5282 18.5807C14.4221 18.5368 14.3083 18.5141 14.1934 18.5141Z" fill="#FF8F1C"/>
</svg>
`,
    };

    const USP_ITEMS = [
        {key: "lifetimeGuarantee", lines: ["Lifetime", "Guarantee"]},
        {key: "freeShipping", lines: ["Free Shipping", "Over $199"]},
        {key: "designedByGardeners", lines: ["Designed by", "Gardeners"]},
        {key: "designedToLast", lines: ["Designed", "to Last"]},
    ];

    const observedPlacements = new Set();

    let lastFooterHeight = 0;

    function logInfo(message) {
        console.log(`%c%c${TEST_ID}-${VARIANT_ID}`, "color: white; background: rgb(0, 0, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", "margin-left: 8px; color: white; background: rgb(0, 57, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;", message);
    }

    function waitForElem(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== "undefined") ? callback(elements) : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    function queryFirst(selectors) {
        try {
            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element) return element;
            }
        } catch (error) {
            console.error(`${TEST_ID}-${VARIANT_ID} queryFirst error:`, error);
        }

        return null;
    }

    function addBodyClass() {
        try {
            !document.body.classList.contains(BODY_CLASS) && document.body.classList.add(BODY_CLASS);

            return document.body.classList.contains(BODY_CLASS);
        } catch (error) {
            console.error(`${TEST_ID}-${VARIANT_ID} addBodyClass error:`, error);
            return false;
        }
    }

    function buildUspHtml(placement) {
        const items = USP_ITEMS.map((item) => {
            const lines = item.lines.map((line) => `<span class="ab--usp-line">${line}</span>`).join("");

            return `<li class="ab--usp-item ab--usp-item--${item.key}" aria-label="${item.lines.join(" ")}">
        <span class="ab--usp-icon">${SVG[item.key] || ""}</span>
        <span class="ab--usp-label">${lines}</span>
      </li>`;
        }).join("");

        return `<ul class="${USP_CLASS} ${placement.modifier}">${items}</ul>`;
    }

    function measureContentBottom(element) {
        const top = element.getBoundingClientRect().top;
        const paddingBottom = parseFloat(getComputedStyle(element).paddingBottom) || 0;
        const PAINTED = ["BUTTON", "IFRAME", "SVG", "IMG", "INPUT", "CANVAS", "VIDEO"];

        let bottom = 0;
        element.querySelectorAll("*").forEach((node) => {
            const isLeaf = node.children.length === 0 || PAINTED.includes(node.tagName.toUpperCase());
            if (!isLeaf) return;

            const rect = node.getBoundingClientRect();
            if (rect.height <= 0 || rect.width <= 0) return;
            if (getComputedStyle(node).visibility === "hidden") return;

            bottom = Math.max(bottom, rect.bottom - top);
        });

        return bottom > 0 ? Math.ceil(bottom + paddingBottom) : 0;
    }

    function fixFooterHeight() {
        try {
            const footerInner = document.querySelector(".cart__footer-inner");
            if (!footerInner) return;

            footerInner.style.setProperty("min-height", "0", "important");
            footerInner.style.setProperty("height", "max-content", "important");

            const contentHeight = measureContentBottom(footerInner);
            if (!contentHeight) return;

            if (Math.abs(contentHeight - lastFooterHeight) < 2) return;

            lastFooterHeight = contentHeight;
            footerInner.style.setProperty("height", `${contentHeight}px`, "important");
        } catch (error) {
            console.error(`${TEST_ID}-${VARIANT_ID} fixFooterHeight error:`, error);
        }
    }

    /* The wallet buttons render asynchronously and resize themselves — keep
       re-measuring instead of trusting the first pass. */
    function watchFooterHeight() {
        try {
            waitForElem(".cart__footer-inner", ([footerInner]) => {
                fixFooterHeight();

                const resizeObserver = new ResizeObserver(() => fixFooterHeight());
                [...footerInner.children].forEach((child) => resizeObserver.observe(child));

                window.addEventListener("resize", fixFooterHeight);
            });
        } catch (error) {
            console.error(`${TEST_ID}-${VARIANT_ID} watchFooterHeight error:`, error);
        }
    }

    function insertUspBar(placement) {
        try {
            if (document.querySelector(`.${placement.modifier}`)) return false;

            const target = queryFirst(placement.targets);
            if (!target) return false;

            placement.name === "cart-page" && fixFooterHeight();

            target.insertAdjacentHTML(placement.position, buildUspHtml(placement));
            logInfo(`USP bar inserted - ${placement.name}`);

            return true;
        } catch (error) {
            console.error(`${TEST_ID}-${VARIANT_ID} insertUspBar error (${placement.name}):`, error);
            return false;
        }
    }

    /* The cart sections are re-rendered on quantity change / line removal,
       which takes the bar with them — watch and put it back. */
    function observePlacement(placement) {
        try {
            if (observedPlacements.has(placement.name)) return;
            observedPlacements.add(placement.name);

            waitForElem(placement.watches.join(", "), () => {
                const watched = queryFirst(placement.watches);
                const scope = watched?.parentElement || watched;
                if (!scope) return;

                const observer = new MutationObserver(() => {
                    /* The theme re-measures the sticky box on every update. */
                    placement.name === "cart-page" && fixFooterHeight();

                    if (document.querySelector(`.${placement.modifier}`)) return;

                    insertUspBar(placement);
                });

                observer.observe(scope, {childList: true, subtree: true});
                logInfo(`watching - ${placement.name}`);
            });
        } catch (error) {
            console.error(`${TEST_ID}-${VARIANT_ID} observePlacement error (${placement.name}):`, error);
        }
    }

    /* The side cart is built when the drawer first opens, so keep watching
       the body until each placement target shows up. */
    function observeBody() {
        try {
            const observer = new MutationObserver(() => {
                PLACEMENTS.forEach((placement) => {
                    if (document.querySelector(`.${placement.modifier}`)) return;

                    insertUspBar(placement) && observePlacement(placement);
                });
            });

            observer.observe(document.body, {childList: true, subtree: true});
        } catch (error) {
            console.error(`${TEST_ID}-${VARIANT_ID} observeBody error:`, error);
        }
    }

    function initUspBars() {
        PLACEMENTS.forEach((placement) => {
            waitForElem(placement.targets.join(", "), () => {
                insertUspBar(placement) && observePlacement(placement);
            });
        });

        observeBody();
        watchFooterHeight();
    }

    /* Debug aid — says which slot never resolved, and with which candidates. */
    function reportMissingTargets() {
        setTimeout(() => {
            PLACEMENTS.forEach((placement) => {
                if (document.querySelector(`.${placement.modifier}`)) return;

                logInfo(`no target for ${placement.name} - tried: ${placement.targets.join(" | ")}`);
            });
        }, 10000);
    }

    function mainJs([body]) {
        try {
            logInfo("fired");

            if (!addBodyClass()) return;

            initUspBars();
            reportMissingTargets();
        } catch (error) {
            console.error(`${TEST_ID}-${VARIANT_ID} mainJs error:`, error);
        }
    }

    waitForElem("body", mainJs);
})();
