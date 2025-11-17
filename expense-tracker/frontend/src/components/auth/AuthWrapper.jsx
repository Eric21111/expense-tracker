import React, { useEffect, useState, useCallback } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { switchUser, clearUserSession, validateDataIsolation } from '../../services/dataIsolationService';

const AuthWrapper = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const checkLocalStorageAuth = useCallback(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.email) {
          setCurrentUser(parsedUser);
          setIsAuthenticated(true);
          setIsLoading(false);
          
          if (process.env.NODE_ENV === 'development') {
            const validationReport = validateDataIsolation();
            if (!validationReport.valid) {
              console.warn('Data isolation issues detected:', validationReport);
            }
          }
          return true;
        }
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }
    return false;
  }, []);
  
  useEffect(() => {
    if (checkLocalStorageAuth()) {
      return;
    }
    
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userEmail = user.email;
        
        let previousEmail = null;
        
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            previousEmail = parsedUser.email;
          } catch (e) {
            console.error('Error parsing stored user:', e);
          }
        }
        
        if (previousEmail && previousEmail !== userEmail) {
          console.log('Switching from user:', previousEmail, 'to:', userEmail);
          clearUserSession(previousEmail);
        }
        
        switchUser(userEmail);
        
        const userData = {
          email: user.email,
          name: user.displayName || user.email.split('@')[0],
          photoURL: user.photoURL,
          uid: user.uid
        };
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userEmail', userEmail);
        
        setCurrentUser(userData);
        setIsAuthenticated(true);
        
        if (process.env.NODE_ENV === 'development') {
          const validationReport = validateDataIsolation();
          if (!validationReport.valid) {
            console.warn('Data isolation issues detected:', validationReport);
          }
        }
      } else {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          setCurrentUser(null);
          setIsAuthenticated(false);
          
          const publicRoutes = ['/login', '/register', '/', '/about', '/contact'];
          if (!publicRoutes.includes(location.pathname)) {
            navigate('/login');
          }
        } else {
          checkLocalStorageAuth();
        }
      }
      
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, [navigate, location, checkLocalStorageAuth]);
  
  useEffect(() => {
    const handleStorageChange = () => {
      checkLocalStorageAuth();
    };
    
    window.addEventListener('userStorageChange', handleStorageChange);
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('userStorageChange', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkLocalStorageAuth]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  const publicRoutes = ['/login', '/register', '/', '/about', '/contact'];
  if (publicRoutes.includes(location.pathname)) {
    return children;
  }
  
  if (!isAuthenticated) {
    return null;
  }
  
  return children;
};

export default AuthWrapper;
