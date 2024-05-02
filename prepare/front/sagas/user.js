import { all, fork, delay, put, takeLatest, call } from "redux-saga/effects";
import axios from "axios";
import {
	loadMyInfoRequestAction,
	loadMyInfoFailureAction,
	loadMyInfoSuccessAction,
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

function loadMyInfoAPI() {
	return axios.get("/user");
}
function* loadMyInfo() {
	try {
		const result = yield call(loadMyInfoAPI);
		yield put(loadMyInfoSuccessAction(result.data));
	} catch (err) {
		yield put(loadMyInfoFailureAction(err.response.data));
	}
}

function loginAPI(data) {
	return axios.post("/user/login", data);
}
function* login(action) {
	try {
		const result = yield call(loginAPI, action.payload);
		yield put(loginSuccessAction(result.data));
	} catch (err) {
		yield put(loginFailureAction(err.response.data));
	}
}

function logoutAPI() {
	return axios.post("/user/logout");
}
function* logout() {
	try {
		yield call(logoutAPI);
		yield put(logoutSuccessAction());
	} catch (err) {
		yield put(logoutFailureAction(err.response.data));
	}
}

function signUpAPI(data) {
	return axios.post("/user", data);
}
function* signup(action) {
	try {
		const result = yield call(signUpAPI, action.payload);
		yield put(signupSuccessAction(action.payload));
	} catch (err) {
		yield put(signupFailureAction(err.response.data));
	}
}

function followAPI() {
	return axios.post("/follow");
}
function* follow(action) {
	try {
		console.log("follow saga");
		yield delay(1000);
		yield put(followSuccessAction(action.payload));
	} catch (err) {
		yield put(followFailureAction(err.response.data));
	}
}

function unFollowAPI() {
	return axios.post("/unfollow");
}
function* unFollow(action) {
	try {
		console.log("unFollow saga");
		yield delay(1000);
		yield put(unFollowSuccessAction(action.payload));
	} catch (err) {
		yield put(unFollowFailureAction(err.response.data));
	}
}

function* watchLoadMyInfo() {
	yield takeLatest(loadMyInfoRequestAction, loadMyInfo);
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
	yield all([fork(watchLogIn), fork(watchLogOut), fork(watchSignUp), fork(watchFollow), fork(watchUnFollow), fork(watchLoadMyInfo)]);
}
