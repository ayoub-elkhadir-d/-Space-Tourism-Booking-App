// =========================================
// VARIABLES AND DOM ELEMENTS - ALL AT THE TOP
// =========================================

// DOM Elements
let name_in_page = document.getElementById("name_");
let login_hid = document.getElementById("login_tag");
let main_ = document.getElementById("container_");
let button_add_passager = document.getElementById("add_passager");
let date_in = document.getElementById("date_input");
let option_distination = document.getElementById("options_dist");
let button_submit = document.getElementById("button_submit");
let total_price_ = document.getElementById("totalprice");
let accommodation_container_ = document.getElementById("accommodation_container");
let inputs_form = document.getElementById("form_inputs"); // Added this, used in multiple places

// Global data and state
let mydata = JSON.parse(localStorage.getItem("data")) || {};
let destinations = mydata.destinations || [];
let spacecraft = mydata.spacecraft || [];
let accommodations = mydata.accommodations || [];
let selectedAccommodationId = null;
let select_number_persons = 0; // Fixed: initialized to 0
let select_destination_ = null;
let duration_du_travel = 0;
let currentPassengerCount = 0;
let maxPassengers = 6;

// Prices - initialized to 0
let destinationPrice = 0;
let accommodationPrice = 0;

// Other
let number_passager = 0; // Not sure if used, kept for now
button_add_passager.style.display = "none"; // Moved here from bottom

// =========================================
// HELPER FUNCTIONS
// =========================================

// Check if user is logged in
function islogin() {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let is_l = false;
    for (let user of users) {
        if (user.logged_in === true) {
            is_l = true;
            name_in_page.innerText = user.nome;
            login_hid.innerText = "log out";
            window.login_info_id = user.id; // Fixed: declared as global if needed
            return true;
        }
    }
    return is_l;
}

// Validate input (simple regex check)
function validateInput(input, type) {
    const value = input.value.trim();
    let regex;
    if (type === 'text') {
        regex = /^[a-zA-Z\s]{2,30}$/; // Letters and spaces, 2-30 chars
    } else if (type === 'email') {
        regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email
    } else if (type === 'number') {
        regex = /^\d{10,15}$/; // Phone: 10-15 digits
    }
    const isValid = regex.test(value);
    const errorSpan = input.nextElementSibling;
    if (isValid && value) {
        input.classList.remove('invalid');
        input.classList.add('valid');
        errorSpan.textContent = 'Valid';
        errorSpan.className = 'success';
    } else if (value) {
        input.classList.remove('valid');
        input.classList.add('invalid');
        errorSpan.textContent = 'Invalid: Enter valid value';
        errorSpan.className = 'error';
    } else {
        input.classList.remove('valid', 'invalid');
        errorSpan.textContent = '';
    }
    return isValid && value;
}

// Get price of a destination by ID
function get_price_de_destination(nome_de_destination) {
    for (let destination_ of destinations) {
        if (destination_.id === nome_de_destination) {
            return destination_.price;
        }
    }
    return 0; // Fixed: return 0 if not found
}

// Get travel duration in days (one way)
function get_days(destination) {
    let days_ = 0;
    for (let destination_ of destinations) {
        if (destination_.id == destination) {
            let durationStr = destination_.travelDuration;
            if (durationStr.includes("days")) {
                days_ = parseInt(durationStr);
            } else if (durationStr.includes("years")) {
                days_ = parseInt(durationStr) * 365;
            } else {
                days_ = parseInt(durationStr) * 30; // Assume months
            }
        }
    }
    return days_;
}

// Create a single passenger form
function creat_form(index) {
    const form_ = document.createElement("div");
    form_.classList.add("dy_form", "border", "border-neon-blue/30", "p-4", "rounded-lg");
    form_.innerHTML = `
        <h1 class="font-orbitron text-2xl mb-4 text-glow">
            Person ${index + 1}
        </h1>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-gray-300 mb-2">first name</label>
                <input type="text" class="form-input w-full px-4 py-3" placeholder="Enter your first name" />
                <span class="error"></span>
            </div>
            <div>
                <label class="block text-gray-300 mb-2">last name</label>
                <input type="text" class="form-input w-full px-4 py-3" placeholder="Enter your last name" />
                <span class="error"></span>
            </div>
            <div>
                <label class="block text-gray-300 mb-2">Email address</label>
                <input type="email" class="form-input w-full px-4 py-3" placeholder="Enter your email" />
                <span class="error"></span>
            </div>
            <div>
                <label class="block text-gray-300 mb-2">phone number</label>
                <input type="tel" class="form-input w-full px-4 py-3" placeholder="Enter your phone number" />
                <span class="error"></span>
            </div>
        </div>
    `;
    return form_;
}

