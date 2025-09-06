let travelData = {};

// Fetch travel data
fetch('/json/travel.json')
  .then(res => res.json())
  .then(data => { travelData = data; });

// Elements
const destSelect = document.getElementById('destinationSelect');
const destInput = document.getElementById('destination');
const pkgSelect = document.getElementById('packageSelect');
const pkgDays = document.getElementById('packageDays');
const pkgNights = document.getElementById('packageNights');
const pkgDesc = document.getElementById('packageDescription');
const customFields = document.getElementById('customPackageFields');
const detailsContent = document.getElementById("detailsContent")

// Travel Type Change
document.querySelectorAll('.travel-radio').forEach(radio => {
  radio.addEventListener('change', () => {
    const type = document.querySelector('.travel-radio:checked')?.value.toLowerCase();
    destSelect.innerHTML = '<option value="" disabled selected hidden>Choose your destination</option>';
    pkgSelect.innerHTML = '<option value="" disabled selected hidden>Choose a package</option>';
    destInput.classList.add('hidden');
    customFields.classList.add('hidden');
    destInput.value = '';
    pkgDays.value = '';
    pkgNights.value = '';
    pkgDesc.value = '';
    [destInput, pkgDays, pkgNights, pkgDesc].forEach(e => e.required = false)
    detailsContent.innerHTML = '<p class="text-gray-500 text-center">Select a package to see details</p>';

    if (type && travelData[type]) {
      travelData[type].forEach(dest => {
        destSelect.innerHTML += `<option value="${dest.name}">${dest.name}</option>`;
      });
      destSelect.innerHTML += `<option value="Custom">Custom Destination</option>`;
    }
  });
});

// Destination Change
destSelect.addEventListener('change', () => {
  const destName = destSelect.value;
  const type = document.querySelector('.travel-radio:checked')?.value.toLowerCase();
  
  pkgSelect.innerHTML = '<option value="" disabled selected hidden>Choose a package</option>';
  destInput.classList.add('hidden');
  customFields.classList.add('hidden');
  destInput.value = destName;
  destInput.required = false;
  
  if (destName === "Custom") {
    destInput.classList.remove('hidden');        
    destInput.value = "";
    destInput.required = true;
    pkgSelect.innerHTML += '<option value="Custom Package">Custom Package</option>';        
    return;
  }

  if (destName !== '' && type && travelData[type]) {
    const dest = travelData[type].find(d => d.name === destName);
    if (dest) {
      dest.packages.forEach(pkg => {
        pkgSelect.innerHTML += `<option value="${pkg.title}">${pkg.title} - ₹${pkg.price}</option>`;
      });
      pkgSelect.innerHTML += `<option value="Custom Package">Custom Package</option>`;
    }
  }
  detailsContent.innerHTML = '<p class="text-gray-500 text-center">Select a package to see details</p>';
});

// Package Change
pkgSelect.addEventListener('change', () => {
  const pkgTitle = pkgSelect.value;
  const destName = destSelect.value;
  const type = document.querySelector('.travel-radio:checked')?.value.toLowerCase();

  customFields.classList.add('hidden');  
  pkgDays.value = '';
  pkgNights.value = '';
  pkgDesc.value = '';  

  [pkgDays, pkgNights, pkgDesc].forEach(e => e.required = false)

  if (pkgTitle === "Custom Package") {
    customFields.classList.remove('hidden');
    [pkgDays, pkgNights, pkgDesc].forEach(e => e.required = true)
    detailsContent.innerHTML = '<p class="text-gray-500 text-center">Fill in your custom package details above</p>';
    return;
  }

  if (pkgTitle !== '' && destName !== '' && type && travelData[type]) {
    const dest = travelData[type].find(d => d.name === destName);
    if (dest) {
      const pkg = dest.packages.find(p => p.title === pkgTitle);
      if (pkg) {
        pkgDays.value = pkg.days;
        pkgNights.value = pkg.nights;
        pkgDesc.value = pkg.description;

        detailsContent.innerHTML = `
          <h3 class="text-xl font-bold mb-2">${pkg.title}</h3>
          <p class="text-gray-600 mb-4">${pkg.days} Days / ${pkg.nights} Nights • ₹${pkg.price}</p>
          <p class="text-gray-600">${pkg.description}</p>
        `;
      }
    }
  }
});

// Travel Date: only allow tomorrow onwards
const travelDateInput = document.getElementById('travelDate');
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const minDate = tomorrow.toISOString().split('T')[0];
travelDateInput.setAttribute('min', minDate);
travelDateInput.setAttribute('value', minDate);







