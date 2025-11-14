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

let mydata = JSON.parse(localStorage.getItem("data")) || {};
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

if (button_add_passager) button_add_passager.style.display = "none";

let all_data_forms = JSON.parse(localStorage.getItem("data_form")) || [];
let all_data = all_data_forms;
window.editingBookingId = null;

// =========================================
// CUSTOM ALERT FUNCTION
// =========================================
function showAlert(message, type = 'info', options = {}) {
  const modal = document.getElementById('alertModal');
  const content = document.getElementById('alertContent');
  const buttons = document.getElementById('alertButtons');

  if (!modal || !content || !buttons) {
    // Fallback to simple alert if modal elements not present
    if (type === 'error') console.error(message);
    else console.log(message);
    alert(message);
    return;
  }

  let icon = '';
  let colorClass = '';
  switch (type) {
    case 'success':
      icon = '✅';
      colorClass = 'text-green-400';
      break;
    case 'error':
      icon = '❌';
      colorClass = 'text-red-400';
      break;
    case 'confirm':
      icon = '❓';
      colorClass = 'text-neon-yellow';
      break;
    default:
      icon = 'ℹ';
      colorClass = 'text-neon-blue';
  }

  // Set content (use template literal)
  content.innerHTML = `
    <div class="font-orbitron ${colorClass} text-4xl mb-4 text-glow">${icon}</div>
    <p class="text-white text-center font-exo">${message}</p>
  `;

  // Clear buttons
  buttons.innerHTML = '';

  if (type === 'confirm') {
    // Yes/No buttons for confirm
    const yesBtn = document.createElement('button');
    yesBtn.innerHTML = '<i class="fas fa-check mr-1"></i>Yes';
    yesBtn.className = 'btn-primary px-4 py-2 rounded font-bold text-white hover:shadow-glow transition-all';
    yesBtn.onclick = () => {
      modal.classList.add('hidden');
      options.onYes?.();
    };

    const noBtn = document.createElement('button');
    noBtn.innerHTML = '<i class="fas fa-times mr-1"></i>No';
    noBtn.className = 'bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded font-bold text-white transition-all';
    noBtn.onclick = () => {
      modal.classList.add('hidden');
      options.onNo?.();
    };

    buttons.appendChild(yesBtn);
    buttons.appendChild(noBtn);

  } else {
    // OK button for other types
    const okBtn = document.createElement('button');
    okBtn.innerHTML = '<i class="fas fa-check mr-1"></i>OK';
    okBtn.className = 'btn-primary px-6 py-2 rounded font-bold text-white hover:shadow-glow transition-all';
    okBtn.onclick = () => modal.classList.add('hidden');
    buttons.appendChild(okBtn);
  }

  // Show modal with animation
  modal.classList.remove('hidden');
  const loginCard = modal.querySelector('.login-card');
  if (loginCard) {
    loginCard.style.transform = 'scale(0.9)';
    setTimeout(() => {
      loginCard.style.transform = 'scale(1)';
    }, 10);
  }
}

// =========================================
// HELPER FUNCTIONS
// =========================================
function generateUniqueId() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  // fallback
  return 'id-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
}

function islogin() {
    

  let users = JSON.parse(localStorage.getItem("users")) || [];
  for (let user of users) {
    if (user.logged_in === true) {
      if (name_in_page) name_in_page.innerText = user.nome || user.name || '';
      if (login_hid) login_hid.innerText = "log out";
      window.login_info_id = user.id;
      return true;
    }
  }
   window.location.replace("login.html");
  return false;
}

// =========================================
// CANCEL EDIT FUNCTION
// =========================================
if (cancel_edit_btn) {
  cancel_edit_btn.addEventListener("click", function() {
    for (let item of all_data) {
      if (item.bookingDetails && item.bookingDetails[0] && item.bookingDetails[0].opnedforom == "edit") {
        item.bookingDetails[0].opnedforom = null;
        localStorage.setItem("data_form", JSON.stringify(getdatafrom_forms()));
        window.location.reload();
        return;
      }
    }
    window.location.reload();
  });
}

