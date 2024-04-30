// mySQL에서는 테이블, sequelize에서는 model 같은 의미
module.exports = (sequelize, DataTypes) => {
	// define한 User은 모델의 이름.
	// mySQL에는 자동으로 소문자, 복수가 되어서 users 테이블로 저장됨.
	// 첫번째 객체 : user 정보
	// 두번째 객체 : user모델에 대한 세팅
	const Comment = sequelize.define(
		"Comment",
		{
			//id: {}, // id는 mySQL에서 자동으로 넣어주기 때문에 여기서 만들 필요 없다.
			content: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			// UserId: {} 이라는 컬럼 만듬
			// PostId: {} 이라는 컬럼 만듬
		},
		{
			charset: "utf8mb4",
			collate: "utf8mb4_general_ci", // 한글 저장 + 이모티콘 저장 가능
		}
	);
	Comment.associate = (db) => {
		db.Comment.belongsTo(db.User); // 어떤 사용자에 쓰여진 댓글이다 --> 라는 컬럼 자동으로 생김
		db.Comment.belongsTo(db.Post); // 어떤 글에 쓰여진 댓글이다 --> 라는 컬럼 자동으로 생김
	};
	return Comment;
};
