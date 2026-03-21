import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";

import {
  LoginApi,
  RegisterApi,
  LogoutApi,
  GetProfileApi,
} from "../services/auth.api.js";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  /**
   * Handle Login *****************************
   */
  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await LoginApi({ email, password });

      if (!data || !data.user) {
        return {
          success: false,
          message: data?.message || "Invalid credentials",
        };
      }

      setUser(data.user);

      return {
        success: true,
        message: "Login successful",
      };
    } catch (error) {
      console.error("Login Error:", error);
      return {
        success: false,
        message: "Something went wrong",
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Register *****************************
   */
  const handleRegister = async ({ username, email, phone, password }) => {
    setLoading(true);
    try {
      const data = await RegisterApi({
        username,
        email,
        phone,
        password,
      });

      if (!data || !data.user) {
        return {
          success: false,
          message: data?.message || "Registration failed",
        };
      }

      setUser(data.user);

      return {
        success: true,
        message: "Registration successful",
      };
    } catch (error) {
      console.error("Register Error:", error);
      return {
        success: false,
        message: "Something went wrong",
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Logout *****************************
   */
  const handleLogOut = async () => {
    setLoading(true);
    try {
      const data = await LogoutApi();

      setUser(null);

      return {
        success: true,
        message: data?.message || "Logged out successfully",
      };
    } catch (error) {
      console.error("Logout Error:", error);
      return {
        success: false,
        message: "Logout failed",
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get Logged-in User Profile *****************************
   */
  const handleGetProfile = async () => {
    setLoading(true);
    try {
      const data = await GetProfileApi();

      if (!data || !data.user) {
        setUser(null);
        return {
          success: false,
          message: "User not found",
        };
      }

      setUser(data.user);

      return {
        success: true,
        message: "Profile fetched",
      };
    } catch (error) {
      console.error("Get Profile Error:", error);
      setUser(null);
      return {
        success: false,
        message: "Failed to fetch profile",
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch and set authenticated user data on initial load || Load user session on app start
   */
  useEffect(() => {
    const getAndSetUser = async () => {
      const data = await GetProfileApi();
      setUser(data?.user);
      setLoading(false);
    };
    getAndSetUser();
  }, []);

  return {
    user,
    loading,
    handleRegister,
    handleLogin,
    handleLogOut,
    handleGetProfile,
  };
};
