import axios from "axios";

// Backend Base URL
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * Axios instance configured for all API requests
 * - baseURL: Uses environment variable for backend URL
 * - withCredentials: Enables sending cookies (for auth/session handling)
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});


/**
 * @function RegisterApi
 * @description Register a new user
 * @param {Object} data - User registration data
 * @param {string} data.username - Username of the user
 * @param {string} data.email - Email address
 * @param {string} data.phone - Phone number
 * @param {string} data.password - User password
 * @returns {Promise<Object>} Response data from server
 */
const RegisterApi = async ({ username, email, phone, password }) => {
  try {
    const res = await api.post(
      `/auth/register`,
      {
        username,
        email,
        phone,
        password,
      }
    );

    console.log("Register Response", res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * @function LoginApi
 * @description Login user with email and password
 * @param {Object} data - Login credentials
 * @param {string} data.email - User email
 * @param {string} data.password - User password
 * @returns {Promise<Object>} Response data from server
 */
const LoginApi = async ({ email, password }) => {
  try {
    const res = await api.post(
      `/auth/login`,
      {
        email,
        password,
      }
    );

    console.log("Login Api Response === ", res.data);
     return res.data;
  
  } catch (error) {
    console.log(error);
  }
};

/**
 * @function LogoutApi
 * @description Logout the current user (clears session/cookies)
 * @returns {Promise<Object>} Response data from server
 */
const LogoutApi = async () => {
  try {
    const res = await api.get(`/auth/logout`);

    console.log("LogOut Api Response === ", res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * @function GetProfileApi
 * @description Fetch logged-in user's profile details
 * @returns {Promise<Object>} User profile data
 */
const GetProfileApi = async () => {
  try {
    const res = await api.get(`/auth/getProfile`);

    console.log("Get Profile Api Response === ", res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export {
  RegisterApi,
  LoginApi,
  LogoutApi,
  GetProfileApi
};