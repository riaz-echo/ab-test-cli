(() => {
    var testData = {
        testName: "ID772_EU_PLP_Filter",
        handle: "LOOP-ID772",
        testVariant: "v1",
        testSite: "Loop Earplug EU",
        testVersion: 0.000001,
        useCaseIndex: 0,
    };

    const tid = testData.handle;

    var waitForElem = (waitFor, callback, minElements = 1, isVariable = false, timer = 30000, frequency = 100) => {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== "undefined") ? callback(elements) : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    };

    const hf = {
        query: (seletor) => {
            return document.querySelector(seletor) ? document.querySelector(seletor) : null;
        },
        queryAll: (seletor) => {
            return document.querySelectorAll(seletor) ? document.querySelectorAll(seletor) : null;
        },
        classAdd: (seletor, className) => {
            document.querySelector(seletor)?.classList.add(className);
        },
        classRemove: (seletor, className) => {
            return document.querySelector(seletor + "." + className)?.classList.remove(className);
        },
        forcePush: (func, limit, frequency, immediate = true) => {
            immediate && func();
            let cnt = 0;
            let intervalPush = setInterval(() => {
                cnt += frequency;
                func();
                cnt >= limit || func() == true ? clearInterval(intervalPush) : null;
            }, frequency);
        },
    };

    const svgObj = {
        "cross-big": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.00011 4L20.0001 20M4 20.0001L20 4.00006" stroke="#252427" stroke-width="1.5" stroke-linecap="round"/>
</svg>`,
        "cross-small": `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3 13.0005L13 3M3 3L13 13" stroke="#252427" stroke-linecap="round"/>
</svg>`,
        "filter-switch": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.2983 12.907C18.1709 12.9071 19.6888 14.4251 19.689 16.2977C19.689 18.1703 18.171 19.6882 16.2983 19.6883C14.7505 19.6882 13.4459 18.6513 13.0396 17.2342H6.00049C5.50357 17.2342 5.10032 16.8307 5.1001 16.3338C5.1001 15.8367 5.50343 15.4334 6.00049 15.4334H13.019C13.4013 13.9796 14.7245 12.9071 16.2983 12.907ZM16.2983 14.7068C15.4199 14.7069 14.7077 15.4192 14.7075 16.2977C14.7075 17.1763 15.4197 17.8884 16.2983 17.8885C17.1769 17.8884 17.8892 17.1762 17.8892 16.2977C17.889 15.4192 17.1768 14.7069 16.2983 14.7068ZM8.59131 5.2C10.1392 5.20012 11.4439 6.23778 11.8501 7.65508H18.8872C19.3842 7.65516 19.7875 8.05851 19.7876 8.55547C19.7876 9.05247 19.3842 9.45577 18.8872 9.45586H11.8696C11.4872 10.9094 10.1649 11.9811 8.59131 11.9812C6.71859 11.9812 5.20073 10.4633 5.20068 8.59062C5.20088 6.71804 6.71869 5.2 8.59131 5.2ZM8.59131 6.9998C7.7128 6.9998 7.00068 7.71216 7.00049 8.59062C7.00053 9.46922 7.7127 10.1814 8.59131 10.1814C9.46979 10.1813 10.1821 9.46912 10.1821 8.59062C10.1819 7.71225 9.46969 6.99995 8.59131 6.9998Z" fill="#252427"/>
</svg>`,
    };
    const filterData = {
        "Product type": {
            Earplugs: {
                name: "Earplugs",
                type: "filter_product_type",
                filterParam: "gid://shopify/Metaobject/33953087823",
                icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_628_1252)">
<path d="M12 2.01758C14.9564 2.01758 17.3189 4.46252 17.3467 7.44531C19.1254 8.95984 20.2548 11.2139 20.2549 13.7334C20.2549 18.2935 16.5593 21.9912 12 21.9912C7.44091 21.9909 3.74512 18.2934 3.74512 13.7334C3.74522 11.2147 4.87451 8.96081 6.65234 7.44629C6.67962 4.46327 9.04358 2.01796 12 2.01758ZM12 6.97656C8.26987 6.97683 5.24531 10.0016 5.24512 13.7334C5.24512 17.4653 8.26975 20.4909 12 20.4912C15.7305 20.4912 18.7549 17.4655 18.7549 13.7334C18.7547 10.0015 15.7304 6.97656 12 6.97656ZM12 9.22559C14.4905 9.22559 16.5098 11.2441 16.5098 13.7344C16.5096 16.2245 14.4904 18.2422 12 18.2422C9.50981 18.2419 7.4904 16.2243 7.49023 13.7344C7.49023 11.2443 9.50971 9.22585 12 9.22559ZM14.6289 12.2715C13.8531 12.7207 12.9559 12.9795 12 12.9795C11.044 12.9794 10.1469 12.7209 9.37109 12.2715C9.12934 12.7047 8.99023 13.2032 8.99023 13.7344C8.9904 15.3953 10.3377 16.7419 12 16.7422C13.6626 16.7422 15.0096 15.3955 15.0098 13.7344C15.0098 13.2031 14.8707 12.7048 14.6289 12.2715ZM12 10.7256C11.4388 10.7257 10.9145 10.881 10.4648 11.1484C10.9355 11.3609 11.4542 11.4794 12 11.4795C12.5457 11.4795 13.0652 11.3617 13.5361 11.1494C13.0862 10.8817 12.5617 10.7256 12 10.7256ZM12 3.51758C10.2762 3.51789 8.7956 4.69902 8.31543 6.34473C9.42468 5.79015 10.6755 5.47664 12 5.47656C13.3241 5.47656 14.5746 5.79053 15.6836 6.34473C15.2033 4.69908 13.7239 3.51758 12 3.51758Z" fill="#252427"/>
</g>
<defs>
<clipPath id="clip0_628_1252">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>`,
            },
            "Sleep mask": {
                name: "Sleep mask",
                type: "filter_product_type",
                filterParam: "gid://shopify/Metaobject/455737016655",
                icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.52393 7.34196C13.6959 7.18766 14.4955 8.4632 14.4955 8.80437" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20.3457 8.2225C20.3457 8.72655 16.6134 9.13458 12.0098 9.13458C7.40613 9.13458 3.67383 8.72655 3.67383 8.2225C3.67383 7.32757 7.40613 7.31042 12.0098 7.31042C16.6134 7.31042 20.3457 7.44415 20.3457 8.2225Z" stroke="#252427" stroke-width="1.5" stroke-miterlimit="10"/>
<path d="M20.3463 8.22235V14.168C20.3463 14.6326 20.0612 15.0047 19.6741 15.2138C18.6594 15.7642 16.9677 16.3659 15.8176 16.5871C15.0991 16.726 14.3489 16.7928 13.769 16.3162C13.1971 15.8447 12.8116 14.0566 12.063 14.0772H11.9562C11.2059 14.0566 10.8205 15.8447 10.2502 16.3162C9.67034 16.7945 8.92005 16.726 8.20163 16.5871C7.05152 16.3659 5.36139 15.7642 4.34508 15.2138C3.95958 15.0047 3.67285 14.6326 3.67285 14.168V8.19321" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
            },
            Accessories: {
                name: "Accessories",
                type: "filter_product_type",
                filterParam: "gid://shopify/Metaobject/33953186127",
                icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_628_1443)">
<path d="M15.9902 13.4133L16.4229 15.09C16.5012 15.3978 16.542 15.7098 16.542 16.0217V20.7228H16.5391C16.539 21.0817 16.4882 21.4384 16.3848 21.7912C16.3534 21.9122 16.191 22.0011 16.0029 22.0012H15.9648L15.6768 21.9963V21.9982H15.1035L15.0654 22.0012C14.8774 22.0011 14.7149 21.9122 14.6836 21.7912C14.5801 21.4383 14.5293 21.0809 14.5293 20.7219H14.5264V16.0217C14.5264 15.7098 14.5672 15.3977 14.6455 15.09L15.0781 13.4133H15.9902Z" fill="#252427"/>
<path d="M8.92188 13.4133L9.35449 15.09C9.43284 15.3978 9.47363 15.7098 9.47363 16.0217V20.7228H9.4707C9.47066 21.0817 9.4198 21.4384 9.31641 21.7912C9.28507 21.9122 9.1226 22.0011 8.93457 22.0012H8.89648L8.60938 21.9963V21.9982H8.03516L7.99805 22.0012C7.80994 22.0012 7.64658 21.9123 7.61523 21.7912C7.51187 21.4385 7.46196 21.0817 7.46191 20.7228H7.45898V16.0217C7.45898 15.7098 7.49976 15.3978 7.57812 15.09L8.01074 13.4133H8.92188Z" fill="#252427"/>
<path d="M8.46606 5.78253V15.2956" stroke="#252427" stroke-width="1.5" stroke-linecap="round"/>
<path d="M15.5344 5.80576L15.5344 15.2953" stroke="#252427" stroke-width="1.5" stroke-linecap="round"/>
<circle cx="8.46581" cy="4.09277" r="1.34277" stroke="#252427" stroke-width="1.5"/>
<circle cx="15.5344" cy="4.09277" r="1.34277" stroke="#252427" stroke-width="1.5"/>
</g>
<defs>
<clipPath id="clip0_628_1443">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>`,
            },
            "Spare parts": {
                name: "Spare parts",
                type: "filter_accessory_type",
                filterParam: "gid://shopify/Metaobject/57455608041",
                icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.6489 6.73808C11.682 6.36467 11.4543 6.04458 11.0344 5.4791C10.291 4.47787 11.1621 2.88184 12.2326 2.88184" stroke="#252427" stroke-width="1.5"/>
<path d="M12.8162 6.73808C12.7831 6.36467 13.0108 6.04458 13.4307 5.4791C14.1741 4.47787 13.303 2.88184 12.2325 2.88184" stroke="#252427" stroke-width="1.5"/>
<ellipse cx="11.9999" cy="13.8309" rx="7.53062" ry="7.28765" stroke="#252427" stroke-width="1.5"/>
<path d="M7.66772 15.3352C8.16647 16.6125 9.18582 17.6425 10.4753 18.1827" stroke="#252427" stroke-width="1.5" stroke-linecap="round"/>
<path d="M13.5249 9.13525C14.4636 9.47849 15.273 10.0765 15.863 10.8422" stroke="#252427" stroke-width="1.5" stroke-linecap="round"/>
</svg>`,
            },
        },
        "Use cases": {
            "Noise sensitivity": {
                name: "Noise sensitivity",
                type: "filter_use_case",
                filterParam: "gid://shopify/Metaobject/33953415503",
                icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_628_913)">
<path d="M5 12.7306L15.1164 3L13.8991 10.5052H19L8.90115 21L11.2295 12.7306H5Z" stroke="#252427" stroke-width="1.5" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_628_913">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>`,
            },
            Sleep: {
                name: "Sleep",
                type: "filter_use_case",
                filterParam: "gid://shopify/Metaobject/33953317199",
                icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_628_2069)">
<path d="M12.3787 3C15.5217 3 18.2994 4.49295 20 6.77166C18.8788 5.9859 17.5057 5.51444 16.013 5.51444C12.2779 5.51444 9.25454 8.41572 9.25454 12C9.25454 15.5843 12.2779 18.4856 16.013 18.4856C17.5057 18.4856 18.8851 18.0141 20 17.2283C18.2994 19.5071 15.5217 21 12.3787 21C7.20119 21 3 16.9684 3 12C3 7.03156 7.20119 3 12.3787 3Z" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14 12L17 12L14 15H17" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M19 9L22 9L19 12H22" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_628_2069">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>`,
            },
            "Music & events": {
                name: "Music & events",
                type: "filter_use_case",
                filterParam: "gid://shopify/Metaobject/33953481039",
                icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_628_2509)">
<path d="M6 21C7.65685 21 9 19.6569 9 18C9 16.3431 7.65685 15 6 15C4.34315 15 3 16.3431 3 18C3 19.6569 4.34315 21 6 21Z" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18 18C19.6569 18 21 16.6569 21 15C21 13.3431 19.6569 12 18 12C16.3431 12 15 13.3431 15 15C15 16.6569 16.3431 18 18 18Z" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9 18V5.80609L21 3L20.9904 15.2697" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9 10L21 7" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_628_2509">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>`,
            },
            Focus: {
                name: "Focus",
                type: "filter_use_case",
                filterParam: "gid://shopify/Metaobject/33953349967",
                icon: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M14.3382 17.4456C14.2796 17.1499 14.3747 16.8437 14.5901 16.6313C14.806 16.4191 15.115 16.3276 15.4129 16.3877L18.0975 16.9292C18.5187 17.0142 18.9054 17.2222 19.2067 17.5261L25.3814 23.7526C26.2328 24.6118 26.2014 25.9988 25.3113 26.8186L24.649 27.4286C23.7993 28.2102 22.4768 28.1873 21.6557 27.3762L15.4698 21.2614C15.1661 20.9612 14.9595 20.5772 14.8766 20.1602L14.3382 17.4456ZM22.9406 26.0989C23.069 26.2254 23.2769 26.2288 23.4098 26.107L24.0721 25.498C24.2113 25.3697 24.2162 25.1514 24.0833 25.0169L23.681 24.6112L22.5485 25.7114L22.9406 26.0989ZM16.6623 19.812C16.6754 19.877 16.7083 19.9382 16.7557 19.9851L21.2575 24.4351L22.4032 23.3218L17.9086 18.7903C17.8615 18.7428 17.8007 18.7101 17.7349 18.6967L16.387 18.4249L16.6623 19.812Z" fill="#252427"/>
<path d="M6 6.9633C6.00004 5.32675 7.33885 4 8.99035 4L21.4718 4C23.1233 4 24.4621 5.32675 24.4621 6.9633V15.209C24.4621 15.7071 24.0547 16.1109 23.552 16.1109C23.0494 16.1109 22.6419 15.7071 22.6419 15.209V6.9633C22.6419 6.32293 22.118 5.80375 21.4718 5.80375L8.99035 5.80375C8.34413 5.80375 7.82025 6.32293 7.82021 6.9633L7.82021 23.4547C7.82021 24.0951 8.3441 24.6142 8.99035 24.6142H13.8446C14.347 24.6144 14.7547 25.0182 14.7547 25.5161C14.7547 26.0141 14.3471 26.4178 13.8446 26.418H8.99035C7.33882 26.418 6 25.0913 6 23.4547L6 6.9633Z" fill="#252427"/>
<path d="M9.12036 7.99401C9.1204 7.49595 9.52786 7.09214 10.0305 7.09214L20.4317 7.09214C20.9343 7.09214 21.3417 7.49595 21.3418 7.99401C21.3418 8.4921 20.9343 8.89588 20.4317 8.89588L10.0305 8.89588C9.52783 8.89588 9.12036 8.4921 9.12036 7.99401Z" fill="#252427"/>
<path d="M9.12036 11.0861C9.1204 10.5881 9.52786 10.1843 10.0305 10.1843L18.3514 10.1843C18.8541 10.1843 19.2615 10.5881 19.2615 11.0861C19.2615 11.5842 18.8541 11.988 18.3514 11.988L10.0305 11.988C9.52783 11.988 9.12036 11.5842 9.12036 11.0861Z" fill="#252427"/>
<path d="M9.12036 14.1783C9.1204 13.6802 9.52786 13.2764 10.0305 13.2764L17.3113 13.2764C17.8139 13.2764 18.2214 13.6802 18.2214 14.1783C18.2214 14.6764 17.814 15.0802 17.3113 15.0802L10.0305 15.0802C9.52783 15.0802 9.12036 14.6764 9.12036 14.1783Z" fill="#252427"/>
</svg>`,
            },
            Conversation: {
                name: "Conversation",
                type: "filter_use_case",
                filterParam: "gid://shopify/Metaobject/24884576591",
                icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_628_1413)">
