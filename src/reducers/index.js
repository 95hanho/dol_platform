import { combineReducers } from "redux";
import login from "./loginSlice";
import modal from "./modalSlice";
import user from "./userSlice";
import loding from "./lodingSlice";

const rootReducer = combineReducers({ login, user, modal, loding });

export default rootReducer;
