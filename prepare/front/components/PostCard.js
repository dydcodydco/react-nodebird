import { Card, Popover, Button, Avatar, List } from "antd";
import { RetweetOutlined, HeartOutlined, HeartTwoTone, MessageOutlined, EllipsisOutlined } from "@ant-design/icons";
import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { removePostRequestAction } from "../reducers/post";

import PostImages from "./PostImages";
import CommentForm from "./CommentForm";
import PostCardContent from "./PostCardContent";
import Followbutton from "./FollowButton";

const PostCard = ({ post }) => {
	// const { me: {id} } = useSelector((state) => state.user);
	// const id = me && me.id;
	// const id = me?.id; // 옵셔널 체이닝 연산자
	const id = useSelector((state) => state.user.me?.id);
	const { removePostLoading } = useSelector((state) => state.post);
	const dispatch = useDispatch();
	const [liked, setLiked] = useState(false);
	const [commentFormOpend, setCommentFormOpend] = useState(false);

	const onToggleLike = useCallback(() => {
		setLiked((prevLiked) => !prevLiked);
	}, []);
	const onToggleComment = useCallback(() => {
		setCommentFormOpend((prev) => !prev);
	}, []);
	const onRemovePost = useCallback(() => {
		dispatch(removePostRequestAction({ id: post.id }));
	}, []);
	return (
		<div style={{ marginTop: 10 }}>
			<Card
				cover={post.Images[0] && <PostImages images={post.Images} />}
				actions={[
					// 배열안에 들어가는 것들은 다 key를 넣어줘야 한다.
					<RetweetOutlined key='retweet' />,
					liked ? <HeartTwoTone key='heart' twoToneColor={"#eb2f96"} onClick={onToggleLike} /> : <HeartOutlined key='heart' onClick={onToggleLike} />,
					<MessageOutlined key={"comment"} onClick={onToggleComment} />,
					<Popover
						key={"more"}
						content={
							<Button.Group>
								{id && post.User?.id === id ? (
									<>
										<Button type='primary' key='modify'>
											수정
										</Button>
										<Button type='danger' key={"delete"} onClick={onRemovePost} loading={removePostLoading}>
											삭제
										</Button>
									</>
								) : (
									<Button type='dashed' key={"report"}>
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
			>
				<Card.Meta avatar={<Avatar>{post.User?.nickname[0]}</Avatar>} title={post.User?.nickname} description={<PostCardContent postData={post.content} />} />
			</Card>
			{commentFormOpend && (
				<div>
					{/* 게시글의 아이디 위해서 post 넘겨줌 */}
					<CommentForm post={post} />
					<List
						header={`${post.Comments.length}개의 댓글`}
						itemLayout='horizontal'
						dataSource={post.Comments}
						renderItem={(item) => (
							<List.Item key={item.id}>
								<List.Item.Meta title={item.User?.nickname} avatar={<Avatar>{item.User?.nickname[0]}</Avatar>} description={item.content} />
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
	}).isRequired,
};

export default PostCard;
