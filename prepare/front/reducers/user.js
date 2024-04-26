import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
	isLoggedIn: false,
	user: null,
	signUpData: {},
	loginData: {},
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducer: {
		logIn: (state, action) => {
			state.isLoggedIn = true;
			state.user = action.payload;
		},
		logOut: (state) => {
			state.isLoggedIn = false;
			state.user = null;
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

export const { logIn, logOut } = userSlice.actions; // 액션 생성 함수
export default userSlice.reducer; // 리듀서
