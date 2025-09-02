let travelData = {};

// Fetch travel data
fetch('/json/travel.json')
  .then(res => res.json())
  .then(data => { 
    travelData = data; 
  });

// Travel type change using radio buttons
document.querySelectorAll('.travel-radio').forEach(radio => {
  radio.addEventListener('change', function() {
    const type = this.value;
    const destSelect = document.getElementById('destination');
    const pkgSelect = document.getElementById('package');
    
    // Clear other dropdowns
    destSelect.innerHTML = '<option value="">Choose your destination</option>';
    pkgSelect.innerHTML = '<option value="">Choose a package</option>';
    
    if (type && travelData[type]) {
      travelData[type].forEach((dest, i) => {
        destSelect.innerHTML += `<option value="${i}">${dest.name}</option>`;
      });
    }
    
    document.getElementById('detailsContent').innerHTML = '<p class="text-gray-500 text-center">Select a package to see details</p>';
  });
});

// Destination change
document.getElementById('destination').onchange = function() {
  const destIndex = this.value;
  const type = document.querySelector('.travel-radio:checked')?.value;
  const pkgSelect = document.getElementById('package');
  
  pkgSelect.innerHTML = '<option value="">Choose a package</option>';
  
  if (destIndex !== '' && type && travelData[type]) {
    const packages = travelData[type][destIndex].packages;
    packages.forEach((pkg, i) => {
      pkgSelect.innerHTML += `<option value="${i}">${pkg.title} - ₹${pkg.price}</option>`;
    });
  }
  
  document.getElementById('detailsContent').innerHTML = '<p class="text-gray-500 text-center">Select a package to see details</p>';
};

// Package change
document.getElementById('package').onchange = function() {
  const pkgIndex = this.value;
  const destIndex = document.getElementById('destination').value;
  const type = document.querySelector('.travel-radio:checked')?.value;
  
  if (pkgIndex !== '' && destIndex !== '' && type && travelData[type]) {
    const pkg = travelData[type][destIndex].packages[pkgIndex];
    document.getElementById('detailsContent').innerHTML = `
      <h3 class="text-xl font-bold mb-2">${pkg.title}</h3>
      <p class="text-gray-600 mb-4">${pkg.days} Days / ${pkg.nights} Nights • ₹${pkg.price}</p>
      <p class="text-gray-600">${pkg.description}</p>
    `;
  } else {
    document.getElementById('detailsContent').innerHTML = '<p class="text-gray-500 text-center">Select a package to see details</p>';
  }
};

// Travel Date: Only allow tomorrow or later
const travelDateInput = document.getElementById('travelDate');
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const minDate = tomorrow.toISOString().split('T')[0];
travelDateInput.setAttribute('min', minDate);
travelDateInput.setAttribute('value', minDate);

