import { createSlice, current } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
	removeFollowerLoading: false, // 팔로워 제거 시도중
	removeFollowerDone: false,
	removeFollowerError: null,
	loadFollowersLoading: false, // 팔로워 리스트 가져오기 시도중
	loadFollowersDone: false,
	loadFollowersError: null,
	loadFollowingsLoading: false, // 팔로윙 리스트 가져오기 시도중
	loadFollowingsDone: false,
	loadFollowingsError: null,
	loadMyInfoLoading: false, // 유저 정보 가져오기 시도중
	loadMyInfoDone: false,
	loadMyInfoError: null,
	logInLoading: false, // 로그인 시도중
	logInDone: false,
	logInError: null,
	logOutLoading: false, // 로그아웃 시도중
	logOutDone: false,
	logOutError: null,
	signUpLoading: false, // 회원가입 시도중
	signUpDone: false,
	signUpError: null,
	changeNicknameLoading: false, // 닉네임 변경 시도중
	changeNicknameDone: false,
	changeNicknameError: null,
	followLoading: false, // 팔로우 시도중
	followDone: false,
	followError: null,
	unFollowLoading: false, // 언팔로우 시도중
	unFollowDone: false,
	unFollowError: null,
	me: null,
	signUpData: {},
	loginData: {},
};

const dummyUser = (payload) => {
	return {
		...payload,
		nickname: "zzimzzim",
		id: "1",
		Posts: [{ id: "1" }],
		Followings: [{ nickname: "더미1" }, { nickname: "더미2" }, { nickname: "더미3" }],
		Followers: [{ nickname: "더미1" }, { nickname: "더미2" }, { nickname: "더미3" }],
	};
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		removeFollowerRequestAction: (state) => {
			state.removeFollowerLoading = true;
			state.removeFollowerError = null;
			state.removeFollowerDone = false;
		},
		removeFollowerSuccessAction: (state, action) => {
			state.removeFollowerLoading = false;
			state.removeFollowerDone = true;
			state.me.Followers = state.me.Followers.filter((d) => d.id !== action.payload.UserId);
		},
		removeFollowerFailureAction: (state, action) => {
			state.removeFollowerLoading = false;
			state.removeFollowerError = action.payload;
		},
		loadFollowersRequestAction: (state) => {
			state.loadFollowersLoading = false;
			state.loadFollowersDone = false;
			state.loadFollowersError = null;
		},
		loadFollowersSuccessAction: (state, action) => {
			state.loadFollowersLoading = false;
			state.loadFollowersDone = true;
			state.me.Followers = action.payload;
		},
		loadFollowersFailureAction: (state, action) => {
			state.loadFollowersLoading = false;
			state.loadFollowersError = action.payload;
		},
		loadFollowingsRequestAction: (state) => {
			state.loadFollowingsLoading = false;
			state.loadFollowingsDone = false;
			state.loadFollowingsError = null;
		},
		loadFollowingsSuccessAction: (state, action) => {
			state.loadFollowingsLoading = false;
			state.loadFollowingsDone = true;
			state.me.Followings = action.payload;
		},
		loadFollowingsFailureAction: (state, action) => {
			state.loadFollowingsLoading = false;
			state.loadFollowingsError = action.payload;
		},
		loadMyInfoRequestAction: (state) => {
			state.loadMyInfoLoading = false;
			state.loadMyInfoDone = false;
			state.loadMyInfoError = null;
		},
		loadMyInfoSuccessAction: (state, action) => {
			state.loadMyInfoLoading = false;
			state.loadMyInfoDone = true;
			state.me = action.payload;
		},
		loadMyInfoFailureAction: (state, action) => {
			state.loadMyInfoLoading = false;
			state.loadMyInfoError = action.payload;
		},
		followRequestAction: (state) => {
			state.followLoading = true;
			state.followError = null;
			state.followDone = false;
		},
		followSuccessAction: (state, action) => {
			state.followLoading = false;
			state.followDone = true;
			state.me.Followings.push({ id: action.payload.UserId });
		},
		followFailureAction: (state, action) => {
			state.followLoading = false;
			state.followError = action.payload;
		},
		unFollowRequestAction: (state) => {
			state.unFollowLoading = true;
			state.unFollowError = null;
			state.unFollowDone = false;
		},
		unFollowSuccessAction: (state, action) => {
			state.unFollowLoading = false;
			state.unFollowDone = true;
			state.me.Followings = state.me.Followings.filter((d) => d.id !== action.payload.UserId);
		},
		unFollowFailureAction: (state, action) => {
			state.unFollowLoading = false;
			state.unFollowError = action.payload;
		},
		loginRequestAction: (state) => {
			state.logInLoading = true;
			state.logInError = null;
			state.logInDone = false;
		},
		loginSuccessAction: (state, action) => {
			state.logInLoading = false;
			state.logInDone = true;
			state.me = action.payload;
		},
		loginFailureAction: (state, action) => {
			state.logInLoading = false;
			state.logInError = action.payload;
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
			state.logInError = action.payload;
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
			state.signUpError = action.payload;
		},
		changeNicknameRequestAction: (state) => {
			state.changeNicknameLoading = true;
			state.changeNicknameError = null;
			state.changeNicknameDone = false;
		},
		changeNicknameSuccessAction: (state, action) => {
			state.changeNicknameLoading = false;
			state.changeNicknameDone = true;
			state.me.nickname = action.payload.nickname;
		},
		changeNicknameFailureAction: (state, action) => {
			state.changeNicknameLoading = false;
			state.changeNicknameError = action.payload;
		},
		addPostToMe: (state, action) => {
			state.me.Posts.unshift({ id: action.payload });
		},
		removePostOfMe: (state, action) => {
			state.me.Posts = state.me.Posts.filter((v) => v.id !== action.payload);
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
	removeFollowerRequestAction,
	removeFollowerSuccessAction,
	removeFollowerFailureAction,
	loadFollowersRequestAction,
	loadFollowersSuccessAction,
	loadFollowersFailureAction,
	loadFollowingsRequestAction,
	loadFollowingsSuccessAction,
	loadFollowingsFailureAction,
	changeNicknameRequestAction,
	changeNicknameSuccessAction,
	changeNicknameiailureAction,
	loadMyInfoRequestAction,
	loadMyInfoSuccessAction,
	loadMyInfoiailureAction,
	unFollowRequestAction,
	unFollowSuccessAction,
	unFollowFailureAction,
	followRequestAction,
	followSuccessAction,
	followFailureAction,
	loginRequestAction,
	loginSuccessAction,
	loginFailureAction,
	logoutRequestAction,
	logoutSuccessAction,
	logoutFailureAction,
	signupRequestAction,
	signupSuccessAction,
	signupFailureAction,
	addPostToMe,
	removePostOfMe,
} = userSlice.actions; // 액션 생성 함수

export default userSlice.reducer; // 리듀서
