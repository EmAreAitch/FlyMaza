let travelData = {};

// Fetch travel data
fetch('/json/travel.json')
  .then(res => res.json())
  .then(data => { 
    travelData = data; 
  });

// Travel type change
document.querySelectorAll('.travel-radio').forEach(radio => {
  radio.addEventListener('change', function() {
    const type = this.value.toLowerCase();
    const destSelect = document.getElementById('destination');
    const pkgSelect = document.getElementById('package');
    
    // Reset dropdowns
    destSelect.innerHTML = '<option value="">Choose your destination</option>';
    pkgSelect.innerHTML = '<option value="">Choose a package</option>';

    // Hide custom fields
    document.getElementById('customDestination').classList.add('hidden');
    document.getElementById('customPackageFields').classList.add('hidden');
    
    if (type && travelData[type]) {
      travelData[type].forEach(dest => {
        destSelect.innerHTML += `<option value="${dest.name}">${dest.name}</option>`;
      });
      // Add custom option
      destSelect.innerHTML += `<option value="Other">Other (Custom)</option>`;
    }
    
    document.getElementById('detailsContent').innerHTML = '<p class="text-gray-500 text-center">Select a package to see details</p>';
  });
});

// Destination change
document.getElementById('destination').onchange = function() {
  const destName = this.value;
  const customDestInput = document.getElementById('customDestination');
  const pkgSelect = document.getElementById('package');
  const customPkgFields = document.getElementById('customPackageFields');
  const type = document.querySelector('.travel-radio:checked')?.value.toLowerCase();

  pkgSelect.innerHTML = '<option value="">Choose a package</option>';
  customDestInput.classList.add('hidden');
  customPkgFields.classList.add('hidden');

  if (destName === "Other") {
    customDestInput.classList.remove('hidden');
    customPkgFields.classList.remove('hidden');
    pkgSelect.innerHTML = '<option value="Other">Other (Custom)</option>';
    document.getElementById('detailsContent').innerHTML = `
      <p class="text-gray-500 text-center">Fill in your custom package details above</p>
    `;
    return;
  }

  if (destName !== '' && type && travelData[type]) {
    const dest = travelData[type].find(d => d.name === destName);
    if (dest) {
      dest.packages.forEach(pkg => {
        pkgSelect.innerHTML += `<option value="${pkg.title}">${pkg.title} - ₹${pkg.price}</option>`;
      });
      pkgSelect.innerHTML += `<option value="Other">Other (Custom)</option>`;
    }
  }
};

// Package change
document.getElementById('package').onchange = function() {
  const pkgTitle = this.value;
  const customPkgFields = document.getElementById('customPackageFields');
  const destName = document.getElementById('destination').value;
  const type = document.querySelector('.travel-radio:checked')?.value.toLowerCase();

  // Hide custom fields initially
  customPkgFields.classList.add('hidden');

  if (pkgTitle === "Other") {
    customPkgFields.classList.remove('hidden');
    document.getElementById('detailsContent').innerHTML = `
      <p class="text-gray-500 text-center">Fill in your custom package details above</p>
    `;
    return;
  }

  if (pkgTitle !== '' && destName !== '' && type && travelData[type]) {
    const dest = travelData[type].find(d => d.name === destName);
    if (dest) {
      const pkg = dest.packages.find(p => p.title === pkgTitle);
      if (pkg) {
        document.getElementById('detailsContent').innerHTML = `
          <h3 class="text-xl font-bold mb-2">${pkg.title}</h3>
          <p class="text-gray-600 mb-4">${pkg.days} Days / ${pkg.nights} Nights • ₹${pkg.price}</p>
          <p class="text-gray-600">${pkg.description}</p>
        `;
      }
    }
  } else {
    document.getElementById('detailsContent').innerHTML = '<p class="text-gray-500 text-center">Select a package to see details</p>';
  }
};

// Travel Date: only allow tomorrow onwards
const travelDateInput = document.getElementById('travelDate');
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const minDate = tomorrow.toISOString().split('T')[0];
travelDateInput.setAttribute('min', minDate);
travelDateInput.setAttribute('value', minDate);

// Handle form submission
document.querySelector('form[name="enquiry"]').addEventListener('submit', function(event) {
    event.preventDefault();
    const myForm = event.target;
    const formData = new FormData(myForm);
    
    // Method 1: Filter out empty values
    const keysToDelete = [];
    for (let [key, value] of formData.entries()) {
        if (!value || value.toString().trim() === '') {
            formData.delete(key);
        }
    }    
    
    fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
    })
    .then(() => alert("Thank you for your submission"))
    .catch(error => alert(error));
});
