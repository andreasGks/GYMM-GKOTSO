// src/components/admin/ManageAnnouncements.js
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Assuming you have configured Firebase in a separate file
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

const ManageAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });

  useEffect(() => {
    // Listen to changes in the announcements collection
    const unsubscribe = onSnapshot(collection(db, 'announcements'), (snapshot) => {
      const announcementsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAnnouncements(announcementsList);
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);

  const handleAddAnnouncement = async () => {
    await addDoc(collection(db, 'announcements'), newAnnouncement);
    setNewAnnouncement({ title: '', content: '' });
  };

  const handleUpdateAnnouncement = async (id, updatedData) => {
    const announcementRef = doc(db, 'announcements', id);
    await updateDoc(announcementRef, updatedData);
  };

  const handleDeleteAnnouncement = async (id) => {
    const announcementRef = doc(db, 'announcements', id);
    await deleteDoc(announcementRef);
  };

  return (
    <div>
      <h2>Διαχείριση Ανακοινώσεων</h2>
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Τίτλος" 
          value={newAnnouncement.title} 
          onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))} 
          style={{ width: '100%', marginBottom: '10px', padding: '10px', fontSize: '16px' }} 
        />
        <textarea 
          placeholder="Περιεχόμενο" 
          value={newAnnouncement.content} 
          onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))} 
          style={{ width: '100%', height: '100px', padding: '10px', fontSize: '16px' }} 
        />
        <button onClick={handleAddAnnouncement} style={{ marginTop: '10px', padding: '10px 20px', fontSize: '16px' }}>
          Προσθήκη Ανακοίνωσης
        </button>
      </div>
      <div>
        {announcements.map((announcement) => (
          <div key={announcement.id} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
            <h3>{announcement.title}</h3>
            <p>{announcement.content}</p>
            <button 
              onClick={() => handleUpdateAnnouncement(announcement.id, { title: 'Updated Title', content: 'Updated Content' })} 
              style={{ marginRight: '10px', padding: '5px 10px' }}>
              Ενημέρωση
            </button>
            <button onClick={() => handleDeleteAnnouncement(announcement.id)} style={{ padding: '5px 10px' }}>
              Διαγραφή
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageAnnouncements;
