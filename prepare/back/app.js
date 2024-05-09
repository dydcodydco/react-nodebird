// node에서는 import / export 안쓰고 require / module.exports 사용
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const hpp = require('hpp');
const helmet = require('helmet');

const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const hashtahRouter = require('./routes/hashtag');
const db = require('./models'); // sequelize에서 model 모두 등록 // express에서 그 sequelize를 등록해야 한다.
const passportConfig = require('./passport');

dotenv.config();
const app = express();
db.sequelize
	.sync()
	.then(() => {
		console.log('db연결 성공!');
	})
	.catch(console.error);
passportConfig();

// 운영용 빌드
if (process.env.NOD_ENV === 'production') {
	app.use(morgan('combined')); // 로그볼 수 있게 해주는 것
	// 보안에 도움되는 패키지들
	app.use(hpp());
	app.use(helmet());
} else {
	app.use(morgan('dev')); // 로그볼 수 있게 해주는 것
}
// app.use(cors()) -> 모든 요청에 다 res.setHeader("Access-Control-Allow-Origin", "*") 설정 넣어주는 것
app.use(
	cors({
		origin: ['http://localhost:3000', 'nodebird.com', 'http://13.125.119.94'], // true or * // access-control-allow-origin가 true된다. --> 다른 도메인끼리 api 요청
		credentials: true, // access-control-allow-credential가 true된다. --> 다른 도메인끼리 쿠키 전달
	})
);
// __dirname -> 현재 폴더, 이 폴더 안에 uploads폴더 경로를 합쳐준다. // 운영체제 차이때문에 이렇게 경로를 설정해줌
app.use('/', express.static(path.join(__dirname, 'uploads')));
// req.body를 사용하기 위해 라우터 연결 이전에 아래 두 미들웨어(express.json, express.urlencoded) 적용해야한다.
// use는 express 서버에다가 무언갈 장착한다는 뜻
// 아래 두 코드가 프론트에서 받은 데이터를 req.body에 넣어주는 역할을 한다.
// 그래서 req.body실행하는 코드보다 일찍 실행시켜야 한다.
app.use(express.json()); // json형태의 데이터를 req.body에
app.use(express.urlencoded({ extended: true })); // form/submit일때 url-encoed방식으로 오는데 이를 req.body에 넣어줌 (multipart가 아닌 form형식)
// .env 에 있는 정보들이 치환되서 process.env.으로 들어간다.
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
	session({
		saveUninitialized: false,
		resave: false,
		// 로그인 후 쿠키에 랜덤한 문자열을 보내줄때 유저를 데이터로 만들어낸 문자.
		// 그래서 secret이 해킹당하면 데이터 노출 위험이 있다.
		// 그래서 secret은 꽁꽁 숨겨둬야한다
		secret: process.env.COOKIE_SECRET,
	})
);
app.use(passport.initialize());
app.use(passport.session());

// api의 앞쪽 중복되는 부분을 prefix(접두어)로 뽑아내서 첫번째 인자에 넣을 수 있다. ('/post')
app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/user', userRouter);
app.use('/hashtag', hashtahRouter);

app.listen(80, () => {
	console.log('서버 실행 중');
});
