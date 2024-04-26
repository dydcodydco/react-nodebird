import { Button, Card, List } from "antd";
import PropTypes from "prop-types";
import { useMemo } from "react";
import { StopOutlined } from "@ant-design/icons";

const FollowList = ({ header, data }) => {
	const style = useMemo(
		() => ({
			marginBottom: "20px",
		}),
		[]
	);
	const listGrid = useMemo(() => {
		return { gutter: 4, xs: 1, sm: 2, md: 2, lg: 3 };
	}, []);
	return (
		<List
			style={style}
			grid={listGrid}
			size='small'
			header={<div>{header}</div>}
			loadMore={
				<div style={{ textAlign: "center", margin: "10px 0" }}>
					<Button>더 보기</Button>
				</div>
			}
			bordered
			dataSource={data}
			renderItem={(item) => (
				<List.Item style={{ marginTop: 20 }}>
					<Card actions={[<StopOutlined key='stop' />]}>
						<Card.Meta description={item.nickName} />
					</Card>
				</List.Item>
			)}
		/>
	);
};

FollowList.propTypes = {
	header: PropTypes.string.isRequired,
	data: PropTypes.array.isRequired,
};

export default FollowList;
