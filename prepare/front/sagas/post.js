import { all, fork, delay, put, takeLatest, call, throttle } from "redux-saga/effects";
import axios from "axios";
import {
	loadPostsRequestAction,
	loadPostsSuccessAction,
	loadPostsFailureAction,
	addPostRequestAction,
	addPostSuccessAction,
	addPostFailureAction,
	removePostRequestAction,
	removePostSuccessAction,
	removePostFailureAction,
	addCommentRequestAction,
	addCommentSuccessAction,
	addCommentFailureAction,
	generateDummyPosts,
} from "../reducers/post";
import { addPostToMe, removePostOfMe } from "../reducers/user";
import shortid from "shortid";

function loadPostsApi(data) {
	return axios.post(`/api/post/${data.postId}/comment`);
}
function* loadPosts(action) {
	try {
		// const result = yield call(addPostAPI, action.data);
		console.log("loadPosts saga", action);
		yield delay(1000);
		yield put(loadPostsSuccessAction(generateDummyPosts(10)));
	} catch (err) {
		yield put(loadPostsFailureAction(err.response.data));
	}
}

function addPostAPI(data) {
	return axios.post("/post", data);
}
function* addPost(action) {
	try {
		const result = yield call(addPostAPI, action.payload);
		yield put(addPostSuccessAction(result.data));
		yield put(addPostToMe(result.data.id));
	} catch (err) {
		yield put(addPostFailureAction(err.response.data));
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
	return axios.post(`/post/${data.postId}/comment`, data); // POST /post/1/comment
}
function* addComment(action) {
	try {
		const result = yield call(addPostAPI, action.payload);
		yield put(addCommentSuccessAction(result.payload));
	} catch (err) {
		yield put(addCommentFailureAction(err.response.data));
	}
}

function* watchLoadPosts() {
	yield takeLatest(loadPostsRequestAction, loadPosts);
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
	yield all([fork(watchLoadPosts), fork(watchAddPost), fork(watchRemovePost), fork(watchAddComment)]);
}
