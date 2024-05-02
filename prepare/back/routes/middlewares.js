// app.use() 에 들어가는 것과, app 라우터에 들어가는것도 미들웨어다
// (app.get('/', (req, res, next) => { })-- > 여기서(req, res, next) => { } 이부분
// router.post("/login", isNotLoggedIn, (req, res, next) => { 이런식으로 중간다리 역할로 미들웨어 적용

exports.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		// next의 사용방법은 두개
		// 매개변수로 뭐라도 넣으면 에러처리 해줌.
		// 매개변수 없으면 다음 미들웨어로 간다.
		next();
	} else {
		res.status(401).send("로그인이 필요합니다.");
	}
};

exports.isNotLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		// next의 사용방법은 두개
		// 매개변수로 뭐라도 넣으면 에러처리 해줌. --> 에러처리 미들웨어로 제일 끝으로 간다.
		// app.listen과 라우터 실행코드 사이 어딘가에 내부로 존재
		// 매개변수 없으면 다음 미들웨어로 간다.
		// 직접만들수도 있는데 그러려면 매개변수 4개로 만들어야한다.
		// app.use((err, req, res, next) => {})
		// 기본 에러 효과말고 다른 걸 적용하고 싶을때 에러 미들웨어 따로 만들어서 사용
		next();
	} else {
		res.status(401).send("로그인하지 않은 사용자만 접근 가능합니다.");
	}
};
