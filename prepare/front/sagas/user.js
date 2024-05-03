import { all, fork, delay, put, takeLatest, call } from "redux-saga/effects";
import axios from "axios";
import {
	loadFollowersRequestAction,
	loadFollowersSuccessAction,
	loadFollowersFailureAction,
	loadFollowingsRequestAction,
	loadFollowingsSuccessAction,
	loadFollowingsFailureAction,
	changeNicknameRequestAction,
	changeNicknameSuccessAction,
	changeNicknameiailureAction,
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
	removeFollowerRequestAction,
	removeFollowerSuccessAction,
	removeFollowerFailureAction,
} from "../reducers/user";

function changeNicknameAPI(data) {
	return axios.patch("/user/nickname", { nickname: data });
}
function* changeNickname(action) {
	try {
		const result = yield call(changeNicknameAPI, action.payload);
		yield put(changeNicknameSuccessAction(result.data));
	} catch (err) {
		yield put(changeNicknameiailureAction(err.response.data));
	}
}

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

function followAPI(data) {
	return axios.patch(`/user/${data}/follow`);
}
function* follow(action) {
	try {
		const result = yield call(followAPI, action.payload);
		yield put(followSuccessAction(result.data));
	} catch (err) {
		yield put(followFailureAction(err.response.data));
	}
}

function unFollowAPI(data) {
	return axios.delete(`/user/${data}/follow`);
}
function* unFollow(action) {
	try {
		const result = yield call(unFollowAPI, action.payload);
		yield put(unFollowSuccessAction(result.data));
	} catch (err) {
		yield put(unFollowFailureAction(err.response.data));
	}
}

function removeFollowerAPI(data) {
	return axios.delete(`/user/follower/${data}`);
}
function* removeFollower(action) {
	try {
		const result = yield call(removeFollowerAPI, action.payload);
		yield put(removeFollowerSuccessAction(result.data));
	} catch (err) {
		yield put(removeFollowerFailureAction(err.response.data));
	}
}

function loadFollowsAPI() {
	return axios.get(`/user/followers`);
}
function* loadFollowers() {
	try {
		const result = yield call(loadFollowsAPI);
		yield put(loadFollowersSuccessAction(result.data));
	} catch (err) {
		yield put(loadFollowersFailureAction(err.response.data));
	}
}

function loadFollowingsAPI() {
	return axios.get(`/user/followings`);
}
function* loadFollowings() {
	try {
		const result = yield call(loadFollowingsAPI);
		yield put(loadFollowingsSuccessAction(result.data));
	} catch (err) {
		yield put(loadFollowingsFailureAction(err.response.data));
	}
}

function* watchLoadFollowers() {
	yield takeLatest(loadFollowersRequestAction, loadFollowers);
}
function* watchLoadFollowings() {
	yield takeLatest(loadFollowingsRequestAction, loadFollowings);
}
function* watchChangeNickname() {
	yield takeLatest(changeNicknameRequestAction, changeNickname);
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
function* watchRemoveFollower() {
	yield takeLatest(removeFollowerRequestAction, removeFollower);
}

export default function* userSaga() {
	yield all([
		fork(watchRemoveFollower),
		fork(watchLoadFollowers),
		fork(watchLoadFollowings),
		fork(watchChangeNickname),
		fork(watchLogIn),
		fork(watchLogOut),
		fork(watchSignUp),
		fork(watchFollow),
		fork(watchUnFollow),
		fork(watchLoadMyInfo),
	]);
}
