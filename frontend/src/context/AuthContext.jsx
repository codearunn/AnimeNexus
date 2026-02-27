// That message is:

// ✔ NOT an error
// ✔ Only ESLint dev warning
// ✔ App works fine

import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const AuthContext = createContext(); //Creates shared memory for auth.

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  // #25 Start as true so App shows <Loading/> until checkAuth completes \u2014
  // prevents briefly flashing the logged-out UI to an authenticated user
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const register = async (data) => { // data is  the form values coming from your Register page.
    try {
      setLoading(true);
      setError(null);
      const res = await api.post("/auth/register", data);
      // Set user immediately from registration response
      if (res.data.user) {
        setUser(res.data.user);
        toast.success("Account created successfully!");
        return true; // Indicate success
      }
    } catch (error) {
      const errorMessage = error?.error || error?.message || "Registration failed";
      setError(errorMessage);
      toast.error(errorMessage);
      return false; // Indicate failure
    } finally {
      setLoading(false);
    }
  };

  const login = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post("/auth/login", data);
      // Set user immediately from login response
      if (res.data.user) {
        setUser(res.data.user);
        toast.success("LoggedIn successfully!");
        return true; // Indicate success
      }
    } catch (error) {
      const errorMessage = error?.error || error?.message || "Login failed";
      setError(errorMessage);
      toast.error(errorMessage);
      return false; // Indicate failure
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await api.post("/auth/logout"); // when called will clear the cookie
      setUser(null);
      toast.success("Logged out!");
    } catch (error) {
      const errorMessage = error?.error || error?.message || "Logout failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally{
      setLoading(false);
    }
  };

  const deleteAccount = async (password) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete("/auth/account", { data: { password } });
      setUser(null);
      toast.success("Account deleted successfully");
      return true;
    } catch (error) {
      const errorMessage = error?.error || error?.message || "Failed to delete account";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Keeps user logged in after refresh. ==> Persistent login.
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch (error) {
      // Don't set error on initial auth check - user just not logged in
      console.error(error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    //Whatever you put inside value={} becomes available to ALL components inside it.
    <AuthContext.Provider  // Think of it as a global data distributor.

      value={{ // is just an object: “These are the things I want to share globally.”
        user,
        setUser,
        loading,
        error,
        register,
        login,
        logout,
        deleteAccount
      }}
    >
      {/* This is everything wrapped inside AuthProvider. */}
      {children}
    </AuthContext.Provider>
  )
};

// Custom hooks for cleaner component code
export const useAuth = () => useContext(AuthContext);


// 🔁 Full Flow
// 	1.	AuthProvider creates state + functions
// 	2.	Provider exposes them via value
// 	3.	App receives them
// 	4.	Components use useAuth()
// 	5.	React gives them same values