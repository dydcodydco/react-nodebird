import { all, fork, delay, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
	addPostRequestAction,
	addPostSuccessAction,
	addPostFailureAction,
	removePostRequestAction,
	removePostSuccessAction,
	removePostFailureAction,
	addCommentRequestAction,
	addCommentSuccessAction,
	addCommentFailureAction,
} from "../reducers/post";
import { addPostToMe, removePostOfMe } from "../reducers/user";
import shortid from "shortid";

function addPostAPI(data) {
	return axios.post("/api/post/", data);
}
function* addPost(action) {
	try {
		// const result = yield call(addPostAPI, action.data);
		console.log("addPost saga", action);
		yield delay(1000);
		const id = shortid.generate();
		yield put(addPostSuccessAction({ id, content: action.payload.text }));
		yield put(addPostToMe(id));
	} catch (err) {
		yield put(addPostFailureAction({ error: err.response.data }));
	}
}

function removePostAPI(data) {
	return axios.post("/api/post/", data);
}
function* removePost(action) {
	try {
		// const result = yield call(addPostAPI, action.data);
		console.log("removePost saga", action);
		yield delay(1000);
		yield put(removePostSuccessAction(action.payload.id));
		yield put(removePostOfMe(action.payload.id));
	} catch (err) {
		yield put(removePostFailureAction({ error: err.response.data }));
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
		yield put(addCommentSuccessAction(action.payload));
	} catch (err) {
		console.log(err);
		yield put(addCommentFailureAction({ error: err.response.data }));
	}
}

function* watchAddPost() {
	yield takeLatest(addPostRequestAction, addPost);
}
function* watchRemovePost() {
	yield takeLatest(removePostRequestAction, removePost);
}
function* watchAddComment() {
	yield takeLatest(addCommentRequestAction, addComment);
}

export default function* postSaga() {
	yield all([fork(watchAddPost), fork(watchRemovePost), fork(watchAddComment)]);
}
