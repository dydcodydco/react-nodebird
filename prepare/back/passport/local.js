const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const { User } = require("../models");
const bcrypt = require("bcrypt");

// /passport/index.js에서 local()으로 실행되는 부분
module.exports = () => {
	// 로그인 전략에는 두개의 인자가 들어간다. (객체, 함수)
	passport.use(
		new LocalStrategy(
			{
				usernameField: "email", // req.body.email 라는 뜻
				passwordField: "password", // req.body.password 라는 뜻
			},
			async (email, password, done) => {
				try {
					const user = await User.findOne({
						where: { email },
					});
					if (!user) {
						// done은 마치 callback 함수 같은 것 --> /routes/user 에서 호출하면 전달된다
						// done ( 서버에러, 성공, 클라이언트 에러 (보내는측이 잘못보냄) )
						return done(null, false, { reason: "존재하지 않는 사용자입니다!" });
					}
					// db에 있는 유저의 비번과, 사용자가 입력한 비번 비교
					const result = await bcrypt.compare(password, user.password);
					if (result) {
						return done(null, user);
					}
					return done(null, false, { reaseon: "비밀번호가 틀렸습니다." });
				} catch (error) {
					console.error(error);
					return done(error);
				}
			}
		)
	);
};
