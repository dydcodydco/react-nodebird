import { HYDRATE } from "next-redux-wrapper";
import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
	// 왜 id같이 소문자가 있고, User처럼 대문자가 있는걸까?
	// 데이터베이스에서 사용하는 시퀄라이즈랑 관계있다.
	// 어떤 정보와 다른 정보가 관계가 있으면 합쳐주는게 그게 대문자가 된다.
	// 설정으로 소문자 가능하긴함.
	// 소문자 = 게시글 자체 속성
	// 대문자 = 다른 정보들과 합쳐서 주는 정보
	mainPosts: [
		{
			id: 1,
			User: {
				id: 111,
				nickname: "zzimzzim",
			},
			content: "첫 번째 게시글 #해시태그, #익스프레스",
			Images: [
				{
					src: "https://loremflickr.com/cache/resized/3735_32789051834_239cec50ff_n_320_240_nofilter.jpg",
				},
				{
					src: "https://loremflickr.com/cache/resized/65535_53082472984_a62a3153b1_n_320_240_nofilter.jpg",
				},
				{
					src: "https://loremflickr.com/cache/resized/65535_53079205137_78f14ba882_320_240_nofilter.jpg",
				},
			],
			Comments: [
				{
					User: {
						nickname: "찜찜",
					},
					content: "얼른 사고싶어요~",
				},
				{
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
	postAdded: false,
};

const dummyPost = {
	id: 2,
	content: "더미데이터 입니다.",
	User: {
		id: 1,
		nickname: "WlaWla",
	},
	Images: [],
	Comments: [],
};

const postSlice = createSlice({
	name: "post",
	initialState,
	reducers: {
		addPost: (state, action) => {
			state.mainPosts = [dummyPost, ...state.mainPosts];
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

export const { addPost } = postSlice.actions;
export default postSlice.reducer;
