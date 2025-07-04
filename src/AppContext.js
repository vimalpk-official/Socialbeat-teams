import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Persist only email
  const [email, setEmail] = useState(() => {
    return localStorage.getItem('email') || "";
  });

  const [headerFlag, setHeaderFlag] = useState(false); // Always false on reload

  // Sync email to localStorage
  useEffect(() => {
    if (email) {
      localStorage.setItem('email', email);
    } else {
      localStorage.removeItem('email');
    }
  }, [email]);

  return (
    <AppContext.Provider value={{ email, setEmail, headerFlag, setHeaderFlag }}>
      {children}
    </AppContext.Provider>
  );
};
