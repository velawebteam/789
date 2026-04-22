import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, googleProvider, onAuthStateChanged, signInWithPopup, signOut, User } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isAuthorized: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check access_rules first (by email)
        const email = firebaseUser.email;
        let role = 'user';
        
        if (email) {
          const ruleRef = doc(db, 'access_rules', email);
          const ruleSnap = await getDoc(ruleRef);
          if (ruleSnap.exists()) {
            role = ruleSnap.data().role;
          } else {
            // Fallback to constants for initial setup
            const { ADMIN_EMAILS, ALLOWED_EMAILS } = await import('../constants/auth');
            if (ADMIN_EMAILS.includes(email)) role = 'admin';
            else if (ALLOWED_EMAILS.includes(email)) role = 'worker';
          }
        }

        // Check/Update user document
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists() || userSnap.data().role !== role) {
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: role,
            updatedAt: serverTimestamp(),
            ...(userSnap.exists() ? {} : { createdAt: serverTimestamp() })
          };
          await setDoc(userRef, userData, { merge: true });
        }
        
        setIsAdmin(role === 'admin');
        setIsAuthorized(role === 'admin' || role === 'worker');
        setUser(firebaseUser);
      } else {
        setUser(null);
        setIsAdmin(false);
        setIsAuthorized(false);
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
        console.log("Login cancelled by user (popup closed).");
      } else if (error.code === 'auth/cancelled-popup-request') {
        console.log("Login request cancelled (multiple popups).");
      } else if (error.code === 'auth/unauthorized-domain') {
        alert("Erro de Autenticação: Este domínio não está autorizado no Firebase Console. Por favor, adicione o domínio atual à lista de 'Domínios Autorizados' nas definições de Autenticação do seu projeto Firebase.");
      } else {
        alert(`Ocorreu um erro ao tentar fazer login: ${error.message}`);
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
    <AuthContext.Provider value={{ user, loading, isAdmin, isAuthorized, login, logout }}>
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
