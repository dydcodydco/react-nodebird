const express = require("express");
// sequelize가 다른 테이블의 정보까지 합쳐서 보내줘서 편함
const bcrypt = require("bcrypt");
const passport = require("passport");
const { Op } = require("sequelize"); // operator

const { User, Post, Image, Comment } = require("../models");
const db = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

// 브라우저에서 새로고침 할때 마다 실행시킬 것
// GET /user 유저 정보 불러오기
router.get("/", async (req, res, next) => {
	try {
		if (req.user) {
			const fullUserWithoutPassword = await User.findOne({
				where: { id: req.user.id },
				// 원하는 정보만 받을 수 있음
				// attreibute: ['id', 'nickname', 'email'],
				// 원하지 않는 정보만 빼고 가져올 수 있음
				attributes: {
					exclude: ["password"],
				},
				include: [
					{
						// model: Post는 hasMany라서 복수형이 되어 프론트 me.Posts가 됩니다.
						model: db.Post,
						attributes: ["id"], // id만 가져오게
					},
					{
						model: db.User,
						as: "Followings",
						attributes: ["id"],
					},
					{
						model: db.User,
						as: "Followers",
						attributes: ["id"],
					},
				],
			});
			res.status(200).json(fullUserWithoutPassword);
		} else {
			res.status(200).json(null);
		}
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// POST /user/login 로그인 하기
router.post("/login", isNotLoggedIn, (req, res, next) => {
	// 미들웨어 확장방법 사용해서 next함수 쓸수있게
	// 로그인 전략 실행
	passport.authenticate("local", (err, user, info) => {
		if (err) {
			console.error(err);
			return next(err);
		}
		if (info) {
			return res.status(403).send(info.reason);
		}
		// passport 로그인 중
		// req.login 할때 동시에 실행되는게 /passport/index.js의 serializeUser
		return req.login(user, async (loginErr) => {
			if (loginErr) {
				console.error(loginErr);
				return next(loginErr);
			}
			// 로그인하게되면 내부적으로 res.setHeader('Cookie', 임의의 문자열) 이렇게 보내준다
			// 그리고 알아서 세션과 연결해준다 --> 브라우저엔 문자 (쿠키), 서베에서 데이터 보관.
			// 서버쪽에서 통째로 들고있는건 세션(쿠키와 정보 연결) 이런식으로 보안 위협 최소
			const fullUserWithoutPassword = await User.findOne({
				where: { id: user.id },
				// 원하는 정보만 받을 수 있음
				// attreibute: ['id', 'nickname', 'email'],
				// 원하지 않는 정보만 빼고 가져올 수 있음
				attributes: {
					exclude: ["password"],
				},
				include: [
					{
						// model: Post는 hasMany라서 복수형이 되어 프론트 me.Posts가 됩니다.
						model: db.Post,
						attributes: ["id"],
					},
					{
						model: db.User,
						as: "Followings",
						attributes: ["id"],
					},
					{
						model: db.User,
						as: "Followers",
						attributes: ["id"],
					},
				],
			});
			return res.status(200).json(fullUserWithoutPassword); // 쿠키정보와 사용자정보 프론트로 보내줌
		});
	})(req, res, next);
});

// --> 접두어(/user + / 이라는 뜻)
// POST /user/ 회원가입 하기
router.post("/", isNotLoggedIn, async (req, res, next) => {
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
		const user = await User.create({
			email,
			nickname,
			password: hashedPassword,
		});
		// res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		// 요청에 성공적 응답 200
		res.status(201).json(user);
		// res.json();
	} catch (err) {
		console.error(err);
		// next는 status 500 = 서버에서 처리하다가 에러 처리하는것 이기에
		next(err); // next로 에러 보내면 에러들이 한방에 처리된다. 익스프레스가 브라우저한테 알려준다.
	}
});

// POST /user/logout 로그아웃
router.post("/logout", isLoggedIn, (req, res, next) => {
	// 로그인 한 후 부터는 req에 user정보가 들어가있다. (req.user)
	req.logOut(() => {
		req.session.destroy(); // 세션 지우고 쿠키 지우면 로그아웃 끝
		res.send("ok");
	});
});

// PATCH /user/nickname 닉네임 수정
router.patch("/nickname", isLoggedIn, async (req, res, next) => {
	try {
		await User.update(
			{
				nickname: req.body.nickname,
			},
			{
				where: { id: req.user.id },
			}
		);
		res.status(200).json({ nickname: req.body.nickname });
	} catch (error) {
		console.log(error);
		next(error);
	}
});

// PATCH /user/1/follow
router.patch("/:userId/follow", isLoggedIn, async (req, res, next) => {
	try {
		// 유저를 검사해서
		const user = await User.findOne({
			where: { id: req.params.userId },
		});
		if (!user) {
			res.status(403).send("없는 사람을 팔로우하시려고 하시네요?");
		}
		// 그 유저에게 follower 추가
		await user.addFollowers(req.user.id);
		res.status(200).json({ UserId: parseInt(req.params.userId) });
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// DELETE /user/1/follow 내가 팔로한사람 (팔로잉) 취소 --> 언팔
router.delete("/:userId/follow", isLoggedIn, async (req, res, next) => {
	try {
		// 팔로할 유저를 검사해서
		const user = await User.findOne({
			where: { id: req.params.userId },
		});
		if (!user) {
			res.status(403).send("없는 사람을 언팔로우하시려고 하시네요?");
		}
		// 그 유저에게서 follower 제거
		await user.removeFollowers(req.user.id);
		res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// DELETE /user/follow/1 나를 팔로한사람 (팔로워) 제거 --> 그 사람이 나를 언팔
router.delete("/follower/:userId", isLoggedIn, async (req, res, next) => {
	try {
		// 팔로할 유저를 검사해서
		const user = await User.findOne({
			where: { id: req.params.userId },
		});
		if (!user) {
			res.status(403).send("없는 사람을 언팔로우하시려고 하시네요?");
		}
		// 그 유저에게서 follower 제거
		await user.removeFollowings(req.user.id);
		res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// GET /user/followers 팔로워즈 불러오기
router.get("/followers", isLoggedIn, async (req, res, next) => {
	try {
		// 나를 먼저 찾고
		const user = await User.findOne({
			where: { id: req.user.id },
		});
		// 내 팔로워즈 get 하기
		const followers = await user.getFollowers({ limit: parseInt(req.query.limit, 10) });
		res.status(200).json(followers);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// GET /user/followings 팔로잉즈 불러오기
// 미들웨어... (req, res, next) 이 콜백함수도 미들웨어
router.get("/followings", isLoggedIn, async (req, res, next) => {
	try {
		const user = await User.findOne({
			where: { id: req.user.id },
		});
		const followings = await user.getFollowings({ limit: parseInt(req.query.limit, 10) });
		res.status(200).json(followings);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// GET /user/1/posts 유저의 여러 게시글 가져오기
router.get("/:userId/posts", async (req, res, next) => {
	try {
		const where = { UserId: req.params.userId };
		// 초기 로딩이 아닐때
		if (parseInt(req.query.lastId, 10)) {
			// 검색하려는 데이터 id가 lastId보다 작은
			where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
			// 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 ,1
		}
		const posts = await Post.findAll({
			where,
			limit: parseInt(req.query?.limit, 10) || 10, // 몇개를 가져와라
			// lastId: 10, // 1-10만큼 가져와라
			// offset: 10 --> 11 - 20, offset: 100 --> 101 - 110
			// 근데 실무에선 잘 안쓴다... 왜냐하면 비효율적이라서.
			// 데이터를 가져오는 중에 추가데이터가 생기거나 삭제해버리면 그때부터 limit, offset이 꼬여버린다.
			// 그래서 limit / offset 방식이 아니라 limit / lastId 방식을 사용한다.
			order: [["createdAt", "DESC"]], // 2차원 배열인 이유는 여러기준으로 정렬할 수 있기 때문.
			include: [
				{
					model: User, // 게시글 작성자
					attributes: ["id", "nickname"],
				},
				{
					model: User,
					as: "Likers",
					attributes: ["id"],
				},
				{
					model: Image,
				},
				{
					model: Comment,
					include: [
						{
							model: User, // 댓글 작성자
							attributes: ["id", "nickname"],
							oror: [["createdAt", "DESC"]], // 댓글정렬
						},
					],
				},
				{
					model: Post,
					as: "Retweet",
					include: [
						{
							model: User,
							attributes: ["id", "nickname"],
						},
						{
							model: Image,
						},
					],
				},
			],
		});
		// console.log(posts);
		res.status(200).json(posts);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// GET /user/1 유저 정보 불러오기
router.get("/:userId", async (req, res, next) => {
	try {
		const fullUserWithoutPassword = await User.findOne({
			where: { id: req.params.userId },
			// 원하는 정보만 받을 수 있음
			// attreibute: ['id', 'nickname', 'email'],
			// 원하지 않는 정보만 빼고 가져올 수 있음
			attributes: {
				exclude: ["password"],
			},
			include: [
				{
					// model: Post는 hasMany라서 복수형이 되어 프론트 me.Posts가 됩니다.
					model: db.Post,
					attributes: ["id"], // id만 가져오게
				},
				{
					model: db.User,
					as: "Followings",
					attributes: ["id"],
				},
				{
					model: db.User,
					as: "Followers",
					attributes: ["id"],
				},
			],
		});
		if (fullUserWithoutPassword) {
			// 우리가 쓸 수 있는 데이터로 바꿔준 후 .toJSON();
			const data = fullUserWithoutPassword.toJSON();
			// 다른 사람의 정보는 보안에 위협이 될 수 있기에 id같은 정보말고 갯수만 내려주게
			// ( 개인정보 침해 예방 )
			data.Posts = data.Posts.length;
			data.Followings = data.Followings.length;
			data.Followers = data.Followers.length;
			res.status(200).json(data);
		} else {
			res.status(404).json("존재하지 않는 사용자 입니다.");
		}
	} catch (error) {
		console.error(error);
		next(error);
	}
});

module.exports = router;
