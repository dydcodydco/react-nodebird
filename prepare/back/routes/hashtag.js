const express = require("express");
const { Op } = require("sequelize"); // operator

const router = express.Router();
const { Post, User, Image, Comment, Hashtag } = require("../models");

// GET /hashtag/해시태그  해시태그 여러 게시글 가져오기
router.get("/:hastag", async (req, res, next) => {
	try {
		const where = {};
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
					model: Hashtag,
					// 위 where의 조건과 아래의  where조건 동시에 만족하는 posts가지고 온다.
					where: { name: decodeURIComponent(req.params.hastag) },
				},
				{
					model: User, // 게시글 작성자
					attributes: ["id", "nickname"],
				},
				{
					model: User,
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
						{ model: Image },
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

module.exports = router;
