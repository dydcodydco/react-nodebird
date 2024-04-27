import { createSlice, current } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
	isLoggingIn: false, // 로그인 시도중
	isLoggingOut: false, // 로그아웃 시도중
	isLoggedIn: false,
	me: null,
	signUpData: {},
	loginData: {},
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		logIn: (state, action) => {
			state.isLoggedIn = true;
			state.me = action.payload;
		},
		logOut: (state) => {
			state.isLoggedIn = false;
			state.me = null;
		},
		loginRequestAction: (state) => {
			// console.log("reducer loginRequestAction");
			// console.log("state", state);
			state.isLoggingIn = true;
		},
		loginSuccessAction: (state, action) => {
			console.log("reducer login");
			console.log("state", state);
			// console.log("state", current(state));
			console.log(action);

			state.isLoggingIn = false;
			state.isLoggedIn = true;
			state.me = action.payload;
			state.me.nickname = "zzimzzim";
		},
		loginFailureAction: (state) => {
			state.isLoggingIn = false;
			state.isLoggedIn = false;
		},
		logoutRequestAction: (state) => {
			state.isLoggingOut = true;
		},
		logoutSuccessAction: (state) => {
			state.isLoggingOut = false;
			state.isLoggedIn = false;
			state.me = null;
		},
		logoutFailureAction: (state) => {
			state.isLoggingOut = false;
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
} = userSlice.actions; // 액션 생성 함수

export default userSlice.reducer; // 리듀서
