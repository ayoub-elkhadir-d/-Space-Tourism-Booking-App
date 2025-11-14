// =========================================
// VARIABLES AND DOM ELEMENTS
// =========================================
let name_in_page = document.getElementById("name_");
let login_hid = document.getElementById("login_tag");
let main_ = document.getElementById("container_");
let button_add_passager = document.getElementById("add_passager");
let date_in = document.getElementById("date_input");
let option_distination = document.getElementById("options_dist");
let button_submit = document.getElementById("button_submit");
let accommodation_container_ = document.getElementById("accommodation_container");
let inputs_form = document.getElementById("form_inputs");
let cancel_edit_btn = document.getElementById("cancel_edit");

let mydata = JSON.parse(localStorage.getItem("data")) || [];
let destinations = mydata.destinations || [];
let accommodations = mydata.accommodations || [];

let selectedAccommodationId = null;
let select_number_persons = 0;
let select_destination_ = null;
let duration_du_travel = 0;
let currentPassengerCount = 0;
let maxPassengers = 6;
let destinationPrice = 0;
let accommodationPrice = 0;
let total_price_ = 0;

button_add_passager.style.display = "none";

let all_data_forms = JSON.parse(localStorage.getItem("data_form")) || [];
let all_data = all_data_forms;
window.editingBookingId = null;

// =========================================
// HELPER FUNCTIONS
// =========================================
function generateUniqueId() {
    return crypto.randomUUID();
}

function islogin() {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    for (let user of users) {
        if (user.logged_in === true) {
            name_in_page.innerText = user.nome;
            login_hid.innerText = "log out";
            window.login_info_id = user.id;
            return true;
        }
    }
    return false;
}

// =========================================
// CANCEL EDIT FUNCTION
// =========================================
cancel_edit_btn.addEventListener("click", function() {
for (let item of all_data) {
    if(item.bookingDetails[0].opnedforom=="edit"){
        item.bookingDetails[0].opnedforom=null
        localStorage.setItem("data_form", JSON.stringify(getdatafrom_forms()));
        window.location.reload();
    }
}
window.location.reload();
});

// =========================================
// EDIT BOOKING FUNCTION
// =========================================
function opned_from_my_booking_to_edity() {
    for (let item of all_data) {
        if(item.bookingDetails[0].opnedforom === "edit") {
            window.editingBookingId = item.bookingDetails[0].id;

            date_in.value = item.bookingDetails[0].date;
            button_submit.innerText = "Update booking";

            select_destination_ = item.bookingDetails[0].destination;
            option_distination.value = select_destination_;
            destinationPrice = get_price_de_destination(select_destination_);
            duration_du_travel = get_days(select_destination_);

            // display accommodations
            accommodation_container_.innerHTML = "";
            for (let data of accommodations) {
                if (data.availableOn.includes(select_destination_)) {
                    accommodation_container_.innerHTML += `
                        <div class="accommodation-card border border-neon-blue/50 rounded-xl p-4 flex-1 
                            hover:shadow-[0_0_15px_#0ea5e9] transition-all cursor-pointer"
                            data-id="${data.id}">
                            <h3 class="font-orbitron text-xl text-neon-blue mb-2">${data.name}</h3>
                            <p class="text-gray-300 text-sm">${data.shortDescription}</p>
                            <h3 class=" text-M text-neon-blue mb-2">${data.pricePerDay}$/day</h3>
                        </div>`;
                }
            }
            addClickEventsToCards();

            // select accommodation
            if(item.bookingDetails[0].accommodation) {
                const accCards = document.querySelectorAll(".accommodation-card");
                for (let card of accCards) {
                    if(card.dataset.id === getAccommodationIdByName(item.bookingDetails[0].accommodation)) {
                        card.classList.add("selected");
                        selectedAccommodationId = card.dataset.id;
                        accommodationPrice = accommodations.find(acc => acc.id.toString() === selectedAccommodationId).pricePerDay;
                        break;
                    }
                }
            }

            // passengers
            currentPassengerCount = item.bookingDetails[0].numPassengers;
            let persons__ = document.querySelectorAll('input[name="person"]');
            for (let radio_ of persons__) {
                if (radio_.value == currentPassengerCount) { 
                    radio_.checked = true;
                    break;
                }
            }

            inputs_form.innerHTML = "";
            let passengers = item.passengers || [];
            for (let i = 0; i < passengers.length; i++) {
                const formElement = creat_form(i);
                inputs_form.appendChild(formElement);

                const inputs = formElement.querySelectorAll('input');
                inputs[0].value = passengers[i].firstName || "";
                inputs[1].value = passengers[i].lastName || "";
                inputs[2].value = passengers[i].email || "";
                inputs[3].value = passengers[i].phone || "";

                addValidationToForm(formElement);
            }
            total_();
        }
    }
}
function get_price_de_destination(nome_de_destination) {
    for (let destination_ of destinations) {
        if (destination_.id === nome_de_destination) {
            return destination_.price;
        }
    }
    return 0;
}
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
                days_ = parseInt(durationStr) * 30;
            }
        }
    }
    return days_;
}
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

