import PropTypes from 'prop-types';
import { Button } from 'antd';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unFollowRequestAction, followRequestAction } from '../reducers/user';

const FollowButton = ({ post }) => {
  const { me, followLoading, unFollowLoading } = useSelector(
    state => state.user
  );
  const dispatch = useDispatch();

  const isFollowing = me?.Followings.find(v => v.id === post.User.id);
  // const isFollowing = me && me.Followings.find((v) => v.id === post.User.id);

  const onClickButton = useCallback(() => {
    if (isFollowing) {
      dispatch(unFollowRequestAction(post.User.id));
    } else {
      dispatch(followRequestAction(post.User.id));
    }
  }, [isFollowing]);

  if (me.id === post.User.id) {
    return null;
  }
  return (
    <Button loading={followLoading || unFollowLoading} onClick={onClickButton}>
      {isFollowing ? '언팔로우' : '팔로우'}
    </Button>
  );
};

FollowButton.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Comment: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default FollowButton;
