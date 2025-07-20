'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextValue {
  user: any | null;
  defaultSpaceId?: string;
}

const AuthContext = createContext<AuthContextValue>({ user: null });
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.status === 401) {
          alert('You are not authorized');
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error('Failed to fetch user', err);
      }
    }
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, defaultSpaceId: user?.default_space_id }}>
      {children}
    </AuthContext.Provider>
  );
};
