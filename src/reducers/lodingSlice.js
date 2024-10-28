import { createSlice } from "@reduxjs/toolkit";

const lodingSlice = createSlice({
  name: "loding",
  initialState: {
    ing: false,
  },
  reducers: {
    lodingOn(state) {
      state.ing = true;
    },
    lodingOff(state) {
      state.ing = false;
    },
  },
});

export default lodingSlice.reducer;
