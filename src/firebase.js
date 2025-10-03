// // src/firebase.js

// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore, doc, setDoc } from 'firebase/firestore';

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBjKnPPVY7U-U9rLrj0yJFUx8SRGpeNkUk",
//   authDomain: "gymm-gkotso.firebaseapp.com",
//   projectId: "gymm-gkotso",
//   storageBucket: "gymm-gkotso.appspot.com",
//   messagingSenderId: "238187630772",
//   appId: "1:238187630772:web:2f9841a0edd2b20be0c7e1"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app);

// // Function to create a default user
// export const createDefaultUser = async () => {
//   try {
//     const userDocRef = doc(db, 'users', 'user0'); // Set the username as 'user0'
//     await setDoc(userDocRef, {
//       username: 'user0',       // Username is 'user0'
//       password: '1234567',     // Password is '1234567' (Note: This should be hashed in a real app)
//       status: 'approved'       // Set the status to 'approved'
//     });
//     console.log('Default user created successfully');
//   } catch (error) {
//     console.error('Error creating default user:', error);
//   }
// };

//STOOOOOOOP
//STOOOOOOOP
//STOOOOOOOP
//STOOOOOOOP



// src/firebase.js

// import { initializeApp } from 'firebase/app';
// import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
// import { getFirestore, doc, setDoc } from 'firebase/firestore';

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBjKnPPVY7U-U9rLrj0yJFUx8SRGpeNkUk",
//   authDomain: "gymm-gkotso.firebaseapp.com",
//   projectId: "gymm-gkotso",
//   storageBucket: "gymm-gkotso.appspot.com",
//   messagingSenderId: "238187630772",
//   appId: "1:238187630772:web:2f9841a0edd2b20be0c7e1"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app);

// // Function to create a default user
// export const createDefaultUser = async () => {
//   try {
//     // Email and password for the default user
//     const email = 'user0@example.com';
//     const password = '1234567';

//     // Create the user with Firebase Authentication
//     await createUserWithEmailAndPassword(auth, email, password);

//     // Store additional user details in Firestore
//     const userDocRef = doc(db, 'users', email); // Use email as document ID
//     await setDoc(userDocRef, {
//       username: 'user0',
//       status: 'approved'  // Set the status to 'approved'
//     });

//     console.log('Default user created successfully');
//   } catch (error) {
//     console.error('Error creating default user:', error);
//   }
// };





//STOOOOOOOP
//STOOOOOOOP
//STOOOOOOOP
//STOOOOOOOP


// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjKnPPVY7U-U9rLrj0yJFUx8SRGpeNkUk",
  authDomain: "gymm-gkotso.firebaseapp.com",
  projectId: "gymm-gkotso",
  storageBucket: "gymm-gkotso.appspot.com",
  messagingSenderId: "238187630772",
  appId: "1:238187630772:web:2f9841a0edd2b20be0c7e1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Function to create a default user
export const createDefaultUser = async () => {
  try {
    const email = 'user0@example.com';
    const password = '1234567';

    // Create user in Firebase Authentication
    await createUserWithEmailAndPassword(auth, email, password);

    // Store additional user details in Firestore
    const userDocRef = doc(db, 'users', email); // Use email as document ID
    await setDoc(userDocRef, {
      username: 'user0',
      status: 'approved'  // User status
    });

    console.log('Default user created successfully');
  } catch (error) {
    console.error('Error creating default user:', error);
  }
};
