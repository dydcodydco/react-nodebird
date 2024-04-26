import { Card, Popover, Button, Avatar } from "antd";
import {
	RetweetOutlined,
	HeartOutlined,
	HeartTwoTone,
	MessageOutlined,
	EllipsisOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import PostImages from "../components/PostImages";
import { useState, useCallback } from "react";

const PostCard = ({ post }) => {
	const [liked, setLiked] = useState(false);
	const [commentFormOpend, setCommentFormOpend] = useState(false);

	// const { me: {id} } = useSelector((state) => state.user);
	// const id = me && me.id;
	// const id = me?.id; // 옵셔널 체이닝 연산자
	const id = useSelector((state) => state.user.me?.id);

	const onToggleLike = useCallback(() => {
		setLiked((prevLiked) => !prevLiked);
	}, []);
	const onToggleComment = useCallback(() => {
		setCommentFormOpend((prev) => !prev);
	}, []);
	return (
		<div style={{ marginTop: 10 }}>
			<Card
				cover={post.Images[0] && <PostImages images={post.images} />}
				actions={[
					// 배열안에 들어가는 것들은 다 key를 넣어줘야 한다.
					<RetweetOutlined key='retweet' />,
					liked ? (
						<HeartTwoTone
							key='heart'
							twoToneColor={"#eb2f96"}
							onClick={onToggleLike}
						/>
					) : (
						<HeartOutlined key='heart' onClick={onToggleLike} />
					),
					<MessageOutlined key={"comment"} onClick={onToggleComment} />,
					<Popover
						key={"more"}
						content={
							<Button.Group>
								{id && post.User.id === id ? (
									<>
										<Button type='primary' key='modify'>
											수정
										</Button>
										<Button type='danger' key={"delete"}>
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
			>
				<Card.Meta
					avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
					title={post.User.nickname}
					description={post.content}
				/>
			</Card>
			{commentFormOpend && <div>댓글 부분</div>}
			{/* <CommentForm />
				<Comments /> */}
		</div>
	);
};

PostCard.propTypes = {
	post: PropTypes.shape({
		id: PropTypes.number,
		User: PropTypes.object,
		content: PropTypes.string,
		createdAt: PropTypes.object,
		Comment: PropTypes.arrayOf(PropTypes.object),
		Images: PropTypes.arrayOf(PropTypes.object),
	}).isRequired,
};

export default PostCard;
