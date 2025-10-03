import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase'; // Adjust path as needed
import { collection, onSnapshot } from 'firebase/firestore';

const Home = () => {
  const [programs, setPrograms] = useState([]);
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    const unsubscribePrograms = onSnapshot(collection(db, 'programs'), (snapshot) => {
      const programsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPrograms(programsList);
    });

    const unsubscribeTrainers = onSnapshot(collection(db, 'trainers'), (snapshot) => {
      const trainersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTrainers(trainersList);
    });

    return () => {
      unsubscribePrograms();
      unsubscribeTrainers();
    };
  }, []);

  const getTrainerNames = (trainerIds = []) => {
    return trainerIds
      .map(id => {
        const trainer = trainers.find(trainer => trainer.id === id);
        return trainer ? trainer.name : 'Unknown Trainer';
      })
      .join(', ');
  };

  return (
    <div style={{ 
      textAlign: 'center', 
      margin: '0', 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      background: '#2F4F4F', 
      minHeight: '100vh',
      color: '#fff',
      boxSizing: 'border-box'
    }}>
      <h1 style={{ fontSize: '36px', marginBottom: '30px', color: '#fff' }}>
        Welcome to GYMM-GKOTSO
      </h1>
      
      <div style={{ marginBottom: '60px' }}>
        <Link to="/user-login">
          <button style={buttonStyle}>Login as User</button>
        </Link>
        <Link to="/admin-login">
          <button style={buttonStyle}>Login as Admin</button>
        </Link>
        <Link to="/user-register">
          <button style={buttonStyle}>Register as User</button>
        </Link>
      </div>

      <p style={{ 
        fontSize: '18px', 
        maxWidth: '800px', 
        margin: '0 auto 60px auto', 
        color: '#f0f0f0'
      }}>
        At GYMM-GKOTSO, we are committed to providing the best fitness experience in the area. Our state-of-the-art facilities, 
        diverse range of programs tailored to meet all fitness levels, and highly skilled trainers ensure that you get the 
        support and motivation you need to achieve your goals. Join us and become part of a community dedicated to health, 
        wellness, and fitness.
      </p>

      <h2 style={{ fontSize: '28px', marginBottom: '30px', color: '#fff' }}>Our Programs</h2>
      <div style={servicesGrid}>
        {programs.length > 0 ? (
          programs.map(program => (
            <div key={program.id} style={serviceCard}>
              <h3 style={{ fontSize: '18px', margin: '0 0 10px 0' }}>{program.name}</h3>
              <p style={{ fontSize: '14px', margin: '0' }}>
                {getTrainerNames(program.trainerIds)}
              </p>
            </div>
          ))
        ) : (
          <p style={{ fontSize: '18px' }}>No programs available at the moment.</p>
        )}
      </div>

      <h2 style={{ fontSize: '28px', marginTop: '60px', marginBottom: '30px', color: '#fff' }}>Meet Our Trainers</h2>
      <div style={servicesGrid}>
        {trainers.length > 0 ? (
          trainers.map(trainer => (
            <div key={trainer.id} style={serviceCard}>
              <h3 style={{ fontSize: '18px', margin: '0 0 10px 0' }}>{trainer.name}</h3>
              <p style={{ fontSize: '14px', margin: '0' }}>{trainer.shortCV}</p>
            </div>
          ))
        ) : (
          <p style={{ fontSize: '18px' }}>No trainers available at the moment.</p>
        )}
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: '15px 30px',
  fontSize: '18px',
  margin: '0 20px', 
  backgroundColor: '#fff',
  color: '#2F4F4F',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  transition: 'background-color 0.3s, color 0.3s',
};

const servicesGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: '20px',
  justifyContent: 'center',
};

const serviceCard = {
  backgroundColor: '#fff',
  color: '#333',
  borderRadius: '10px',
  padding: '10px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
  transition: 'transform 0.3s',
  height: 'auto',
};

export default Home;
