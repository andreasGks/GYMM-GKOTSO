import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Ensure this path is correct
import { collection, onSnapshot } from 'firebase/firestore';

const BrowseServices = () => {
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
        Browse Our Services
      </h1>
      
      <h2 style={{ fontSize: '28px', marginBottom: '30px', color: '#fff' }}>Our Programs</h2>
      <div style={servicesGrid}>
        {programs.length > 0 ? (
          programs.map(program => (
            <div key={program.id} style={serviceCard}>
              <h3 style={{ fontSize: '18px', margin: '0 0 10px 0' }}>{program.name}</h3>
              <p style={{ fontSize: '14px', margin: '0' }}>
                Trainers: {getTrainerNames(program.trainerIds)}
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

export default BrowseServices;
