import { Form, Input } from "antd";
import { useMemo } from "react";

const NicknameEditForm = () => {
	const style = useMemo(() => ({ marginTop: "20px", border: "1px solid #9d9d9d", padding: "30px" }), []);
	return (
		<Form style={style}>
			<Input.Search addonBefore='닉네임' enterButton='수정' />
		</Form>
	);
};

export default NicknameEditForm;
