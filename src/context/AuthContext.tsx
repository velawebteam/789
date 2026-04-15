import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, googleProvider, onAuthStateChanged, signInWithPopup, signOut, User } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check if user exists in Firestore, if not create
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          const newUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: 'user',
            createdAt: serverTimestamp(),
          };
          await setDoc(userRef, newUser);
          setIsAdmin(false);
        } else {
          setIsAdmin(userSnap.data().role === 'admin');
        }
        setUser(firebaseUser);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const login = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      // Handle specific Firebase Auth errors gracefully
      if (error.code === 'auth/popup-closed-by-user') {
        // User closed the popup, no need to log as error
        console.log("Login cancelled by user (popup closed).");
      } else if (error.code === 'auth/cancelled-popup-request') {
        // Another popup was opened, ignore this one
        console.log("Login request cancelled (multiple popups).");
      } else {
        console.error("Login failed:", error);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
