// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createDefaultUser } from './firebase'; // Import the function from firebase.js
import Home from './components/Home';
import UserLogin from './components/user/UserLogin';
import AdminLogin from './components/admin/AdminLogin';
import UserRegister from './components/user/UserRegister';
import UserBase from './components/user/UserBase';
import AdminBase from './components/admin/AdminBase';
import ManageSystem from './components/admin/ManageSystem';
import InitializeCollections from './components/admin/InitializeCollections';
import ManageAnnouncements from './components/admin/ManageAnnouncements';
import ManageUsers from './components/admin/ManageUsers';
import ManageRequests from './components/admin/ManageRequests'; // Import ManageRequests
import Announcements from './components/user/Announcements';
import BookAppointment from './components/user/BookAppointment';
import BookingHistory from './components/user/BookingHistory'; // Imported BookingHistory

function App() {
  useEffect(() => {
    const initializeApp = async () => {
      // Only create default user if in development
      if (process.env.NODE_ENV === 'development') {
        try {
          await createDefaultUser();
        } catch (error) {
          console.error('Error initializing default user:', error);
        }
      }
    };

    initializeApp();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/user-register" element={<UserRegister />} />
        <Route path="/user-base" element={<UserBase />} >
          <Route path="announcements" element={<Announcements />} />
          <Route path="book-appointment" element={<BookAppointment />} />
          <Route path="booking-history" element={<BookingHistory />} /> {/* Added route for BookingHistory */}
        </Route>
        <Route path="/admin-base" element={<AdminBase />} >
          <Route path="manage-system" element={<ManageSystem />} />
          <Route path="manage-announcements" element={<ManageAnnouncements />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="manage-requests" element={<ManageRequests />} /> {/* Added route for ManageRequests */}
        </Route>
        <Route path="/initialize-collections" element={<InitializeCollections />} />
      </Routes>
    </Router>
  );
}

export default App;
