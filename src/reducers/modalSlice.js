import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    // 기본 알람
    modal_alert: false,
    modal_alert_txt: "",
    // logout 알람
    modal_logout: false,
    // 컨펌 알람(확인/취소)
    modal_confirm: false,
    modal_confirm_txt: "",
    modal_confirm_set: "",
    modal_confirm_result: "",
    // 관심사 모달
    modal_interest: false,
    modal_interest_join: false,
  },
  reducers: {
    on_modal_alert(state, { payload }) {
      /*
      dispatch({
        type: "modal/on_modal_alert",
        payload: "",
      });
      */
      state.modal_alert = true;
      state.modal_alert_txt = payload;
    },
    off_modal_alert(state) {
      state.modal_alert = false;
    },
    on_modal_logout(state) {
      state.modal_logout = true;
    },
    off_modal_logout(state) {
      state.modal_logout = false;
    },
    on_modal_confirm(state, { payload }) {
      state.modal_confirm = true;
      state.modal_confirm_txt = payload.txt;
      state.modal_confirm_set = payload.set;
      state.modal_confirm_result = "";
    },
    off_modal_confirm(state) {
      state.modal_confirm = false;
    },
    check_modal_confirm(state, { payload }) {
      state.modal_confirm_result = payload;
      state.modal_confirm = false;
    },
    on_modal_interest(state, { payload }) {
      state.modal_interest = true;
      if (payload) state.modal_interest_join = true;
    },
    off_modal_interest(state) {
      state.modal_interest = false;
      state.modal_interest_join = false;
    },
  },
});

export default modalSlice.reducer;
