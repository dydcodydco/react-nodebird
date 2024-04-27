import {
	all,
	fork,
	take,
	takeEvery,
	takeLatest,
	put,
	call,
	delay,
} from "redux-saga";
import axios from "axios";

// LOG_IN_REQUEST 이벤트가 발생 -> login함수를 실행할때 데이터를 인자로 넣고 실행
// login은 인자를 (acion) 받고 call의 두번째 인자로 데이터를 넣어줌
// loginApi함수는 그 데이터를 매개변수로 받아서 api 호출
// yield call(loginAPI, action.data, a, b, c);
// function loginAPI(data, a, b, c) {
function loginAPI(data) {
	return axios.post("/api/login", data);
}

function* login(action) {
	try {
		// const result = yield call(loginAPI, action.data);
		yield delay(1000);
		yield put({
			type: "LOG_IN_SUCCESS",
			data: result.data,
		});
	} catch (err) {
		yield put({
			type: "LOG_IN_FAILURE",
			data: err.response.data,
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
			type: "LOG_OUT_SUCCESS",
			data: result.data,
		});
	} catch (err) {
		yield put({
			type: "LOG_OUT_FAILURE",
			data: err.response.data,
		});
	}
}

function addPostAPI(data) {
	return axios.post("/api/addPost", data);
}

function* addPost(action) {
	try {
		// const result = yield call(addPostAPI, action.data);
		yield delay(1000);
		yield put({
			type: "ADD_POST_SUCCESS",
			data: result.data,
		});
	} catch (err) {
		yield put({
			type: "ADD_POST_FAILURE",
			data: err.response.data,
		});
	}
}

// thunk에서는 LOG_IN이 비동기 액션크리에이터를 직접실행
// saga에서는 비동기 액션크리에이터가 직접실행되는게 아니고 이벤트 리스너같은 역할을 한다.
// LOG_IN액션이 들어오면 login제너레이터 함수를 실행.
function* watchLogIn() {
	yield takeLatest("LOG_IN_REQUEST", login);
}

function* watchLogOut() {
	yield takeLatest("LOG_OUT_REQUEST", logout);
}

function* watchAddPost() {
	yield takeLatest("ADD_POST_REQUEST", addPost);
}

export default function* rootSaga() {
	yield all([fork(watchLogIn), fork(watchLogOut), fork(watchAddPost)]);
}
