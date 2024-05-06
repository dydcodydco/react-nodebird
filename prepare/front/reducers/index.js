import { combineReducers } from "redux";
import user from "./user";
import post from "./post";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3065";
axios.defaults.withCredentials = true;

const rootReducer = combineReducers({
	user,
	post,
});

export default rootReducer;
