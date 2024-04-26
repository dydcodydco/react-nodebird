import { Button, Form, Input } from "antd";
import { useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addPost } from "../reducers/post";
import { Controller, useForm } from "react-hook-form";

const PostForm = () => {
	const inputFileRef = useRef(null);
	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const { imagePaths } = useSelector((state) => state.post);
	const dispatch = useDispatch();
	const onFinish = useCallback((data) => {
		console.log(data);
		dispatch(addPost());
	}, []);

	const onClickImageUpload = useCallback(() => {
		inputFileRef.current.click();
	}, [inputFileRef.current]);

	// ref를 register에서 따로 꺼내기
	const { ref: registerRef, ...rest } = register("imageInput");
	const fileUploadHandler = (e) => {
		// 업로드한 파일 가져오기
		const file = e.target.files?.[0];
		if (file) {
			const binaryData = [file];
			const urlImage = URL.createObjectURL(
				new Blob(binaryData, { type: "image" })
			);
		}
	};
	return (
		<Form
			style={{ margin: "10px 0 20px" }}
			encType='multipart/form-data'
			onFinish={handleSubmit(onFinish)}
		>
			<Controller
				name='content'
				control={control}
				rules={{
					required: "내용을 적어주세요.",
				}}
				render={({ field }) => (
					<>
						<Input.TextArea
							{...field}
							maxLength={140}
							placeholder='어떤 신기한 일이 있었나요?'
						/>
						{errors.content && <p>{errors.content.message}</p>}
					</>
				)}
			/>
			<div>
				<input
					{...register("file")}
					type='file'
					accept='image/*'
					multiple
					hidden
					ref={inputFileRef}
				/>

				<input
					{...rest}
					type='file'
					ref={(e) => {
						// registerRef를 통해 react-hook-form이 이 input의 ref를 추적할 수 있다
						registerRef(e);
						inputFileRef.current = e;
					}}
					name='imageInput'
					onChange={fileUploadHandler}
				/>

				<Button onClick={onClickImageUpload}>이미지 업로드</Button>
				<Button type='primary' style={{ float: "right" }} htmlType='submit'>
					작성하기
				</Button>
			</div>
			<div>
				{imagePaths.map((v) => (
					<div key={v} style={{ display: "inline-block" }}>
						<img src={v} style={{ width: "200px" }} />
						<div>
							<Button>제거</Button>
						</div>
					</div>
				))}
			</div>
		</Form>
	);
};

export default PostForm;