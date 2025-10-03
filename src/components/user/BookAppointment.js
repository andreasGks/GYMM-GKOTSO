import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Adjust if firebase config is in a different location
import { collection, onSnapshot, addDoc, updateDoc, doc, query, where, getDocs, deleteDoc } from 'firebase/firestore';

const BookAppointment = () => {
  const [programs, setPrograms] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [userTeams, setUserTeams] = useState([]);
  const userId = 'user-id'; // Replace with actual user ID

  useEffect(() => {
    // Subscriptions to real-time updates
    const unsubscribePrograms = onSnapshot(collection(db, 'programs'), snapshot => {
      const programsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPrograms(programsList);
    });
    const unsubscribeSchedules = onSnapshot(collection(db, 'schedules'), snapshot => {
      const schedulesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSchedules(schedulesList);
    });
    const unsubscribeTrainers = onSnapshot(collection(db, 'trainers'), snapshot => {
      const trainersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTrainers(trainersList);
    });
    const unsubscribeSlots = onSnapshot(collection(db, 'slots'), snapshot => {
      const slotsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAvailableSlots(slotsList);
    });
    const unsubscribeUserTeams = onSnapshot(
      query(collection(db, 'userTeams'), where('userId', '==', userId)),
      snapshot => {
        const userTeamsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUserTeams(userTeamsList);
      }
    );

    return () => {
      unsubscribePrograms();
      unsubscribeSchedules();
      unsubscribeTrainers();
      unsubscribeSlots();
      unsubscribeUserTeams();
    };
  }, [userId]);

  const handleSelectSchedule = async (scheduleId) => {
    const selectedSchedule = schedules.find(schedule => schedule.id === scheduleId);

    if (selectedSchedule) {
      const capacity = parseInt(selectedSchedule.capacity, 10);
      const bookingsCount = selectedSchedule.bookingsCount || 0;

      const userTeamQuery = query(
        collection(db, 'userTeams'),
        where('userId', '==', userId),
        where('scheduleId', '==', scheduleId)
      );

      const userTeamSnapshot = await getDocs(userTeamQuery);

      if (!userTeamSnapshot.empty) {
        alert('You have already joined this team.');
        return;
      }

      if (bookingsCount < capacity) {
        try {
          await updateDoc(doc(db, 'schedules', scheduleId), {
            bookingsCount: bookingsCount + 1,
          });
          await addDoc(collection(db, 'userTeams'), {
            userId,
            scheduleId,
            joinedAt: new Date(),
          });
          alert('You have successfully joined the team!');
        } catch (error) {
          console.error('Error joining team:', error);
          alert('Failed to join the team. Please try again.');
        }
      } else {
        alert('This team is already at full capacity.');
      }
    } else {
      alert('Schedule not found.');
    }
  };

  const handleLeaveSchedule = async (scheduleId) => {
    try {
      const userTeamQuery = query(
        collection(db, 'userTeams'),
        where('userId', '==', userId),
        where('scheduleId', '==', scheduleId)
      );

      const userTeamSnapshot = await getDocs(userTeamQuery);

      if (!userTeamSnapshot.empty) {
        const userTeamDoc = userTeamSnapshot.docs[0];
        await deleteDoc(doc(db, 'userTeams', userTeamDoc.id));

        const selectedSchedule = schedules.find(schedule => schedule.id === scheduleId);
        if (selectedSchedule) {
          const bookingsCount = selectedSchedule.bookingsCount || 0;
          await updateDoc(doc(db, 'schedules', scheduleId), {
            bookingsCount: bookingsCount - 1,
          });
        }

        alert('You have successfully left the team.');
      } else {
        alert('You are not registered for this team.');
      }
    } catch (error) {
      console.error('Error leaving team:', error);
      alert('Failed to leave the team. Please try again.');
    }
  };

  const handleBookSlot = async () => {
    if (!selectedSlot) {
      alert('Please select a slot.');
      return;
    }

    const selectedSlotDetails = availableSlots.find(slot => slot.id === selectedSlot);

    if (selectedSlotDetails) {
      const capacity = parseInt(selectedSlotDetails.capacity, 10);
      const bookingsCount = selectedSlotDetails.bookingsCount || 0;

      if (bookingsCount < capacity) {
        try {
          await addDoc(collection(db, 'bookings'), {
            slotId: selectedSlot,
            userId,
            bookedAt: new Date(),
          });
          await updateDoc(doc(db, 'slots', selectedSlot), {
            bookingsCount: bookingsCount + 1,
          });
          alert('Appointment booked successfully!');
          setSelectedSlot('');
        } catch (error) {
          console.error('Error booking appointment:', error);
          alert('Failed to book appointment. Please try again.');
        }
      } else {
        alert('This slot is fully booked.');
      }
    }
  };

  const TeamDetail = ({ team, onJoinTeam, onLeaveTeam, isRegistered }) => {
    const handleJoinClick = () => {
      onJoinTeam(team.id);
    };

    const handleLeaveClick = () => {
      onLeaveTeam(team.id);
    };

    return (
      <div style={{ borderBottom: '1px solid #ddd', padding: '10px 0', backgroundColor: '#fff', borderRadius: '5px', marginBottom: '10px' }}>
        <p>{team.name} - {team.trainerName} - {team.day} - {team.time} - Capacity: {team.currentMembers}/{team.maxCapacity}</p>
        {isRegistered ? (
          <button onClick={handleLeaveClick} style={{ padding: '5px 10px' }}>
            Leave Team
          </button>
        ) : (
          <button
            onClick={handleJoinClick}
            style={{ padding: '5px 10px' }}
            disabled={team.currentMembers >= team.maxCapacity}
          >
            {team.currentMembers >= team.maxCapacity ? 'Full' : 'Join Team'}
          </button>
        )}
      </div>
    );
  };

  const availableTeams = schedules.map(schedule => {
    const program = programs.find(program => program.id === schedule.programId);
    const trainer = trainers.find(trainer => trainer.id === schedule.trainerId);

    return {
      id: schedule.id,
      name: program ? program.name : 'Unknown Program',
      trainerName: trainer ? trainer.name : 'Unknown Trainer',
      day: schedule.day,
      time: schedule.time,
      currentMembers: schedule.bookingsCount || 0,
      maxCapacity: parseInt(schedule.capacity, 10) || 0,
    };
  }).filter(team => team.maxCapacity > 0);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '20px', color: '#555' }}>Available Teams</h3>
        {availableTeams.length > 0 ? (
          <div>
            {availableTeams.map(team => {
              const isRegistered = userTeams.some(userTeam => userTeam.scheduleId === team.id);
              return (
                <TeamDetail
                  key={team.id}
                  team={team}
                  onJoinTeam={handleSelectSchedule}
                  onLeaveTeam={handleLeaveSchedule}
                  isRegistered={isRegistered}
                />
              );
            })}
          </div>
        ) : (
          <p>No teams available.</p>
        )}
      </div>

      {selectedSlot && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleBookSlot} style={{ padding: '10px 20px', fontSize: '16px' }}>
            Book Appointment
          </button>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;
