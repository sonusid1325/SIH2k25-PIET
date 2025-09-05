import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./config";

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Sign up with email and password
export const signUpWithEmail = async (
  email: string,
  password: string,
  name: string,
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // Update user profile with name
    await updateProfile(user, {
      displayName: name,
    });

    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: name,
      photoURL: user.photoURL,
      createdAt: new Date(),
      profileCompleted: false,
    });

    return { user, error: null };
  } catch (error: unknown) {
    console.error("Error signing up:", error);
    return {
      user: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return { user: userCredential.user, error: null };
  } catch (error: unknown) {
    console.error("Error signing in:", error);
    return {
      user: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user document exists, create if not
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date(),
        profileCompleted: false,
      });
    }

    return { user, error: null };
  } catch (error: unknown) {
    console.error("Error signing in with Google:", error);
    return {
      user: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: unknown) {
    console.error("Error signing out:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Check if user profile is completed
export const checkProfileCompletion = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.profileCompleted || false;
    }
    return false;
  } catch (error) {
    console.error("Error checking profile completion:", error);
    return false;
  }
};

// Update user profile completion status
export const updateProfileCompletion = async (
  uid: string,
  profileData: Record<string, unknown>,
) => {
  try {
    await setDoc(
      doc(db, "users", uid),
      {
        ...profileData,
        profileCompleted: true,
        updatedAt: new Date(),
      },
      { merge: true },
    );
    return { error: null };
  } catch (error: unknown) {
    console.error("Error updating profile:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
