/* eslint-disable react-refresh/only-export-components */
import axios from 'axios';
import secureLocalStorage from "react-secure-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [activeLink, setActiveLink] = useState('home');
  const [loading, setLoading] = useState(true);

  // ✅ Logout
  const logOut = async () => {
    try {
      await fetch("/api/logout", { method: "POST", credentials: "include" });
    } catch (err) {
      console.error("Logout error:", err);
    }
    secureLocalStorage.removeItem('user');
    secureLocalStorage.removeItem('expiresIn');
    setUser(null);
    window.location.reload();
  };

  // ✅ Verify auth and load user from localStorage
  useEffect(() => {
    const verifyAuth = () => {
      const storedUser = secureLocalStorage.getItem('user');
      const expirationTime = secureLocalStorage.getItem('expiresIn');

      if (storedUser && expirationTime) {
        const currentTime = new Date().getTime();
        if (currentTime <= parseInt(expirationTime)) {
          setUser(JSON.parse(storedUser));
        } else {
          logOut();
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, []);

  // ✅ Login
  const login = (userData, expireIn) => {
    const expiresIn = new Date().getTime() + expireIn * 1000;
    secureLocalStorage.setItem('expiresIn', expiresIn.toString());
    secureLocalStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // ✅ Update user locally
  const updateUser = (userData) => {
    secureLocalStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // ✅ Refresh user from backend (this is the key part)
  const refreshUser = async () => {
 
    try {
     const res = await axios.get('/api/users/me', { withCredentials: true });
      if (res?.data?.user) {
        secureLocalStorage.setItem('user', JSON.stringify(res.data?.user));
        setUser(res.data?.user);
      }
    } catch (error) {
      if(error?.response?.status===404){
      logOut()
      }
  
    }
  };

  // ✅ Example: used for vote status updates (optional)
  const updateVoteStatus = async () => {  
    if (user) {
      try {  
        const { data } = await axios.get('/api/users/me');
        const updatedUser = { ...data.user, hasVoted: data.user.hasVoted };
        secureLocalStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      } catch (error) {
        console.error('Error updating vote status:', error);
      }
    }
  };

  const value = {
    user,
    setUser,
    login,
    logOut,
    updateUser,
    updateVoteStatus,
    refreshUser,
    activeLink,
    setActiveLink,
    loading,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserContext;
