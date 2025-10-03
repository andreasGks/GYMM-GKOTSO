import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where, getDocs, writeBatch } from 'firebase/firestore';
import './ManageSystem.css'; // Import CSS

const ManageSystem = () => {
  const [trainers, setTrainers] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [membersCount, setMembersCount] = useState({}); // Store members count for each schedule

  const [newTrainer, setNewTrainer] = useState('');
  const [newProgram, setNewProgram] = useState('');
  const [newSchedule, setNewSchedule] = useState({ programId: '', trainerId: '', day: '', time: '', capacity: '' });
  const [editSchedule, setEditSchedule] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Subscribe to real-time updates for trainers, programs, and schedules
      const trainersUnsubscribe = onSnapshot(collection(db, 'trainers'), (snapshot) => {
        const trainersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTrainers(trainersList);
      });

      const programsUnsubscribe = onSnapshot(collection(db, 'programs'), (snapshot) => {
        const programsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPrograms(programsList);
      });

      const schedulesUnsubscribe = onSnapshot(collection(db, 'schedules'), async (snapshot) => {
        const schedulesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSchedules(schedulesList);

        // Update members count for each schedule
        const counts = {};
        for (let schedule of schedulesList) {
          const count = await getCurrentMembersCount(schedule.id);
          counts[schedule.id] = count;
        }
        setMembersCount(counts);
      });

      return () => {
        // Clean up subscriptions
        trainersUnsubscribe();
        programsUnsubscribe();
        schedulesUnsubscribe();
      };
    };

    fetchData();
  }, []);

  // Add new trainer
  const handleAddTrainer = async () => {
    if (newTrainer.trim() !== '') {
      await addDoc(collection(db, 'trainers'), { name: newTrainer });
      setNewTrainer('');
    }
  };

  // Add new program
  const handleAddProgram = async () => {
    if (newProgram.trim() !== '') {
      await addDoc(collection(db, 'programs'), { name: newProgram });
      setNewProgram('');
    }
  };

  // Add or update schedule
  const handleAddSchedule = async () => {
    if (!newSchedule.programId || !newSchedule.trainerId || !newSchedule.day || !newSchedule.time || !newSchedule.capacity) {
      alert('Please fill in all fields.');
      return;
    }

    if (editSchedule) {
      const scheduleRef = doc(db, 'schedules', editSchedule.id);
      
      // Clear current members if updating
      await clearScheduleMembers(editSchedule.id);

      await updateDoc(scheduleRef, newSchedule);
      setEditSchedule(null);
    } else {
      await addDoc(collection(db, 'schedules'), newSchedule);
    }

    // Reset schedule form
    setNewSchedule({ programId: '', trainerId: '', day: '', time: '', capacity: '' });
  };

  // Set schedule for editing
  const handleEditSchedule = (schedule) => {
    setEditSchedule(schedule);
    setNewSchedule(schedule);
  };

  // Delete trainer
  const handleDeleteTrainer = async (id) => {
    await deleteDoc(doc(db, 'trainers', id));
  };

  // Delete program
  const handleDeleteProgram = async (id) => {
    await deleteDoc(doc(db, 'programs', id));
  };

  // Delete schedule
  const handleDeleteSchedule = async (id) => {
    await deleteDoc(doc(db, 'schedules', id));
  };

  // Get trainer name by ID
  const getTrainerName = (trainerId) => {
    const trainer = trainers.find(t => t.id === trainerId);
    return trainer ? trainer.name : 'Unknown Trainer';
  };

  // Get program name by ID
  const getProgramName = (programId) => {
    const program = programs.find(p => p.id === programId);
    return program ? program.name : 'Unknown Program';
  };

  // Get current members count for a schedule
  const getCurrentMembersCount = async (scheduleId) => {
    const userTeamsQuery = query(collection(db, 'userTeams'), where('scheduleId', '==', scheduleId));
    const userTeamsSnapshot = await getDocs(userTeamsQuery);
    return userTeamsSnapshot.size; // Return number of members
  };

  // Clear members from a schedule
  const clearScheduleMembers = async (scheduleId) => {
    const batch = writeBatch(db);
    const userTeamsQuery = query(collection(db, 'userTeams'), where('scheduleId', '==', scheduleId));
    const userTeamsSnapshot = await getDocs(userTeamsQuery);

    userTeamsSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  };

  return (
    <div className="manage-system">
      <h2>Gym Service Management</h2>
      <p>
        The System Offers the Ability to Add, Delete, and Update the Following Categories:
      </p>
      <ul>
        <li>Trainers</li>
        <li>Offered Programs (e.g., Pilates, Strength, Swimming)</li>
        <li>Group Programs (day, time, trainer, capacity).</li>
      </ul>

      <div className="manage-system-content">
        {/* Trainer Management */}
        <div className="manage-system-section">
          <div className="manage-system-left">
            <section>
              <h3>Add Trainer</h3>
              <input 
                type="text" 
                value={newTrainer} 
                onChange={(e) => setNewTrainer(e.target.value)} 
                placeholder="New Trainer" 
                className="input-field"
              />
              <button onClick={handleAddTrainer} className="button-primary">
                Add New Trainer
              </button>
            </section>
          </div>

          <div className="manage-system-right">
            <section>
              <h3>Trainers</h3>
              <ul>
                {trainers.map(trainer => (
                  <li key={trainer.id} className="list-item">
                    {trainer.name}
                    <button onClick={() => handleDeleteTrainer(trainer.id)} className="button-delete">
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        {/* Program Management */}
        <div className="manage-system-section">
          <div className="manage-system-left">
            <section>
              <h3>Add Program</h3>
              <input 
                type="text" 
                value={newProgram} 
                onChange={(e) => setNewProgram(e.target.value)} 
                placeholder="New Program" 
                className="input-field"
              />
              <button onClick={handleAddProgram} className="button-primary">
                Add New Program
              </button>
            </section>
          </div>

          <div className="manage-system-right">
            <section>
              <h3>Program Types</h3>
              <ul>
                {programs.map(program => (
                  <li key={program.id} className="list-item">
                    {program.name}
                    <button onClick={() => handleDeleteProgram(program.id)} className="button-delete">
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        {/* Schedule Management */}
        <div className="manage-system-section">
          <div className="manage-system-left">
            <section>
              <h3>{editSchedule ? 'Edit Group' : 'Add New Group'}</h3>
              <input 
                type="text" 
                value={newSchedule.day} 
                onChange={(e) => setNewSchedule(prev => ({ ...prev, day: e.target.value }))} 
                placeholder="Day" 
                className="input-field"
              />
              <input 
                type="text" 
                value={newSchedule.time} 
                onChange={(e) => setNewSchedule(prev => ({ ...prev, time: e.target.value }))} 
                placeholder="Time" 
                className="input-field"
              />
              <input 
                type="number" 
                value={newSchedule.capacity} 
                onChange={(e) => setNewSchedule(prev => ({ ...prev, capacity: e.target.value }))} 
                placeholder="Capacity" 
                className="input-field"
              />
              <select 
                value={newSchedule.programId} 
                onChange={(e) => setNewSchedule(prev => ({ ...prev, programId: e.target.value }))}
                className="select-field"
              >
                <option value="">Select Program</option>
                {programs.map(program => (
                  <option key={program.id} value={program.id}>{program.name}</option>
                ))}
              </select>
              <select 
                value={newSchedule.trainerId} 
                onChange={(e) => setNewSchedule(prev => ({ ...prev, trainerId: e.target.value }))}
                className="select-field"
              >
                <option value="">Select Trainer</option>
                {trainers.map(trainer => (
                  <option key={trainer.id} value={trainer.id}>{trainer.name}</option>
                ))}
              </select>
              <button onClick={handleAddSchedule} className="button-primary">
                {editSchedule ? 'Update Group' : 'Add Group'}
              </button>
            </section>
          </div>

          <div className="manage-system-right">
            <section>
              <h3>Group Programs</h3>
              <ul>
                {schedules.map(schedule => (
                  <li key={schedule.id} className="list-item">
                    <strong>{getProgramName(schedule.programId)}</strong> with {getTrainerName(schedule.trainerId)}
                    <br />
                    {schedule.day} at {schedule.time} - Capacity: {schedule.capacity} - Members: {membersCount[schedule.id] || 0}
                    <button onClick={() => handleEditSchedule(schedule)} className="button-edit">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteSchedule(schedule.id)} className="button-delete">
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSystem;
