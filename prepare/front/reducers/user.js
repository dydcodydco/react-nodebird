import { createSlice, current } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
	logInLoading: false, // 로그인 시도중
	logInDone: false,
	logInError: null,
	logOutLoading: false, // 로그아웃 시도중
	logOutDone: false,
	logOutError: null,
	signUpLoading: false, // 회원가입 시도중
	signUpDone: false,
	signUpError: null,
	me: null,
	signUpData: {},
	loginData: {},
};

const dummyUser = (payload) => {
	return {
		...payload,
		nickname: "zzimzzim",
		id: 1,
		Posts: [],
		Followings: [],
		Followers: [],
	};
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		loginRequestAction: (state) => {
			state.logInLoading = true;
			state.logInError = null;
			state.logInDone = false;
		},
		loginSuccessAction: (state, action) => {
			state.logInLoading = false;
			state.logInDone = true;
			state.me = dummyUser(action.payload);
		},
		loginFailureAction: (state, action) => {
			state.logInLoading = false;
			state.logInError = action.error;
		},
		logoutRequestAction: (state) => {
			state.logOutLoading = true;
			state.logOutDone = false;
			state.logOutError = null;
		},
		logoutSuccessAction: (state) => {
			state.logOutLoading = false;
			state.logOutDone = true;
			state.me = null;
		},
		logoutFailureAction: (state, action) => {
			state.logOutLoading = false;
			state.logInError = action.error;
		},
		signupRequestAction: (state) => {
			state.signUpLoading = true;
			state.signUpError = null;
			state.signUpDone = false;
		},
		signupSuccessAction: (state, action) => {
			state.signUpLoading = false;
			state.signUpDone = true;
			state.me = dummyUser(action.payload);
		},
		signupFailureAction: (state, action) => {
			state.signUpLoading = false;
			state.signUpError = action.error;
		},
	},
	extraReducers: (builder) =>
		builder
			.addCase(HYDRATE, (state, action) => ({
				...state,
				...action.payload.user,
			}))
			.addDefaultCase((state) => state),
}); // 최신 방식
// 기존에는 불변성 유지를 위해서 개발자가 새객체로 리턴해줘야했는데
// redux toolkit에서는 immer라이브러리가 처리해줌.

export const {
	logIn,
	logOut,
	loginRequestAction,
	loginSuccessAction,
	loginFailureAction,
	logoutRequestAction,
	logoutSuccessAction,
	logoutFailureAction,
	signupRequestAction,
	signupSuccessAction,
	signupFailureAction,
} = userSlice.actions; // 액션 생성 함수

export default userSlice.reducer; // 리듀서
