let mydata = JSON.parse(localStorage.getItem("data_form")) || [];
let bookingDetails_ = mydata.bookingDetails || [];
let passengers_ = mydata.passengers || [];
let main_= document.getElementById("container_")

function get_all_data(){
    
    for(let item of mydata){

        console.log()

         main_.innerHTML+= `<div class="ticket-card bg-space-purple/40 border border-neon-blue/50 rounded-2xl p-6 m-6 shadow-lg">
    <h2 class="font-orbitron text-4xl text-center text-glow text-neon-blue mb-6">
        🚀 Travel Ticket
    </h2>

    <div class="grid grid-cols-2 md:grid-cols-3 gap-6 p-2">
        <!-- Total Price -->
        <div class=" p-4 rounded-lg text-center border border-neon-blue/30">
            <h4 class="font-orbitron text-xl text-neon-blue mb-2">Total price</h4>
            <p id="ticket_total" class="text-4xl font-bold text-white tracking-wider">${item.bookingDetails[0].totalprice}$</p>
        </div>

        <!-- Passengers -->
        <div class=" p-4 rounded-lg text-center border border-neon-blue/30">
            <h4 class="font-orbitron text-xl text-neon-blue mb-2">num passagers</h4>
            <p id="ticket_passengers" class="text-gray-200 text-lg">${item.bookingDetails[0].numPassengers}</p>
        </div>

        <!-- Spacecraft -->
        <div class=" p-4 rounded-lg text-center border border-neon-blue/30">
            <h4 class="font-orbitron text-xl text-neon-blue mb-2">Spacecraft</h4>
            <p id="ticket_spacecraft" class="text-gray-200 text-lg">${item.bookingDetails[0].accommodation}</p>
        </div>

        <!-- Duration -->
        <div class=" p-4  text-center border border-neon-blue/30">
            <h4 class="font-orbitron text-xl text-neon-blue mb-2">Duration</h4>
            <p id="ticket_duration" class="text-gray-200 text-lg">${item.bookingDetails[0].duration}-days</p>
        </div>

        <!-- Destination -->
        <div class=" p-4 rounded-lg text-center border border-neon-blue/30 col-span-2 md:col-span-1">
            <h4 class="font-orbitron text-xl text-neon-blue mb-2">Destination</h4>
            <p id="ticket_destination" class="text-gray-200 text-lg">${item.bookingDetails[0].destination}<p>
        </div>
    </div>
</div>
  `

    }
    
    

}
get_all_data()