function addValidationToForm(formElement) {
    formElement.querySelectorAll('input').forEach(function(input) {
        input.addEventListener('input', function() {
            let inputType = this.type === 'tel' ? 'number' : this.type;
            validateInput(this, inputType);
            total_();
        });
    });
}
function getAccommodationIdByName(name) {
    const acc = accommodations.find(a => a.name === name);
    return acc ? acc.id.toString() : null;
}

// =========================================
// VALIDATION FUNCTIONS
// =========================================
function validateInput(input, type) {
    const value = input.value.trim();
    let regex;

    if (type === 'text') regex = /^[a-zA-Z\s]{2,30}$/;
    else if (type === 'email') regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    else if (type === 'number') regex = /^\d{10,15}$/;

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

// =========================================
// GET & SAVE FORM DATA
// =========================================
function getSelectedAccommodationName() {
    if (!selectedAccommodationId) return null;
    const selectedAcc = accommodations.find(acc => acc.id.toString() === selectedAccommodationId);
    return selectedAcc ? selectedAcc.name : null;
}

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
        numPassengers: currentPassengerCount || 0,
        accommodation: getSelectedAccommodationName() || '',
        totalprice: total_price_,
        duration: duration_du_travel,
        status: "Virefied",
        id: window.editingBookingId || generateUniqueId(),
        opnedforom: null
    }];

    const data_n = { passengers, bookingDetails: bookingDetailsArray };

    if (window.editingBookingId) {
        const index = all_data.findIndex(d => d.bookingDetails[0].id === window.editingBookingId);
        if (index !== -1) all_data[index] = data_n;
        else all_data.push(data_n);
    } else {
        all_data.push(data_n);
    }

    return all_data;
}

