import { HYDRATE } from "next-redux-wrapper";
import { createSlice } from "@reduxjs/toolkit";
import shortId from "shortid";

export const initialState = {
	// 왜 id같이 소문자가 있고, User처럼 대문자가 있는걸까?
	// 데이터베이스에서 사용하는 시퀄라이즈랑 관계있다.
	// 어떤 정보와 다른 정보가 관계가 있으면 합쳐주는게 그게 대문자가 된다.
	// 설정으로 소문자 가능하긴함.
	// 소문자 = 게시글 자체 속성
	// 대문자 = 다른 정보들과 합쳐서 주는 정보 / 서버에서 주는 정보로 고유한 Id를 가지고 있다.
	mainPosts: [
		{
			id: "1",
			User: {
				id: "1",
				nickname: "zzimzzim",
			},
			content: "첫 번째 게시글 #해시태그, #익스프레스",
			Images: [
				{
					id: shortId.generate(),
					src: "https://loremflickr.com/cache/resized/65535_53669042936_630c778818_320_240_nofilter.jpg",
				},
				{
					id: shortId.generate(),
					src: "https://loremflickr.com/cache/resized/65535_52982053835_12fc661207_320_240_nofilter.jpg",
				},
				{
					id: shortId.generate(),
					src: "https://loremflickr.com/cache/resized/65535_52905479084_303bf25ec0_320_240_nofilter.jpg",
				},
			],
			Comments: [
				{
					id: shortId.generate(),
					User: {
						nickname: "찜찜",
					},
					content: "얼른 사고싶어요~",
				},
				{
					id: shortId.generate(),
					User: {
						nickname: "hero",
					},
					content: "리액트 넥스트 고수가 될테다~",
				},
			],
			createdAt: {},
		},
	],
	imagePaths: [],
	addPostLoading: false,
	addPostDone: false,
	addPostError: null,
	removePostLoading: false,
	removePostDone: false,
	removePostError: null,
	addCommentLoading: false,
	addCommentDone: false,
	addCommentError: null,
};

const dummyPost = ({ id, content }) => {
	return {
		id,
		content,
		User: {
			id: "1",
			nickname: "WlaWla",
		},
		Images: [],
		Comments: [],
	};
};

const dummyComment = (content) => ({
	id: shortId.generate(),
	content: content,
	User: {
		id: "1",
		nickname: "WlaWla",
	},
});

const postSlice = createSlice({
	name: "post",
	initialState,
	reducers: {
		addPostRequestAction: (state, action) => {
			state.addPostLoading = true;
			state.addPostDone = false;
			state.addPostError = null;
		},
		addPostSuccessAction: (state, action) => {
			state.addPostLoading = false;
			state.addPostDone = true;
			state.mainPosts.unshift(dummyPost(action.payload));
		},
		addPostFailureAction: (state, action) => {
			state.addPostLoading = false;
			state.addPostError = action.error;
		},
		removePostRequestAction: (state, action) => {
			state.removePostLoading = true;
			state.removePostDone = false;
			state.removePostError = null;
		},
		removePostSuccessAction: (state, action) => {
			state.removePostLoading = false;
			state.removePostDone = true;
			state.mainPosts = state.mainPosts.filter((d) => d.id !== action.payload);
		},
		removePostFailureAction: (state, action) => {
			state.removePostLoading = false;
			state.removePostError = action.error;
		},
		addCommentRequestAction: (state, action) => {
			state.addCommentLoading = true;
			state.addCommentDone = false;
			state.addCommentError = null;
		},
		addCommentSuccessAction: (state, action) => {
			const { content, postId } = action.payload;
			const post = state.mainPosts.find((d) => d.id === postId);
			post.Comments.unshift(dummyComment(content));
			state.addCommentLoading = false;
			state.addCommentDone = true;
		},
		addCommentFailureAction: (state, action) => {
			state.addCommentLoading = false;
			state.addCommentError = action.error;
		},
	},
	extraReducers: (builder) =>
		builder
			.addCase(HYDRATE, (state, action) => ({
				...state,
				...action.payload.post,
			}))
			.addDefaultCase((state) => state),
});

export const {
	addPostRequestAction,
	addPostSuccessAction,
	addPostFailureAction,
	removePostRequestAction,
	removePostSuccessAction,
	removePostFailureAction,
	addCommentRequestAction,
	addCommentSuccessAction,
	addCommentFailureAction,
} = postSlice.actions;
export default postSlice.reducer;
