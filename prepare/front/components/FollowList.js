import { Button, Card, List } from 'antd';
import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { StopOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { unFollowRequestAction, removeFollowerRequestAction } from '../reducers/user';

const FollowList = ({ header, data, onClickMore, loading }) => {
	const dispatch = useDispatch();

	const style = useMemo(
		() => ({
			marginBottom: '20px',
		}),
		[]
	);
	const listGrid = useMemo(() => {
		return { gutter: 4, xs: 1, sm: 2, md: 2, lg: 3 };
	}, []);

	const onCancel = useCallback(
		(id) => () => {
			if (header === '팔로잉') {
				dispatch(unFollowRequestAction(id));
			} else {
				dispatch(removeFollowerRequestAction(id));
			}
		},
		[]
	);
	return (
		<List
			style={style}
			grid={listGrid}
			size='small'
			header={<div>{header}</div>}
			loadMore={
				<div style={{ textAlign: 'center', margin: '10px 0' }}>
					<Button onClick={onClickMore} loading={loading}>
						더 보기
					</Button>
				</div>
			}
			bordered
			dataSource={data}
			renderItem={(item) => (
				<List.Item style={{ marginTop: 20 }}>
					<Card actions={[<StopOutlined key='stop' onClick={onCancel(item.id)} />]}>
						<Card.Meta description={item.nickname} />
					</Card>
				</List.Item>
			)}
		/>
	);
};

FollowList.propTypes = {
	header: PropTypes.string.isRequired,
	data: PropTypes.array.isRequired,
	onClickMore: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
};

export default FollowList;
