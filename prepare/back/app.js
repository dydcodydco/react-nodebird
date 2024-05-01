// node에서는 import / export 안쓰고 require / module.exports 사용
const express = require("express");
const cors = require("cors");

const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
const db = require("./models"); // sequelize에서 model 모두 등록 // express에서 그 sequelize를 등록해야 한다.
const passportConfig = require("./passport");

const app = express();
db.sequelize
	.sync()
	.then(() => {
		console.log("db연결 성공!");
	})
	.catch(console.error);
passportConfig();

// app.use(cors()) -> 모든 요청에 다 res.setHeader("Access-Control-Allow-Origin", "*") 설정 넣어주는 것
app.use(
	cors({
		origin: true,
		credentials: false, // 나중에 true로 바꿈
	})
);
// req.body를 사용하기 위해 라우터 연결 이전에 아래 두 코드(미들웨어) 적용해야한다.
// use는 express 서버에다가 무언갈 장착한다는 뜻
// 아래 두 코드가 프론트에서 받은 데이터를 req.body에 넣어주는 역할을 한다.
// 그래서 req.body실행하는 코드보다 일찍 실행시켜야 한다.
app.use(express.json()); // json형태의 데이터를 req.body에
app.use(express.urlencoded({ extended: true })); // form/submit일때 url-encoed방식으로 오는데 이를 req.body에 넣어줌

// api의 앞쪽 중복되는 부분을 prefix(접두어)로 뽑아내서 첫번째 인자에 넣을 수 있다. ('/post')
app.use("/post", postRouter);
app.use("/user", userRouter);

app.listen(3065, () => {
	console.log("서버 실행 중");
});
