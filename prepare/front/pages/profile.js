import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadFollowersRequestAction, loadFollowingsRequestAction, loadMyInfo } from "../reducers/user";
import wrapper from "../store/configurStore";

import AppLayout from "../components/AppLayout";
import NicknameEditForm from "../components/NicknameEditForm";
import FollowList from "../components/FollowList";
import { useRouter } from "next/router";

const Profile = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const { me } = useSelector((state) => state.user);

	useEffect(() => {
		dispatch(loadFollowersRequestAction());
		dispatch(loadFollowingsRequestAction());
	}, []);

	useEffect(() => {
		if (!(me && me.id)) {
			router.push("/");
		}
	}, [me && me.id]);

	if (!me) {
		return null;
	}
	return (
		<>
			<Head>
				<title>내 프로필 | NodeBird</title>
			</Head>
			<AppLayout>
				<NicknameEditForm />
				<FollowList header='팔로잉' data={me.Followings} />
				<FollowList header='팔로워' data={me.Followers} />
			</AppLayout>
		</>
	);
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
	console.log("getServerSideProps start--------------------------");
	console.log(req.headers);
	const cookie = req ? req.headers.cookie : "";
	axios.defaults.headers.Cookie = "";
	if (req && cookie) {
		axios.defaults.headers.Cookie = cookie;
	}
	await store.dispatch(loadMyInfo());
	console.log("getServerSideProps end--------------------------");
});
export default Profile;