<path d="M10.5328 3C6.04596 3 3 5.6397 3 9.74255C3 12.2691 3.91196 14.2904 5.67023 15.5914C5.78696 15.6781 5.92558 15.6932 5.87451 15.9421C5.66659 16.9527 5.3018 18.7552 5.3018 18.7552C5.28721 18.8307 5.31274 18.9099 5.36381 18.9589C5.41853 19.0079 5.49149 19.0117 5.54985 18.9777C5.54985 18.9777 8.12524 17.2204 8.46814 16.998C9.26702 16.47 9.96012 16.3682 10.4745 16.3682C14.0311 16.3682 18 14.7278 18 9.6973C18 5.79808 15.275 3 10.5365 3H10.5328Z" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 18.0001C13.0168 18.9108 14.491 19.2604 15.876 19.2604C16.2312 19.2604 16.7059 19.329 17.253 19.6758C17.4886 19.8203 19.2534 20.9834 19.2534 20.9834C19.2932 21.0087 19.3439 21.0051 19.3802 20.9726C19.4164 20.9401 19.4345 20.8895 19.4237 20.8389C19.4237 20.8389 19.1736 19.6469 19.0287 18.9787C18.9924 18.8125 19.0867 18.8053 19.17 18.7475C20.3767 17.8878 21 16.5477 21 14.8789C21 13.7532 20.6175 12.7574 19.9392 12" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_628_1413">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>`,
            },
            "Social gatherings": {
                name: "Social gatherings",
                type: "filter_use_case",
                filterParam: "gid://shopify/Metaobject/33953546575",
                icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_786_543)">
<path d="M21 21L15 22" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15.8061 3.33435L19.3805 3L20.858 9.50915C21.0753 10.4055 21.0572 11.3587 20.7059 12.216C20.0939 13.7028 18.6815 14.8161 16.9433 14.9797C14.6618 15.1931 12.612 13.7028 12.1123 11.565C12.0362 11.2485 12.0181 10.9212 12.0181 10.594L12 3.69004L15.8061 3.33435Z" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18 21L17 15" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20 8L12 11" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4 21L10 22" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.19069 3.33089L4.61335 3L3.14182 9.5111C2.92436 10.4077 2.94248 11.3613 3.29768 12.2187C3.91021 13.706 5.32737 14.8161 7.06711 14.9797C9.35052 15.1932 11.3983 13.6988 11.8985 11.5605C11.9746 11.2438 11.9928 10.9165 11.9891 10.5892L12 3.68313L8.19069 3.33089Z" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6 21L7 15" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4 8L12 11" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_786_543">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>`,
            },
            "Playtime & school time": {
                name: "Playtime & school time",
                type: "filter_use_case",
                filterParam: "gid://shopify/Metaobject/46817804623",
                icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_628_2822)">
