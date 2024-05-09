import { useDispatch, useSelector } from 'react-redux';
import AppLayout from '../components/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { useEffect } from 'react';
import { loadPosts, loadPostsError } from '../reducers/post';
import { loadMyInfo } from '../reducers/user';
import wrapper from '../store/configurStore';
import axios from 'axios';

// 프론트, 브라우저 같이 실행
const Home = () => {
  const { me } = useSelector(state => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } =
    useSelector(state => state.post);
  const dispatch = useDispatch();

  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  // useEffect(() => {
  // 	dispatch(loadPostsRequestAction());
  // 	dispatch(loadMyInfoRequestAction());
  // }, []);

  useEffect(() => {
    const onScroll = () => {
      // window.scrollY : 스크롤 얼마나 내렸는지
      // document.documentElement.clientHeight: 화면 보이는 길이
      // document.documentelement.scrollHeight: 화면 스크롤의 총 길이
      // console.log(window.scrollY, document.documentElement.clientHeight, document.documentElement.scrollHeight);
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch(loadPosts({ lastId, limit: 10 }));
        }
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePosts, loadPostsLoading, mainPosts.length]);

  return (
    <AppLayout>
      {me && <PostForm />}

      {/* 순서가 바뀌거나 삭제될 수 있는 리스트들에 key값으로 index를 쓰면 안됀다. */}
      {/* 반복문이 있고 바뀌지 않는 리스트일 경우에만 사용해도 된다. */}
      {mainPosts && mainPosts[0]
        ? mainPosts.map(post => <PostCard key={post.id} post={post} />)
        : null}
    </AppLayout>
  );
};

// SSR (프론트 서버에서 실행)
// Home컴포넌트보다 먼저 실행된다. 서버에서 서버로 요청보내는거라 브라우저가 간섭못함
// 화면을 그리기전에 서버에서 먼저 실행하는 함수
// 이 부분이 실행된 결과를 HYDRATE로 보내준다.
export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ req }) => {
      console.log('getServerSideProps start--------------------------');
      console.log(req.headers);
      const cookie = req ? req.headers.cookie : '';
      axios.defaults.headers.Cookie = '';
      // 쿠키가 브라우저에 있는경우만 넣어서 실행
      // (주의, 아래 조건이 없다면 다른 사람으로 로그인 될 수도 있음)
      if (req && cookie) {
        axios.defaults.headers.Cookie = cookie;
      }
      await store.dispatch(loadPosts());
      await store.dispatch(loadMyInfo());
      console.log('getServerSideProps end--------------------------');

      // store.dispatch(loadPosts());
      // store.dispatch(loadMyInfoRequestAction());
      // store.dispatch(END);
      // await store.sagaTask.toPromise(); // 사가 작업 완료 대기
      // console.log("state--------------------------------", store.getState());
    }
);

// export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
// 	// const cookie = req ? req.headers.cookie : "";
// 	// axios.defaults.headers.Cookie = "";
// 	// // 쿠키가 브라우저에 있는경우만 넣어서 실행
// 	// // (주의, 아래 조건이 없다면 다른 사람으로 로그인 될 수도 있음)
// 	// if (req && cookie) {
// 	// 	axios.defaults.headers.Cookie = cookie;
// 	// }
// 	await store.dispatch(loadPostsRequestAction());
// 	await store.dispatch(loadMyInfoRequestAction());
// 	console.log("state", store.getState());
// });

export default Home;
