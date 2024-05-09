import axios from 'axios';
import { all, fork } from 'redux-saga/effects';

import postSaga from './post';
import userSaga from './user';
import { backUrl } from '../config/config';

axios.defaults.baseURL = backUrl;
axios.defaults.withCredentials = true; // 도메인다른 백엔드 서버와 쿠키 주고받을 수 있다.

export default function* rootSaga() {
  yield all([fork(userSaga), fork(postSaga)]);
}

// LOG_IN_REQUEST 이벤트가 발생 -> login함수를 실행할때 데이터를 인자로 넣고 실행
// login은 인자를 (acion) 받고 call의 두번째 인자로 데이터를 넣어줌
// loginApi함수는 그 데이터를 매개변수로 받아서 api 호출
// yield call(loginAPI, action.data, a, b, c);
// function loginAPI(data, a, b, c) {
// function loginAPI(data) {
// 	return axios.post("/api/login", data);
// }

// function* login(action) {
// 	try {
// 		// const result = yield call(loginAPI, action.data);
// 		yield delay(1000);
// 		yield put({
// 			type: "LOG_IN_SUCCESS",
// 			data: result.data,
// 		});
// 	} catch (err) {
// 		yield put({
// 			type: "LOG_IN_FAILURE",
// 			data: err.response.data,
// 		});
// 	}
// }

// thunk에서는 LOG_IN이 비동기 액션크리에이터를 직접실행
// saga에서는 비동기 액션크리에이터가 직접실행되는게 아니고 이벤트 리스너같은 역할을 한다.
// LOG_IN액션이 들어오면 login제너레이터 함수를 실행.
// function* watchLogIn() {
// 	yield takeLatest("LOG_IN_REQUEST", login);
// }
