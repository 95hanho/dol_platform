import { createSlice } from "@reduxjs/toolkit";
import { setCookie, removeCookie } from "../cookies";

const loginSlice = createSlice({
  name: "login",
  initialState: {
    changingId: "",
    successCode: "",
  },
  reducers: {
    setToken(state, { payload }) {
      setCookie("accessToken", payload.accessToken, 30);
      setCookie("refreshToken", payload.refreshToken, 60 * 2);
    },
    logout(state) {
      removeCookie("accessToken");
      removeCookie("refreshToken");
    },
    setChangePwdData(state, { payload }) {
      state.changingId = payload.changingId;
      state.successCode = payload.successCode;
    },
  },
});

export default loginSlice.reducer;
