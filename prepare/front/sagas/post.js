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
	likePostRequestAction,
	likePostSuccessAction,
	likePostFailureAction,
	unLikePostRequestAction,
	unLikePostSuccessAction,
	unLikePostFailureAction,
	uploadImagesRequestAction,
	uploadImagesSuccessAction,
	uploadImagesFailureAction,
	removeImageRequestAction,
	removeImageSuccessAction,
	removeImageFailureAction,
	generateDummyPosts,
	retweetRequestAction,
	retweetSuccessAction,
	retweetFailureAction,
} from "../reducers/post";
import { addPostToMe, removePostOfMe } from "../reducers/user";
import shortid from "shortid";

function retweetpi(data) {
	return axios.post(`/post/${data}/retweet`);
}
function* retweet(action) {
	try {
		const result = yield call(retweetpi, action.payload);
		yield put(retweetSuccessAction(result.data));
	} catch (err) {
		console.error(err);
		yield put(retweetFailureAction(err.response.data));
	}
}

function uploadImagesApi(data) {
	return axios.post(`/post/images`, data); // formData는 받은 그대로
}
function* uploadImages(action) {
	try {
		const result = yield call(uploadImagesApi, action.payload);
		yield put(uploadImagesSuccessAction(result.data));
	} catch (err) {
		console.error(err);
		yield put(uploadImagesFailureAction(err.response.data));
	}
}

function likePostsApi(data) {
	return axios.patch(`/post/${data}/like`); // 데이터의 일부분 수정하는거니까 patch
}
function* likePost(action) {
	try {
		console.log(action.payload);
		const result = yield call(likePostsApi, action.payload);
		yield put(likePostSuccessAction(result.data));
	} catch (err) {
		console.error(err);
		yield put(likePostFailureAction(err.response.data));
	}
}

function unLikePostsApi(data) {
	return axios.delete(`/post/${data}/unlike`);
}
function* unLikePost(action) {
	try {
		const result = yield call(unLikePostsApi, action.payload);
		yield put(unLikePostSuccessAction(result.data));
	} catch (err) {
		console.error(err);
		yield put(unLikePostFailureAction(err.response.data));
	}
}

function loadPostsApi(data) {
	return axios.get(`/posts`, data);
}
function* loadPosts(action) {
	try {
		// console.log("loadPosts saga", action);
		// yield delay(1000);
		const result = yield call(loadPostsApi, action.payload);
		yield put(loadPostsSuccessAction(result.data));
	} catch (err) {
		console.error(err);
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
		console.error(err);
		yield put(addPostFailureAction(err.response.data));
	}
}

function removePostAPI(data) {
	return axios.delete(`/post/${data}`);
}
function* removePost(action) {
	try {
		const result = yield call(removePostAPI, action.payload.id);
		yield put(removePostSuccessAction(result.data.PostId));
		yield put(removePostOfMe(result.data.PostId));
	} catch (err) {
		console.error(err);
		yield put(removePostFailureAction(err.response.data));
	}
}

function addCommentApi(data) {
	// POST /post/1/comment
	return axios.post(`/post/${data.postId}/comment`, data);
}
function* addComment(action) {
	try {
		const result = yield call(addCommentApi, action.payload);
		yield put(addCommentSuccessAction(result.data));
	} catch (err) {
		console.error(err);
		yield put(addCommentFailureAction(err.response.data));
	}
}

function* watchRetweet() {
	yield takeLatest(retweetRequestAction, retweet);
}
function* watchUploadImages() {
	yield takeLatest(uploadImagesRequestAction, uploadImages);
}
function* watchLikePost() {
	yield takeLatest(likePostRequestAction, likePost);
}
function* watchUnLikePost() {
	yield takeLatest(unLikePostRequestAction, unLikePost);
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
	yield all([
		fork(watchRetweet),
		fork(watchUploadImages),
		fork(watchLoadPosts),
		fork(watchAddPost),
		fork(watchRemovePost),
		fork(watchAddComment),
		fork(watchLikePost),
		fork(watchUnLikePost),
	]);
}
