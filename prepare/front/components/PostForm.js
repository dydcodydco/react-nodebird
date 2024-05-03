import { Button, Form, Input } from "antd";
import { useCallback, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addPostRequestAction, uploadImagesRequestAction, removeImageAction } from "../reducers/post";
import { Controller, useForm } from "react-hook-form";

const PostForm = () => {
	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();
	const { imagePaths, addPostDone, addPostError } = useSelector((state) => state.post);
	const dispatch = useDispatch();

	useEffect(() => {
		if (addPostDone) {
			reset();
		}
	}, [addPostDone]);

	useEffect(() => {
		if (addPostError) {
			alert(addPostError);
		}
	}, [addPostError]);

	const onSubmit = useCallback(
		(data) => {
			const formData = new FormData();
			imagePaths.forEach((d) => {
				formData.append("image", d);
			});
			formData.append("content", data.content);
			return dispatch(addPostRequestAction(formData));
			// dispatch(addPostRequestAction({ text: data.content, images: data.images, }));
		},
		[imagePaths]
	);

	const imageInput = useRef(null);
	const onClickImageUpload = useCallback(() => {
		imageInput.current.click();
	}, [imageInput.current]);

	// ref를 register에서 따로 꺼내기
	// const { ref: registerRef, ...rest } = register("image");
	const onChangeImages = useCallback((e) => {
		// 업로드한 파일 가져오기
		// const file = e.target.files?.[0];
		// if (file) {
		// 	const binaryData = [file];
		// 	const urlImage = URL.createObjectURL(new Blob(binaryData, { type: "image" }));
		// }

		// multipart형식으로 서버에 보내려면 formData로 보내야한다.
		// multipart로 보내야 multer가 처리할 수 있다.
		console.log(e.target.files);
		const imageFormData = new FormData();
		// e.target.files는 유사배열, 배열모양을 띄는 객체
		[].forEach.call(e.target.files, (d) => {
			imageFormData.append("image", d);
		});

		dispatch(uploadImagesRequestAction(imageFormData));
	});

	const onRemoveImage = useCallback((index) => () => {
		dispatch(removeImageAction(index));
	});
	return (
		<Form style={{ margin: "10px 0 20px" }} encType='multipart/form-data' onFinish={handleSubmit(onSubmit)}>
			<Controller
				name='content'
				control={control}
				rules={{
					required: "내용을 적어주세요.",
				}}
				render={({ field }) => (
					<>
						<Input.TextArea {...field} maxLength={140} placeholder='어떤 신기한 일이 있었나요?' />
						{errors.content && <p>{errors.content.message}</p>}
					</>
				)}
			/>
			<div>
				<input type='file' name='image' multiple ref={imageInput} onChange={onChangeImages} />

				<Button onClick={onClickImageUpload}>이미지 업로드</Button>
				<Button type='primary' style={{ float: "right" }} htmlType='submit'>
					작성하기
				</Button>
			</div>
			<div>
				{imagePaths.map((v, i) => (
					<div key={v} style={{ display: "inline-block" }}>
						<img src={`http://localhost:3065/${v}`} style={{ width: "200px" }} />
						<div>
							<Button onClick={onRemoveImage(i)}>제거</Button>
						</div>
					</div>
				))}
			</div>
		</Form>
	);
};

export default PostForm;
