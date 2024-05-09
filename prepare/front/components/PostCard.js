import { Card, Popover, Button, Avatar, List } from 'antd';
import {
  RetweetOutlined,
  HeartOutlined,
  HeartTwoTone,
  MessageOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Link from 'next/link';
import dayjs from 'dayjs';

import {
  removePostRequestAction,
  likePostRequestAction,
  unLikePostRequestAction,
  retweetRequestAction,
} from '../reducers/post';
import PostImages from './PostImages';
import CommentForm from './CommentForm';
import PostCardContent from './PostCardContent';
import Followbutton from './FollowButton';

dayjs.locale('ko');

const PostCard = ({ post }) => {
  // const { me: {id} } = useSelector((state) => state.user);
  // const id = me && me.id;
  // const id = me?.id; // 옵셔널 체이닝 연산자
  const { removePostLoading } = useSelector(state => state.post);
  const dispatch = useDispatch();
  const [commentFormOpend, setCommentFormOpend] = useState(false);

  const id = useSelector(state => state.user.me?.id);
  const liked = post.Likers.find(d => d.id === id);

  const onLike = useCallback(() => {
    if (!id) {
      alert('로그인이 필요합니다.');
    }
    dispatch(likePostRequestAction(post.id));
  }, [id]);
  const onUnLike = useCallback(() => {
    if (!id) {
      alert('로그인이 필요합니다.');
    }
    dispatch(unLikePostRequestAction(post.id));
  }, [id]);
  const onToggleComment = useCallback(() => {
    setCommentFormOpend(prev => !prev);
  }, []);
  const onRemovePost = useCallback(() => {
    if (!id) {
      alert('로그인이 필요합니다.');
    }
    dispatch(removePostRequestAction({ id: post.id }));
  }, [id]);
  const onRetweet = useCallback(() => {
    if (!id) {
      alert('로그인이 필요합니다.');
    }
    dispatch(retweetRequestAction(post.id));
  }, [id]);
  return (
    <div style={{ marginTop: 10 }}>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          // 배열안에 들어가는 것들은 다 key를 넣어줘야 한다.
          <RetweetOutlined key='retweet' onClick={onRetweet} />,
          liked ? (
            <HeartTwoTone
              key='heart'
              twoToneColor={'#eb2f96'}
              onClick={onUnLike}
            />
          ) : (
            <HeartOutlined key='heart' onClick={onLike} />
          ),
          <MessageOutlined key={'comment'} onClick={onToggleComment} />,
          <Popover
            key={'more'}
            content={
              <Button.Group>
                {id && post.User?.id === id ? (
                  <>
                    <Button type='primary' key='modify'>
                      수정
                    </Button>
                    <Button
                      type='danger'
                      key={'delete'}
                      onClick={onRemovePost}
                      loading={removePostLoading}
                    >
                      삭제
                    </Button>
                  </>
                ) : (
                  <Button type='dashed' key={'report'}>
                    신고
                  </Button>
                )}
              </Button.Group>
            }
          >
            <EllipsisOutlined />
          </Popover>,
        ]}
        extra={id && <Followbutton post={post} />}
        title={
          post.RetweetId ? `${post.User.nickname}님이 리트윗하셨습니다.` : null
        }
      >
        {post.RetweetId && post.Retweet ? (
          <Card
            cover={
              post.Retweet.Images[0] && (
                <PostImages images={post.Retweet.Images} />
              )
            }
          >
            <div style={{ float: 'right' }}>
              {dayjs(post.createdAt).format('YYYY.MM.DD')}
            </div>
            <Card.Meta
              avatar={
                <Link href={`/user/${post.Retweet.User.id}`}>
                  <Avatar>{post.Retweet.User?.nickname[0]}</Avatar>
                </Link>
              }
              title={post.Retweet.User?.nickname}
              description={<PostCardContent postData={post.Retweet.content} />}
            />
          </Card>
        ) : (
          <>
            <div style={{ float: 'right' }}>
              {dayjs(post.createdAt).format('YYYY.MM.DD')}
            </div>
            <Card.Meta
              avatar={
                <Link href={`/user/${post.User.id}`}>
                  <Avatar>{post.User?.nickname[0]}</Avatar>
                </Link>
              }
              title={post.User?.nickname}
              description={<PostCardContent postData={post.content} />}
            />
          </>
        )}
      </Card>
      {commentFormOpend && (
        <div>
          {/* 게시글의 아이디 위해서 post 넘겨줌 */}
          <CommentForm post={post} />
          <List
            header={`${post.Comments.length}개의 댓글`}
            itemLayout='horizontal'
            dataSource={post.Comments}
            renderItem={item => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  title={item.User.nickname}
                  avatar={
                    <Link href={`/user/${item.User.id}`}>
                      <Avatar>{item.User.nickname[0]}</Avatar>
                    </Link>
                  }
                  description={item.content}
                />
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    Likers: PropTypes.arrayOf(PropTypes.object),
    RetweetId: PropTypes.number,
    Retweet: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
};

export default PostCard;
