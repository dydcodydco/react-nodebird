import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadFollowersRequestAction, loadFollowingsRequestAction, loadMyInfoRequestAction } from "../reducers/user";

import AppLayout from "../components/AppLayout";
import NicknameEditForm from "../components/NicknameEditForm";
import FollowList from "../components/FollowList";
import { useRouter } from "next/router";

const Profile = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const { me } = useSelector((state) => state.user);

	useEffect(() => {
		if (!me) {
			dispatch(loadMyInfoRequestAction());
		}
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

export default Profile;