<path d="M17 21H6V9.70016L11.4983 7L17 9.70016V21Z" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 7V3H16V5.34069H12" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6 21H3V12H6" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18 21H21V12H18" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10 21V17.0465C10 15.9169 10.8961 15 12 15C13.1039 15 14 15.9169 14 17.0465V21" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_628_2822">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>`,
            },
            Parenting: {
                name: "Parenting",
                type: "filter_use_case",
                filterParam: "gid://shopify/Metaobject/24884609359",
                icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_426_42127)">
<path d="M4.5 10.5H21.75C21.75 12.2902 21.0388 14.0071 19.773 15.273C18.5071 16.5388 16.7902 17.25 15 17.25H11.25C9.45979 17.25 7.7429 16.5388 6.47703 15.273C5.21116 14.0071 4.5 12.2902 4.5 10.5Z" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.5 10.5V4.5C13.5 4.30109 13.579 4.11032 13.7197 3.96967C13.8603 3.82902 14.0511 3.75 14.25 3.75H15C16.7902 3.75 18.5071 4.46116 19.773 5.72703C21.0388 6.9929 21.75 8.70979 21.75 10.5" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1.5 7.5C2.29565 7.5 3.05871 7.81607 3.62132 8.37868C4.18393 8.94129 4.5 9.70435 4.5 10.5" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.25 22.3125C8.97487 22.3125 9.5625 21.7249 9.5625 21C9.5625 20.2751 8.97487 19.6875 8.25 19.6875C7.52513 19.6875 6.9375 20.2751 6.9375 21C6.9375 21.7249 7.52513 22.3125 8.25 22.3125Z" fill="#252427"/>
<path d="M18 22.3125C18.7249 22.3125 19.3125 21.7249 19.3125 21C19.3125 20.2751 18.7249 19.6875 18 19.6875C17.2751 19.6875 16.6875 20.2751 16.6875 21C16.6875 21.7249 17.2751 22.3125 18 22.3125Z" fill="#252427"/>
<path d="M13.5 10.5L19.6341 5.59216" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_426_42127">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>`,
            },
            Travel: {
                name: "Travel",
                type: "filter_use_case",
                filterParam: "gid://shopify/Metaobject/33953448271",
                icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_628_1901)">
<path d="M19.4187 8C20.2689 8.16695 20.8237 8.50474 20.9642 9.0056C21.4037 10.5625 17.7435 13.1367 12.7936 14.7519C7.8437 16.371 3.4738 16.4215 3.03789 14.8645C2.85416 14.2083 3.34411 13.4046 4.38885 12.5466" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M19.5235 9L19 7.68472L20 7" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9 17.3176C9.83385 17.7518 10.8013 18 11.831 18C14.1241 18 16.0987 16.7712 17 15" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.25744 14C6.09027 13.4339 6 12.8339 6 12.2102C5.99666 8.77966 8.7415 6 12.1249 6C14.9026 6 17.2492 7.87651 18 10.4484" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.30361 8H10.3663C10.6682 8 10.9108 8.33272 10.9108 8.74245V8.88108C10.9108 9.29082 11.1563 9.62354 11.4554 9.62354C11.7573 9.62354 12 9.95625 12 10.366V11.0253C12 11.435 11.7545 11.7677 11.4554 11.7677H9.97968C9.72856 11.7677 9.52539 12.045 9.52539 12.3839C9.52539 12.7258 9.32223 13 9.07111 13H7" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 18C12.8995 17.9667 13.1848 16.9117 13.1848 16.587C13.1848 16.2623 13.4208 16 13.7128 16H16" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14 6V7.48848C14 7.76775 14.2498 7.99232 14.5534 7.99232H14.6988C15.0055 7.99232 15.2522 8.21977 15.2522 8.49616C15.2522 8.77543 15.502 9 15.8055 9H18" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_628_1901">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>`,
            },
            Motorcycling: {
                name: "Motorcycling",
                type: "filter_use_case",
                filterParam: "gid://shopify/Metaobject/33953513807",
                icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_628_1827)">
