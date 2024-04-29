import { all, fork, delay, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import { addPostRequestAction, addPostSuccessAction, addPostFailureAction, addCommentRequestAction, addCommentSuccessAction, addCommentFailureAction } from "../reducers/post";

function addPostAPI(data) {
	return axios.post("/api/post/", data);
}

function* addPost(action) {
	try {
		// const result = yield call(addPostAPI, action.data);
		console.log("addPost saga", action);
		yield delay(1000);
		yield put({ type: addPostSuccessAction, payload: action.payload });
	} catch (err) {
		yield put({ type: addPostFailureAction, error: err.response.data });
	}
}

function addCommentApi(data) {
	return axios.post(`/api/post/${data.postId}/comment`);
}
function* addComment(action) {
	try {
		// const result = yield call(addPostAPI, action.data);
		console.log("addComment saga", action);
		yield delay(1000);
		yield put({
			type: addCommentSuccessAction,
			payload: action.payload,
		});
	} catch (err) {
		console.log(err);
		yield put({
			type: addCommentFailureAction,
			error: err.response.data,
		});
	}
}

function* watchAddPost() {
	yield takeLatest(addPostRequestAction, addPost);
}

function* watchAddComment() {
	yield takeLatest(addCommentRequestAction, addComment);
}

export default function* postSaga() {
	yield all([fork(watchAddPost), fork(watchAddComment)]);
}
