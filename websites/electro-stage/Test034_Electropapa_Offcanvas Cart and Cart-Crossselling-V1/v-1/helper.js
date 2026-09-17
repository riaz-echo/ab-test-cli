
(function () {
    const PRODUCT_ID = "c0ecc3922d28382110f1f5fcfaf0bb84";
    const LOCALE_PREFIX = "/de";

    function getCsrfToken() {
        const input = document.querySelector('input[name="_csrf_token"]');
        if (input) return input.value;
        const meta = document.querySelector('meta[name="csrf-token"]');
        if (meta) return meta.content;
        return null;
    }

    async function addToCart(productId, qty = 1) {
        const formData = new FormData();
        formData.append(`lineItems[${productId}][id]`, productId);
        formData.append(`lineItems[${productId}][referencedId]`, productId);
        formData.append(`lineItems[${productId}][quantity]`, qty);
        formData.append(`lineItems[${productId}][type]`, "product");
        formData.append(`lineItems[${productId}][stackable]`, 1);
        formData.append(`lineItems[${productId}][removable]`, 1);
        formData.append("redirectTo", "frontend.cart.offcanvas");

        const csrf = getCsrfToken();
        if (csrf) formData.append("_csrf_token", csrf);

        const url = `${LOCALE_PREFIX}/checkout/line-item/add?offcanvas=1`;

        const res = await fetch(url, {
            method: "POST",
            body: formData,
            credentials: "include",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                Accept: "text/html, application/json",
            },
        });

        if (!res.ok) {
            console.error("Add to cart failed:", res.status, await res.text());
            return;
        }

        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            const json = await res.json();
            console.log("Add to cart JSON response:", json);
            if (json.contents) {
                injectOffcanvas(json.contents);
            }
        } else {
            const html = await res.text();
            injectOffcanvas(html);
        }
    }

    function injectOffcanvas(html) {
        let container = document.getElementById("test-offcanvas-container");
        if (!container) {
            container = document.createElement("div");
            container.id = "test-offcanvas-container";
            Object.assign(container.style, {
                position: "fixed",
                top: "0",
                right: "0",
                width: "380px",
                maxHeight: "100vh",
                overflowY: "auto",
                background: "#fff",
                boxShadow: "-2px 0 8px rgba(0,0,0,0.2)",
                zIndex: 999999,
                padding: "16px",
            });
            document.body.appendChild(container);
        }
        container.innerHTML = html;
    }

    const btn = document.createElement("button");
    btn.textContent = "Add to cart (test)";
    Object.assign(btn.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 999999,
        padding: "12px 20px",
        background: "#000",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "14px",
    });
    btn.addEventListener("click", () => addToCart(PRODUCT_ID, 1));
    document.body.appendChild(btn);

    console.log("Test add-to-cart button injected. Click it to run.");
})();

// Api call test
const offcanvasCartRecommendationsApiUrl = "/de/widgets/elio-data-discovery/cart-recommendations?offcanvas=1";

try {
    const response = await fetch(offcanvasCartRecommendationsApiUrl, {
        method: "GET",
        credentials: "same-origin",
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            Accept: "text/html, */*",
        },
    });

    console.log("Status:", response.status);
    console.log("Content-Type:", response.headers.get("content-type"));

    const html = await response.text();
    console.log("HTML Response:", html);
    document.body.insertAdjacentHTML("beforeend", html);
} catch (err) {
    console.error(err);
}


control api payload src :


lineItems[78397094a0976b0346cae5ed8946ede6][quantity]
1
redirectTo
frontend.cart.offcanvas
lineItems[78397094a0976b0346cae5ed8946ede6][isScl]
false
lineItems[78397094a0976b0346cae5ed8946ede6][id]
78397094a0976b0346cae5ed8946ede6
lineItems[78397094a0976b0346cae5ed8946ede6][type]
product
lineItems[78397094a0976b0346cae5ed8946ede6][referencedId]
78397094a0976b0346cae5ed8946ede6
lineItems[78397094a0976b0346cae5ed8946ede6][stackable]
1
lineItems[78397094a0976b0346cae5ed8946ede6][removable]
1
product-name
Kamera-Akku (2 Stück) als Ersatz für Panasonic DMW-BCM13E, DMW-BCM13 für Panasonic - 900mAh 3,6V Li-Ion
brand-name
