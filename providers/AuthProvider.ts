// // src/auth/googleAuth.ts
// import { useAuthRequest } from 'expo-auth-session';
// import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
// import { useEffect } from 'react';
// import { auth } from './firebase';

// // Your Google Client ID
// const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

// export const useGoogleAuth = () => {
//   const [request, response, promptAsync] = useAuthRequest({
//     clientId: CLIENT_ID,
//     scopes: ['profile', 'email'],
//   });

//   useEffect(() => {
//     if (response?.type === 'success' && response.params?.id_token) {
//       const { id_token } = response.params;

//       // Create a Google credential with the ID token
//       const credential = GoogleAuthProvider.credential(id_token);

//       // Sign in with Firebase using the Google credential
//       signInWithCredential(auth, credential)
//         .then((userCredential) => {
//           console.log('User signed in:', userCredential.user);
//         })
//         .catch((error) => {
//           console.error('Error signing in with Google:', error);
//         });
//     }
//   }, [response]);

//   return {
//     request,
//     promptAsync,
//   };
// };