// =========================================
// EDIT BOOKING FUNCTION
// =========================================
function opned_from_my_booking_to_edity() {
  for (let item of all_data) {
    if (item.bookingDetails && item.bookingDetails[0] && item.bookingDetails[0].opnedforom === "edit") {
      window.editingBookingId = item.bookingDetails[0].id;

      if (date_in) date_in.value = item.bookingDetails[0].date || "";
      if (button_submit) button_submit.innerText = "Update booking";

      select_destination_ = item.bookingDetails[0].destination || '';
      if (option_distination) option_distination.value = select_destination_;
      destinationPrice = get_price_de_destination(select_destination_);
      duration_du_travel = get_days(select_destination_);

      // display accommodations
      if (accommodation_container_) accommodation_container_.innerHTML = "";
      for (let data of accommodations) {
        if (data.availableOn && data.availableOn.includes(select_destination_)) {
          accommodation_container_.innerHTML += `
            <div class="accommodation-card border border-neon-blue/50 rounded-xl p-4 flex-1
                hover:shadow-[0_0_15px_#0ea5e9] transition-all cursor-pointer"
                data-id="${data.id}">
                <h3 class="font-orbitron text-xl text-neon-blue mb-2">${data.name}</h3>
                <p class="text-gray-300 text-sm">${data.shortDescription}</p>
                <h3 class=" text-M text-neon-blue mb-2">${data.pricePerDay}$/day</h3>
            </div>
          `;
        }
      }
      addClickEventsToCards();

      // select accommodation
      if (item.bookingDetails[0].accommodation) {
        const accCards = document.querySelectorAll(".accommodation-card");
        for (let card of accCards) {
          if (card.dataset.id === getAccommodationIdByName(item.bookingDetails[0].accommodation)) {
            card.classList.add("selected");
            selectedAccommodationId = card.dataset.id;
            const found = accommodations.find(acc => acc.id.toString() === selectedAccommodationId);
            accommodationPrice = found ? found.pricePerDay : 0;
            break;
          }
        }
      }

      // passengers
      currentPassengerCount = item.bookingDetails[0].numPassengers || 0;
      let persons__ = document.querySelectorAll('input[name="person"]');
      for (let radio_ of persons__) {
        if (radio_.value == currentPassengerCount) {
          radio_.checked = true;
          break;
        }
      }

      if (inputs_form) inputs_form.innerHTML = "";
      let passengers = item.passengers || [];
      for (let i = 0; i < passengers.length; i++) {
        const formElement = creat_form(i);
        inputs_form.appendChild(formElement);

        const inputs = formElement.querySelectorAll('input');
        if (inputs[0]) inputs[0].value = passengers[i].firstName || "";
        if (inputs[1]) inputs[1].value = passengers[i].lastName || "";
        if (inputs[2]) inputs[2].value = passengers[i].email || "";
        if (inputs[3]) inputs[3].value = passengers[i].phone || "";

        addValidationToForm(formElement);
      }
      total_();
    }
  }
}

// =========================================
// PRICE & DURATION HELPERS
// =========================================
function get_price_de_destination(nome_de_destination) {
  for (let destination_ of destinations) {
    if (destination_.id === nome_de_destination) {
      return parseFloat(destination_.price) || 0;
    }
  }
  return 0;
}
function get_days(destination) {
  let days_ = 0;
  for (let destination_ of destinations) {
    if (destination_.id == destination) {
      let durationStr = destination_.travelDuration || '';
      if (durationStr.includes("days")) {
        days_ = parseInt(durationStr) || 0;
      } else if (durationStr.includes("years")) {
        days_ = (parseInt(durationStr) || 0) * 365;
      } else {
        days_ = (parseInt(durationStr) || 0) * 30;
      }
    }
  }
  return days_;
}

