// mySQL에서는 테이블, sequelize에서는 model 같은 의미
module.exports = (sequelize, DataTypes) => {
	// define한 User은 모델의 이름.
	// mySQL에는 자동으로 소문자, 복수가 되어서 users 테이블로 저장됨.
	// 첫번째 객체 : user 정보
	// 두번째 객체 : user모델에 대한 세팅
	const Post = sequelize.define(
		"Post",
		{
			//id: {}, // id는 mySQL에서 자동으로 넣어주기 때문에 여기서 만들 필요 없다.
			content: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			// UserId: {} 이라는 컬럼 만듬
		},
		{
			charset: "utf8mb4",
			collate: "utf8mb4_general_ci", // 한글 저장 + 이모티콘 저장 가능
		}
	);
	Post.associate = (db) => {
		// belongsTo 의 역할? // 어떤컬럼과 관계된것에 대해 컬럼이 생긴다.
		// Post.belongsTo(db.User) 이라면 해당 User : 1 이런 칼럼 자동으로 생김
		// 1번 사용자에 쓰여진 글이다.
		// 다대다 관계
		db.Post.belongsTo(db.User); // post.addUser(추가), get.addUser(조회) --> 이건 include도 가능, set.addUser(수정), remove.addUser(제거)
		// belongsToMany인 관계는 두 테이블 사이에 하나의 테이블이 생기고, 거기에서 데이터들이 짝지어진다.
		// 이러한 중간테이블은 sequelize가 만들어준다.
		db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" }); // post.addHashtags, get.Hashtags
		db.Post.hasMany(db.Comment); // post.addComments, get.AddComments,
		db.Post.hasMany(db.Image); // post.addImages, get.addImages,
		// Post를 좋아요 누른 User들
		db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" }); // post.addLikers, post.removeLikers 생김
		db.Post.belongsTo(db.Post, { as: "Retweet" }); // 리트윗 post.addRetweet
	};
	return Post;
};
