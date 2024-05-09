import { Card, Avatar } from 'antd';
import Head from 'next/head';
import { useSelector } from 'react-redux';

import AppLayout from '../components/AppLayout';
import { loadUser } from '../reducers/user';
import wrapper from '../store/configurStore';

const About = () => {
  const { userInfo } = useSelector((state) => state.user);
  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>

      <AppLayout>
        {userInfo ? (
          <Card
            actions={[
              <div key="twit">
                짹짹
                <br />
                {userInfo.Posts}
              </div>,
              <div key="followings">
                팔로잉
                <br />
                {userInfo.Followings}
              </div>,
              <div key="followers">
                팔로워
                <br />
                {userInfo.Followers}
              </div>,
            ]}
          >
            <Card.Meta
              avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
              title={userInfo.nickname}
            />
          </Card>
        ) : (
          <div>1</div>
        )}
      </AppLayout>
    </>
  );
};

export const getStaticProps = wrapper.getStaticProps(
  (store) =>
    async ({ req }) => {
      console.log('getStaticProps start--------------------------');
      await store.dispatch(loadUser(8));
      console.log('getStaticProps end--------------------------');
    },
);

export default About;
