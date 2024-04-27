import { all, fork, delay, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
	loginRequestAction,
	loginFailureAction,
	loginSuccessAction,
	logoutFailureAction,
	logoutRequestAction,
	logoutSuccessAction,
} from "../reducers/user";

function loginAPI(data) {
	return axios.post("/api/login", data);
}

function* login(action) {
	try {
		// console.log("saga login");
		// console.log(action);
		// const result = yield call(loginAPI, action.data);
		yield delay(1000);
		yield put(loginSuccessAction(action.payload));
	} catch (err) {
		yield put({
			type: loginFailureAction,
			// data: err.response.data,
		});
	}
}

function logoutAPI() {
	return axios.post("/api/logout");
}

function* logout() {
	try {
		// const result = yield call(logoutAPI);
		yield delay(1000);
		yield put({
			type: logoutSuccessAction,
			// data: result.data,
		});
	} catch (err) {
		yield put({
			type: "LOG_OUT_FAILURE",
			data: err.response.data,
		});
	}
}

function* watchLogIn() {
	yield takeLatest(loginRequestAction, login);
}

function* watchLogOut() {
	yield takeLatest(logoutRequestAction, logout);
}

export default function* userSaga() {
	yield all([fork(watchLogIn), fork(watchLogOut)]);
}
