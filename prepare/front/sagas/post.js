import { all, fork, delay, put, takeLatest, throttle } from "redux-saga/effects";
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
		yield put(loadPostsFailureAction({ error: err.response.data }));
	}
}

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
		yield put(addCommentFailureAction({ error: err.response.data }));
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
	yield all([fork(watchLoadPosts, fork(watchAddPost), fork(watchRemovePost), fork(watchAddComment))]);
}
