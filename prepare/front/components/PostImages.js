import PropTypes from "prop-types";
import { useCallback, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import ImagesZoom from "./ImagesZoom"; // 폴더를 호출하면 자동으로 index.js 찾음

const PostImages = ({ images }) => {
	const [showImageZoom, setShowImageZoom] = useState(false);

	const onZoom = useCallback(() => {
		setShowImageZoom(true);
	}, []);

	const onClose = useCallback(() => {
		setShowImageZoom(false);
	}, []);

	if (images.length === 1) {
		return (
			<>
				{/* // 시각장애인을 위한 스크린리더에 정보 알려주기 (role, alt) */}
				<img
					role='presentation' // 스크린리더에서 굳이 클릭할필요를 안알려줘도 될때
					src={`http://localhost:3065/${images[0].src}`}
					alt={images[0].src}
					onClick={onZoom}
				/>
				{showImageZoom && <ImagesZoom images={images} onClose={onClose} />}
			</>
		);
	}
	if (images.length === 2) {
		return (
			<>
				{/* // 시각장애인을 위한 스크린리더에 정보 알려주기 (role, alt) */}
				<img
					role='presentation' // 스크린리더에서 굳이 클릭할필요를 안알려줘도 될때
					src={`http://localhost:3065/${images[0].src}`}
					alt={images[0].src}
					onClick={onZoom}
					style={{ width: "50%", display: "inline-block" }}
				/>
				<img
					role='presentation' // 스크린리더에서 굳이 클릭할필요를 안알려줘도 될때
					src={`http://localhost:3065/${images[1].src}`}
					alt={images[1].src}
					onClick={onZoom}
					style={{ width: "50%", display: "inline-block" }}
				/>
				{showImageZoom && <ImagesZoom images={images} onClose={onClose} />}
			</>
		);
	}
	return (
		<>
			<div>
				<img
					role='presentation' // 스크린리더에서 굳이 클릭할필요를 안알려줘도 될때
					src={`http://localhost:3065/${images[0].src}`}
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
			{showImageZoom && <ImagesZoom images={images} onClose={onClose} />}
		</>
	);
};

PostImages.propTypes = {
	images: PropTypes.arrayOf(PropTypes.object),
};

export default PostImages;
