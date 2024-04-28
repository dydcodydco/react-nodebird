import { useSelector } from "react-redux";
import AppLayout from "../components/AppLayout";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";

const Home = () => {
	const { logInDone } = useSelector((state) => state.user);
	const { mainPosts } = useSelector((state) => state.post);
	return (
		<AppLayout>
			{logInDone && <PostForm />}

			{/* 순서가 바뀌거나 삭제될 수 있는 리스트들에 key값으로 index를 쓰면 안됀다. */}
			{/* 반복문이 있고 바뀌지 않는 리스트일 경우에만 사용해도 된다. */}
			{mainPosts.map((post) => (
				<PostCard key={post.id} post={post} />
			))}
		</AppLayout>
	);
};

export default Home;
