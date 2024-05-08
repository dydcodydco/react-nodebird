import styled, { createGlobalStyle } from 'styled-components';
import { CloseOutlined } from '@ant-design/icons';

// 해당문법은 자바스크립트 문법
// 함수 호출 방법은 func(), func`` 이렇게 호출도 가능하다.
// styled.div가 함수 이를 ``으로 호출한것이다. 함수를 호출하는 문법
// `` -> 템플릿 리터럴 ,  아래는 그래서 태그드 템플릿 리터럴 es6, es2015
export const Overlay = styled.div`
	position: fixed;
	z-index: 5000;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
`;

export const Header = styled.header`
	height: 44px;
	background: white;
	position: relative;
	padding: 0;
	text-align: center;

	& h1 {
		margin: 0;
		font-size: 17px;
		color: #333;
		line-height: 44px;
	}
`;

export const SlickWrapper = styled.div`
	height: calc(100% - 44px);
	background-color: #090909;
`;

export const ImageWrapper = styled.div`
	padding: 32px;
	text-align: center;

	& img {
		margin: 0 auto;
		max-height: 750px;
	}
`;

export const Indicator = styled.div`
	text-align: center;

	& > div {
		width: 75px;
		height: 30px;
		line-height: 30px;
		border-radius: 15px;
		background-color: #313131;
		display: inline-block;
		text-align: center;
		color: white;
		font-size: 15px;
	}
`;

// 이미 정해져있는 클레스 (예: react-slick 플러그인의 태그의 클래스 .slick, .slick-list, ... )
// 들을 새로운 스타일로 덮어씌울 수 있다.
// 사용은 return 값 중 아무데나 넣으면 된다.
// styled.div같은 경우들은 로컬 스코프를 가진다. 그래서 클래스명이 고유한것으로 바뀌어지고 중복되지 않는데
// createGlobalStyled은 전역적으로 들어가고 클래스명이 바꾸지 않는다.
export const Global = createGlobalStyle`
	.slick-slide {
		display: inline-block;
	}
`;

export const CloseBtn = styled(CloseOutlined)`
	position: absolute;
	right: 0;
	top: 0;
	padding: 15px;
	line-height: 14px;
	cursor: pointer;
`;
