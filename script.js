const inputs = ['brands', 'products', 'consulting', 'onboard'];
const el = {};
inputs.forEach(id => el[id] = document.getElementById(id));

const productContainer = document.getElementById('productNameInputs');

function updateProductRows() {
    const count = parseInt(el.products.value) || 0;
    const existingRows = productContainer.querySelectorAll('.product-row').length;

    if (count > existingRows) {
        for (let i = existingRows + 1; i <= count; i++) {
            const row = document.createElement('div');
            row.className = 'product-row';
            row.innerHTML = `
                <input type="text" placeholder="Product ${i} Name" class="prod-name">
                <select class="prod-cadence">
                    <option value="1.6">Daily (365/yr)</option>
                    <option value="1.4">15 per month</option>
                    <option value="1.3">2 per week</option>
                    <option value="1.2">1 per week</option>
                    <option value="1.0" selected>Monthly (1 per month)</option>
                    <option value="0.8">Custom (Low Vol)</option>
                </select>
            `;
            productContainer.appendChild(row);
            
            // Add listener to the new select box
            row.querySelector('.prod-cadence').addEventListener('change', calculate);
        }
    } else if (count < existingRows) {
        for (let i = existingRows; i > count; i--) {
            productContainer.removeChild(productContainer.lastChild);
        }
    }
}

function calculate() {
    updateProductRows();

    const numBrands = parseInt(el.brands.value) || 0;
    const consultHours = parseInt(el.consulting.value) || 0;
    
    // Constant Rates
    const MIN_PLATFORM = 2500;
    const SUPPORT = 750;
    const CONSULT_RATE = 250;
    const BRAND_FEE = 500;
    const PRODUCT_BASE_FEE = 400; // Complexity cost per product

    // 1. Calculate Aggregate Product Complexity
    let totalProductComplexity = 0;
    const productRows = productContainer.querySelectorAll('.product-row');
    
    productRows.forEach(row => {
        const cadenceMultiplier = parseFloat(row.querySelector('.prod-cadence').value);
        totalProductComplexity += (PRODUCT_BASE_FEE * cadenceMultiplier);
    });

    // 2. Base Platform Fee Calculation
    // Logic: Base Infrastructure ($1000) + Brand Management + Sum of Product Complexities
    let calculatedPlatform = 1000 + (numBrands * BRAND_FEE) + totalProductComplexity;
    
    // Apply $2,500 Minimum Floor
    const finalPlatform = Math.max(MIN_PLATFORM, calculatedPlatform);
    
    // 3. Totals
    const consultTotal = consultHours * CONSULT_RATE;
    const monthlyRecurring = finalPlatform + SUPPORT + consultTotal;
    const onboardingFee = parseFloat(el.onboard.value || 0);
    const yearOneTotal = (monthlyRecurring * 12) + onboardingFee;

    // 4. Update UI
    document.getElementById('monthlyTotal').innerText = Math.round(monthlyRecurring).toLocaleString();
    document.getElementById('yearOneTotal').innerText = Math.round(yearOneTotal).toLocaleString();
    document.getElementById('platformCost').innerText = '$' + Math.round(finalPlatform).toLocaleString();
    document.getElementById('consultCost').innerText = '$' + consultTotal.toLocaleString();
    document.getElementById('oneTimeTotal').innerText = '$' + onboardingFee.toLocaleString();
    
    document.getElementById('minFeeBadge').style.visibility = (finalPlatform === MIN_PLATFORM) ? 'visible' : 'hidden';
}

function exportPDF() {
    const element = document.getElementById('capture-area');
    const opt = {
        margin: 0.2,
        filename: 'MetricWorks_Besoke_Proposal.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, backgroundColor: '#1e293b' },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(element).save();
}

// Global Listeners
inputs.forEach(id => {
    el[id].addEventListener('input', calculate);
});

// Run Init
calculate();
