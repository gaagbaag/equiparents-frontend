// src/redux/slices/parentalAccountSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import fetchWithToken from "@/utils/fetchWithToken";

interface ParentalAccountState {
  children: any[];
  users: any[];
  finalized: boolean;
  calendar: { id: string } | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ParentalAccountState = {
  children: [],
  users: [],
  finalized: false,
  calendar: null,
  status: "idle",
  error: null,
};

export const fetchParentalAccount = createAsyncThunk<
  ParentalAccountState,
  void,
  { state: RootState }
>("parentalAccount/fetch", async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token;

  if (!token || !token.trim()) {
    console.warn("⛔ fetchParentalAccount cancelado: token no disponible.");
    return rejectWithValue("Token inválido o ausente");
  }

  try {
    const res = await fetchWithToken(
      `${process.env.NEXT_PUBLIC_API_URL}/api/parental-accounts/my-account`
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Error al obtener cuenta parental");
    }

    const data = await res.json();

    return {
      children: data.children || [],
      users: data.users || [],
      finalized: data.finalized || false,
      calendar: data.calendar || null,
      status: "succeeded",
      error: null,
    };
  } catch (err: any) {
    console.error("❌ Error en fetchParentalAccount:", err.message);
    return rejectWithValue({
      children: [],
      users: [],
      finalized: false,
      calendar: null,
      status: "failed",
      error: err.message || "Error inesperado",
    });
  }
});

const parentalAccountSlice = createSlice({
  name: "parentalAccount",
  initialState,
  reducers: {
    resetParentalAccount: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParentalAccount.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchParentalAccount.fulfilled,
        (state, action: PayloadAction<ParentalAccountState>) => {
          state.children = action.payload.children;
          state.users = action.payload.users;
          state.finalized = action.payload.finalized;
          state.calendar = action.payload.calendar;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(fetchParentalAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Error al obtener cuenta parental";
      });
  },
});

export const { resetParentalAccount } = parentalAccountSlice.actions;
export default parentalAccountSlice.reducer;
