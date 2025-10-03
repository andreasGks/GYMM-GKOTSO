import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const adminUsername = 'admin';
  const adminPassword = '1234';

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (username === adminUsername && password === adminPassword) {
      alert('Login successful!');
      navigate('/admin-base'); // Redirect to admin dashboard or base page
    } else {
      alert('Incorrect username or password.');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      background: '#2F4F4F', // Matching background color
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <h1 style={{ 
        fontSize: '36px', 
        marginTop: '30px', // Adjusted margin to move the text higher
        marginBottom: '30px',
        color: '#fff',
        textAlign: 'center' 
      }}>
        Welcome admin to GYMM-GKOTSO
      </h1>
      <div style={{ 
        backgroundColor: '#fff', 
        color: '#333',
        borderRadius: '10px', 
        padding: '20px', 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '10px', 
                borderRadius: '5px', 
                border: '1px solid #ccc' 
              }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '10px', 
                borderRadius: '5px', 
                border: '1px solid #ccc' 
              }}
            />
          </div>
          <button type="submit" style={buttonStyle}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

// Reuse the buttonStyle from Home.js
const buttonStyle = {
  padding: '15px 30px',
  fontSize: '18px',
  backgroundColor: '#fff',
  color: '#2F4F4F', // Dark grey color for text on the buttons
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  transition: 'background-color 0.3s, color 0.3s',
};

export default AdminLogin;
