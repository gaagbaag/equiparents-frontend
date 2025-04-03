import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InvitationState {
  accepted: boolean;
  code: string | null;
  error: string | null;
  loading: boolean;
}

const initialState: InvitationState = {
  accepted: false,
  code: null,
  error: null,
  loading: false,
};

const invitationSlice = createSlice({
  name: "invitation",
  initialState,
  reducers: {
    startAccept(state) {
      state.loading = true;
      state.error = null;
    },
    acceptSuccess(state, action: PayloadAction<string>) {
      state.accepted = true;
      state.code = action.payload;
      state.loading = false;
    },
    acceptFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    resetInvitation(state) {
      return initialState;
    },
  },
});

export const { startAccept, acceptSuccess, acceptFailure, resetInvitation } =
  invitationSlice.actions;

export default invitationSlice.reducer;
