import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Ensure this path is correct based on your file structure
import { collection, query, where, getDocs, orderBy, limit, doc, getDoc } from 'firebase/firestore';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = 'user-id'; // Replace with actual user ID or retrieve dynamically

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsQuery = query(
          collection(db, 'bookings'),
          where('userId', '==', userId),
          orderBy('bookedAt', 'desc'),
          limit(10)
        );

        const bookingsSnapshot = await getDocs(bookingsQuery);

        if (bookingsSnapshot.empty) {
          console.log('No bookings found for user:', userId);
        }

        const bookingsList = await Promise.all(
          bookingsSnapshot.docs.map(async (doc) => {
            const bookingData = doc.data();
            console.log('Booking data:', bookingData);

            const scheduleDocRef = doc(db, 'schedules', bookingData.scheduleId);
            const scheduleDoc = await getDoc(scheduleDocRef);
            
            if (!scheduleDoc.exists()) {
              console.log('Schedule not found for ID:', bookingData.scheduleId);
            }

            const scheduleData = scheduleDoc.exists() ? scheduleDoc.data() : {};
            console.log('Schedule data:', scheduleData);

            return {
              id: doc.id,
              ...bookingData,
              programType: scheduleData.programType || 'N/A',
              trainerName: scheduleData.trainerName || 'N/A',
              day: scheduleData.day || 'N/A',
              time: scheduleData.time || 'N/A',
            };
          })
        );

        setBookings(bookingsList);
      } catch (err) {
        console.error('Error fetching bookings or schedules:', err);
        setError('Failed to fetch bookings.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
        <h2>Booking History</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
      <h2>Booking History</h2>
      {bookings.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: '0' }}>
          {bookings.map((booking) => (
            <li key={booking.id} style={{ borderBottom: '1px solid #ddd', padding: '10px 0', backgroundColor: '#fff', borderRadius: '5px', marginBottom: '10px' }}>
              <p><strong>Program Type:</strong> {booking.programType}</p>
              <p><strong>Trainer Name:</strong> {booking.trainerName}</p>
              <p><strong>Day:</strong> {booking.day}</p>
              <p><strong>Time:</strong> {booking.time}</p>
              <p><strong>Date:</strong> {booking.bookedAt.toDate().toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  );
};

export default BookingHistory;
