import { auth } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const initAuth = () => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem('user', JSON.stringify({
          uid: user.uid,
          email: user.email
        }));
      } else {
        localStorage.removeItem('user');
      }
      resolve(user);
    });
  });
};

export const getStoredUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = () => {
  return !!getStoredUser();
}; 