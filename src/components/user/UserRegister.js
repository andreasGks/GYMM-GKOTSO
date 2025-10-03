import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { fetchCountries, fetchCities } from '../../services/apiService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the styles

const UserRegister = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const countries = await fetchCountries();
        setCountries(countries);
        setLoadingCountries(false);
      } catch (error) {
        console.error('Failed to load countries:', error);
      }
    };

    loadCountries();
  }, []);

  useEffect(() => {
    const loadCities = async () => {
      if (country) {
        try {
          setLoadingCities(true);
          const cities = await fetchCities(country);
          setCities(cities);
          setLoadingCities(false);
        } catch (error) {
          console.error('Failed to load cities:', error);
          setLoadingCities(false);
        }
      } else {
        setCities([]);
      }
    };

    loadCities();
  }, [country]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user data to Firestore
      await addDoc(collection(db, 'pendingUsers'), {
        firstName,
        lastName,
        country,
        city,
        address,
        email,
        username,
        password,
        createdAt: new Date(),
        status: 'pending',
        uid: user.uid, // Store Firebase UID
      });

      toast.info('Your request will be approved or rejected within 24 hours. If approved, you will be able to log in.');
      navigate('/home'); // Redirect to home or another appropriate page
    } catch (error) {
      console.error('Registration failed:', error.message);
      toast.error('Registration failed: ' + error.message);
    }
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#2F4F4F', // Main color
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    boxSizing: 'border-box',
    gap: '20px', // Added space between form and note
  };

  const gymNameStyle = {
    backgroundColor: '#2F4F4F', // Main color of the site
    color: '#fff', // White text color
    padding: '20px',
    fontSize: '36px', // Matching size with AdminLogin
    textAlign: 'center',
    width: '100%',
    marginBottom: '20px', // Space below the gym name
    position: 'relative',
    top: '0',
    zIndex: '1', // Ensure it stays above other content
  };

  const formContainerStyle = {
    backgroundColor: '#fff',
    color: '#333',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%',
    zIndex: '0',
  };

  const noteContainerStyle = {
    backgroundColor: '#fff9c4', // Light yellow background for the note
    color: '#333',
    borderRadius: '5px',
    padding: '15px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%',
    marginTop: '20px',
    fontSize: '16px',
  };

  const headingStyle = {
    fontSize: '36px',
    marginBottom: '30px',
    color: '#333',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
  };

  const formGroupStyle = {
    marginBottom: '20px',
  };

  const labelStyle = {
    fontSize: '14px',
    color: '#555',
    marginBottom: '8px',
    display: 'block',
    fontWeight: 'bold',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s ease-in-out',
  };

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
    marginTop: '20px',
  };

  const buttonHoverStyle = {
    backgroundColor: '#e0e0e0',
  };

  return (
    <div style={containerStyle}>
      <ToastContainer />
      <div style={gymNameStyle}>
        Welcome to GYMM-GKOTSO
      </div>
      <div style={formContainerStyle}>
        <h1 style={headingStyle}>User Registration</h1>
        <form onSubmit={handleRegister} style={formStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>First Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Last Name:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Country:</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              disabled={loadingCountries}
              style={inputStyle}
            >
              <option value="">Select Country</option>
              {countries.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>City:</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              disabled={loadingCities || !country}
              style={inputStyle}
            >
              <option value="">Select City</option>
              {cities.map((c, index) => (
                <option key={index} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Address:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
            onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
          >
            Register
          </button>
        </form>
      </div>
      <div style={noteContainerStyle}>
        <p><strong>Note:</strong> Thank you for registering! Your request will be reviewed and you will receive a response within 24 hours. If approved, you will be able to log in. If you have any questions, feel free to contact us.</p>
      </div>
    </div>
  );
};

export default UserRegister;
