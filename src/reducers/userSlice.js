import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    loginId: "",
    name: "",
    nickName: "",
    birth: "",
    gender: "",
    email: "",
    phone: "",
    dept: "",
    interestList: [],
    categoryIdList: [4, 2, 3],
  },
  reducers: {
    setUserInfo(state, { payload }) {
      console.log("userInfo", payload);
      state.loginId = payload.loginId;
      state.name = payload.name;
      state.nickName = payload.nickName;
      state.birth = payload.birth;
      state.gender = payload.gender;
      state.email = payload.email;
      state.phone = payload.phone;
      state.dept = payload.dept;
      state.interestList = payload.interestList;
    },
    resetUserInfo(state) {
      state.loginId = "";
      state.name = "";
      state.nickName = "";
      state.birth = "";
      state.gender = "";
      state.email = "";
      state.phone = "";
      state.dept = "";
      state.interestList = [];
    },
  },
});

export default userSlice.reducer;
