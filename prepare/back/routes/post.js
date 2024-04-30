const express = require("express");

const router = express.Router();

// POST /post
router.post("/", (req, res) => {
	res.send("작성 완료");
});

// DELETE /post
router.delete("/", (req, res) => {
	res.send({ id: 1 });
});

module.exports = router;