// =========================================
// CREATE FORM (fixed template literals)
// =========================================
function creat_form(index) {
  const form_ = document.createElement("div");
  form_.classList.add("dy_form", "border", "border-neon-blue/30", "p-4", "rounded-lg");
  form_.innerHTML = `
    <h1 class="font-orbitron text-2xl mb-4 text-glow">Person ${index + 1}</h1>
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
// VALIDATION FUNCTIONS (fixed regex + safe DOM handling)
// =========================================
function validateInput(input, type) {
  const value = (input.value || '').trim();
  let regex;

  if (type === 'text') regex = /^[a-zA-Z\u0600-\u06FF\s]{2,60}$/; // allow Arabic letters too
  else if (type === 'email') regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  else if (type === 'number') regex = /^[+\d\s\-]{7,20}$/; // allow +, spaces, hyphen (phone formats)
  else regex = /[\s\S]*/;

  const isValid = regex.test(value);
  const errorSpan = input.nextElementSibling;

  if (isValid && value) {
    input.classList.remove('invalid');
    input.classList.add('valid');
    if (errorSpan) {
      errorSpan.textContent = 'Valid';
      errorSpan.classList.remove('error');
      errorSpan.classList.add('success');
    }
  } else if (value) {
    input.classList.remove('valid');
    input.classList.add('invalid');
    if (errorSpan) {
      errorSpan.textContent = 'Invalid: Enter valid value';
      errorSpan.classList.remove('success');
      errorSpan.classList.add('error');
    }
  } else {
    input.classList.remove('valid', 'invalid');
    if (errorSpan) {
      errorSpan.textContent = '';
      errorSpan.classList.remove('success', 'error');
    }
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
      email: (this_form.querySelector('input[type="email"]') || {}).value || '',
      phone: (this_form.querySelector('input[type="tel"]') || {}).value || ''
    };
    passengers.push(inputs);
  }

  const bookingDetailsArray = [{
    destination: select_destination_ || '',
    date: date_in ? date_in.value : '',
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
    const index = all_data.findIndex(d => d.bookingDetails && d.bookingDetails[0] && d.bookingDetails[0].id === window.editingBookingId);
    if (index !== -1) all_data[index] = data_n;
    else all_data.push(data_n);
  } else {
    all_data.push(data_n);
  }

  return all_data;
}
// =========================================
// validate form
// =========================================
function isFormValid() {
  if (!select_destination_) { showAlert('Please fill the destination field', 'error'); return false; }
  if (!date_in || !date_in.value) { showAlert('Please fill the departure date field', 'error'); return false; }
  if (!currentPassengerCount) { showAlert('Please select the number of passengers', 'error'); return false; }
  if (!getSelectedAccommodationName()) { showAlert('Please select the accommodation type', 'error'); return false; }

  const forms = document.querySelectorAll('.dy_form');
  for (let form of forms) {
    const inputs = form.querySelectorAll('input');
    for (let input of inputs) {
      let inputType = input.type === 'tel' ? 'number' : input.type;
      if (!validateInput(input, inputType)) {
        const placeholder = input.placeholder || input.name || 'field';
        showAlert(`Please correct all fields in passenger forms (e.g., ${placeholder})`, 'error');
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
  const tt = document.getElementById("ticket_total");
  const tp = document.getElementById("ticket_passengers");
  const ts = document.getElementById("ticket_spacecraft");
  const td = document.getElementById("ticket_duration");
  const tdest = document.getElementById("ticket_destination");

  if (tt) tt.innerText = total_price_.toFixed(2) + " $";
  if (tp) tp.innerText = currentPassengerCount;
  if (ts) ts.innerText = getSelectedAccommodationName() || '-';
  if (td) td.innerText = duration_du_travel + " days";
  if (tdest) tdest.innerText = select_destination_ || "-";
}

function total_() {
  let totalDays = (duration_du_travel || 0) * 2;
  let accomTotal = (currentPassengerCount || 0) * (accommodationPrice || 0) * totalDays;
  total_price_ = (destinationPrice || 0) + accomTotal;
  updateTicketInfo();
}

// =========================================
// INITIALIZATION FUNCTIONS
// =========================================
function add_data_to_local() { //add data to localstorage
  fetch("./data.json")
    .then(res => res.json())
    .then(data => {
      localStorage.setItem("data", JSON.stringify(data));

      mydata = data || {};
      destinations = mydata.destinations || [];
      accommodations = mydata.accommodations || [];
      get_data_();
    })
    .catch(err => console.error("Error:", err));
}

function get_data_() {   //get data from local storage
  if (!option_distination) return;

  option_distination.innerHTML = '';
  option_distination.innerHTML = '<option value="" disabled selected>Select your destination</option>';
  for (let d of destinations) {
    option_distination.innerHTML += `<option value="${d.id}">${d.name} - ${d.price}-$ </option>`;
  }

  if (accommodation_container_) accommodation_container_.innerHTML = "";
  for (let data of accommodations) {
    accommodation_container_.innerHTML += `
      <div class="accommodation-card border border-neon-blue/50 rounded-xl p-4 flex-1
          hover:shadow-[0_0_15px_#0ea5e9] transition-all cursor-pointer"
          data-id="${data.id}">
          <h3 class="font-orbitron text-xl text-neon-blue mb-2">${data.name}</h3>
          <p class="text-gray-300 text-sm">${data.shortDescription}</p>
          <h3 class=" text-M text-neon-blue mb-2">${data.pricePerDay}$/day</h3>
      </div>
    `;
  }
  addClickEventsToCards();
}

function addClickEventsToCards() {  // add click lisner in accomendations
  document.querySelectorAll(".accommodation-card").forEach(card => {
    card.addEventListener("click", function() {
      document.querySelectorAll(".accommodation-card").forEach(c => c.classList.remove("selected"));
      this.classList.add("selected");
      selectedAccommodationId = this.dataset.id;
      const found = accommodations.find(acc => acc.id.toString() === selectedAccommodationId);
      accommodationPrice = found ? found.pricePerDay : 0;
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
      if (!inputs_form) return;
      inputs_form.innerHTML = "";
      select_number_persons = parseInt(event.target.value) || 0;
      currentPassengerCount = 0;

      let formsToCreate = select_number_persons < 3 ? select_number_persons : 3;
      for (let a = 0; a < formsToCreate; a++) {
        const formElement = creat_form(a);
        inputs_form.appendChild(formElement);
        currentPassengerCount++;
        addValidationToForm(formElement);
      }

      if (button_add_passager) button_add_passager.style.display = select_number_persons < 3 ? "none" : "block";
      total_();
    });
  });
}
// =========================================
// check dat
// =========================================
function check_date(){
  if (!date_in) return true;
  let today = new Date();
  let oneMonthLater = new Date(today.getFullYear(), today.getMonth()+ 1 , today.getDate());
  let inputDate = new Date(date_in.value);

  if (isNaN(inputDate.getTime())) {
    showAlert('Please enter a valid date', 'error');
    return false;
  }

  if (inputDate < oneMonthLater) {
    showAlert(`You must select a date at least one month from now. Minimum allowed date: ${oneMonthLater.toDateString()}`, 'error');
    return false;
  } else {
    return true;
  }
}

// =========================================
// accommendations aficher
// =========================================
function select_destination_to_afficher_accommendations() {
  if (!option_distination) return;
  option_distination.addEventListener("change", function() {
    if (accommodation_container_) accommodation_container_.innerHTML = "";
    select_destination_ = option_distination.value;
    duration_du_travel = get_days(select_destination_);
    destinationPrice = get_price_de_destination(select_destination_);

    for (let data of accommodations) {
      if (data.availableOn && data.availableOn.includes(select_destination_)) {
        accommodation_container_.innerHTML += `
          <div class="accommodation-card border border-neon-blue/50 rounded-xl p-4 flex-1
              hover:shadow-[0_0_15px_#0ea5e9] transition-all cursor-pointer"
              data-id="${data.id}">
              <h3 class="font-orbitron text-xl text-neon-blue mb-2">${data.name}</h3>
              <p class="text-gray-300 text-sm">${data.shortDescription}</p>
              <h3 class=" text-M text-neon-blue mb-2">${data.pricePerDay}$/day</h3>
          </div>
        `;
      }
    }
    addClickEventsToCards();
    total_();
  });
}

// =========================================
// BUTTON EVENTS
// =========================================
if (button_add_passager) {
  button_add_passager.addEventListener("click", function() {
    if (currentPassengerCount < maxPassengers) {
      const newForm = creat_form(currentPassengerCount);
      inputs_form.appendChild(newForm);
      currentPassengerCount++;
      addValidationToForm(newForm);
      total_();
      if (currentPassengerCount >= maxPassengers) button_add_passager.style.display = "none";
    } else showAlert("The limit is 6 passengers", 'error');
  });
}

if (button_submit) {
  button_submit.addEventListener("click", function() {
    if(islogin()){
    if (isFormValid()) {
      if (!check_date()) return;
      localStorage.setItem("data_form", JSON.stringify(getdatafrom_forms()));
      showAlert(window.editingBookingId ? 'Booking updated successfully!' : 'Booking created successfully!', 'success');
      setTimeout(() => window.location.reload(), 1500);
    }
    }
  });

}

if (date_in) date_in.addEventListener("change", total_);


// =========================================
// INITIAL CALLS
// =========================================
add_data_to_local();
islogin();
get_data_();
get_number_passager();
select_destination_to_afficher_accommendations();
opned_from_my_booking_to_edity();