// Add validation listeners to a form's inputs (called once per form)
function addValidationToForm(formElement) {
    formElement.querySelectorAll('input').forEach(function(input) {
        input.addEventListener('input', function() {
            let inputType = this.type === 'tel' ? 'number' : this.type;
            validateInput(this, inputType);
            total_(); // Call total on any input change
        });
    });
}

// Get all form data
function getdatafrom_forms() {
    const passengers = [];
    const get_forms = document.querySelectorAll(".dy_form");
    for (let this_form of get_forms) {
        let textInputs = this_form.querySelectorAll('input[type="text"]');
        let inputs = {
            firstName: textInputs[0] ? textInputs[0].value : '',
            lastName: textInputs[1] ? textInputs[1].value : '',
            email: this_form.querySelector('input[type="email"]').value,
            phone: this_form.querySelector('input[type="tel"]').value
        };
        passengers.push(inputs);
    }

    const bookingDetailsArray = [{
        destination: select_destination_ || '',
        date: date_in.value || '',
        numPassengers: select_number_persons || 0,
        accommodation: getSelectedAccommodationName() || '',
        destinationPrice: destinationPrice,
        accommodationPrice: accommodationPrice
    }];

    return {
        passengers: passengers,
        bookingDetails: bookingDetailsArray
    };
}

// Get selected accommodation name
function getSelectedAccommodationName() {
    if (!selectedAccommodationId) return null;
    const selectedAcc = accommodations.find(function(acc) {
        return acc.id.toString() === selectedAccommodationId;
    });
    return selectedAcc ? selectedAcc.name : null;
}

// Check if entire form is valid
function isFormValid() {
    if (!select_destination_) {
        alert('Please fill the destination field');
        return false;
    }
    if (!date_in.value) {
        alert('Please fill the departure date field');
        return false;
    }
    if (!select_number_persons) {
        alert('Please select the number of passengers');
        return false;
    }
    if (!getSelectedAccommodationName()) {
        alert('Please select the accommodation type');
        return false;
    }

    const forms = document.querySelectorAll('.dy_form');
    for (let form of forms) {
        const inputs = form.querySelectorAll('input');
        for (let input of inputs) {
            let inputType = input.type === 'tel' ? 'number' : input.type;
            if (!validateInput(input, inputType)) {
                alert(`Please correct all fields in passenger forms (e.g., ${input.placeholder})`);
                return false;
            }
        }
    }
    return true;
}

// =========================================
// TOTAL PRICE FUNCTION - COMPLETED AND SIMPLE
// =========================================
function total_() {

    let totalDays = duration_du_travel * 2;
    let accomTotal = select_number_persons * accommodationPrice * totalDays;
    let grandTotal = destinationPrice + accomTotal;
    total_price_.innerText = `${grandTotal}`;
}

// =========================================
// INITIALIZATION FUNCTIONS
// =========================================

// Load data from JSON if not in localStorage
function add_data_to_local() {
    fetch("./data.json")
        .then(function(response) { return response.json(); })
        .then(function(data) {
            localStorage.setItem("data", JSON.stringify(data));
        })
        .catch(function(error) { console.error("Error:", error); });
}

// Populate destinations and accommodations
function get_data_() {
    // Add destinations to dropdown
    for (let datas of destinations) {
        option_distination.innerHTML += `<option value="${datas.id}">${datas.name}</option>`;
    }
    // Skip spacecraft for now (empty in original)

    // Add initial accommodations
    for (let data of accommodations) {
        accommodation_container_.innerHTML += `
            <div class="accommodation-card border border-neon-blue/50 rounded-xl p-4 flex-1 
                    hover:shadow-[0_0_15px_#0ea5e9] transition-all cursor-pointer ${selectedAccommodationId === data.id.toString() ? 'selected' : ''}" 
                    data-id="${data.id}">
                <h3 class="font-orbitron text-xl text-neon-blue mb-2">${data.name}</h3>
                <p class="text-gray-300 text-sm">${data.shortDescription}</p>
                <h3 class=" text-M text-neon-blue mb-2">${data.pricePerDay}$/day</h3>
            </div>`;
    }
    // Add click events once
    addClickEventsToCards();
}

