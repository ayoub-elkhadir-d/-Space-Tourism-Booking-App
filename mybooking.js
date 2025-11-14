let mydata = JSON.parse(localStorage.getItem("data_form")) || [];
let bookingDetails_ = mydata.bookingDetails || [];
let passengers_ = mydata.passengers || [];

let container_cards = document.getElementById("container");

function get_all_data() {
    for (let item of mydata) {
        container_cards.innerHTML += `
        <div class="relative max-w-3xl mx-auto bg-gradient-to-br from-[#12021f] to-[#1a0633] border border-blue-700/40 rounded-3xl shadow-2xl overflow-hidden card">
    
    <div class="flex justify-between items-center px-8 pt-8 pb-4">
        <h2 class="font-orbitron text-4xl text-blue-400 tracking-widest drop-shadow-lg">
            🚀 Travel Ticket
        </h2>

        <span class="verified_h1 px-4 py-2 text-lg font-bold  border  rounded-xl bg-green-900/20 shadow-[0_0_10px_#22c55e]" >
          ${item.bookingDetails[0].status}
        </span>
    </div>
      <p class="id_class text-xl text-blue-400 pl-5 ">ID :${item.bookingDetails[0].id}</p>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-6 px-8 py-6">

        <div class="p-4 rounded-xl border border-blue-600/40 hover:border-blue-400">
            <h4 class="font-orbitron text-lg text-blue-400 mb-1">Total Price</h4>
            <p class="price text-3xl font-black text-white">${item.bookingDetails[0].totalprice}$</p>
        </div>

        <div class="p-4 rounded-xl border border-blue-600/40 hover:border-blue-400">
            <h4 class="font-orbitron text-lg text-blue-400 mb-1">Passengers</h4>
            <p class="text-xl text-gray-200">${item.bookingDetails[0].numPassengers}</p>
        </div>

        <div class="p-4 rounded-xl border border-blue-600/40 hover:border-blue-400">
            <h4 class="font-orbitron text-lg text-blue-400 mb-1">Spacecraft</h4>
            <p class="text-xl text-gray-200">${item.bookingDetails[0].accommodation}</p>
        </div>

        <div class="p-4 rounded-xl border border-blue-600/40 hover:border-blue-400">
            <h4 class="font-orbitron text-lg text-blue-400 mb-1">Duration</h4>
            <p class="text-xl text-gray-200">${item.bookingDetails[0].duration}-days</p>
        </div>

        <div class="p-4 rounded-xl border border-blue-600/40 hover:border-blue-400 col-span-2 md:col-span-1">
            <h4 class="font-orbitron text-lg text-blue-400 mb-1">Destination</h4>
            <p class="text-xl text-gray-200">${item.bookingDetails[0].destination}</p>
        </div>
    </div>

    <div class="px-8 pb-6 border-t border-blue-700/40 pt-4">
        <h3 class="font-orbitron text-2xl text-blue-400 mb-3">Passengers</h3>

        <div class="space-y-1">
            ${item.passengers.map(p => `
                <p class="text-gray-300 text-lg tracking-wide">${p.firstName} ${p.lastName} — ${p.email}</p>
            `).join('')}
        </div>

        <div class="flex justify-center gap-4 pt-10 items-center">

            <button class="button_delete px-5 py-2 font-orbitron border border-red-600 text-red-400 rounded-xl bg-red-900/20 hover:bg-red-700/40 transition shadow-[0_0_10px_#f00]">
                Delete
            </button>

            <button class="button_edit px-5 py-2 font-orbitron border border-yellow-600 text-yellow-400 rounded-xl bg-yellow-900/20 hover:bg-yellow-700/40 transition shadow-[0_0_10px_#ff0]">
                Edit
            </button>

            <button class="button_cancel px-5 py-2 font-orbitron border border-blue-500 text-blue-300 rounded-xl bg-blue-900/20 hover:bg-blue-700/40 transition shadow-[0_0_10px_#09f]">
                Cancel Booking
            </button>

        </div>
    </div>
        </div>
        `;
    }
}

get_all_data();

container_cards.addEventListener('click', function(event) {

    if (event.target.classList.contains('button_cancel')) {
        
        const card = event.target.closest('.card');
        const priceElement = card.querySelector('.verified_h1');
       const element_id = card.querySelector('.id_class');
       let rawText = element_id.textContent; 
        let bookingId = rawText.replace("ID :", "").trim();
        console.log(bookingId)
        for (let item of mydata) {

            if(item.bookingDetails[0].id==bookingId){
                item.bookingDetails[0].status="canceled"
                localStorage.setItem("data_form", JSON.stringify(mydata));
            }

        }
         if (priceElement) {
            priceElement.textContent = "Canceled";
   
        }

    }if (event.target.classList.contains('button_delete')) {
       const card = event.target.closest('.card');
      
       const element_id = card.querySelector('.id_class');
       let rawText = element_id.textContent; 
        let bookingId = rawText.replace("ID :", "").trim();
        
              for (let item of mydata) {

            if(item.bookingDetails[0].id==bookingId){
                let index = mydata.findIndex(function(item){ return item.bookingDetails[0].id == bookingId});
                if(index!==-1){
                mydata.splice(index, 1);
                localStorage.setItem("data_form", JSON.stringify(mydata));
                card.remove();
                }

            }

        }
    }
    if (event.target.classList.contains('button_edit')) {
       const card = event.target.closest('.card');
      
       const element_id = card.querySelector('.id_class');
       let rawText = element_id.textContent; 
        let bookingId = rawText.replace("ID :", "").trim();
        
       for (let item of mydata) {

            if(item.bookingDetails[0].id==bookingId){
              item.bookingDetails[0].opnedforom="edit"   
             localStorage.setItem("data_form", JSON.stringify(mydata));
              window.open("booking.html","_blank")
                
         
            }

        }
    }
});

