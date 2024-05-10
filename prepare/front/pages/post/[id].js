import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import AppLayout from '../../components/AppLayout';
import PostCard from '../../components/PostCard';
import { loadPost } from '../../reducers/post';
import { loadMyInfo } from '../../reducers/user';
import wrapper from '../../store/configurStore';

const Post = () => {
  const router = useRouter();
  const { id } = router.query;
  const { singlePost } = useSelector((state) => state.post);

  return (
    <AppLayout>
      {singlePost ? (
        <>
          <Head>
            <title>
              {singlePost?.User.nickname}
              님의 글
            </title>
            <meta name="description" content={singlePost.content} />
            <meta
              property="og:title"
              content={`${singlePost.User.nickname}님의 게시글`}
            />
            <meta property="og:description" content={singlePost.content} />
            <meta
              property="og:image"
              content={
                singlePost.Images[0]
                  ? singlePost.Images[0].src
                  : 'https://nodebird.com/favicon.ico'
              }
            />
            <meta
              property="og:url"
              content={`https://nodebird.com/post/${id}`}
            />
          </Head>
          <PostCard post={singlePost}>{id}번 게시글</PostCard>
        </>
      ) : (
        <div>존재하지 않는 게시물입니다.</div>
      )}
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, params }) => {
      const cookie = req ? req.headers.cookie : '';
      axios.defaults.headers.Cookie = '';
      // 쿠키가 브라우저에 있는경우만 넣어서 실행
      // (주의, 아래 조건이 없다면 다른 사람으로 로그인 될 수도 있음)
      if (req && cookie) {
        axios.defaults.headers.Cookie = cookie;
      }

      await store.dispatch(loadMyInfo());
      await store.dispatch(loadPost(params.id));
    },
);

export default Post;
