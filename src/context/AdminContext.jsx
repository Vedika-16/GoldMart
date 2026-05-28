import { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext(null);

export const useAdmin = () => useContext(AdminContext);

// Hardcoded admin credentials
const ADMIN_EMAIL = 'admin@luxegold.com';
const ADMIN_PASSWORD = 'admin123';

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedAdmin = localStorage.getItem('luxegold_admin');
    if (savedAdmin) {
      setIsAdmin(true);
    }
    setIsLoading(false);
  }, []);

  const adminLogin = (email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem('luxegold_admin', JSON.stringify({ email, loggedInAt: Date.now() }));
      return { success: true };
    }
    return { success: false, message: 'Invalid admin credentials' };
  };

  const adminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('luxegold_admin');
  };

  return (
    <AdminContext.Provider value={{ isAdmin, isLoading, adminLogin, adminLogout }}>
      {children}
    </AdminContext.Provider>
  );
};
