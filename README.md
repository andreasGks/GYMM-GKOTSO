# GYMΜ-GKOTSO 🏋️‍♂️

**University Project – Web Application**

A dynamic gym management platform built with **React** and **Firebase**, designed to streamline interactions between gym members and administrators.

### Features

* 👤 **User side**:

  * Register and log in securely
  * View available programs, trainers, and announcements
  * Book and manage appointments in real time
  * Join or leave teams based on capacity

* 🔑 **Admin side**:

  * Manage announcements, programs, trainers, requests, and users
  * Real-time updates synced through Firebase Firestore
  * Collection initialization and system management modules

* 🌍 **API integration**:

  * Fetch country and city data dynamically via `countriesnow.space` API

### Tech Stack

* **Frontend**: React (functional components, hooks, responsive design)
* **Backend/DB**: Firebase Firestore (real-time data, authentication)
* **External APIs**: Countries & Cities API
* **Other**: Modular component structure with separated `admin` and `user` folders

### Highlights

* Real-time updates with Firestore listeners
* Separation of concerns: independent **Admin** and **User** modules
* Responsive UI for smooth cross-device experience

---

💡 Built as part of a university assignment to demonstrate modern web development practices with React and Firebase.