<path d="M10.5 12C11.3284 12 12 11.3284 12 10.5C12 9.67157 11.3284 9 10.5 9C9.67157 9 9 9.67157 9 10.5C9 11.3284 9.67157 12 10.5 12Z" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3.97268 15.4481C2.52619 12.7128 2.63515 9.28544 4.6903 6.52837C7.08359 3.32205 11.5471 2.12285 15.3155 3.67348C17.8816 4.72776 19.6249 6.75299 20.3538 9.07168L21 17.7523L17.7163 20.7666C17.4758 20.9876 17.1264 21.06 16.8108 20.9477L3.97268 15.4481Z" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11 9H20" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10 12L21 18" stroke="#252427" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_628_1827">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>`,
            },
        },
        "What's affecting you": {
            Noise: {
                name: "Noise",
                type: "sensory_focus",
                filterParam: "Hearing",
            },
            Light: {
                name: "Light",
                type: "sensory_focus",
                filterParam: "Sight",
            },
        },
        Colors: {
            Silver: {
                name: "Silver",
                type: "filter.v.m.color.name",
                filterParam: "Silver",
            },
            Gold: {
                name: "Gold",
                type: "filter.v.m.color.name",
                filterParam: "Gold",
            },
            Rose: {
                name: "Rose",
                type: "filter.v.m.color.name",
                filterParam: "Rose",
            },
            Green: {
                name: "Green",
                type: "filter.v.m.color.name",
                filterParam: "Green",
            },
            White: {
                name: "White",
                type: "filter.v.m.color.name",
                filterParam: "White",
            },
            Black: {
                name: "Black",
                type: "filter.v.m.color.name",
                filterParam: "Black",
            },
            Purple: {
                colorCode: "#C7BEDB",
                name: "Purple",
                type: "filter.v.m.color.name",
                filterParam: "Purple",
            },
            Pink: {
                name: "Pink",
                type: "filter.v.m.color.name",
                filterParam: "Pink",
            },
            Orange: {
                colorCode: "#FF8000",
                name: "Orange",
                type: "filter.v.m.color.name",
                filterParam: "Orange",
            },
            Blue: {
                name: "Blue",
                type: "filter.v.m.color.name",
                filterParam: "Blue",
            },
            Multicolor: {
                name: "Multicolor",
                type: "filter.v.m.color.name",
                filterParam: "Multicolor",
            },
        },
    };

    const typeObj = {
        "type-all": [],
        "type-earplug": ["switch", "dream", "quiet", "engage", "engage-plus", "experience", "experience-plus", "engage-kids", "experience-2-tomorrowland", "mclaren"],
        "type-bundles": ["full-coverage-bundle", "tomorrowland-festival-bundle", "festival-bundle", "mclaren-f1-team-bundle", "earplug-bundle", "daily-calm-bundle", "dreamville-bundle", "deluxe-bundle"],
        "type-accessories": ["link-tomorrowland", "link", "carry-case-black", "carry-case-switch", "extra-carry-case-dream", "carry-case-sublime", "carry-case-switch-2", "loop-cleaning-kit", "silicone-eartips-switch-2-multicolor", "dream-double-tips", "loop-dream-ear-tips", "tips-foam", "silicone-ear-tips", "quiet-2-ear-tips-4-pack-black", "quiet-2-ear-tips-4-pack-multi", "mute-style-pack-sublime", "mute-style-pack-essentials", "tips-silicone-mute", "dream-ear-tips-black"],
        "type-limited": ["experience-2-tomorrowland", "mclaren", "swarovski", "tomorrowland-festival-bundle", "mclaren-f1-team-bundle", "dreamville-bundle"],
        "type-collaboration": ["experience-2-tomorrowland", "mclaren", "swarovski", "link-tomorrowland", "tomorrowland-festival-bundle", "dreamville-bundle", "mclaren-f1-team-bundle"],
        "type-new": ["experience-2-tomorrowland", "mclaren", "swarovski", "tomorrowland-festival-bundle", "mclaren-f1-team-bundle", "dreamville-bundle", "dream-double-tips", "mute-style-pack-essentials"],
        "type-mask": ["eclipse"],
    };

    const useCaseObj = {
        "Noise sensitivity": {
            items: ["switch", "switch", "dream", "quiet", "engage", "engage-plus", "experience", "experience-plus", "engage-kids", "experience-2-tomorrowland", "mclaren", "full-coverage-bundle", "tomorrowland-festival-bundle", "festival-bundle", "mclaren-f1-team-bundle", "earplug-bundle", "daily-calm-bundle", "dreamville-bundle", "deluxe-bundle"],
        },
        Sleep: {
            items: ["dream", "quiet", "eclipse", "full-coverage-bundle", "daily-calm-bundle", "dreamville-bundle"],
        },
        "Music & events": {
            items: ["switch", "experience", "experience-plus", "experience-2-tomorrowland", "mclaren", "link", "link-tomorrowland", "full-coverage-bundle", "tomorrowland-festival-bundle", "festival-bundle", "mclaren-f1-team-bundle", "earplug-bundle", "dreamville-bundle", "deluxe-bundle"],
        },
        Focus: {
            items: ["switch", "quiet", "experience", "experience-plus", "experience-2-tomorrowland", "mclaren", "full-coverage-bundle", "tomorrowland-festival-bundle", "mclaren-f1-team-bundle", "earplug-bundle", "dreamville-bundle", "deluxe-bundle"],
        },
        Conversation: {
            items: ["engage", "engage-plus", "mclaren", "full-coverage-bundle", "mclaren-f1-team-bundle", "earplug-bundle", "daily-calm-bundle", "deluxe-bundle"],
        },
        "Social gatherings": {
            items: ["switch", "engage", "engage-plus", "mclaren", "full-coverage-bundle", "mclaren-f1-team-bundle", "earplug-bundle", "daily-calm-bundle", "deluxe-bundle"],
        },
        "Playtime & schooltime": {
            items: ["engage-kids", "link", "link-tomorrowland"],
        },
        Parenting: {
            items: ["switch", "engage", "engage-plus", "mclaren", "full-coverage-bundle", "mclaren-f1-team-bundle", "earplug-bundle", "daily-calm-bundle", "deluxe-bundle", "link", "link-tomorrowland"],
        },
        Travel: {
            items: ["switch", "quiet", "mclaren", "full-coverage-bundle", "mclaren-f1-team-bundle", "earplug-bundle", "deluxe-bundle", "link", "link-tomorrowland"],
        },
        Motorcycling: {
            items: ["experience", "experience-plus", "experience-2-tomorrowland", "tomorrowland-festival-bundle", "dreamville-bundle", "link", "link-tomorrowland"],
        },
    };

    const useCaseObjExtra = {
        Case: {
            items: ["carry-case-black", "carry-case-switch", "extra-carry-case-dream", "carry-case-sublime", "carry-case-switch-2"],
        },
        "Eartips & mutes": {
            items: ["silicone-eartips-switch-2-multicolor", "dream-double-tips", "dream-ear-tips-black", "loop-dream-ear-tips", "silicone-ear-tips", "quiet-2-ear-tips-4-pack-black", "quiet-2-ear-tips-4-pack-multi", "tips-foam", "mute-style-pack-sublime", "tips-silicone-mute", "mute-style-pack-essentials"],
        },
        Link: {
            items: ["link", "link-tomorrowland"],
        },
    };

    function preSeletedFilters() {
        const params = new URLSearchParams(window.location.search);
        params.forEach((value, key) => {
            key = key.replace("filter.p.m.custom.", "");
            waitForElem(`.${tid}-filter-item[data-filter-type="${key}"][data-filter-param="${value}"]`, () => {
                hf.query(`.${tid}-filter-item[data-filter-type="${key}"][data-filter-param="${value}"]`).click();
            });
        });
    }

    function setFilter(resetFilter = false, deleteFilter = false, category, value, filterItemValue = "") {
        let url = new URL(window.location);
        const paramName = category === "filter.v.m.color.name" ? `filter.v.m.color.name` : `filter.p.m.custom.${category}`;

        let filterItem = filterItemValue.toLocaleLowerCase().replaceAll(" ", "").replaceAll("&", "");

        if (resetFilter) {
            [...url.searchParams.keys()].filter((k) => k.startsWith("filter.p.m.custom") || k.startsWith("filter.v.m") || k.startsWith("filteritem")).forEach((k) => url.searchParams.delete(k));
        } else if (deleteFilter) {
            let existing = url.searchParams.getAll(paramName);
            let filtered = existing.filter((v) => v !== value);
            let existing2 = url.searchParams.getAll("filteritem");
            let filtered2 = existing2.filter((v) => v !== filterItem);

            url.searchParams.delete(paramName);
            url.searchParams.delete("filteritem");

            filtered.forEach((v) => url.searchParams.append(paramName, v));
            filtered2.forEach((v) => url.searchParams.append("filteritem", v));
        } else {
            let existing = url.searchParams.getAll(paramName);
            if (!existing.includes(value)) {
                url.searchParams.append(paramName, value);
                url.searchParams.append("filteritem", filterItem);
            }
        }
        window.history.pushState({}, "", url);
        window.dispatchEvent(new Event("popstate"));

        category == "filter_accessory_type" ? hf.query('button[data-filter-value="gid://shopify/Metaobject/57071861993"]').click() : testData.triggerBtn.click();

        markFilterRefreshPending();
        scheduleUseCaseRefresh();
    }

    function getFilteredProductCount() {
        return hf.queryAll("#ProductGridContainer > .collection .product-card")?.length;
    }

    function getFirstVisibleHeading(selectors) {
        const headings = selectors.flatMap((selector) => [...hf.queryAll(selector)]);
        return headings.find((heading) => heading?.getClientRects?.().length) || headings[0] || null;
    }

    function addFilterTrigger() {
        waitForElem("#ProductGridContainer, facets-filters", () => {
            const shopToggleRow = hf.query(`.${tid}-shop-toggle-row`);
            const fallbackAnchor = hf.query("facets-filters");
            const hasUrlFilter = [...new URLSearchParams(window.location.search).keys()].some((key) => key.includes("filter"));
            const useCaseHeading = document.body.classList.contains(`${tid}-usecase-enabled`) ? getFirstVisibleHeading([`#ProductGridContainer > .${tid}-section:not(.hidden-type-filter) .collection__title h2`, `#ProductGridContainer > .${tid}-section:not(.hidden-type-filter) .heading h2`]) : null;
            const firstHeading = useCaseHeading || getFirstVisibleHeading(["#ProductGridContainer > .collection .heading h2", "#ProductGridContainer > .collection .collection__title h2", "#ProductGridContainer > .collection h2"]);
            const useHeadingPlacement = !hasUrlFilter && firstHeading;
            const insertAnchor = useHeadingPlacement ? firstHeading : shopToggleRow || fallbackAnchor;
            if (!insertAnchor) return;
            const triggerMarkup = `
          <div class="${tid}-filter-trigger-wrapper">
            <div class="${tid}-filter-trigger-container">
              <div class="${tid}-filter-trigger">
                <span class="${tid}-filter-trigger-icon">${svgObj["filter-switch"]}</span>
                <span class="${tid}-filter-trigger-copy">Filter</span>
                <span class="${tid}-filter-trigger-count">(0)</span>
              </div>
              <div class="${tid}-filter-trigger-count-wrapper">
                <span class="${tid}-filter-item-count">0 result</span>
              </div>
            </div>
          </div>`;

            if (useHeadingPlacement) {
                firstHeading.classList.add(`${tid}-collection-heading`);
                const headingRow = firstHeading.closest(".heading, .collection__title") || firstHeading.parentElement;
                headingRow?.classList.add(`${tid}-collection-heading-row`);
                headingRow?.classList.toggle(`${tid}-usecase-heading-row`, !!headingRow.querySelector("swiper-products"));
            }

            const filterTriggerWrapper = hf.query(`.${tid}-filter-trigger-wrapper`);
            if (!filterTriggerWrapper) {
                insertAnchor.insertAdjacentHTML("afterend", triggerMarkup);
            } else if (filterTriggerWrapper.previousElementSibling !== insertAnchor || filterTriggerWrapper.parentElement !== insertAnchor.parentElement) {
                insertAnchor.insertAdjacentElement("afterend", filterTriggerWrapper);
            }

            hf.query(`.${tid}-filter-trigger-wrapper`)?.classList.toggle(`${tid}-filter-trigger-standalone`, !useHeadingPlacement);

            updateFilterResultCount();
            updateAppliedFilterCount();
            bindFilterTriggerClick();

            if (!hasUrlFilter && !document.body.classList.contains(`${tid}-usecase-enabled`) && !firstHeading) {
                setTimeout(addFilterTrigger, 300);
            }
        });
    }

    function bindFilterTriggerClick() {
        if (testData.filterTriggerClickBound) return;
        testData.filterTriggerClickBound = true;

        document.addEventListener("click", (ev) => {
            if (!ev.target.closest(`.${tid}-filter-trigger`)) return;

            hf.classAdd(`.${tid}-filter-wrapper`, `expanded`);
            hf.classAdd(`body`, `overflow-hidden`);
            hf.classAdd(`html`, `overflow-hidden`);
        });
    }

    function updateFilterResultCount() {
        const count = getFilteredProductCount();
        if (hf.query(`.${tid}-filter-item-count`)) {
            hf.query(`.${tid}-filter-item-count`).textContent = count + " " + (count == 1 ? "result" : "results");
        }
    }

    function getAppliedFilterCount() {
        const appliedCount = hf.queryAll(`.${tid}-applied-filter-item`)?.length || 0;
        const activeCount = hf.queryAll(`.${tid}-filter-item-active`)?.length || 0;
        return Math.max(appliedCount, activeCount);
    }

    function updateAppliedFilterCount() {
        const count = getAppliedFilterCount();
        if (hf.query(`.${tid}-filter-trigger-count`)) {
            hf.query(`.${tid}-filter-trigger-count`).textContent = "(" + count + ")";
        }

        if (count > 0) {
            hf.classAdd(`.${tid}-filter-trigger-container`, `filteradded`);
            hf.classRemove(`.${tid}-clear-all-btn`, `hidden`);
        } else {
            hf.classRemove(`.${tid}-filter-trigger-container`, `filteradded`);
            hf.query(`.${tid}-clear-all-btn`)?.classList.add(`hidden`);
        }
    }

    function addUseCaseRuntimeStyle() {
        if (hf.query(`.${tid}-usecase-runtime-css`)) return;

        const style = document.createElement("style");
        style.classList.add(`${tid}-usecase-runtime-css`);
        style.innerHTML = `
body.${tid}-codeInject .${tid}-usecase-toggle[aria-checked="false"]{background-color:#d8d5cf}
body.${tid}-codeInject .${tid}-usecase-toggle[aria-checked="false"] .${tid}-usecase-toggle-knob{left:2px}
body.${tid}-codeInject #ProductGridContainer > .${tid}-section{display:none}
body.${tid}-codeInject.${tid}-usecase-enabled #ProductGridContainer > .collection{display:none !important}
body.${tid}-codeInject.${tid}-usecase-enabled #ProductGridContainer > .${tid}-section{display:block}
body.${tid}-codeInject.${tid}-usecase-enabled.${tid}-filter-refreshing #ProductGridContainer > .${tid}-section{display:none !important}
body.${tid}-codeInject .${tid}-section.hidden-type-filter,body.${tid}-codeInject .hidden-type-filter{display:none !important}
body.${tid}-codeInject .${tid}-section .collection.display-block{display:block !important}
body.${tid}-codeInject .${tid}-section .swiper-wrapper{scrollbar-width:none;-ms-overflow-style:none}
body.${tid}-codeInject .${tid}-section .swiper-wrapper::-webkit-scrollbar{display:none}
body.${tid}-codeInject .${tid}-section .swiper-footer{overflow-x:auto;overflow-y:hidden;scrollbar-width:none;-ms-overflow-style:none}
body.${tid}-codeInject .${tid}-section .swiper-footer::-webkit-scrollbar{display:none}
body.${tid}-codeInject .${tid}-section .${tid}-pagination{display:flex;justify-content:center;min-width:fit-content;height:41px;align-items:center}
body.${tid}-codeInject .${tid}-section .${tid}-pagination-itemwrap{width:24px;height:24px;display:flex;align-items:center;justify-content:center}
body.${tid}-codeInject .${tid}-section .${tid}-pagination-item{display:inline-block}
body.${tid}-codeInject .${tid}-section .${tid}-pagination-item:before{content:"";width:10px;height:10px;border-radius:50%;background-color:#252427;opacity:.5;display:inline-block}
body.${tid}-codeInject .${tid}-section .${tid}-pagination-item.active:before{opacity:1 !important}
body.${tid}-codeInject .${tid}-section .swiper-pagination{min-width:fit-content}
body.${tid}-codeInject .${tid}-section .swiper-footer.scroll-enabled{max-width:70%;justify-content:flex-start;margin:0 auto}
body.${tid}-codeInject .${tid}-section .heading-section{font-size:32px}`;
        document.head.appendChild(style);
    }

    function addUseCaseToggle() {
        waitForElem("#ProductGridContainer", (containers) => {
            const grid = containers[0];

            if (!hf.query(`.${tid}-shop-toggle-row`)) {
                grid.insertAdjacentHTML(
                    "beforebegin",
                    `
          <div class="${tid}-shop-toggle-row">
            <h1 class="${tid}-shop-title">Shop</h1>
            <div class="${tid}-usecase-toggle-wrap">
              <span class="${tid}-usecase-toggle-label">Use cases</span>
              <button class="${tid}-usecase-toggle" type="button" role="switch" aria-checked="false" aria-label="Use cases">
                <span class="${tid}-usecase-toggle-knob"></span>
              </button>
            </div>
          </div>`
                );
            }

            if (!testData.useCaseToggleInitialized) {
                testData.useCaseToggleInitialized = true;
                setUseCaseEnabled(false);
            }

            const toggle = hf.query(`.${tid}-usecase-toggle`);
            if (toggle && !toggle.getAttribute(`${tid}-listener-added`)) {
                toggle.setAttribute(`${tid}-listener-added`, "true");
                toggle.addEventListener("click", () => {
                    setUseCaseEnabled(toggle.getAttribute("aria-checked") !== "true");
                });
            }
        });
    }

    function setUseCaseEnabled(enabled) {
        hf.query(`.${tid}-usecase-toggle`)?.setAttribute("aria-checked", enabled ? "true" : "false");
        document.body.classList.toggle(`${tid}-usecase-enabled`, enabled);
        window.sessionStorage.setItem(`${tid}-usecase-enabled`, String(enabled));

        if (enabled) {
            document.body.classList.add(`${tid}-usecase-loading`);
            addUseCaseLoadingCard();
            scheduleUseCaseRefresh();
        } else {
            document.body.classList.remove(`${tid}-usecase-loading`);
            setTimeout(addFilterTrigger, 100);
        }
    }

    function addUseCaseLoadingCard() {
        if (hf.query(`.${tid}-usecase-loader`)) return;

        const shopToggleRow = hf.query(`.${tid}-shop-toggle-row`);
        const grid = hf.query("#ProductGridContainer");
        const insertAnchor = shopToggleRow || grid;
        if (!insertAnchor) return;

        const loaderMarkup = `
          <div class="${tid}-usecase-loader" aria-hidden="true">
            <div class="${tid}-usecase-loader-card"></div>
          </div>`;

        insertAnchor.insertAdjacentHTML(shopToggleRow ? "afterend" : "beforebegin", loaderMarkup);
    }

    function getOriginalProductCard(productHandle) {
        const root = window.Shopify?.routes?.root || "/";
        return hf.query(`#ProductGridContainer > .collection .product-card .card__link[href="${root}products/${productHandle}"], #ProductGridContainer > .collection .product-card .card__link[href^="${root}products/${productHandle}?"]`)?.closest(".product-card");
    }

    function getOriginalProductSignature() {
        return [...hf.queryAll("#ProductGridContainer > .collection .product-card .card__link")]
            .map((link) => link.getAttribute("href")?.split("?")[0])
            .filter(Boolean)
            .join("|");
    }

    function markFilterRefreshPending() {
        document.body.classList.add(`${tid}-filter-refreshing`);
        testData.filterRefreshStartedAt = Date.now();
        if (document.body.classList.contains(`${tid}-usecase-enabled`)) {
            document.body.classList.add(`${tid}-usecase-loading`);
            addUseCaseLoadingCard();
        }
    }

    function waitForStableFilterResult(callback, delay = 1200) {
        const firstSignature = getOriginalProductSignature();
        setTimeout(() => {
            const secondSignature = getOriginalProductSignature();
            if (firstSignature === secondSignature) {
                callback(secondSignature);
            } else {
                waitForStableFilterResult(callback, delay);
            }
        }, delay);
    }

    function isScrollableX(el) {
        return el && el.scrollWidth > el.clientWidth + 16;
    }

    function getSlideInView(swiperElem) {
        if (!swiperElem) return 0;
        let slides = [...swiperElem.querySelectorAll(".swiper-slide:not(.hidden-type-filter)")];
        if (!slides.length) return 0;

        let closestIndex = slides[0].getAttribute("pagination-value");
        slides.forEach((slide) => {
            let sliderLeft = slide.offsetLeft;
            let sliderRight = slide.offsetLeft + slide.offsetWidth;
            let viewableBoxLeft = swiperElem.scrollLeft;
            let viewableBoxRight = swiperElem.scrollLeft + swiperElem.offsetWidth;
            if (sliderLeft <= viewableBoxLeft + 16 || sliderRight == viewableBoxRight - 16 || sliderRight == viewableBoxRight - 15 || sliderRight == viewableBoxRight - 17) {
                closestIndex = slide.getAttribute("pagination-value");
            }
        });
        return closestIndex;
    }

    function refreshUseCaseSwatchIds() {
        hf.queryAll(`.${tid}-section variant-swatches fieldset`).forEach((fieldset, index) => {
            const swatchBlock = fieldset.querySelector(`div[data-variant-swatch]`);
            const legend = fieldset.querySelector(`.variant-swatch__label legend`);
            const labelValue = fieldset.querySelector(`.variant-swatch__label span`);
            const oldDatablockId = swatchBlock?.getAttribute("data-block-id");
            const newDatablockId = `${tid}-swatches-${index + 1}`;

            if (!oldDatablockId || oldDatablockId === newDatablockId) return;

            swatchBlock.setAttribute("data-block-id", newDatablockId);
            fieldset.setAttribute("aria-labelledby", fieldset.getAttribute("aria-labelledby")?.replace(oldDatablockId, newDatablockId) || newDatablockId);
            legend?.setAttribute("id", legend.getAttribute("id")?.replace(oldDatablockId, newDatablockId) || newDatablockId);
            labelValue?.setAttribute("id", labelValue.getAttribute("id")?.replace(oldDatablockId, newDatablockId) || `${newDatablockId}-value`);

            fieldset.querySelectorAll("input, label").forEach((swatchElm, swatchIndex) => {
                if (swatchElm.tagName == "INPUT") {
                    swatchElm.setAttribute("id", swatchElm.getAttribute("id")?.replace(oldDatablockId, newDatablockId) || newDatablockId);
                    swatchElm.setAttribute("name", swatchElm.getAttribute("name")?.replace(oldDatablockId, newDatablockId) || newDatablockId);
                    if (swatchIndex == 0) swatchElm.setAttribute("checked", true);
                } else if (swatchElm.tagName == "LABEL") {
                    swatchElm.setAttribute("for", swatchElm.getAttribute("for")?.replace(oldDatablockId, newDatablockId) || newDatablockId);
                }
            });
        });
    }

    function findKeysByItem(obj, item) {
        return Object.keys(obj).filter((key) => obj[key].includes(item));
    }

    function renderUseCaseSections() {
        const grid = hf.query("#ProductGridContainer");
        if (!grid) return;

        const productSignature = getOriginalProductSignature();
        if (testData.useCaseProductSignature === productSignature && hf.query(`#ProductGridContainer > .${tid}-section`)) {
            document.body.classList.remove(`${tid}-usecase-loading`);
            return;
        }

        testData.useCaseProductSignature = productSignature;
        testData.isRenderingUseCase = true;

        const renderGroup = (itemObject, startIndex = 0) => {
            Object.keys(itemObject).forEach((usecaseItem, objectIndex) => {
                const index = startIndex + objectIndex;
                const seenHandles = [];
                const slides = [];

                if (!hf.query(`#ProductGridContainer .${tid}-section[usecase-name="${usecaseItem}"]`)) {
                    grid.insertAdjacentHTML(
                        "beforeend",
                        `
          <section class="${tid}-section ${tid}-section-${index}" usecase-name="${usecaseItem}">
            <div class="collection py-6 md-py-12 display-block">
              <div class="collection__title">
                <h2 class="heading-section">${usecaseItem}</h2>
                <swiper-products class="pb-6 swiper swiper-section-${index}">
                  <div class="swiper-wrapper"></div>
                  <div class="swiper-footer">
                    <div class="${tid}-pagination hidden"></div>
                    <div class="swiper-pagination"></div>
                  </div>
                </swiper-products>
              </div>
            </div>
          </section>`
                    );
                }

                const section = hf.query(`#ProductGridContainer .${tid}-section[usecase-name="${usecaseItem}"]`);
                const swiperWrapper = section?.querySelector(".swiper-wrapper");
                const pagination = section?.querySelector(`.${tid}-pagination`);
                const nativePagination = section?.querySelector(".swiper-pagination");

                itemObject[usecaseItem].items.forEach((productHandle) => {
                    if (!productHandle || seenHandles.includes(productHandle)) return;
                    seenHandles.push(productHandle);

                    const productCard = getOriginalProductCard(productHandle);
                    if (!productCard) return;

                    const cloneCard = productCard.cloneNode(true);
                    const oldCardClasses = [...cloneCard.classList].filter((className) => className.endsWith("-oldcard"));
                    if (oldCardClasses.length) {
                        cloneCard.classList.remove(...oldCardClasses);
                    }
                    findKeysByItem(typeObj, productHandle).forEach((itemType) => {
                        cloneCard.classList.add(`${tid}-${itemType}`);
                        cloneCard.querySelector(".card-wrapper")?.classList.add(`${tid}-${itemType}`);
                    });
                    slides.push({
                        handle: productHandle,
                        html: cloneCard.innerHTML,
                    });
                });

                section?.classList.toggle("hidden-type-filter", slides.length == 0);

                if (swiperWrapper) {
                    swiperWrapper.innerHTML = slides
                        .map(
                            (slide, slideIndex) => `
                    <div class="swiper-slide" data-handle="${slide.handle}" pagination-value="${slideIndex + 1}">${slide.html}</div>`
                        )
                        .join("");
                }

                if (pagination) {
                    pagination.innerHTML = slides
                        .map(
                            (_slide, slideIndex) => `
                      <div class="${tid}-pagination-itemwrap">
                        <span class="${tid}-pagination-item ${slideIndex == 0 ? "active" : ""}" pagination-value="${slideIndex + 1}"></span>
                      </div>`
                        )
                        .join("");

                    pagination.classList.toggle("hidden", slides.length <= 6);
                }

                nativePagination?.classList.toggle("hidden", slides.length > 6);

                waitForElem(
                    `.${tid}-section .swiper-section-${index}.swiper.swiper-initialized`,
                    () => {
                        const itemWrapper = hf.query(`.${tid}-section .swiper-section-${index}.swiper.swiper-initialized .swiper-wrapper`);
                        const footer = hf.query(`.${tid}-section .swiper-section-${index}.swiper.swiper-initialized .swiper-footer`);

                        if (isScrollableX(footer)) {
                            footer.classList.add("scroll-enabled");
                        }

                        itemWrapper?.closest(".swiper")?.swiper?.update?.();

                        if (itemWrapper?.getAttribute(`${tid}-scroll-listener`)) return;
                        itemWrapper?.setAttribute(`${tid}-scroll-listener`, "true");
                        itemWrapper?.addEventListener("scroll", () => {
                            let activeIndex = getSlideInView(itemWrapper);
                            hf.query(`.${tid}-section .swiper-section-${index} .${tid}-pagination-item.active`)?.classList.remove("active");
                            hf.query(`.${tid}-section .swiper-section-${index} .${tid}-pagination-item[pagination-value="${activeIndex}"]`)?.classList.add("active");

                            let activeDot = hf.query(`.${tid}-section .swiper-section-${index}.swiper.swiper-initialized .${tid}-pagination-item.active`)?.closest(`.${tid}-pagination-itemwrap`);
                            if (activeDot) {
                                if (activeDot.offsetLeft < activeDot.offsetWidth * 8) {
                                    hf.query(`.${tid}-section .swiper-section-${index}.swiper.swiper-initialized .swiper-footer`)?.scrollTo({
                                        left: 0,
                                        behavior: "smooth",
                                    });
                                } else if (activeDot.offsetLeft > activeDot.offsetWidth * 11) {
                                    hf.query(`.${tid}-section .swiper-section-${index}.swiper.swiper-initialized .swiper-footer`)?.scrollTo({
                                        left: 1000,
                                        behavior: "smooth",
                                    });
                                }
                            }
                        });
                    },
                    1,
                    false,
                    50000,
                    500
                );
            });
        };

        renderGroup(useCaseObj);
        renderGroup(useCaseObjExtra, Object.keys(useCaseObj).length);
        refreshUseCaseSwatchIds();
        addFilterTrigger();
        setTimeout(() => {
            testData.isRenderingUseCase = false;
            document.body.classList.remove(`${tid}-usecase-loading`);
        }, 0);
    }

    function scheduleUseCaseRefresh() {
        if (testData.useCaseRefreshTimer) {
            clearTimeout(testData.useCaseRefreshTimer);
        }
        const refreshToken = Date.now();
        testData.useCaseRefreshToken = refreshToken;

        testData.useCaseRefreshTimer = setTimeout(() => {
            waitForStableFilterResult(() => {
                if (testData.useCaseRefreshToken !== refreshToken) return;

                updateFilterResultCount();
                if (document.body.classList.contains(`${tid}-usecase-enabled`)) {
                    renderUseCaseSections();
                } else {
                    document.body.classList.remove(`${tid}-usecase-loading`);
                }
                document.body.classList.remove(`${tid}-filter-refreshing`);
            });
        }, 300);
    }

    function bindUseCasePagination() {
        waitForElem("#ProductGridContainer", (containers) => {
            const grid = containers[0];
            if (grid.getAttribute(`${tid}-pagination-listener`)) return;

            grid.setAttribute(`${tid}-pagination-listener`, "true");
            grid.addEventListener("click", (ev) => {
                if (!ev.target.closest(`.${tid}-pagination-item`)) return;

                const section = ev.target.closest(`.${tid}-section`);
                const card = section?.querySelector(".swiper-slide:not(.hidden-type-filter)");
                const wrapper = section?.querySelector(".swiper-wrapper");
                if (!section || !card || !wrapper) return;

                let cardIndex = parseInt(ev.target.closest(`.${tid}-pagination-item`).getAttribute("pagination-value"));
                section.querySelectorAll(".swiper-wrapper .swiper-slide:not(.hidden-type-filter)").forEach((element, index) => {
                    if (parseInt(element.getAttribute("pagination-value")) == cardIndex) {
                        cardIndex = index + 1;
                    }
                });

                ev.target.closest(`.${tid}-pagination`).querySelector(`.${tid}-pagination-item.active`)?.classList.remove("active");
                ev.target.closest(`.${tid}-pagination-item`).classList.add("active");

                wrapper.scrollTo({
                    left: card.offsetWidth * (cardIndex - 1) + 16 * (cardIndex - 1),
                    behavior: "smooth",
                });
            });
        });
    }

    function observeProductGrid() {
        waitForElem("#ProductGridContainer", (containers) => {
            if (testData.gridObserver) return;

            testData.gridObserver = new MutationObserver((mutations) => {
                if (testData.isRenderingUseCase) return;

                const hasProductGridMutation = mutations.some((mutation) => {
                    if (mutation.target?.closest?.(`.${tid}-section`)) return false;

                    const changedNodes = [...mutation.addedNodes, ...mutation.removedNodes].filter((node) => node.nodeType === 1);

                    return changedNodes.some((node) => !node.classList?.contains(`${tid}-section`) && !node.closest?.(`.${tid}-section`));
                });

                if (!hasProductGridMutation) return;

                addUseCaseToggle();
                addFilterTrigger();
                scheduleUseCaseRefresh();
            });
            testData.gridObserver.observe(containers[0], {
                childList: true,
                subtree: true,
            });
        });
    }

    let testCode = {
        init: () => {
            waitForElem("body", () => {
                if (!hf.query(`body.${testData.handle}-codeInject`)) {
                    hf.classAdd("body", `${testData.handle}-codeInject`);

                    testCode.mainCode();
                }
            });
        },
        mainCode: () => {
            waitForElem(
                "allColorSwatchesObject",
                () => {
                    !hf.query(`.${tid}-filter-wrapper`) &&
                        hf.query("body").insertAdjacentHTML(
                            "afterbegin",
                            `
          <div class="${tid}-filter-wrapper">
            <div class="${tid}-filter-container">
              <div class="${tid}-filter-header">
                <div class="${tid}-filter-close""}><span class="${tid}-filter-close-text">Close</span> <span class="${tid}-filter-close-icon">${svgObj["cross-big"]}</span></div>
              </div>  
              <div class="${tid}-filter-content">
                <div class="${tid}-applied-filters-section ${tid}-filter-section">
                  <h2 class="${tid}-applied-filters-title">Applied filters</h2>
                  <div class="${tid}-applied-filters-list">
                  </div>
                  <div class="${tid}-clear-all-btn button button tertiary hidden">Clear all</div>
                </div>
              </div>
            </div>
          </div>
        `
                        );

                    Object.keys(filterData).forEach((key) => {
                        !hf.query(`.${tid}-filter-section[data-filter-type="${key}"]`) &&
                            hf.query(`.${tid}-filter-content`).insertAdjacentHTML(
                                "beforeend",
                                `
            <div class="${tid}-filter-section" data-filter-type="${key}">
            <h2 class="${tid}-filter-section-title">${key}</h2>
            <div class="${tid}-filter-section-list">
            ${Object.values(filterData[key])
                .map((filterItem) => {
                    return `
            <div class="${tid}-filter-item" data-filter-value="${filterItem.name}" data-filter-category="${key}" data-filter-param="${filterItem.filterParam}" data-filter-type="${filterItem.type}">
              ${filterItem.icon ? `<span class="${tid}-filter-item-icon">${filterItem.icon}</span>` : ""}
              ${key == "Colors" ? `<span class="${tid}-filter-item-color-iconwrap"><span class="${tid}-filter-item-color-icon" style="background-image: url(${allColorSwatchesObject[filterItem.name] && allColorSwatchesObject[filterItem.name]?.image}); background-color: ${filterData[key][filterItem.name]?.colorCode}"></span></span>` : ""}
              <span class="${tid}-filter-item-name">${filterItem.name}</span>
            </div>
                    `;
                })
                .join("")}
                </div>
              </div>
            `
                            );
                    });

                    waitForElem(`facets-filters div[data-filter-param="filter.p.m.custom.filter_product_type"] button:not([data-shop-all="true"])`, (elm) => {
                        testData.triggerBtn = elm[0];
                        testData.triggerBtn.setAttribute("data-filter-param", "|");
                        testData.triggerBtn.setAttribute("data-filter-value", "|");

                        hf.query(`.${tid}-filter-wrapper`).addEventListener("click", (ev) => {
                            if (ev.target.closest(`.${tid}-filter-item`)) {
                                let appliedFilterDiv = hf.query(`.${tid}-applied-filters-list`);
                                let filterItemValue = ev.target.closest(`.${tid}-filter-item`).getAttribute("data-filter-value");
                                let filterItemCategory = ev.target.closest(`.${tid}-filter-item`).getAttribute("data-filter-category");
                                let filterItemParam = ev.target.closest(`.${tid}-filter-item`).getAttribute("data-filter-param");
                                let filterItemType = ev.target.closest(`.${tid}-filter-item`).getAttribute("data-filter-type");
                                if (ev.target.closest(`.${tid}-filter-item.${tid}-filter-item-active`)) {
                                    appliedFilterDiv.querySelector(`.${tid}-applied-filter-item[data-filter-value="${filterItemValue}"][data-filter-category="${filterItemCategory}"]`)?.click();
                                } else {
                                    !appliedFilterDiv.querySelector(`.${tid}-applied-filter-item[data-filter-value="${filterItemValue}"][data-filter-category="${filterItemCategory}"]`) &&
                                        appliedFilterDiv.insertAdjacentHTML(
                                            "beforeend",
                                            `
                <div class="${tid}-applied-filter-item" data-filter-value="${filterItemValue}" data-filter-category="${filterItemCategory}" data-filter-type="${filterItemType}" data-filter-param="${filterItemParam}">
                 ${filterItemCategory == "Colors" ? `<span class="${tid}-applied-filter-item-color-iconwrap"><span class="${tid}-applied-filter-item-color-icon" style="background-image: url(${allColorSwatchesObject[filterItemValue] && allColorSwatchesObject[filterItemValue]?.image}); background-color: ${filterData[filterItemCategory][filterItemValue]?.colorCode}"></span></span>` : ""}
                 ${filterData[filterItemCategory][filterItemValue]?.icon ? `<span class="${tid}-applied-filter-item-icon">${filterData[filterItemCategory][filterItemValue].icon}</span>` : ""}
                  <span class="${tid}-applied-filter-item-name">${filterItemValue}</span>
                  <span class="${tid}-applied-filter-item-remove">${svgObj["cross-small"]}</span>
                </div>
              `
                                        );

                                    ev.target.closest(`.${tid}-filter-item`).classList.add(`${tid}-filter-item-active`);
                                    updateAppliedFilterCount();
                                    setFilter(false, false, filterItemType, filterItemParam, filterItemValue);
                                }
                            } else if (ev.target.closest(`.${tid}-applied-filter-item`)) {
                                let filterItemValue = ev.target.closest(`.${tid}-applied-filter-item`).getAttribute("data-filter-value");
                                let filterItemCategory = ev.target.closest(`.${tid}-applied-filter-item`).getAttribute("data-filter-category");
                                let filterItemType = ev.target.closest(`.${tid}-applied-filter-item`).getAttribute("data-filter-type");
                                let filterItemParam = ev.target.closest(`.${tid}-applied-filter-item`).getAttribute("data-filter-param");
                                setFilter(false, true, filterItemType, filterItemParam, filterItemValue);
                                ev.target.closest(`.${tid}-applied-filter-item`).remove();
                                hf.query(`.${tid}-filter-item[data-filter-value="${filterItemValue}"][data-filter-category="${filterItemCategory}"]`).classList.remove(`${tid}-filter-item-active`);
                                updateAppliedFilterCount();
                            } else if (ev.target.closest(`.${tid}-clear-all-btn`)) {
                                hf.query(`.${tid}-applied-filters-list`).innerHTML = "";
                                hf.queryAll(`.${tid}-filter-item-active`).forEach((el) => {
                                    el.classList.remove(`${tid}-filter-item-active`);
                                });
                                setFilter(true);
                                ev.target.closest(`.${tid}-clear-all-btn`).classList.add(`hidden`);
                                updateAppliedFilterCount();
                            } else if (ev.target.closest(`.${tid}-filter-close`)) {
                                hf.classRemove(`.${tid}-filter-wrapper`, `expanded`);
                                hf.classRemove(`body`, `overflow-hidden`);
                                hf.classRemove(`html`, `overflow-hidden`);
                            }

                            scheduleUseCaseRefresh();
                        });

                        addUseCaseRuntimeStyle();
                        addUseCaseToggle();
                        bindUseCasePagination();
                        observeProductGrid();
                        scheduleUseCaseRefresh();

                        addFilterTrigger();
                    });

                    waitForElem(`.${tid}-filter-trigger`, () => {
                        bindFilterTriggerClick();
                        preSeletedFilters();
                    });
                },
                1,
                true
            );
        },
    };
    testCode.init();
})();
