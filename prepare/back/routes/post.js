const express = require("express");
const { isLoggedIn } = require("./middlewares");
const path = require("path");
const multer = require("multer");
const fs = require("fs"); // file system
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

const { Post, Comment, Image, User, Hashtag } = require("../models");
const router = express.Router();

try {
	fs.accessSync("uploads");
} catch (error) {
	console.log("uploads 폴더가 없으므로 생성합니다.-----------------------------------");
	fs.mkdirSync("uploads");
}

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: 'ap-northeast-2',
});
const upload = multer({
	storage: multerS3({
		s3: new AWS.S3(),
		bucket: 'zzimzzim-s3',
		key(req, file, cb) {
			cb(null, `original/${Date.now()}_${path.basename(file.originalname)}`)
		}
	}),
	limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});
// POST /post/images
// 이미지 한장이면 upload.single / 없으면 upload.none / 파일 태그가 두개씩 있을때 fields
// upload에서 이미지를 처리하고 처리된 이미지를 다음 콜백함수에서 req.files로 받는다.
router.post("/images", isLoggedIn, upload.array("image"), (req, res, next) => {
	try {
		console.log(req.files);
		res.json(req.files.map((v) => v.location));
	} catch (error) {
		console.error(error);
		next(error);
	}
});


// ==> POST /post 글 작성
// multer은 파일인 경우 req.body.files(여러개)나 rec.body.file(한개)이 된다.
// 파일이나 이미지가 아닌 텍스트들은 req.body 넣어준다.
router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {
	try {
		const hashtags = req.body.content.match(/(#[^\s#]+)/g);
		const post = await Post.create({
			content: req.body.content,
			UserId: req.user.id, // 로그인하고나면 req.user에 정보담김 (passport의 deserialize)
		});
		if (hashtags) {
			// 등록한 해시태그가 있으면 무시하고, 없는 경우에 create한다 (등록한다) --> findOrCreate
			const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({ where: { name: tag.slice(1).toLowerCase() } })));
			// findOrCreate 의 결과값이 [[ㅁㅁㅁ, true], [해쉬값, true]] 이런 모양이기 때문
			await post.addHashtags(result.map((v) => v[0]));
		}
		if (req.body.image) {
			// 이미지 여러개 올리면 [김치찜.png, 갈비찜.png] 배열로
			if (Array.isArray(req.body.image)) {
				// db에 파일 주소만 올린다. db에 올리면 캐싱안되서 속도 이점도 없고 무거워만진다 그래서.
				const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image }))); // promise배열됨
				await post.addImages(images);
			} else {
				// 이미지 하나만 올리면 '김치찜.png' string
				const image = await Image.create({ src: req.body.image });
				await post.addImages(image);
			}
		}
		const fullPost = await Post.findOne({
			where: { id: post.id },
			include: [
				{
					model: User, // 게시글 작성자
					attributes: ["id", "nickname"],
				},
				{
					model: User, // 좋아요 누른 사람
					as: "Likers",
					attributes: ["id"],
				},
				{ model: Image },
				{
					model: Comment,
					include: [
						{
							model: User, // 댓글 작성자
							attributes: ["id", "nickname"],
						},
					],
				},
			],
		});
		res.status(201).json(fullPost);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// POST /post/1/comment 댓글 작성
