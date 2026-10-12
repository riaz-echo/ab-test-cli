
(function() {
    const removeStorageValue = () => window.sessionStorage.removeItem('PDP_XSELL_BELOW_SPECS_counter');
 
    let count = +window.sessionStorage?.getItem('PDP_XSELL_BELOW_SPECS_counter') || 0;

    const isReady = () =>
        document.querySelector('.single_product_details_area .container > .row') &&
        document.querySelector('#related-products-desktop, #releated-products');

    if (isReady()) {
        removeStorageValue();
        return true;
    } else if (count >= 300) {
        removeStorageValue();
        return false;
    } else {
        window.sessionStorage.setItem('PDP_XSELL_BELOW_SPECS_counter', ++count);
        convert_recheck_experiment();
        return false;
    }
})()