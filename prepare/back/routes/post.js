const express = require("express");
const { Post, Comment, Image, User } = require("../models");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

// ==> POST /post 글 작성
router.post("/", isLoggedIn, async (req, res, next) => {
	try {
		const post = await Post.create({
			content: req.body.content,
			UserId: req.user.id, // 로그인하고나면 req.user에 정보담김 (passport의 deserialize)
		});
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

module.exports = router;
