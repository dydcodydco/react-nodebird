import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import useSWR from "swr";

import { loadFollowersRequestAction, loadFollowingsRequestAction, loadMyInfo } from "../reducers/user";
import AppLayout from "../components/AppLayout";
import NicknameEditForm from "../components/NicknameEditForm";
import FollowList from "../components/FollowList";
import wrapper from "../store/configurStore";

const fetcher = (url) => axios.get(url, { widthCredentials: true }).then((result) => result.data);

const Profile = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const { me } = useSelector((state) => state.user);
	const [followersLimit, setFollowersLimit] = useState(3);
	const [followingsimit, setFollowingsLimit] = useState(3);

	const { data: followersData, error: followerError } = useSWR(`http://localhost:3065/user/followers?limit=${followersLimit}`, fetcher);
	const { data: followingsData, error: followingError } = useSWR(`http://localhost:3065/user/followings?limit=${followingsimit}`, fetcher);

	useEffect(() => {
		// dispatch(loadFollowersRequestAction());
		// dispatch(loadFollowingsRequestAction());
	}, []);

	useEffect(() => {
		if (!(me && me.id)) {
			router.push("/");
		}
	}, [me && me.id]);

	const loadMoreFollowings = useCallback(() => {
		setFollowingsLimit((prev) => prev + 3);
	}, []);
	const loadMoreFolloweers = useCallback(() => {
		setFollowersLimit((prev) => prev + 3);
	}, []);

	if (!me) {
		return <div>내정보 로딩중...</div>;
	}

	if (followerError || followingError) {
		console.log("--------------------------error-----------------------------");
		console.error(followerError || followingError);
		return <div>팔로잉/팔로워 로딩 중 에러 발생...</div>;
	}
	return (
		<>
			<Head>
				<title>내 프로필 | NodeBird</title>
			</Head>
			<AppLayout>
				<NicknameEditForm />
				<FollowList header='팔로워' data={followersData} onClickMore={loadMoreFolloweers} loading={!followersData && !followerError} />
				<FollowList header='팔로잉' data={followingsData} onClickMore={loadMoreFollowings} loading={!followingsData && !followingError} />
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
