import { Card, Avatar, Button } from "antd";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { logOut } from "../reducers/user";

const UserProfile = () => {
	const dispatch = useDispatch();
	const onLogOut = useCallback(() => {
		dispatch(logOut());
	}, []);
	return (
		<>
			<Card
				actions={[
					<div key='twit'>
						짹짹
						<br />0
					</div>,
					<div key='followings'>
						팔로잉
						<br />0
					</div>,
					<div key='followers'>
						팔로워
						<br />0
					</div>,
				]}
			>
				<Card.Meta avatar={<Avatar>ZZ</Avatar>} title={"ZzimZzim"} />
				<Button onClick={onLogOut}>로그아웃</Button>
			</Card>
		</>
	);
};

export default UserProfile;
