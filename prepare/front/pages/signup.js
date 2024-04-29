import { Form, Input, Button, Checkbox } from "antd";
import Head from "next/head";
import { useCallback } from "react";
import { useForm, Controller } from "react-hook-form";

import AppLayout from "../components/AppLayout";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { signupRequestAction } from "../reducers/user";

const ButtonWrapper = styled.div`
	margin-top: 10px;
`;

const ErrorMessage = styled.p`
	color: orange;
`;

const Signup = () => {
	const { control, handleSubmit, formState: { errors } } = useForm();
	const { signUpLoading } = useSelector((state) => state.user);
	const dispatch = useDispatch();

	const onSubmit = useCallback((data) => {
		console.log(data);
		dispatch(signupRequestAction(data));
	}, []);
	return (
		<>
			<AppLayout>
				<Head>
					<title>회원가입 | Nodebird</title>
				</Head>
				<Form onFinish={handleSubmit(onSubmit)}>
					<div>
						<label htmlFor='email'>아이디</label>
						<br />
						<Controller
							name='email'
							control={control}
							rules={{
								required: "이메일를 입력해주세요.",
								minLength: {
									value: 3,
									message: "이메일은 3자 이상입니다.",
								},
							}}
							render={({ field }) => (
								<>
									<Input
										{...field}
										id='email'
										type='email'
										placeholder='이메일'
									/>
									{errors.email && (
										<ErrorMessage>{errors.email.message}</ErrorMessage>
									)}
								</>
							)}
						/>
					</div>

					<div>
						<label htmlFor='nickname'>닉네임</label>
						<br />
						<Controller
							name='nickname'
							control={control}
							rules={{
								required: "닉네임를 입력해주세요.",
								minLength: {
									value: 3,
									message: "닉네임는 3자 이상입니다.",
								},
							}}
							render={({ field }) => (
								<>
									<Input {...field} id='nickname' placeholder='닉네임' />
									{errors.nickname && (
										<ErrorMessage>{errors.nickname.message}</ErrorMessage>
									)}
								</>
							)}
						/>
					</div>

					<div>
						<label htmlFor='signPassword'>비밀번호</label>
						<br />
						<Controller
							name='password'
							control={control}
							rules={{
								required: "비밀번호를 입력해주세요.",
								minLength: {
									value: 3,
									message: "비밀번호는 3자 이상입니다.",
								},
							}}
							render={({ field }) => (
								<>
									<Input.Password
										id='signPassword'
										{...field}
										placeholder='비밀번호'
									/>
									{errors.password && (
										<ErrorMessage>{errors.password.message}</ErrorMessage>
									)}
								</>
							)}
						/>
					</div>

					<div>
						<label htmlFor='passwordCheck'>비밀번호 확인</label>
						<br />
						<Controller
							name='passwordCheck'
							control={control}
							rules={{
								required: "비밀번호를 확인해주세요.",
								validate: (value, formValues) => {
									return (
										value === formValues.password ||
										"비밀번호가 일치하지 않습니다."
									);
								},
							}}
							render={({ field }) => {
								return (
									<>
										<Input.Password
											id='passwordCheck'
											{...field}
											placeholder='비밀번호'
										/>
										{errors.passwordCheck && (
											<ErrorMessage>
												{errors.passwordCheck.message}
											</ErrorMessage>
										)}
									</>
								);
							}}
						/>
					</div>

					<div>
						<Controller
							name='term'
							control={control}
							rules={{
								required: { value: true, message: "약관에 동의하셔야 합니다." },
							}}
							render={({ field }) => (
								<Checkbox {...field} checked={field.value}>
									이런저런 가입내용을 동의합니다.
								</Checkbox>
							)}
						/>
						{errors.term && <ErrorMessage>{errors.term.message}</ErrorMessage>}
					</div>

					<ButtonWrapper>
						<Button htmlType='submit' type='primary' loading={signUpLoading}>
							가입하기
						</Button>
					</ButtonWrapper>
				</Form>
			</AppLayout>
		</>
	);
};

export default Signup;
