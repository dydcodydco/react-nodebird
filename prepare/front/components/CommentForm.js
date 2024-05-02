import PropTypes from "prop-types";
import { Form, Input, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { useCallback, useEffect } from "react";
import { addCommentRequestAction } from "../reducers/post";

const CommentForm = ({ post }) => {
	const {
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm();
	const { addCommentDone, addCommentLoading } = useSelector((state) => state.post);
	const id = useSelector((state) => state.user.me?.id);
	const dispatch = useDispatch();

	useEffect(() => {
		if (addCommentDone) reset();
	}, [addCommentDone]);

	const onSubmit = useCallback(
		(data) => {
			dispatch(addCommentRequestAction({ postId: post.id, userId: id, content: data.contentText }));
		},
		[id]
	);
	return (
		<Form onFinish={handleSubmit(onSubmit)}>
			<Form.Item>
				<Controller
					name='contentText'
					control={control}
					rules={{
						required: "댓글을 입력해주세요.",
					}}
					render={({ field }) => (
						<>
							<Input.TextArea {...field} placeholder='댓글을 입력해주세요.' />
							{errors.contentText && <p>{errors.contentText.message}</p>}
						</>
					)}
				/>
				<Button type='primary' htmlType='submit' loading={addCommentLoading} style={{ position: "absolute", right: 0, bottom: -40, zIndex: 1 }}>
					댓글달기
				</Button>
			</Form.Item>
		</Form>
	);
};

CommentForm.propTypes = {
	post: PropTypes.shape({
		id: PropTypes.number,
		User: PropTypes.object,
		content: PropTypes.string,
		createdAt: PropTypes.string,
		Comment: PropTypes.arrayOf(PropTypes.object),
		Images: PropTypes.arrayOf(PropTypes.object),
	}).isRequired,
};

export default CommentForm;
