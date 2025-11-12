let name_in_page = document.getElementById("name_")
let login_hid = document.getElementById("login_tag")
let main_ = document.getElementById("container_")
let button_add_passager = document.getElementById("add_passager")
button_add_passager.style.display="none"
let date_in = document.getElementById("date_input")
let option_distination = document.getElementById("options_dist")
let button_submit = document.getElementById("button_submit")
let total_price_ = document.getElementById("totalprice")
let number_passager=0;
let mydata = JSON.parse(localStorage.getItem("data")) || {};
let selectedAccommodationId = null;
let destinations = mydata.destinations || [];
let spacecraft = mydata.spacecraft || [];
let accommodations = mydata.accommodations || [];
let duration_du_travel;
let date_;
let accommodation_container_ = document.getElementById("accommodation_container")
let currentPassengerCount = 0; 
let maxPassengers = 6; 

/* les variables de total destination */
let select_number_persons
let select_destination_


let destinationPrice = 0; 
let accommodationPrice = 0;  

function islogin(){
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let is_l =false
    for (let user of users) {
        if (user.logged_in===true) {
            is_l=true
            let nome_ = user.nome
                name_in_page.innerText=nome_
                login_hid.innerText="log out"
                login_info_id=user.id;
                return true;
        }
    }
    return is_l
}
islogin()

// Simple function to validate input using regex
function validateInput(input, type) {
  const value = input.value.trim();
  let regex;
  if (type === 'text') {
    regex = /^[a-zA-Z\s]{2,30}$/; // English letters and spaces, 2-30 characters
  } else if (type === 'email') {
    regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
  } else if (type === 'number') {
    regex = /^\d{10,15}$/; // Phone number 10-15 digits
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
function get_price_de_destination(nome_de_destination){
   let price__;
for(destination_ of destinations){
if(destination_.id===nome_de_destination){ 
price__= destination_.price
}
}
return price__
}
function creat_form(index){
 const form_ = document.createElement("div")
 form_.classList.add("dy_form", "border", "border-neon-blue/30", "p-4", "rounded-lg")
 form_.innerHTML=`
   <h1 class="font-orbitron text-2xl mb-4 text-glow ">
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
 `
 return form_
}

// New simple function to collect data in a clear object structure
function getdatafrom_forms(){
  const passengers = [];
  const get_forms = document.querySelectorAll(".dy_form") 
  for(let this_form of get_forms){
    // Collect all text inputs in a list for correct ordering
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
    destinationPrice: destinationPrice,  // إضافة سعر الوجهة لحفظها في البيانات
    accommodationPrice: accommodationPrice  // إضافة سعر الإقامة لحفظها في البيانات
  }];

  const result = {
    passengers: passengers,
    bookingDetails: bookingDetailsArray
  };

  return result;
}

  function add_data_to_local() {
      fetch("./data.json")
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("data", JSON.stringify(data));
        })
        .catch((error) => console.error("Error:", error));
    }

  add_data_to_local();


      function get_number_passager(){
                let persons_ = document.querySelectorAll('input[name="person"]');
                let inputs_form = document.getElementById("form_inputs")
                
         for (let radio of persons_) {
            
        radio.addEventListener("change", (event) => {
        inputs_form.innerHTML=""
          select_number_persons = parseInt(event.target.value);
          currentPassengerCount = 0;
          if(select_number_persons < 3){
           
            for(let a = 0; a < select_number_persons; a++){
              const formElement = creat_form(a);
              inputs_form.appendChild(formElement);
              currentPassengerCount++;
              // Add validation to each input
              formElement.querySelectorAll('input').forEach(input => {
                input.addEventListener('input', function() {
                  let inputType = this.type === 'tel' ? 'number' : this.type;
                  validateInput(this, inputType);
                });
              });
            }
            button_add_passager.style.display = "none"; 
          } else {
         
            for(let a = 0; a < 3; a++){
              const formElement = creat_form(a);
              inputs_form.appendChild(formElement);
              currentPassengerCount++;
              // Add validation to each input
              formElement.querySelectorAll('input').forEach(input => {
                input.addEventListener('input', function() {
                  let inputType = this.type === 'tel' ? 'number' : this.type;
                  validateInput(this, inputType);
                });
              });
            }
            button_add_passager.style.display = "block";
          }
          // Save to localStorage after radio change
    });
 }
 
}
get_number_passager()

