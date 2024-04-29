import { HYDRATE } from "next-redux-wrapper";
import { createSlice } from "@reduxjs/toolkit";
import shortId from "shortid";
import produce from "immer";
// import { fakerKO as faker } from "@faker-js/faker";
import { faker } from "@faker-js/faker";

// 리듀서란? 이전 상태를 state로 받고, action을 통해 다음 상태로 만들어내는 함수(불변성 지키는게 포인트)
// immer의 produce사용하면 불변성을 지키지 않아도 immer가 자동으로 해준다.
const reducer = (state = initialState, action) => {
	// state가 draft로 바뀐다. 그리고 우리는 draft를 사용한다.
	// 이 draft를 변형시키면 immer가 알아서 불변성을 지켜 다음 상태로 업데이트 해준다.
	return produce(state, (draft) => {});
};

export const initialState = {
	// 왜 id같이 소문자가 있고, User처럼 대문자가 있는걸까?
	// 데이터베이스에서 사용하는 시퀄라이즈랑 관계있다.
	// 어떤 정보와 다른 정보가 관계가 있으면 합쳐주는게 그게 대문자가 된다.
	// 설정으로 소문자 가능하긴함.
	// 소문자 = 게시글 자체 속성
	// 대문자 = 다른 정보들과 합쳐서 주는 정보 / 서버에서 주는 정보로 고유한 Id를 가지고 있다.
	mainPosts: [],
	imagePaths: [],
	hasMorePosts: true,
	loadPostsLoading: false,
	loadPostsDone: false,
	loadPostsError: null,
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

// 단일 게시글 생성 함수
faker.seed(123);
const createDummyPost = () => {
	return {
		id: shortId.generate(),
		User: {
			id: shortId.generate(),
			nickname: faker.person.fullName(),
		},
		content: faker.lorem.paragraph(),
		Images: [{ src: faker.image.urlLoremFlickr() }],
		Comments: [
			{
				User: {
					id: shortId.generate(),
					nickname: faker.person.fullName(),
				},
				content: faker.lorem.sentence(),
			},
		],
	};
};
// 여러 게시글 생성
export const generateDummyPosts = (number) =>
	faker.helpers.multiple(createDummyPost, {
		count: number,
	});
// 초기 상태에 더미 게시물 추가
// initialState.mainPosts = [...generateDummyPosts(10)];

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
		loadPostsRequestAction: (state, action) => {
			state.loadPostsLoading = true;
			state.loadPostsDone = false;
			state.loadPostsError = null;
		},
		loadPostsSuccessAction: (state, action) => {
			state.loadPostsLoading = false;
			state.loadPostsDone = true;
			state.mainPosts = [...state.mainPosts, ...action.payload];
			state.hasMorePosts = state.mainPosts.length < 50;
			// state.mainPosts.unshift(action.payload);
		},
		loadPostsFailureAction: (state, action) => {
			state.loadPostsLoading = false;
			state.loadPostsError = action.error;
		},
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
} = postSlice.actions;
export default postSlice.reducer;