function isFormValid() {
    if (!select_destination_) { alert('Please fill the destination field'); return false; }
    if (!date_in.value) { alert('Please fill the departure date field'); return false; }
    if (!currentPassengerCount) { alert('Please select the number of passengers'); return false; }
    if (!getSelectedAccommodationName()) { alert('Please select the accommodation type'); return false; }

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
// TOTAL PRICE FUNCTION
// =========================================
function updateTicketInfo() {
    document.getElementById("ticket_total").innerText = total_price_ + " $";
    document.getElementById("ticket_passengers").innerText = currentPassengerCount;
    document.getElementById("ticket_spacecraft").innerText = getSelectedAccommodationName(); 
    document.getElementById("ticket_duration").innerText = duration_du_travel + " days";
    document.getElementById("ticket_destination").innerText = select_destination_ || "-";
}

function total_() {
    let totalDays = duration_du_travel * 2;
    let accomTotal = currentPassengerCount * accommodationPrice * totalDays;
    total_price_ = destinationPrice + accomTotal;
    updateTicketInfo(); 
}

// =========================================
// INITIALIZATION FUNCTIONS
// =========================================
function add_data_to_local() {
    fetch("./data.json")
        .then(res => res.json())
        .then(data => localStorage.setItem("data", JSON.stringify(data)))
        .catch(err => console.error("Error:", err));
}

function get_data_() {
    option_distination.innerHTML = "";
    for (let d of destinations) {
        option_distination.innerHTML += `<option value="${d.id}">${d.name} - ${d.price}-$ </option>`;
    }

    accommodation_container_.innerHTML = "";
    for (let data of accommodations) {
        accommodation_container_.innerHTML += `
            <div class="accommodation-card border border-neon-blue/50 rounded-xl p-4 flex-1 
                hover:shadow-[0_0_15px_#0ea5e9] transition-all cursor-pointer" 
                data-id="${data.id}">
                <h3 class="font-orbitron text-xl text-neon-blue mb-2">${data.name}</h3>
                <p class="text-gray-300 text-sm">${data.shortDescription}</p>
                <h3 class=" text-M text-neon-blue mb-2">${data.pricePerDay}$/day</h3>
            </div>`;
    }
    addClickEventsToCards();
}

function addClickEventsToCards() {
    document.querySelectorAll(".accommodation-card").forEach(card => {
        card.addEventListener("click", function() {
            document.querySelectorAll(".accommodation-card").forEach(c => c.classList.remove("selected"));
            this.classList.add("selected");
            selectedAccommodationId = this.dataset.id;
            accommodationPrice = accommodations.find(acc => acc.id.toString() === selectedAccommodationId).pricePerDay;
            total_();
        });
    });
}

// =========================================
// PASSENGER SELECTION
// =========================================
function get_number_passager() {
    document.querySelectorAll('input[name="person"]').forEach(radio => {
        radio.addEventListener("change", function(event) {
            inputs_form.innerHTML = "";
            select_number_persons = parseInt(event.target.value);
            currentPassengerCount = 0;

            let formsToCreate = select_number_persons < 3 ? select_number_persons : 3;
            for (let a = 0; a < formsToCreate; a++) {
                const formElement = creat_form(a);
                inputs_form.appendChild(formElement);
                currentPassengerCount++;
                addValidationToForm(formElement);
            }

            button_add_passager.style.display = select_number_persons < 3 ? "none" : "block";
            total_();
        });
    });
}

// =========================================
// DESTINATION SELECT
// =========================================
function select_destination() {
    option_distination.addEventListener("change", function() {
        accommodation_container_.innerHTML = "";
        select_destination_ = option_distination.value;
        duration_du_travel = get_days(select_destination_);
        destinationPrice = get_price_de_destination(select_destination_);

        for (let data of accommodations) {
            if (data.availableOn.includes(select_destination_)) {
                accommodation_container_.innerHTML += `
                    <div class="accommodation-card border border-neon-blue/50 rounded-xl p-4 flex-1 
                        hover:shadow-[0_0_15px_#0ea5e9] transition-all cursor-pointer"
                        data-id="${data.id}">
                        <h3 class="font-orbitron text-xl text-neon-blue mb-2">${data.name}</h3>
                        <p class="text-gray-300 text-sm">${data.shortDescription}</p>
                        <h3 class=" text-M text-neon-blue mb-2">${data.pricePerDay}$/day</h3>
                    </div>`;
            }
        }
        addClickEventsToCards();
        total_();
    });
}

// =========================================
// BUTTON EVENTS
// =========================================
button_add_passager.addEventListener("click", function() {
    if (currentPassengerCount < maxPassengers) {
        const newForm = creat_form(currentPassengerCount);
        inputs_form.appendChild(newForm);
        currentPassengerCount++;
        addValidationToForm(newForm);
        total_();
        if (currentPassengerCount >= maxPassengers) button_add_passager.style.display = "none";
    } else alert("the limit 6");
});

button_submit.addEventListener("click", function() {
    if (isFormValid()) {
        localStorage.setItem("data_form", JSON.stringify(getdatafrom_forms()));
        window.location.reload();
  
    }
});

date_in.addEventListener("change", total_);

// =========================================
// INITIAL CALLS
// =========================================
add_data_to_local();
islogin();
get_data_();
get_number_passager();
select_destination();
opned_from_my_booking_to_edity();
