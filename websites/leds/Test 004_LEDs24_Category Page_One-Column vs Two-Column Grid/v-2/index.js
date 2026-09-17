(function () {
    const STYLE_ID = "varify-listing-tweaks";
    const BODY_CLASS = "leds24-test004";

    function injectStyle() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.type = "text/css";

        style.textContent = `
         @media (max-width: 575.98px) {
             .cms-element-product-listing .cms-listing-row {
                 display: flex;
                 flex-wrap: wrap;
                 margin-left: -8px !important;
                 margin-right: -8px !important;
                 padding:0 !important;
             }

             .cms-element-product-listing .cms-listing-col.col-12 {
                 flex: 0 0 50% !important;
                 max-width: 50% !important;
                 width: 50% !important;
                 padding-left: 8px !important;
                 padding-right: 8px !important;
             }
 
             .cms-element-product-listing .cms-listing-col .product-price-wrapper {
                 display: flex !important;
                 flex-direction: column-reverse !important;
                 align-items: flex-end !important;
                 height: auto !important;
             }
 
             .cms-element-product-listing .cms-listing-col .product-price-wrapper .product-stock-info {
                 position: static !important;
                 margin-top: 8px !important;
                 align-self: flex-start !important;
                 text-align: left !important;
             }
 
             .cms-element-product-listing .cms-listing-col .product-image-wrapper {
                 flex-direction: column !important;
                 align-items: flex-start !important;
                 justify-content: flex-start !important;
                 overflow: visible !important;
                 height: auto !important;
                 width: 100%  !important;
             }

             .product-feature-list-item .product-feature-value {
                    display: block !important;
             }
 
             .cms-element-product-listing .cms-listing-col .product-image-wrapper img.product-image {
                 order: 1 !important;
                 flex: 0 0 auto !important;
                 width: 100% !important;
                 height: auto !important;
                 -webkit-align-self: center !important;
                 align-self: center !important;
             }
 
             .cms-element-product-listing .cms-listing-col .product-image-wrapper img.cover-switch.product-image {
                 top: 0 !important;
                 left: 0 !important;
                 right: auto !important;
                 bottom: auto !important;
                 width: 100% !important;
                 height: auto !important;
                 max-height: none !important;
                 margin: 0 !important;
                 transform: none !important;
                 object-fit: contain !important;
                 object-position: top center !important;
             }

             .cms-element-product-listing .cms-listing-col .product-image-wrapper .k2p-product-icon-wrapper {
                 position: static !important;
                 order: 2 !important;
                 display: flex !important;
                 flex: 0 0 auto !important;
                 flex-wrap: wrap !important;
                 align-items: center !important;
                 gap: 4px !important;
                 margin-top: 8px !important;
                 width: 100% !important;
                 height: auto !important;
             }
         }
 
         .cms-element-product-listing .cms-listing-col ul.varify-feature-list {
             list-style: none !important;
             padding-left: 0 !important;
             padding-inline-start: 0 !important;
             margin-left: 0 !important;
         }

         .cms-element-product-listing .cms-listing-col .product-feature {
           display: none !important;
         }

         .cms-element-product-listing .cms-listing-col .card-body {
             padding: 8px !important;
         }
 
         .cms-element-product-listing .cms-listing-col .product-ordernumber {
             display: none !important;
         }
 
         .cms-element-product-listing .cms-listing-col .product-name {
             margin-top: 4px !important;
         }
 
         .cms-element-product-listing .cms-listing-col img.k2p-product-icon-media {
             width: 24px !important;
             height: 24px !important;
             object-fit: contain !important;
         }
 
         .cms-element-product-listing .cms-listing-col a.product-name,
         .cms-element-product-listing .cms-listing-col .product-price {
             font-size: 16px !important;
         }

         .cms-element-product-listing .cms-listing-col .product-series {
             margin-top: 5px !important;
         }
 
         .cms-element-product-listing .cms-listing-col a.product-name {
             height: auto !important;
         }
 
         .cms-element-product-listing .cms-listing-col .product-badges {
             top: 15px !important;
             left: 15px !important;
         }
     `;

        document.head.appendChild(style);
    }

    function markFeatureLists(scope) {
        var root = scope && scope.querySelectorAll ? scope : document;
        var items = root.querySelectorAll(".cms-element-product-listing .cms-listing-col .product-feature-list-item");

        for (var i = 0; i < items.length; i++) {
            var ul = items[i].parentElement;
            if (ul && ul.tagName === "LI") ul = ul.parentElement;
            if (ul && ul.tagName === "UL") {
                ul.classList.add("varify-feature-list");
            }
        }
    }

    function normalizeIconSizes(scope) {
        var root = scope && scope.querySelectorAll ? scope : document;
        var icons = root.querySelectorAll(".cms-element-product-listing .cms-listing-col .product-image-wrapper .k2p-product-icon-wrapper img");

        for (var i = 0; i < icons.length; i++) {
            var icon = icons[i];
            if (!icon.getAttribute("style")) continue;

            icon.style.removeProperty("width");
            icon.style.removeProperty("height");

            if (!icon.getAttribute("style").trim()) icon.removeAttribute("style");
        }
    }

    function observeListing(row) {
        var target = row.closest(".cms-element-product-listing") || row;
        var observer = new MutationObserver(function (mutations) {
            for (var i = 0; i < mutations.length; i++) {
                if (mutations[i].type === "childList") markFeatureLists(target);
            }

            normalizeIconSizes(target);
        });

        observer.observe(target, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["style"],
        });
    }

    function tagBody() {
        if (document.body) {
            document.body.classList.add(BODY_CLASS);
            return;
        }

        document.addEventListener("DOMContentLoaded", tagBody);
    }

    tagBody();

    window.varify.helpers.waitFor("body." + BODY_CLASS, function () {
        injectStyle();
        markFeatureLists(document);
        normalizeIconSizes(document);

        window.varify.helpers.waitFor(".cms-element-product-listing .cms-listing-row", function (row) {
            injectStyle();
            markFeatureLists(row);
            normalizeIconSizes(row);
            observeListing(row);
        });
    });
})();
