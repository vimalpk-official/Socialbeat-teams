import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(() => localStorage.getItem('email') || "");
  const [headerFlag, setHeaderFlag] = useState(false);
  const [hideButton, setHideButton] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);


  
  const [notificationqueue, setnotificationqueue] = useState(() => {
    try {
      const savedQueue = localStorage.getItem('notificationqueue');
      return savedQueue ? JSON.parse(savedQueue) : [];
    } catch (err) {
      console.warn('Error parsing notificationqueue from localStorage:', err);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('notificationqueue', JSON.stringify(notificationqueue));
  }, [notificationqueue]);

  const clearAuth = () => setUser(null);

  useEffect(() => {
    if (email) {
      localStorage.setItem('email', email);
    } else {
      localStorage.removeItem('email');
    }
  }, [email]);

  return (
    <AppContext.Provider
      value={{
        email,
        setEmail,
        headerFlag,
        setHeaderFlag,
        hideButton,
        setHideButton,
        currentUser,
        setCurrentUser,
        clearAuth,
        user,
        setUser,
        notificationqueue,
        setnotificationqueue,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
