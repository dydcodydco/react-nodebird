import { Form, Button, Input } from "antd";
import Link from "next/link";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { useForm, Controller } from "react-hook-form";

import { logIn } from "../reducers/user";

const ButtonWrapper = styled.div`
	margin-top: 10px;
`;

const FormWrapper = styled(Form)`
	padding: 10px;
`;

const LoginForm = () => {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const dispatch = useDispatch();
	const onFinish = useCallback((data) => {
		dispatch(logIn({ id: data.userId, password: data.password }));
	}, []);

	return (
		<FormWrapper onFinish={handleSubmit(onFinish)}>
			<div>
				<label htmlFor='userId'>아이디</label>
				<br />
				<Controller
					name='userId'
					control={control}
					rules={{
						required: "아이디를 입력해주세요.",
						minLength: {
							value: 3,
							message: "아이디는 3자 이상입니다.",
						},
					}}
					render={({ field }) => (
						<>
							<Input {...field} id='userId' placeholder='아이디' />
							{errors.userId && <p>{errors.userId.message}</p>}
						</>
					)}
				/>
			</div>
			<div>
				<label htmlFor='password'>비밀번호</label>
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
							<Input {...field} id='password' placeholder='비밀번호' />
							{errors.password && <p>{errors.password.message}</p>}
						</>
					)}
				/>
			</div>
			<ButtonWrapper>
				<Button htmlType='submit' type='primary' loading={false}>
					로그인
				</Button>
				<Link href='/signup'>
					<Button>회원가입</Button>
				</Link>
			</ButtonWrapper>
		</FormWrapper>
	);
};

export default LoginForm;
