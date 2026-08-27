(function () {
    const STYLE_ID = "varify-listing-tweaks";

    function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.type = 'text/css';

    style.textContent = `
         /* Mobile: 2-column grid */
         @media (max-width: 575.98px) {
             .cms-element-product-listing .cms-listing-row {
                 display: flex;
                 flex-wrap: wrap;
             }
 
             .cms-element-product-listing .cms-listing-col.col-12 {
                 flex: 0 0 50% !important;
                 max-width: 50% !important;
                 width: 50% !important;
             }
 
             /* Mobile: price above, availability below */
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
 
             /* Mobile: product icons below the image */
             .cms-element-product-listing .cms-listing-col .product-image-wrapper {
                 flex-direction: column !important;
                 align-items: flex-start !important;
                 justify-content: flex-start !important;
                 overflow: visible !important;
                 height: auto !important;
                 width: 100%  !important;
             }
 
             .cms-element-product-listing .cms-listing-col .product-image-wrapper img.product-image {
                 order: 1 !important;
                 flex: 0 0 auto !important;
                 width: 100% !important;
                 height: auto !important;
                 -webkit-align-self: center !important;
                 align-self: center !important;
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
 
         /* Feature list indentation */
         .cms-element-product-listing .cms-listing-col ul.varify-feature-list {
             padding-left: 15px !important;
         }
 
         /* Reduce card body padding */
         .cms-element-product-listing .cms-listing-col .card-body {
             padding: 8px !important;
         }
 
         /* Hide product order number */
         .cms-element-product-listing .cms-listing-col .product-ordernumber {
             display: none !important;
         }
 
         /* Product name spacing */
         .cms-element-product-listing .cms-listing-col .product-name {
             margin-top: 4px !important;
         }
 
         /* Product icon size */
         .cms-element-product-listing .cms-listing-col img.k2p-product-icon-media {
             width: 24px !important;
             height: 24px !important;
         }
 
         /* Product series spacing */
         .cms-element-product-listing .cms-listing-col .product-series {
             margin-top: 5px !important;
         }
 
         /* Remove fixed product-name height */
         .cms-element-product-listing .cms-listing-col a.product-name {
             height: auto !important;
         }
 
         /* Product badge positioning */
         .cms-element-product-listing .cms-listing-col .product-badges {
             top: 15px !important;
             left: 15px !important;
         }
     `;
 
     document.head.appendChild(style);
 }
  

    /* WebKit-sicherer Ersatz fuer ul:has(> .product-feature-list-item):
     markiert die passenden Listen mit einer Klasse. */
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

    window.varify.helpers.onDomLoaded(function () {
        injectStyle();
        markFeatureLists(document);
    });
    window.varify.helpers.waitFor(".cms-element-product-listing .cms-listing-row", function (row) {
        injectStyle();
        markFeatureLists(row);
    });
})();