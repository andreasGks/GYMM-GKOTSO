import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Import Firebase configuration
import { collection, onSnapshot } from 'firebase/firestore';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    // Listen to changes in the announcements collection
    const unsubscribe = onSnapshot(collection(db, 'announcements'), (snapshot) => {
      const announcementsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAnnouncements(announcementsList);
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
      <h2 style={{ fontSize: '24px', color: '#333', marginBottom: '20px' }}>Announcements</h2>
      <div>
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              style={{
                borderBottom: '1px solid #ddd',
                padding: '15px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                marginBottom: '15px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              }}
            >
              <h3 style={{ fontSize: '20px', color: '#555', marginBottom: '10px' }}>{announcement.title}</h3>
              <p style={{ fontSize: '16px', color: '#666' }}>{announcement.content}</p>
            </div>
          ))
        ) : (
          <p style={{ fontSize: '16px', color: '#666' }}>No announcements available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default Announcements;
