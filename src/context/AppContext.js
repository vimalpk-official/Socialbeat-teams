import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();
export const AuthContext = createContext(); 

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const clearAuth = () => {
    setUser(null);
  };

  const [email, setEmail] = useState(() => {
    return localStorage.getItem('email') || "";
  });

  const [headerFlag, setHeaderFlag] = useState(false);
  const [hideButton, setHideButton] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Sync email to localStorage
  useEffect(() => {
    if (email) {
      localStorage.setItem('email', email);
    } else {
      localStorage.removeItem('email');
    }
  }, [email]);

  return (
    <AppContext.Provider value={{
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
      }}>
      {children}
    </AppContext.Provider>
  );
};
