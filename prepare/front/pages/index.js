import { useDispatch, useSelector } from "react-redux";
import AppLayout from "../components/AppLayout";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { useEffect } from "react";
import { loadPostsRequestAction } from "../reducers/post";

const Home = () => {
	const { me } = useSelector((state) => state.user);
	const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector((state) => state.post);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(loadPostsRequestAction(10));
	}, []);

	useEffect(() => {
		const onScroll = () => {
			// console.log(window.scrollY, document.documentElement.clientHeight, document.documentElement.scrollHeight);
			if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
				if (hasMorePosts && !loadPostsLoading) {
					dispatch(loadPostsRequestAction(10));
				}
			}
		};

		window.addEventListener("scroll", onScroll);
		return () => {
			window.removeEventListener("scroll", onScroll);
		};
	}, [hasMorePosts, loadPostsLoading]);

	return (
		<AppLayout>
			{me && <PostForm />}

			{/* 순서가 바뀌거나 삭제될 수 있는 리스트들에 key값으로 index를 쓰면 안됀다. */}
			{/* 반복문이 있고 바뀌지 않는 리스트일 경우에만 사용해도 된다. */}
			{mainPosts.map((post) => (
				<PostCard key={post.id} post={post} />
			))}
		</AppLayout>
	);
};

export default Home;
