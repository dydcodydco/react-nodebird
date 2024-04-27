import PropTypes from "prop-types";
import { useCallback, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

const PostImages = ({ images }) => {
	const [showImageZoom, setShowImageZoom] = useState(false);

	const onZoom = useCallback(() => {
		setShowImageZoom(true);
	}, []);

	if (images.length === 1) {
		return (
			<>
				{/* // 시각장애인을 위한 스크린리더에 정보 알려주기 (role, alt) */}
				<img
					role='presentation' // 스크린리더에서 굳이 클릭할필요를 안알려줘도 될때
					src={images[0].src}
					alt={images[0].src}
					onClick={onZoom}
				/>
			</>
		);
	}
	if (images.length === 2) {
		return (
			<>
				{/* // 시각장애인을 위한 스크린리더에 정보 알려주기 (role, alt) */}
				<img
					role='presentation' // 스크린리더에서 굳이 클릭할필요를 안알려줘도 될때
					src={images[0].src}
					alt={images[0].src}
					onClick={onZoom}
					style={{ width: "50%", display: "inline-block" }}
				/>
				<img
					role='presentation' // 스크린리더에서 굳이 클릭할필요를 안알려줘도 될때
					src={images[1].src}
					alt={images[1].src}
					onClick={onZoom}
					style={{ width: "50%", display: "inline-block" }}
				/>
			</>
		);
	}
	return (
		<div>
			<img
				role='presentation' // 스크린리더에서 굳이 클릭할필요를 안알려줘도 될때
				src={images[0].src}
				alt={images[0].src}
				onClick={onZoom}
				style={{ width: "50%" }}
			/>
			<div
				role='presentation'
				style={{
					display: "inline-block",
					width: "50%",
					textAlign: "center",
					verticalAlign: "middle",
				}}
			>
				<PlusOutlined />
				<br />
				{images.length - 1}
				개의 사진 더보기
			</div>
		</div>
	);
};

PostImages.propTypes = {
	images: PropTypes.arrayOf(PropTypes.object),
};

export default PostImages;
