import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // New loading state

  // Load user and token from localStorage on mount
  useEffect(() => {
    console.log('AuthContext: Initial useEffect - Starting to load from localStorage.');
    try {
      const storedUser = localStorage.getItem("userInfo");
      const storedToken = localStorage.getItem("authToken");

      //console.log('AuthContext: localStorage "userInfo" raw data:', storedUser);
      //console.log('AuthContext: localStorage "authToken" raw data:', storedToken);

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        //console.log('AuthContext: Successfully parsed and set user from localStorage:', parsedUser);
      } else {
        //console.log('AuthContext: No "userInfo" found in localStorage.');
      }

      if (storedToken) {
        setToken(storedToken);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        //console.log('AuthContext: Successfully set token from localStorage and Axios header.');
      } else {
        //console.log('AuthContext: No "authToken" found in localStorage.');
        delete axiosInstance.defaults.headers.common['Authorization']; // Ensure header is cleared if no token
      }
    } catch (error) {
      console.error("AuthContext: Failed to parse localStorage data during initial load:", error);
      localStorage.removeItem("userInfo");
      localStorage.removeItem("authToken");
      setUser(null);
      setToken(null);
      //console.log('AuthContext: Cleared corrupt data and reset state due to error.');
    } finally {
      // IMPORTANT: Set loading to false AFTER trying to load from localStorage
      setIsLoading(false);
      //console.log('AuthContext: Initial load complete. setIsLoading(false).');
    }
  }, []);

  // Save/Remove user to localStorage whenever user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("userInfo", JSON.stringify(user));
      //console.log('AuthContext: User state changed, saving "userInfo" to localStorage:', user);
    } else {
      localStorage.removeItem("userInfo");
      //console.log('AuthContext: User state is null, removing "userInfo" from localStorage.');
    }
  }, [user]);

  // Save/Remove token to localStorage whenever token state changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token);
      //console.log('AuthContext: Token state changed, saving "authToken" to localStorage:', token);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("authToken");
      //console.log('AuthContext: Token state is null, removing "authToken" from localStorage.');
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Login function
  const login = (userData, authToken) => {
    //console.log('AuthContext: login function called with userData and authToken.');
    setUser(userData);
    setToken(authToken);
  };

  // Logout function
  const logout = () => {
    //console.log('AuthContext: logout function called. Clearing user and token states.');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
