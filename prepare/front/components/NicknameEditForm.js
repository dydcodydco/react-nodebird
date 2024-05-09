import { Form, Input } from 'antd';
import { useCallback, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { changeNicknameRequestAction } from '../reducers/user';

const NicknameEditForm = () => {
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const style = useMemo(
    () => ({ marginTop: '20px', border: '1px solid #9d9d9d', padding: '30px' }),
    []
  );

  const onSubmit = useCallback(data => {
    dispatch(changeNicknameRequestAction(data));
    reset();
  }, []);
  return (
    <Form style={style} onFinish={handleSubmit(onSubmit)}>
      <Controller
        name='nickname'
        control={control}
        rules={{
          required: '변경할 닉네임을 입력해주세요.',
          minLength: { value: 2, message: '닉네임은 2글자 이상 가능합니다.' },
        }}
        render={({ field }) => {
          return (
            <>
              <Input.Search
                {...field}
                addonBefore='닉네임'
                onSearch={onSubmit}
                enterButton='수정'
                placeholder='변경할 닉네임 입력해주세요.'
              />
              {errors.nickname && <p>{errors.nickname.message}</p>}
            </>
          );
        }}
      />
    </Form>
  );
};

export default NicknameEditForm;