button_add_passager.addEventListener("click", function() {
  let inputs_form = document.getElementById("form_inputs");
  if (currentPassengerCount < maxPassengers) {
    const newForm = creat_form(currentPassengerCount);
    inputs_form.appendChild(newForm);
    currentPassengerCount++;
    // Add validation to new inputs
    newForm.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', function() {
        let inputType = this.type === 'tel' ? 'number' : this.type;
        validateInput(this, inputType);
      });
    });
   
    if (currentPassengerCount >= maxPassengers) {
      button_add_passager.style.display = "none";
    }
  } else {
    alert("the limit 6");
  }
});

function get_data_() {
    for (let datas of destinations) {
    
        option_distination.innerHTML +=`<option value="${datas.id}">${datas.name}</option> `;
    }
      for (let datas of spacecraft) {

    }
      for (let data of accommodations) {
       accommodation_container_.innerHTML+=`
              <div class="accommodation-card border border-neon-blue/50 rounded-xl p-4 flex-1 
                      hover:shadow-[0_0_15px_#0ea5e9] transition-all cursor-pointer ${selectedAccommodationId === data.id.toString() ? 'selected' : ''}" 
                      data-id="${data.id}">
                  <h3 class="font-orbitron text-xl text-neon-blue mb-2">${data.name}</h3>
                  <p class="text-gray-300 text-sm">
                  ${data.shortDescription}
                  </p>
                  <h3 class=" text-M text-neon-blue mb-2">${data.pricePerDay}$/day</h3>
              </div>`;
    }
    // Add click events to initial cards
    addClickEventsToCards();
}
get_data_();




// Function to add click events to cards
function addClickEventsToCards() {
    document.querySelectorAll(".accommodation-card").forEach(card => {
        card.addEventListener("click", function () {
            // Remove selection from other cards
            document.querySelectorAll(".accommodation-card").forEach(c => c.classList.remove("selected"));
            // Select current card
            this.classList.add("selected");
            selectedAccommodationId = this.dataset.id;
            // استرجاع سعر الإقامة المختارة وتخزينه
            const selectedAcc = accommodations.find(acc => acc.id.toString() === selectedAccommodationId);
            if (selectedAcc) {
                accommodationPrice = selectedAcc.pricePerDay;
                console.log(`${accommodationPrice}`);  
            }
            // Save to localStorage after accommodation selection
        });
    });
}

function get_days(destination){
    let days_ = 0;

    for(destination_ of destinations){
       
        if(destination_.id == destination){ 
       
            
            if(destination_.travelDuration.includes("days")){
                days_ = parseInt(destination_.travelDuration);
            } else if(destination_.travelDuration.includes("years")){
                days_ = parseInt(destination_.travelDuration) * 365;
            } else {
                days_ = parseInt(destination_.travelDuration) * 30;
            }
        }
    }
return days_
}

function select_destination(){
    option_distination.addEventListener("change",function(){
         accommodation_container_.innerHTML=""
         select_destination_ =option_distination.value
        duration_du_travel= get_days(select_destination_)
       destinationPrice= get_price_de_destination(select_destination_)
       
         for (let data of accommodations) {
            let is_include = data.availableOn.includes(select_destination_);
            if(is_include){
                accommodation_container_.innerHTML+=`
                <div class="accommodation-card border border-neon-blue/50 rounded-xl p-4 flex-1 
                    hover:shadow-[0_0_15px_#0ea5e9] transition-all cursor-pointer ${selectedAccommodationId === data.id.toString() ? 'selected' : ''}" 
                        data-id="${data.id}">
                    <h3 class="font-orbitron text-xl text-neon-blue mb-2">${data.name}</h3>
                    <p class="text-gray-300 text-sm">
                    ${data.shortDescription}
                    </p>
                    <h3 class=" text-M text-neon-blue mb-2">${data.pricePerDay}$/day</h3>
                </div>`
        }
       }
     // Add click events after update
       addClickEventsToCards();
    })
}
select_destination()


// Simple function to check full form validity
function isFormValid() {
  // Check basic fields
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

  // Check passenger forms
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

button_submit.addEventListener("click",function(){
if(islogin()){
 if (isFormValid()) {
    localStorage.setItem("data_form", JSON.stringify(getdatafrom_forms()));
    alert('Data saved successfully!');
  }
}else{
    window.open("login.html", "_blank");
}
 
});

if(islogin()){
button_submit.innerText="Submit data"
}

// Function to return selected accommodation name (or null if not selected)
function getSelectedAccommodationName() {
    if (!selectedAccommodationId) return null;
    const selectedAcc = accommodations.find(acc => acc.id.toString() === selectedAccommodationId);
    return selectedAcc ? selectedAcc.name : null;
}


function total_(){
console.log("days"+duration_du_travel)
console.log("acc p"+accommodationPrice)
console.log("dis p"+destinationPrice)
}





