import { Form, Button, Input } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { loginRequestAction } from '../reducers/user';

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
  const { logInLoading, logInError } = useSelector(state => state.user);

  useEffect(() => {
    if (logInError) {
      alert(logInError);
    }
  }, [logInError]);

  const dispatch = useDispatch();
  const onFinish = useCallback(data => {
    dispatch(
      loginRequestAction({ email: data.email, password: data.password })
    );
  }, []);

  return (
    <FormWrapper onFinish={handleSubmit(onFinish)}>
      <div>
        <label htmlFor='email'>이메일</label>
        <br />
        <Controller
          name='email'
          control={control}
          rules={{
            required: '이메일를 입력해주세요.',
            minLength: { value: 3, message: '이메일은 3자 이상입니다.' },
          }}
          render={({ field }) => (
            <>
              <Input {...field} id='email' type='email' placeholder='이메일' />
              {errors.email && <p>{errors.email.message}</p>}
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
            required: '비밀번호를 입력해주세요.',
            minLength: {
              value: 3,
              message: '비밀번호는 3자 이상입니다.',
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
        <Button htmlType='submit' type='primary' loading={logInLoading}>
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