router.post("/:postId/comment", isLoggedIn, async (req, res, next) => {
	try {
		// 서버에서는 존재여부등 꼼꼼하게 검사하는게 좋다.
		const post = await Post.findOne({
			where: { id: req.params.postId },
		});
		if (!post) {
			return res.status(403).send("존재하지 않는 게시글입니다.");
		}
		const comment = await Comment.create({
			content: req.body.content,
			PostId: parseInt(req.params.postId, 10), // req.body.postId 에서도 접근 가능
			UserId: req.user.id, // 로그인하고나면 req.user에 정보담김 (passport의 deserialize)
		});
		const fullComment = await Comment.findOne({
			where: { id: comment.id },
			include: [
				{
					model: User,
					attributes: ["id", "nickname"],
				},
			],
		});
		res.status(201).json(fullComment);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// router.patch("/:postId/like", (req, res, next) => {});
// PATCH /post/1/like
router.patch("/:postId/like", isLoggedIn, async (req, res, next) => {
	try {
		const post = await Post.findOne({
			where: { id: req.params.postId },
		});
		if (!post) {
			return res.status(403).send("게시글이 존재하지 않습니다.");
		}

		// 관계형의 기능 (add, get, set, remove <-- sequelize 덕분 Post.associate)
		await post.addLikers(req.user.id);
		res.json({ PostId: post.id, UserId: req.user.id });
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// PATCH /post/1/unlike
router.delete("/:postId/unlike", isLoggedIn, async (req, res, next) => {
	try {
		const post = await Post.findOne({
			where: { id: req.params.postId },
		});
		if (!post) {
			return res.status(403).send("게시글이 존재하지 않습니다.");
		}
		await post.removeLikers(req.user.id);
		res.json({ PostId: post.id, UserId: req.user.id });
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// DELETE /post/1 글 삭제
router.delete("/:postId", isLoggedIn, async (req, res, next) => {
	try {
		// sequelize에서 제거할 때 destroy 사용
		await Post.destroy({
			where: {
				id: req.params.postId,
				UserId: req.user.id, // 게시글 쓴 사람만 게시글 지울 수 있게
			},
		});
		res.status(200).json({ PostId: parseInt(req.params.postId, 10) });
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// POST /post/1/retweet 리트윗
router.post("/:postId/retweet", isLoggedIn, async (req, res, next) => {
	try {
		// 서버에서는 존재여부등 꼼꼼하게 검사하는게 좋다.
		const post = await Post.findOne({
			where: { id: req.params.postId },
			include: [
				{
					model: Post,
					as: "Retweet",
				},
			],
		});
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		if (!post) {
			return res.status(403).send("존재하지 않는 게시글입니다.");
		}
		// 글쓴이와 리트위하는 대상이 같을때, 누가 내글을 리트윗하고 그걸 다시 내가 리트윗 할때 막음. 즉 내가 내꺼 리트윗시도할때 막아줌
		if (req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
			return res.status(403).send("자신의 글은 리트윗할 수 없습니다.");
		}
		// 위 경우의 수가 아닌 리트윗한 글의 id or 글의 id 사용
		const retweetTargetId = post.RetweetId || post.id;
		// 이미 내가 리트윗한 글인 경우 막기
		const exPost = await Post.findOne({
			where: {
				UserId: req.user.id,
				RetweetId: retweetTargetId,
			},
		});
		if (exPost) {
			return res.status(403).send("이미 리트윗했습니다.");
		}
		// 그 외의 경우 리트윗 생성
		const retweet = await Post.create({
			UserId: req.user.id,
			RetweetId: retweetTargetId,
			content: "retweet",
		});
		// 어떤 글을 리트윗한건지 알 수 있는 정보도 추가
		// include가 너무 복잡해지면 분리해야할 수도 있다. (댓글처럼 분리가능한건 하도록)
		const retweetWithPrevPost = await Post.findOne({
			where: { id: retweet.id },
			include: [
				{
					// 원 게시글이 다른 게시글을 리트윗한 경우, 그 리트윗된 게시글의 정보를 가져옵니다.
					model: Post,
					as: "Retweet",
					include: [
						{
							// 리트윗된 게시글을 작성한 사용자의 정보
							model: User,
							attributes: ["id", "nickname"],
						},
						{
							// 리트윗된 게시글에 포함된 이미지 정보
							model: Image,
						},
					],
				},
				{
					// 원 게시글을 작성한 사용자의 정보
					model: User,
					attributes: ["id", "nickname"],
				},
				{
					// 원 게시글에 포함된 이미지 정보
					model: Image,
				},
				{
					// 게시글에 달린 댓글 정보
					// 댓글같은 경우에는 나중에 불러와도 되기때문에 라우터를 따로 파주던가
					// 댓글창 열었을때 불러오던가 하는 수를 수정해야한다.
					model: Comment,
					include: [
						{
							model: User,
							attributes: ["id", "nickname"],
						},
					],
				},
				{
					// 게시글을 좋아요한 사용자들의 목록
					model: User,
					as: "Likers",
					attributes: ["id"],
				},
			],
		});
		res.status(201).json(retweetWithPrevPost);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// GET /post/1 게시글 하나 불러오기
router.get("/:postId", async (req, res, next) => {
	try {
		// 서버에서는 존재여부등 꼼꼼하게 검사하는게 좋다.
		const post = await Post.findOne({
			where: { id: req.params.postId },
		});
		console.log("--------------------------back post", post);
		if (!post) {
			console.log("--------------------------back post 존재하지 않는 게시글입니다");
			return res.status(404).send("존재하지 않는 게시글입니다.");
		}
		const fullPost = await Post.findOne({
			where: { id: post.id },
			include: [
				{
					// 원 게시글이 다른 게시글을 리트윗한 경우, 그 리트윗된 게시글의 정보를 가져옵니다.
					model: Post,
					as: "Retweet",
					include: [
						{
							// 리트윗된 게시글을 작성한 사용자의 정보
							model: User,
							attributes: ["id", "nickname"],
						},
						{
							// 리트윗된 게시글에 포함된 이미지 정보
							model: Image,
						},
					],
				},
				{
					// 원 게시글을 작성한 사용자의 정보
					model: User,
					attributes: ["id", "nickname"],
				},

				{
					// 게시글을 좋아요한 사용자들의 목록
					model: User,
					as: "Likers",
					attributes: ["id", "nickname"],
				},
				{
					// 원 게시글에 포함된 이미지 정보
					model: Image,
				},
				{
					// 게시글에 달린 댓글 정보
					// 댓글같은 경우에는 나중에 불러와도 되기때문에 라우터를 따로 파주던가
					// 댓글창 열었을때 불러오던가 하는 수를 수정해야한다.
					model: Comment,
					include: [
						{
							model: User,
							attributes: ["id", "nickname"],
						},
					],
				},
			],
		});
		res.status(201).json(fullPost);
	} catch (error) {
		console.log("--------------------------back post error", error);
		console.error(error);
		next(error);
	}
});

module.exports = router;
