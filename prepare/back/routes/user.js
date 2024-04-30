const express = require("express");
const { User } = require("../models");
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/", async (req, res, next) => {
	try {
		const { email, nickname, password } = req.body;
		const exUser = await User.findOne({
			where: {
				email,
			},
		});
		if (exUser) {
			// 원래 응답에는 데이터를 보낼 수 있지만
			// 요청/응답은 헤더 ( 상태, 용량, 시간, 쿠키 ) 와 바디 ( 데이터 ) 로 구성되어있다.
			// 실제 데이터는 body, 그에 대한 정보는 header에
			// 200 - 성공 / 300 - 리다이렉트 / 400 - 클라이언트 에러 / 500 - 서버 에러
			return res.status(403).send("이미 사용 중인 아이디입니다.");
		}
		// 테이블안에 데이터 넣기
		// async, await을 붙여줘야 한다.
		// 암호화된 비번 만들어주기, 2번째 인자에 숫자가 높을수록 보안은 강해진다. 대신 오래걸려서 적절하게.
		const hashedPassword = await bcrypt.hash(password, 10); // bcrypt도 비동기
		await User.create({
			email,
			nickname,
			password: hashedPassword,
		});
		// res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		// 요청에 성공적 응답 200
		res.status(201).send("ok");
		// res.json();
	} catch (err) {
		console.error(err);
		// next는 status 500 = 서버에서 처리하다가 에러 처리하는것 이기에
		next(err); // next로 에러 보내면 에러들이 한방에 처리된다. 익스프레스가 브라우저한테 알려준다.
	}
}); // ==> POST /user/

module.exports = router;
