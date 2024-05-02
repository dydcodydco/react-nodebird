const express = require("express");
const { Post, Comment, Image, User } = require("../models");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

// ==> POST /post
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
					model: Image,
				},
				{
					model: Comment,
				},
				{
					model: User,
				},
			],
		});
		res.status(201).json(fullPost);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// POST /post/1/comment
router.post("/:postId/comment", isLoggedIn, async (req, res, next) => {
	try {
		// 서버에서는 존재여부등 꼼꼼하게 검사하는게 좋다.
		const post = Post.findOne({
			where: { id: req.params.postId },
		});
		if (!post) {
			return res.status(403).send("존재하지 않는 게시글입니다.");
		}
		const comment = await Comment.create({
			content: req.body.contents,
			PostId: req.params.postId, // req.body.postId 에서도 접근 가능
			UserId: req.user.id, // 로그인하고나면 req.user에 정보담김 (passport의 deserialize)
		});
		res.status(201).json(comment);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// DELETE /post
router.delete("/", (req, res) => {
	res.send({ id: 1 });
});

module.exports = router;
