import PropTypes from 'prop-types';
import { useState } from 'react';
import Slick from 'react-slick';
import { Overlay, Global, SlickWrapper, Header, CloseBtn, ImageWrapper, Indicator } from './styles';
import { backUrl } from '../../config/config';

// 컴포넌트가 복잡해지면 폴더만들고 그 안에 index.js 만드는 경우가 더 많아진다.
const ImagesZoom = ({ images, onClose }) => {
	// console.log(images);
	const [currentSlide, setCurrentSlide] = useState(0);
	return (
		<Overlay>
			<Global />
			<Header>
				<h1>상세 이미지</h1>
				<CloseBtn onClick={onClose}>X</CloseBtn>
			</Header>
			<SlickWrapper>
				<div>
					<Slick initialSlide={0} beforeChange={(slide) => setCurrentSlide(slide)} infinite arrows={false} slidesToShow={1} slidesToScroll={1}>
						{images.map((v) => (
							<ImageWrapper key={v.src}>
								<img src={`${backUrl}/${v.src}`} alt={v.src} />
							</ImageWrapper>
						))}
					</Slick>
					<Indicator>
						<div>
							{currentSlide + 1} / {images.length}
						</div>
					</Indicator>
				</div>
			</SlickWrapper>
		</Overlay>
	);
};

ImagesZoom.propTypes = {
	images: PropTypes.arrayOf(PropTypes.object).isRequired,
	onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;
