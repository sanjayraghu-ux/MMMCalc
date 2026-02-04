const inputs = ['brands', 'products', 'frequency', 'support', 'onboard', 'handoff'];
const el = {};
inputs.forEach(id => el[id] = document.getElementById(id));

function calculate() {
    // Labels
    document.getElementById('brandLabel').innerText = el.brands.value;
    document.getElementById('productLabel').innerText = el.products.value;

    // Pricing Logic
    const baseRate = 1200;
    const brandWeight = el.brands.value * 800;
    const productWeight = el.products.value * 250;
    
    const monthlyTotal = (baseRate + brandWeight + productWeight) * parseFloat(el.frequency.value) + parseFloat(el.support.value);
    
    const setupTotal = parseFloat(el.onboard.value) + parseFloat(el.handoff.value);

    // Update Display
    document.getElementById('monthlyTotal').innerText = Math.round(monthlyTotal).toLocaleString();
    document.getElementById('oneTimeTotal').innerText = '$' + Math.round(setupTotal).toLocaleString();

    // Complexity Logic
    const complexity = el.brands.value * el.products.value;
    const tag = document.getElementById('complexityTag');
    if(complexity < 5) { tag.innerText = 'Standard'; tag.style.color = 'green'; }
    else if(complexity < 15) { tag.innerText = 'High'; tag.style.color = 'orange'; }
    else { tag.innerText = 'Enterprise'; tag.style.color = 'red'; }
}

function exportPDF() {
    const element = document.getElementById('capture-area');
    const opt = {
        margin: 0.5,
        filename: 'MMM_Pricing_Quote.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(element).save();
}

// Listeners
inputs.forEach(id => el[id].addEventListener('input', calculate));
calculate(); // Run once on load
