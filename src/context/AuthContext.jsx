import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('luxegold_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock authentication
    const users = JSON.parse(localStorage.getItem('luxegold_users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      const userData = { id: found.id, name: found.name, email: found.email, phone: found.phone, address: found.address };
      setUser(userData);
      localStorage.setItem('luxegold_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, message: 'Invalid email or password' };
  };

  const register = ({ name, email, password, phone, address }) => {
    const users = JSON.parse(localStorage.getItem('luxegold_users') || '[]');
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email already registered' };
    }
    const newUser = { id: Date.now().toString(), name, email, password, phone, address: address || '' };
    users.push(newUser);
    localStorage.setItem('luxegold_users', JSON.stringify(users));
    const userData = { id: newUser.id, name, email, phone, address: newUser.address };
    setUser(userData);
    localStorage.setItem('luxegold_user', JSON.stringify(userData));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('luxegold_user');
  };

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('luxegold_user', JSON.stringify(updatedUser));
    // Also update in the users list
    const users = JSON.parse(localStorage.getItem('luxegold_users') || '[]');
    const idx = users.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...updates };
      localStorage.setItem('luxegold_users', JSON.stringify(users));
    }
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
