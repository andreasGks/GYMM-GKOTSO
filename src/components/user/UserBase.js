import React from 'react';
import { Link, Outlet } from 'react-router-dom';

// Define the grey color for consistency
const greyColor = '#2F4F4F'; // Matching grey color from AdminBase

const UserBase = () => {
  // Styles for the UserBase component
  const styles = {
    header: {
      backgroundColor: greyColor,
      padding: '15px 20px', // Match padding with AdminBase
      textAlign: 'center',
      color: '#fff',
      fontSize: '30px', // Match font size with AdminBase
      fontFamily: 'Arial, sans-serif',
      marginBottom: '15px', // Match margin with AdminBase
    },
    sidebar: {
      width: '200px', // Match width with AdminBase
      float: 'left',
      padding: '15px', // Match padding with AdminBase
      backgroundColor: '#fff', // White background for sidebar
      color: '#333', // Dark grey text color for contrast
      height: 'calc(100vh - 60px)', // Adjust height to fit the screen
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Match shadow with AdminBase
      borderRadius: '8px', // Match border radius with AdminBase
      marginRight: '15px', // Match margin with AdminBase
    },
    mainContent: {
      marginLeft: '220px', // Match margin with AdminBase for content area
      padding: '15px', // Match padding with AdminBase
      backgroundColor: '#fff', // White background for content area
      color: '#333', // Dark grey text color for contrast
      borderRadius: '8px', // Match border radius with AdminBase
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Match shadow with AdminBase
    },
    logoutButton: {
      display: 'block',
      marginTop: '20px',
      padding: '10px 20px', // Match padding with AdminBase
      backgroundColor: '#ff4c4c',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px', // Match font size with AdminBase
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Match shadow with AdminBase
    },
    navList: {
      listStyle: 'none',
      padding: 0,
    },
    navItem: {
      marginBottom: '10px',
    },
    navLink: {
      textDecoration: 'none',
      color: greyColor, // Match link color with AdminBase
      fontWeight: 'bold',
      fontSize: '16px', // Match font size with AdminBase
      transition: 'color 0.3s',
    },
    navLinkHover: {
      color: '#ff4c4c', // Color for hover effect
    },
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: greyColor, color: '#fff', minHeight: '100vh', padding: '20px', boxSizing: 'border-box' }}>
      <header style={styles.header}>
        GYMM-GKOTSO
      </header>
      <div style={{ display: 'flex' }}>
        <aside style={styles.sidebar}>
          <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>User Options</h2>
          <nav>
            <ul style={styles.navList}>
              {/* Removed Browse Services link */}
              <li style={styles.navItem}>
                <Link to="/user-base/book-appointment" style={styles.navLink} onMouseOver={(e) => e.target.style.color = styles.navLinkHover.color} onMouseOut={(e) => e.target.style.color = styles.navLink.color}>
                  Book Appointment
                </Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/user-base/booking-history" style={styles.navLink} onMouseOver={(e) => e.target.style.color = styles.navLinkHover.color} onMouseOut={(e) => e.target.style.color = styles.navLink.color}>
                  Booking History
                </Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/user-base/announcements" style={styles.navLink} onMouseOver={(e) => e.target.style.color = styles.navLinkHover.color} onMouseOut={(e) => e.target.style.color = styles.navLink.color}>
                  Announcements
                </Link>
              </li>
            </ul>
          </nav>
          <button 
            onClick={() => window.location.href = '/'} 
            style={styles.logoutButton}
          >
            Logout
          </button>
        </aside>
        <main style={styles.mainContent}>
          <Outlet /> {/* This will render the selected section component */}
        </main>
      </div>
    </div>
  );
};

export default UserBase;
