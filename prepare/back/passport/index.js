const passport = require("passport");
const local = require("./local");
const { User } = require("../models");

module.exports = () => {
	// /routes/user에서 req.login할때 같이 실행되는 함수로 그때 사용한 user정보를 가져와서 실행
	passport.serializeUser((user, done) => {
		// 다 저장하면 무거우니가 user정보중에서 쿠키와 묶어줄 아이디만 저장 (세션화 할 아이디만 쿠키와 저장 - 이것만 서버에서 들고있음)
		// done ( 서버에러, 성공, 클라이언트 에러 (보내는측이 잘못보냄) )
		done(null, user.id);
	});

	// 로그인 후 그 다음 로그인 요청부터 connect.sid라는 쿠키와 함께 서버로 요청이 오면 매번 실행 (라우터 실행전)
	// 그래서 routes에서 정보를 가져오거나할때 req.user 에 유저 정보가 들어가 있는것
	// 아이디로 부터 db에서 사용자정보 복구
	passport.deserializeUser(async (id, done) => {
		try {
			// 저장했던 id를 가지고 db에서 데이터 복구
			const user = await User.findOne({ where: id });
			done(null, user); // req.user에 user를 넣어준다.
		} catch (error) {
			console.error(error);
			done(error);
		}
	});

	local();
};
