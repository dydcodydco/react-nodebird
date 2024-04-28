import { all, fork, delay, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
	loginRequestAction,
	loginFailureAction,
	loginSuccessAction,
	logoutFailureAction,
	logoutRequestAction,
	logoutSuccessAction,
	signupRequestAction,
	signupSuccessAction,
	signupFailureAction,
} from "../reducers/user";

function loginAPI(data) {
	return axios.post("/api/login", data);
}
function* login(action) {
	try {
		// const result = yield call(loginAPI, action.data);
		// yield put(loginSuccessAction(action.payload));
		yield delay(1000);
		yield put({
			type: loginSuccessAction,
			payload: action.payload,
		});
	} catch (err) {
		yield put({
			type: loginFailureAction,
			error: err.response.data,
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
			type: logoutFailureAction,
			error: err.response.data,
		});
	}
}

function* signup() {
	try {
		yield delay(1000);
		yield put({
			type: signupSuccessAction,
			payload: "",
		});
	} catch (err) {
		yield put({
			type: signupFailureAction,
			error: err.response.data,
		});
	}
}

function* watchLogIn() {
	yield takeLatest(loginRequestAction, login);
}
function* watchLogOut() {
	yield takeLatest(logoutRequestAction, logout);
}
function* watchSignUp() {
	yield takeLatest(signupRequestAction, signup);
}

export default function* userSaga() {
	yield all([fork(watchLogIn), fork(watchLogOut), fork(watchSignUp)]);
}
