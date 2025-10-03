import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query } from 'firebase/firestore';
import { fetchCountries, fetchCities } from '../../services/apiService';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    firstName: '', lastName: '', country: '', city: '', address: '', email: '', username: '', password: '', role: 'user'
  });
  const [editMode, setEditMode] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [error, setError] = useState('');
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);

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
      if (newUser.country) {
        try {
          setLoadingCities(true);
          const cities = await fetchCities(newUser.country);
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
  }, [newUser.country]);

  useEffect(() => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    });

    return () => unsubscribe();
  }, []);

  const handleAddUser = async () => {
    const requiredFields = ['firstName', 'lastName', 'country', 'city', 'address', 'email', 'username', 'password'];
    const isAllFieldsFilled = requiredFields.every(field => newUser[field].trim() !== '');

    if (!isAllFieldsFilled) {
      setError('All fields are required.');
      return;
    }

    setError('');
    await addDoc(collection(db, 'users'), newUser);
    setNewUser({
      firstName: '', lastName: '', country: '', city: '', address: '', email: '', username: '', password: '', role: 'user'
    });
  };

  const handleUpdateUser = async (id) => {
    await updateDoc(doc(db, 'users', id), editedUser);
    setEditMode(null);
  };

  const handleDeleteUser = async (id) => {
    await deleteDoc(doc(db, 'users', id));
  };

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <h2 style={{ textAlign: 'center' }}>Manage Users</h2>
      <div style={{ marginBottom: '20px' }}>
        {/* Add User Form */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '14px', color: '#555', marginBottom: '8px', display: 'block', fontWeight: 'bold' }}>First Name:</label>
            <input
              type="text"
              value={newUser.firstName}
              onChange={(e) => setNewUser(prev => ({ ...prev, firstName: e.target.value }))}
              style={{ width: '100%', padding: '10px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '14px', color: '#555', marginBottom: '8px', display: 'block', fontWeight: 'bold' }}>Last Name:</label>
            <input
              type="text"
              value={newUser.lastName}
              onChange={(e) => setNewUser(prev => ({ ...prev, lastName: e.target.value }))}
              style={{ width: '100%', padding: '10px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '14px', color: '#555', marginBottom: '8px', display: 'block', fontWeight: 'bold' }}>Country:</label>
            <select
              value={newUser.country}
              onChange={(e) => setNewUser(prev => ({ ...prev, country: e.target.value }))}
              required
              disabled={loadingCountries}
              style={{ width: '100%', padding: '10px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' }}
            >
              <option value="">Select Country</option>
              {countries.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '14px', color: '#555', marginBottom: '8px', display: 'block', fontWeight: 'bold' }}>City:</label>
            <select
              value={newUser.city}
              onChange={(e) => setNewUser(prev => ({ ...prev, city: e.target.value }))}
              required
              disabled={loadingCities || !newUser.country}
              style={{ width: '100%', padding: '10px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' }}
            >
              <option value="">Select City</option>
              {cities.map((c, index) => (
                <option key={index} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '14px', color: '#555', marginBottom: '8px', display: 'block', fontWeight: 'bold' }}>Address:</label>
            <input
              type="text"
              value={newUser.address}
              onChange={(e) => setNewUser(prev => ({ ...prev, address: e.target.value }))}
              style={{ width: '100%', padding: '10px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '14px', color: '#555', marginBottom: '8px', display: 'block', fontWeight: 'bold' }}>Email:</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
              style={{ width: '100%', padding: '10px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '14px', color: '#555', marginBottom: '8px', display: 'block', fontWeight: 'bold' }}>Username:</label>
            <input
              type="text"
              value={newUser.username}
              onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
              style={{ width: '100%', padding: '10px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '14px', color: '#555', marginBottom: '8px', display: 'block', fontWeight: 'bold' }}>Password:</label>
            <input
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
              style={{ width: '100%', padding: '10px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' }}
            />
          </div>
          <button
            type="button"
            onClick={handleAddUser}
            style={{ padding: '15px 30px', fontSize: '18px', backgroundColor: '#fff', color: '#2F4F4F', border: 'none', borderRadius: '5px', cursor: 'pointer', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', transition: 'background-color 0.3s, color 0.3s' }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#e0e0e0'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#fff'}
          >
            Add User
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>First Name</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Last Name</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Country</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>City</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Address</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Email</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Username</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={{ padding: '10px' }}>
                {editMode === user.id ? (
                  <input
                    type="text"
                    value={editedUser.firstName || user.firstName}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, firstName: e.target.value }))}
                    style={{ padding: '5px', fontSize: '14px', width: '100%' }}
                  />
                ) : (
                  user.firstName
                )}
              </td>
              <td style={{ padding: '10px' }}>
                {editMode === user.id ? (
                  <input
                    type="text"
                    value={editedUser.lastName || user.lastName}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, lastName: e.target.value }))}
                    style={{ padding: '5px', fontSize: '14px', width: '100%' }}
                  />
                ) : (
                  user.lastName
                )}
              </td>
              <td style={{ padding: '10px' }}>
                {editMode === user.id ? (
                  <select
                    value={editedUser.country || user.country}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, country: e.target.value }))}
                    style={{ padding: '5px', fontSize: '14px', width: '100%' }}
                  >
                    <option value="">Select Country</option>
                    {countries.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  user.country
                )}
              </td>
              <td style={{ padding: '10px' }}>
                {editMode === user.id ? (
                  <select
                    value={editedUser.city || user.city}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, city: e.target.value }))}
                    style={{ padding: '5px', fontSize: '14px', width: '100%' }}
                    disabled={!editedUser.country}
                  >
                    <option value="">Select City</option>
                    {cities.map((c, index) => (
                      <option key={index} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                ) : (
                  user.city
                )}
              </td>
              <td style={{ padding: '10px' }}>
                {editMode === user.id ? (
                  <input
                    type="text"
                    value={editedUser.address || user.address}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, address: e.target.value }))}
                    style={{ padding: '5px', fontSize: '14px', width: '100%' }}
                  />
                ) : (
                  user.address
                )}
              </td>
              <td style={{ padding: '10px' }}>
                {editMode === user.id ? (
                  <input
                    type="email"
                    value={editedUser.email || user.email}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
                    style={{ padding: '5px', fontSize: '14px', width: '100%' }}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td style={{ padding: '10px' }}>
                {editMode === user.id ? (
                  <input
                    type="text"
                    value={editedUser.username || user.username}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, username: e.target.value }))}
                    style={{ padding: '5px', fontSize: '14px', width: '100%' }}
                  />
                ) : (
                  user.username
                )}
              </td>
              <td style={{ padding: '10px' }}>
                {editMode === user.id ? (
                  <button
                    onClick={() => handleUpdateUser(user.id)}
                    style={{ marginRight: '10px', padding: '5px 10px' }}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditMode(user.id);
                      setEditedUser({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        country: user.country,
                        city: user.city,
                        address: user.address,
                        email: user.email,
                        username: user.username
                      });
                      setCities([]); // Clear cities to force reload based on selected country
                    }}
                    style={{ marginRight: '10px', padding: '5px 10px' }}
                  >
                    Update
                  </button>
                )}
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  style={{ padding: '5px 10px' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
