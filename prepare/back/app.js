const http = require("http");
// req = 요청, res = 응답
// 소스 바꾸면 껐다 켜야한다.
const server = http.createServer((req, res) => {
	console.log(req.url, req.method);
	res.write("aaaaaaaaaa1");
	res.write("aaaaaaaaaa2");
	res.write("aaaaaaaaaa3");
	res.write("aaaaaaaaaa4");
	res.end("Hello node"); // end는 마지막에만
});
server.listen(3065, () => {
	console.log("서버 실행 중");
});
