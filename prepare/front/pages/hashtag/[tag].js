import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

import { loadMyInfo } from '../../reducers/user';
import AppLayout from '../../components/AppLayout';
import PostCard from '../../components/PostCard';
import { loadHashtagPosts } from '../../reducers/post';
import wrapper from '../../store/configurStore';

// 프론트, 브라우저 같이 실행
const Home = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { tag } = router.query;
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector(
    state => state.post
  );

  useEffect(() => {
    const onScroll = () => {
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch(loadHashtagPosts({ lastId, limit: 10, tag }));
        }
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePosts, loadPostsLoading, mainPosts.length, tag]);

  return (
    <AppLayout>
      {loadPostsLoading && <div>로딩중 입니다.</div>}
      {mainPosts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayout>
  );
};

// SSR (프론트 서버에서 실행)
// Home컴포넌트보다 먼저 실행된다. 서버에서 서버로 요청보내는거라 브라우저가 간섭못함
// 화면을 그리기전에 서버에서 먼저 실행하는 함수
// 이 부분이 실행된 결과를 HYDRATE로 보내준다.
export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ req, params }) => {
      console.log(req.headers);
      const cookie = req ? req.headers.cookie : '';
      axios.defaults.headers.Cookie = '';
      // 쿠키가 브라우저에 있는경우만 넣어서 실행
      // (주의, 아래 조건이 없다면 다른 사람으로 로그인 될 수도 있음)
      if (req && cookie) {
        axios.defaults.headers.Cookie = cookie;
      }
      await store.dispatch(loadHashtagPosts({ tag: params.tag }));
      await store.dispatch(loadMyInfo());
    }
);

export default Home;
