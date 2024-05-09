import { Menu, Input, Row, Col } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import LoginForm from './LoginForm';
import UserProfile from './UserProfile';


const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;

const AppLayout = ({ children }) => {
  const router = useRouter();
  const { me } = useSelector((state) => state.user); // 둘중 하나 취향차이
  // const isLoggedIn = useSelector((state) => state.user.isLoggedIn); // 둘중 하나 취향차이
  // useSelector: 스토어의 상태값을 반환
  const [searchInput, setSearchInput] = useState('');
  const onChangeSearchInput = useCallback((e) => {
    setSearchInput(e.target.value);
  }, []);
  const onSearch = useCallback(() => {
    router.push(`/hashtag/${encodeURIComponent(searchInput)}`);
  }, [searchInput]);
  return (
    <div>
      <Menu
        defaultSelectedKeys={[router.pathname]}
        theme="light"
        mode="horizontal"
        items={[
          { label: <Link href="/">노드버드</Link>, key: '/' },
          { label: <Link href="/profile">프로필</Link>, key: '/profile' },
          {
            label: (
              <SearchInput
                enterButton
                value={searchInput}
                onChange={onChangeSearchInput}
                onSearch={onSearch}
              />
            ),
            key: '/search',
          },
          { label: <Link href="/signup">회원가입</Link>, key: '/signup' },
        ]}
      />
      <Row gutter={10}>
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <a
            href="https://y-chyachya.tistory.com/"
            target="_blank"
            rel="noreferrer noopener"
          >
            blog by ZzimZzim
          </a>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
  // children은 react의 node라는 타입, 화면에 그릴수있는 모든것들이 node,
  //AppLayout이 return하는 모든것에 들어갈 수 있음
};

export default AppLayout;
