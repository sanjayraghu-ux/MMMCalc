const inputs = ['products', 'consulting', 'onboard'];
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
                    <option value="365">Daily (365/yr)</option>
                    <option value="180">15 per month (180/yr)</option>
                    <option value="104">2 per week (104/yr)</option>
                    <option value="52">1 per week (52/yr)</option>
                    <option value="12" selected>Monthly (12/yr)</option>
                </select>
            `;
            productContainer.appendChild(row);
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

    const MIN_PLATFORM = 2500;
    const SUPPORT = 750;
    const CONSULT_RATE = 250;

    let totalProductCost = 0;
    const productRows = productContainer.querySelectorAll('.product-row');
    
    productRows.forEach(row => {
        const annualCadence = parseInt(row.querySelector('.prod-cadence').value);
        let costPerModel = 0;

        // Pricing logic based on annual frequency
        if (annualCadence >= 365) {
            costPerModel = 200;
        } else if (annualCadence >= 180) {
            costPerModel = 300;
        } else if (annualCadence >= 104) {
            costPerModel = 350;
        } else if (annualCadence >= 52) {
            costPerModel = 450;
        } else {
            costPerModel = 450; // Default for below 1/week
        }

        // Monthly cost for this specific product = (models per year * cost per model) / 12
        totalProductCost += (annualCadence * costPerModel) / 12;
    });

    // Final Platform calculation with $2,500 floor
    const finalPlatform = Math.max(MIN_PLATFORM, totalProductCost);
    
    const consultTotal = (parseInt(el.consulting.value) || 0) * CONSULT_RATE;
    const monthlyRecurring = finalPlatform + SUPPORT + consultTotal;
    const onboardingFee = parseFloat(el.onboard.value || 0);
    const yearOneTotal = (monthlyRecurring * 12) + onboardingFee;

    // Update UI
    document.getElementById('monthlyTotal').innerText = Math.round(monthlyRecurring).toLocaleString();
    document.getElementById('yearOneTotal').innerText = Math.round(yearOneTotal).toLocaleString();
    document.getElementById('platformCost').innerText = '$' + Math.round(finalPlatform).toLocaleString();
    document.getElementById('consultCost').innerText = '$' + consultTotal.toLocaleString();
    document.getElementById('oneTimeTotal').innerText = '$' + onboardingFee.toLocaleString();
    
    const badge = document.getElementById('minFeeBadge');
    badge.style.visibility = (finalPlatform === MIN_PLATFORM) ? 'visible' : 'hidden';
}

function exportPDF() {
    const element = document.getElementById('capture-area');
    const opt = {
        margin: 0.2,
        filename: 'MetricWorks_Proposal.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, backgroundColor: '#1e293b' },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(element).save();
}

inputs.forEach(id => el[id].addEventListener('input', calculate));
calculate();
