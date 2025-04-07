import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "@/types";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  roles: ("parent" | "admin")[];
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  roles: [],
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        user: AuthUser;
        token: string;
        roles: ("parent" | "admin")[];
      }>
    ) => {
      const { user, token, roles } = action.payload;
      state.user = user;
      state.token = token;
      state.roles = roles;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.roles = [];
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
