import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

// Define the grey color for consistency
const greyColor = '#2F4F4F'; // Matching background color from AdminLogin

const AdminBase = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement any logout logic here
    navigate('/home');
  };

  const styles = {
    header: {
      backgroundColor: greyColor,
      padding: '15px 20px', // Reduced padding
      textAlign: 'center',
      color: '#fff',
      fontSize: '30px', // Adjusted font size
      fontFamily: 'Arial, sans-serif',
      marginBottom: '15px', // Reduced margin
    },
    sidebar: {
      width: '200px', // Reduced width
      float: 'left',
      padding: '15px', // Reduced padding
      backgroundColor: '#fff',
      color: '#333',
      height: 'calc(100vh - 60px)', // Adjust height to fit the screen
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Reduced shadow
      borderRadius: '8px', // Reduced border radius
      marginRight: '15px', // Reduced margin
    },
    mainContent: {
      marginLeft: '220px', // Adjusted margin to account for the new sidebar width
      padding: '15px', // Reduced padding
      backgroundColor: '#fff',
      color: '#333',
      borderRadius: '8px', // Reduced border radius
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Reduced shadow
    },
    logoutButton: {
      display: 'block',
      marginTop: '20px',
      padding: '10px 20px', // Reduced padding
      backgroundColor: '#ff4c4c',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px', // Adjusted font size
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
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
      color: greyColor, // Matching link color
      fontWeight: 'bold',
      fontSize: '16px', // Adjusted font size
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
          <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>Admin's Options</h2>
          <nav>
            <ul style={styles.navList}>
              <li style={styles.navItem}>
                <Link to="/admin-base/manage-requests" style={styles.navLink} onMouseOver={(e) => e.target.style.color = styles.navLinkHover.color} onMouseOut={(e) => e.target.style.color = styles.navLink.color}>
                  Manage Requests
                </Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/admin-base/manage-users" style={styles.navLink} onMouseOver={(e) => e.target.style.color = styles.navLinkHover.color} onMouseOut={(e) => e.target.style.color = styles.navLink.color}>
                  Manage Users
                </Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/admin-base/manage-system" style={styles.navLink} onMouseOver={(e) => e.target.style.color = styles.navLinkHover.color} onMouseOut={(e) => e.target.style.color = styles.navLink.color}>
                  Manage System
                </Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/admin-base/manage-announcements" style={styles.navLink} onMouseOver={(e) => e.target.style.color = styles.navLinkHover.color} onMouseOut={(e) => e.target.style.color = styles.navLink.color}>
                  Manage Announcements
                </Link>
              </li>
            </ul>
          </nav>
          <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
        </aside>
        <main style={styles.mainContent}>
          <Outlet /> {/* This will render the selected section component */}
        </main>
      </div>
    </div>
  );
};

export default AdminBase;
