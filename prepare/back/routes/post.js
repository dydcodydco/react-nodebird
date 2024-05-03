const express = require("express");
const { Post, Comment, Image, User } = require("../models");
const { isLoggedIn } = require("./middlewares");
const path = require("path");
const multer = require("multer");
const fs = require("fs"); // file system

const router = express.Router();

try {
	fs.accessSync("uploads");
} catch (error) {
	console.log("uploads 폴더가 없으므로 생성합니다.-----------------------------------");
	fs.mkdirSync("uploads");
}

const upload = multer({
	storage: multer.diskStorage({
		destination(req, file, done) {
			done(null, "uploads");
		},
		filename(req, file, done) {
			// 이미지명.png
			const ext = path.extname(file.originalname); // 확장자 추출 (.png)
			const basename = path.basename(file.originalname, ext); // 이미지명 추출 (이미지명)
			done(null, basename + "_" + new Date().getTime() + ext); // 이미지명123452322.png
		},
	}),
	limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

// ==> POST /post 글 작성
// multer은 파일인 경우 req.body.files(여러개)나 rec.body.file(한개)이 된다.
// 파일이나 이미지가 아닌 텍스트들은 req.body 넣어준다.
router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {
	try {
		const post = await Post.create({
			content: req.body.content,
			UserId: req.user.id, // 로그인하고나면 req.user에 정보담김 (passport의 deserialize)
		});
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
				{
					model: Image,
				},
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

// POST /post/images
// 이미지 한장이면 upload.single / 없으면 upload.none / 파일 태그가 두개씩 있을때 fields
// upload에서 이미지를 처리하고 처리된 이미지를 다음 콜백함수에서 req.files로 받는다.
router.post("/images", isLoggedIn, upload.array("image"), (req, res, next) => {
	try {
		console.log(req.files);
		res.json(req.files.map((v) => v.filename));
	} catch (error) {
		console.error(error);
		next(error);
	}
});

module.exports = router;
