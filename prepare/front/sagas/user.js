import { all, fork, delay, put, takeLatest, call } from "redux-saga/effects";
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
	followRequestAction,
	followSuccessAction,
	followFailureAction,
	unFollowRequestAction,
	unFollowSuccessAction,
	unFollowFailureAction,
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

function signUpAPI(data) {
	return axios.post("http://localhost:3065/user", data);
}
function* signup(action) {
	try {
		console.log(action.payload);
		const result = yield call(signUpAPI, action.payload);
		console.log(result);
		yield put(signupSuccessAction(action.payload));
	} catch (err) {
		yield put(signupFailureAction({ error: err.response.data }));
	}
}

function followAPI() {
	return axios.post("/api/logout");
}
function* follow(action) {
	try {
		console.log("follow saga");
		yield delay(1000);
		yield put(followSuccessAction(action.payload));
	} catch (err) {
		yield put(followFailureAction({ error: err.response.data }));
	}
}

function unFollowAPI() {
	return axios.post("/api/logout");
}
function* unFollow(action) {
	try {
		console.log("unFollow saga");
		yield delay(1000);
		yield put(unFollowSuccessAction(action.payload));
	} catch (err) {
		yield put(unFollowFailureAction({ error: err.response.data }));
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
function* watchFollow() {
	yield takeLatest(followRequestAction, follow);
}
function* watchUnFollow() {
	yield takeLatest(unFollowRequestAction, unFollow);
}

export default function* userSaga() {
	yield all([fork(watchLogIn), fork(watchLogOut), fork(watchSignUp), fork(watchFollow), fork(watchUnFollow)]);
}
