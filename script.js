function calculate() {
    updateProductRows();

    const numProducts = parseInt(el.products.value) || 0;
    const MIN_PLATFORM = 2500;
    const SUPPORT = 750;
    const CONSULT_RATE = 250;

    // 1. Calculate Monthly Platform Fee based on Cadence
    let totalProductCost = 0;
    const productRows = productContainer.querySelectorAll('.product-row');
    
    productRows.forEach(row => {
        const annualCadence = parseInt(row.querySelector('.prod-cadence').value);
        let costPerModel = 0;

        if (annualCadence >= 365) costPerModel = 200;
        else if (annualCadence >= 180) costPerModel = 300;
        else if (annualCadence >= 104) costPerModel = 350;
        else costPerModel = 450;

        totalProductCost += (annualCadence * costPerModel) / 12;
    });

    const finalPlatform = Math.max(MIN_PLATFORM, totalProductCost);
    
    // 2. Calculate Service Totals
    const consultTotal = (parseInt(el.consulting.value) || 0) * CONSULT_RATE;
    const monthlyRecurring = finalPlatform + SUPPORT + consultTotal;
    
    // NEW: Multiply onboarding fee by number of products
    const onboardingPerProduct = parseFloat(el.onboard.value || 0);
    const totalOnboarding = onboardingPerProduct * numProducts;
    
    const yearOneTotal = (monthlyRecurring * 12) + totalOnboarding;

    // 3. Update UI
    document.getElementById('monthlyTotal').innerText = Math.round(monthlyRecurring).toLocaleString();
    document.getElementById('yearOneTotal').innerText = Math.round(yearOneTotal).toLocaleString();
    document.getElementById('platformCost').innerText = '$' + Math.round(finalPlatform).toLocaleString();
    document.getElementById('consultCost').innerText = '$' + consultTotal.toLocaleString();
    document.getElementById('oneTimeTotal').innerText = '$' + totalOnboarding.toLocaleString();
    
    const badge = document.getElementById('minFeeBadge');
    badge.style.visibility = (finalPlatform === MIN_PLATFORM) ? 'visible' : 'hidden';
}

function resetCalculator() {
    if (confirm("Reset all estimator values?")) {
        el.products.value = 1;
        el.consulting.value = 0;
        el.onboard.value = 15000;
        productContainer.innerHTML = '';
        calculate();
    }
}
