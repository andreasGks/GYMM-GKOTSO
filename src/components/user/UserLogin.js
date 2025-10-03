import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate email format
    if (!email.includes('@')) {
      setError('Invalid email format');
      return;
    }

    // Basic password length check
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Query Firestore for user's approval status
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();

        if (userData.status === 'approved') {
          navigate('/user-base'); // Redirect to user dashboard or main page
        } else {
          setError('Your account is not approved yet. Please contact support.');
          await auth.signOut(); // Sign out if not approved
        }
      } else {
        setError('No such user found or account is not approved.');
        await auth.signOut(); // Sign out if not found or not approved
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed: ' + error.message);
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Welcome to GYMM-GKOTSO</h1>
      <div style={formContainerStyle}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>User Login</h2>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <button type="submit" style={buttonStyle}>Login</button>
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

// Styling
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: '#2F4F4F',
  color: '#fff',
  fontFamily: 'Arial, sans-serif',
  padding: '20px',
  boxSizing: 'border-box'
};

const titleStyle = {
  fontSize: '36px',
  marginTop: '30px',
  marginBottom: '30px',
  color: '#fff',
  textAlign: 'center'
};

const formContainerStyle = {
  backgroundColor: '#fff',
  color: '#333',
  borderRadius: '10px',
  padding: '20px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
  maxWidth: '400px',
  width: '100%'
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc'
};

const buttonStyle = {
  padding: '15px 30px',
  fontSize: '18px',
  backgroundColor: '#fff',
  color: '#2F4F4F',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  transition: 'background-color 0.3s, color 0.3s',
};

export default UserLogin;
