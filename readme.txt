

# Space Tourism Booking App

A front-end web application for booking space-tourism experiences, built with HTML, CSS and JavaScript.

## 🚀 Project Overview

This project allows users to:

* View available destinations for space tourism (via `destinations.html` + `data.json`)
* Create an account / log in (`login.html`, `users.json`)
* Book a trip (`booking.html`, `booking.js`)
* View their existing bookings (`mybooking.html`, `mybooking.js`)
* Read information about the service (`about.html`)

The UI is styled via `style.css`.
User and booking data are stored in simple JSON files (`users.json`, `data.json`) for simulation purposes.

## 🛠️ Key Files & Structure

```
/index.html                 ← main landing page  
/about.html                 ← information page  
/destinations.html          ← list of space tourism destinations  
/login.html                 ← login/signup page  
/booking.html               ← booking form/page  
/mybooking.html             ← view user’s bookings  
/style.css                 ← global CSS  
/booking.js                 ← script controlling booking logic  
/mybooking.js               ← script for viewing bookings  
/data.json                  ← destination & trip data  
/users.json                 ← user account data  
```

## ✅ Features

* Responsive layout (works across desktop & mobile)
* Client-side validation for login/booking flows
* Simple JSON-based data simulation (no backend)
* Modular HTML pages for each user flow
* Clear CSS styling and user-friendly UI

## 🔧 Getting Started

1. Clone this repository:

   ```bash
   git clone https://github.com/ayoub-elkhadir-d/-Space-Tourism-Booking-App.git
   ```
2. Navigate into the project folder and open `index.html` in your browser.
3. Use the `login.html` to create or access a dummy user (data written to `users.json`).
4. Select a destination, fill in booking details, and submit.
5. View your booking in `mybooking.html`.

## 📋 Prerequisites & Limitations

* No server / backend — all data lives in JSON files and is manipulated client-side.
* Not suitable for production without implementing secure backend, authentication, database, etc.
* Data persistence is limited to local simulation only.
* For full client-side functionality, you may need to host via a simple local HTTP server (rather than `file://`) to avoid CORS or file-access issues.

## 📚 Tech Stack

* HTML5
* CSS3
* Vanilla JavaScript
* JSON files for simulated data

## 💡 Next Steps / Enhancements

* Integrate a real backend (e.g., Node.js + Express + MongoDB) for persistent bookings and user data.
* Add authentication & authorization (JWT, OAuth).
* Enhance UI/UX: animations, transitions, mobile-first design.
* Add filtering/searching of destinations.
* Add payment processing / checkout simulation.
* Improve error handling, edge-cases, and UI feedback.

## 🧑‍💻 Contributing

You’re welcome to open issues or pull requests. Please ensure:

* Code is clean and well-commented
* UI changes maintain responsiveness
* New features have clear documentation

## 📄 License

This project is offered under [MIT License](LICENSE) (or specify your chosen license).


