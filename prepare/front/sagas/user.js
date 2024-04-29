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
		console.log("login saga", action);
		yield delay(1000);
		yield put(loginSuccessAction(action.payload));
		// yield put(loginSuccessAction(action.payload));
	} catch (err) {
		yield put(loginFailureAction({ error: err.response.data }));
	}
}

function logoutAPI() {
	return axios.post("/api/logout");
}
function* logout() {
	try {
		// const result = yield call(logoutAPI);
		console.log("logout saga");
		yield delay(1000);
		yield put(logoutSuccessAction());
	} catch (err) {
		yield put(logoutFailureAction({ error: err.response.data }));
	}
}

function* signup() {
	try {
		console.log("signup saga");
		yield delay(1000);
		yield put(signupSuccessAction({ payload: "" }));
	} catch (err) {
		yield put(signupFailureAction({ error: err.response.data }));
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
