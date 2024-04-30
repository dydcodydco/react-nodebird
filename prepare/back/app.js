// node에서는 import / export 안쓰고 require / module.exports 사용
const express = require("express");
const postRouter = require("./routes/post");

// sequelize에서 model 모두 등록
// express에서 그 sequelize를 등록해야 한다.
const db = require("./models");
const app = express();
db.sequelize
	.sync()
	.then(() => {
		console.log("db연결 성공!");
	})
	.catch(console.error);
// get이 method 부분, '/'이 url 부분
app.get("/", (req, res) => {
	res.send("hello express");
});

// 데이터는 보통 res.json()
app.get("/posts", (req, res) => {
	res.json([
		{ id: 1, content: "hello1" },
		{ id: 2, content: "hello2" },
		{ id: 3, content: "hello3" },
	]);
});

// api의 앞쪽 중복되는 부분을 prefix(접두어)로 뽑아내서 첫번째 인자에 넣을 수 있다. ('/post')
app.use("/post", postRouter);

app.listen(3065, () => {
	console.log("서버 실행 중");
});
