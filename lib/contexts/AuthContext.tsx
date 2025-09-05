"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User } from "firebase/auth";
import { onAuthStateChange, checkProfileCompletion } from "../firebase/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  profileCompleted: boolean;
  setProfileCompleted: (completed: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileCompleted, setProfileCompleted] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setUser(user);

      if (user) {
        // Check if user profile is completed
        try {
          const isCompleted = await checkProfileCompletion(user.uid);
          setProfileCompleted(isCompleted);
        } catch (error) {
          console.error("Error checking profile completion:", error);
          setProfileCompleted(false);
        }
      } else {
        setProfileCompleted(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    profileCompleted,
    setProfileCompleted,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
