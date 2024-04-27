import PropTypes from "prop-types";
import { Form, Input, Button } from "antd";
import { useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { useCallback } from "react";

const CommentForm = ({ post }) => {
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm();
	const id = useSelector((state) => {
		return state.user.me?.id;
	}, []);
	const onSubmit = useCallback(
		(data) => {
			console.log("userId=", id, "postId=", post.id, data);
		},
		[id, post]
	);
	return (
		<Form onFinish={handleSubmit(onSubmit)}>
			<Form.Item>
				<Controller
					name='commentInput'
					control={control}
					rules={{
						required: "댓글을 입력해주세요.",
					}}
					render={({ field }) => (
						<>
							<Input.TextArea {...field} placeholder='댓글을 입력해주세요.' />
							{errors.commentInput && <p>{errors.commentInput.message}</p>}
						</>
					)}
				/>
				<Button type='primary' htmlType='submit'>
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
		createdAt: PropTypes.object,
		Comment: PropTypes.arrayOf(PropTypes.object),
		Images: PropTypes.arrayOf(PropTypes.object),
	}).isRequired,
};

export default CommentForm;
