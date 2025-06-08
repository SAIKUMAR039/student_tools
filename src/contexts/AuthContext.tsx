import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  userEmail: string | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in (stored in localStorage)
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string): Promise<boolean> => {
    try {
      // Google Apps Script Web App URL - replace with your actual URL
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyD7Q7DMJAMlo0f8eo8EKSQwFDPwx-DGMVebUYeYrv2VCTWa5B2CHtdFvKi5_rp5hnNsQ/exec';
      
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          timestamp: new Date().toISOString(),
          source: 'student-tools-access',
          action: 'login'
        })
      });

      // Store email locally and set authentication
      localStorage.setItem('userEmail', email);
      setUserEmail(email);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('userEmail');
    setUserEmail(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ userEmail, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};