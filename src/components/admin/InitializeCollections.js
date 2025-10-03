import React, { useEffect } from 'react';
import { db } from '../../firebase'; // Import Firestore
import { collection, addDoc } from 'firebase/firestore';

const InitializeCollections = () => {
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Trainers Collection
        const trainersRef = collection(db, 'trainers');
        await addDoc(trainersRef, { name: 'John Doe', specialization: 'Strength Training' });
        await addDoc(trainersRef, { name: 'Jane Smith', specialization: 'Pilates' });

        // Programs Collection
        const programsRef = collection(db, 'programs');
        await addDoc(programsRef, { name: 'Pilates', description: 'A low-impact workout' });
        await addDoc(programsRef, { name: 'Strength Training', description: 'Building muscle strength' });

        // Schedules Collection
        const schedulesRef = collection(db, 'schedules');
        await addDoc(schedulesRef, { programId: 'program1', trainerId: 'trainer1', day: 'Monday', time: '10:00 AM', capacity: 20 });
        await addDoc(schedulesRef, { programId: 'program2', trainerId: 'trainer2', day: 'Wednesday', time: '2:00 PM', capacity: 15 });

        console.log('Collections initialized!');
      } catch (error) {
        console.error('Error initializing collections:', error);
      }
    };

    initializeData();
  }, []);

  return <div>Initializing Collections...</div>;
};

export default InitializeCollections;
