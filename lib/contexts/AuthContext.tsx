"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, loginUser, registerUser } from "../api";

// Define the shape of our user object from the backend
interface User {
  _id: string;
  name: string;
  email: string;
  // Add any other fields from your MongoDB User model here
}

// Define the types for the context value
interface AuthContextType {
  user: User | null;
  loading: boolean;
  profileCompleted: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
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
  const router = useRouter();

  useEffect(() => {
    const checkLoggedInUser = async () => {
      try {
        const { data: user } = await getCurrentUser();
        if (user) {
          setUser(user);
          // You can add more complex logic here later
          setProfileCompleted(true);
        }
      } catch (error) {
        console.log("No active session found.");
        setUser(null);
        setProfileCompleted(false);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedInUser();
  }, []);

  // --- FIX: Add string types to all parameters ---
  const login = async (email: string, password: string): Promise<void> => {
    const { data } = await loginUser({ email, password });
    setUser(data.user);
    setProfileCompleted(true);
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    await registerUser({ name, email, password });
    router.push("/login");
  };

  const logout = () => {
    // Ideally, call a backend endpoint to clear the httpOnly cookie
    setUser(null);
    setProfileCompleted(false);
    router.push("/login");
  };

  const value = {
    user,
    loading,
    profileCompleted,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};