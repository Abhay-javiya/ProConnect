import { createAsyncThunk } from "@reduxjs/toolkit";
import clientServer from "@/config";

const getError = (error, fallback) =>
  error.response?.data || { message: error.message || fallback };

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await clientServer.post("/login", { email, password });
      if (!data.token) return rejectWithValue({ message: "Login response did not include a token." });
      if (typeof window !== "undefined") window.localStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      return rejectWithValue(getError(error, "Login failed."));
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (user, { rejectWithValue }) => {
    try {
      const { data } = await clientServer.post("/register", {
        name: user.name,
        email: user.email,
        password: user.password,
        username: user.username,
      });
      return data;
    } catch (error) {
      return rejectWithValue(getError(error, "Registration failed."));
    }
  }
);

export const logoutUser = () => (dispatch) => {
  if (typeof window !== "undefined") window.localStorage.removeItem("token");
  dispatch({ type: "auth/loggedOut" });
};