// Handle accommodation card clicks (removed repetition)
function addClickEventsToCards() {
    document.querySelectorAll(".accommodation-card").forEach(function(card) {
        card.addEventListener("click", function() {
            // Remove selection from others
            document.querySelectorAll(".accommodation-card").forEach(function(c) {
                c.classList.remove("selected");
            });
            // Select this one
            this.classList.add("selected");
            selectedAccommodationId = this.dataset.id;
            total_(); // Update total

            // Set price
            const selectedAcc = accommodations.find(function(acc) {
                return acc.id.toString() === selectedAccommodationId;
            });
            if (selectedAcc) {
                accommodationPrice = selectedAcc.pricePerDay;
             
            }
        });
    });
}

// Handle number of passengers (simplified, no repetition)
function get_number_passager() {
    let persons_ = document.querySelectorAll('input[name="person"]');
    for (let radio of persons_) {
        radio.addEventListener("change", function(event) {
            inputs_form.innerHTML = ""; // Clear forms
            select_number_persons = parseInt(event.target.value);
            currentPassengerCount = 0;

            let formsToCreate = (select_number_persons < 3) ? select_number_persons : 3;
            for (let a = 0; a < formsToCreate; a++) {
                const formElement = creat_form(a);
                inputs_form.appendChild(formElement);
                currentPassengerCount++;
                addValidationToForm(formElement); // Use shared function
            }

            button_add_passager.style.display = (select_number_persons < 3) ? "none" : "block";
            total_(); // Added: update total when persons change
        });
    }
}

// Handle destination change (simplified)
function select_destination() {
    option_distination.addEventListener("change", function() {
        accommodation_container_.innerHTML = ""; // Clear
        select_destination_ = option_distination.value;
        duration_du_travel = get_days(select_destination_);
        destinationPrice = get_price_de_destination(select_destination_);
        total_(); // Update total

        // Rebuild available accommodations
        for (let data of accommodations) {
            let is_include = data.availableOn.includes(select_destination_);
            if (is_include) {
                accommodation_container_.innerHTML += `
                    <div class="accommodation-card border border-neon-blue/50 rounded-xl p-4 flex-1 
                        hover:shadow-[0_0_15px_#0ea5e9] transition-all cursor-pointer ${selectedAccommodationId === data.id.toString() ? 'selected' : ''}" 
                            data-id="${data.id}">
                        <h3 class="font-orbitron text-xl text-neon-blue mb-2">${data.name}</h3>
                        <p class="text-gray-300 text-sm">${data.shortDescription}</p>
                        <h3 class=" text-M text-neon-blue mb-2">${data.pricePerDay}$/day</h3>
                    </div>`;
            }
        }
        // Re-add click events
        addClickEventsToCards();
    });
}

// =========================================
// EVENT LISTENERS
// =========================================

// Add passenger button
button_add_passager.addEventListener("click", function() {
    if (currentPassengerCount < maxPassengers) {
        const newForm = creat_form(currentPassengerCount);
        inputs_form.appendChild(newForm);
        currentPassengerCount++;
        addValidationToForm(newForm); // Use shared function

        if (currentPassengerCount >= maxPassengers) {
            button_add_passager.style.display = "none";
        }
    } else {
        alert("the limit 6");
    }
});

// Submit button
button_submit.addEventListener("click", function() {
    if (islogin()) {
        if (isFormValid()) {
            localStorage.setItem("data_form", JSON.stringify(getdatafrom_forms()));
            alert('Data saved successfully!');
        }
    } else {
        window.open("login.html", "_blank");
    }
});

// =========================================
// INITIAL CALLS - AT THE BOTTOM
// =========================================
add_data_to_local();
islogin();
if (islogin()) {
    button_submit.innerText = "Submit data";
}
get_data_();
get_number_passager();
select_destination();