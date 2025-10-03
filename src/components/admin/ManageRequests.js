import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Import Firestore
import { collection, query, where, getDocs, deleteDoc, setDoc, doc, getDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the styles

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch pending requests from Firestore
  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'pendingUsers'), where('status', '==', 'pending'));
      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRequests(users);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      setError('Error fetching pending requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      // Reference to the user document in the pendingUsers collection
      const userDocRef = doc(db, 'pendingUsers', id);

      // Fetch user data
      const userDocSnapshot = await getDoc(userDocRef);

      if (!userDocSnapshot.exists()) {
        throw new Error('User data not found');
      }

      const userData = userDocSnapshot.data();

      // Move the approved user to the users collection
      await setDoc(doc(db, 'users', id), { ...userData, status: 'approved' });

      // Delete from pendingUsers
      await deleteDoc(userDocRef);

      toast.success('Request approved!');
      setRequests(requests.filter((request) => request.id !== id));
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Error approving request: ' + error.message);
    }
  };

  const handleReject = async (id) => {
    try {
      const userDocRef = doc(db, 'pendingUsers', id);
      await deleteDoc(userDocRef);
      toast.success('Request rejected!');
      setRequests(requests.filter((request) => request.id !== id));
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Error rejecting request: ' + error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '20px', backgroundColor: '#f4f4f4' }}>
      <ToastContainer />
      <h2>Manage User Registration Requests</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Email</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Country</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>City</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Address</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((request) => (
              <tr key={request.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{request.firstName} {request.lastName}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{request.email}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{request.country}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{request.city}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{request.address}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{request.status}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <button 
                    onClick={() => handleApprove(request.id)} 
                    style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '5px' }}
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleReject(request.id)} 
                    style={{ padding: '5px 10px', backgroundColor: '#f44336', color: '#fff', border: 'none', borderRadius: '5px' }}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '10px' }}>No pending requests</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageRequests;
