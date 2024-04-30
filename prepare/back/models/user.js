// mySQL에서는 테이블, sequelize에서는 model 같은 의미
// user테이블 마치 엑셀 같은 느낌
module.exports = (sequelize, DataTypes) => {
	// define한 User은 모델의 이름.
	// mySQL에는 자동으로 소문자, 복수가 되어서 users 테이블로 저장됨.
	// 첫번째 객체 : user 정보
	// 두번째 객체 : user모델에 대한 세팅
	const User = sequelize.define(
		"User",
		{
			//id: {}, // id는 mySQL에서 자동으로 넣어주기 때문에 여기서 만들 필요 없다.
			// 각 컬럼들에 대한 설명 ()
			email: {
				type: DataTypes.STRING(30), // STRING, TEXT, BOOLEAN, INT, INTEGER, FLOAT, DATETIME
				allowNull: false, // required 여부 // 필수
				unique: true, // 고유한 값
			},
			nickname: {
				type: DataTypes.STRING(30),
				allowNull: false,
			},
			password: {
				type: DataTypes.STRING(100), // 비밀번호는 암호화를해서 길이가 길어져서 넉넉하게 해줌
				allowNull: false,
			},
		},
		{
			charset: "utf8",
			collate: "utf8_general_ci", // 한글 저장
		}
	);
	// 테이블간의 관계에서는 associate 사용 (글과 글을 쓴사람, 팔로워와 팔로잉 등등 여러테이블이 관계 되어있을때)
	// 그래서 mySQL같은걸 관계형 데이터베이스라고도 한다.
	User.associate = (db) => {
		// User.hasMany(db.Post) = 유저는 포스트를 많이 가질 수 있다.
		// 유저가 쓴 Post들의 정보를 유저에 쓰지 않는 이유는
		// 한칸에 하나의 데이터만 들어가야하는데 많아지면 그럴수 없기 때문이다. (, or 여러정보 안된다)
		// 그래서 hasMany가 있는곳에 많이 가지고 있을 데이터를 갖고있는건 원칙적으로 맞지 않다.
		// hasMany당한 즉 belongsTo를 사용하는 컬럼에서 갖고있어야 한다.
		db.User.hasMany(db.Post);
		db.User.hasMany(db.Comment);
		// belongsToMany의 중간 테이블은 이름 지정할 수 있다.
		// 지정안하면 기본으로 이름 합쳐서 만들어줌. 그렇게되었을때 이해가 잘 안되는것들은 지정
		// 같은 테이블들을 관계하는게 중복으로 나오면 헷갈릴 수 있기 때문에 as로 바꿔서 쓸수있다. --> Liked로 검색
		db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" }); // User가 좋아요 누른 Post
		// 다대다에서 찾기를 할 때 중에서 같은 이름일때, 헷갈리지 않게 foreignKey를 추가한다.
		// through = 테이블 이름 바꿈. foreignKey = 컬럼의 타이틀
		// 유저의 Followers를 찾는다면 유저의 정보를 먼저찾고나서 그에 맞는 Follwers를 찾아야한다.
		// 그래서 as에 Followers, foreignKye에 followingId를 한다.
		// 유저의 followingId를 찾고 그에 대응(팔루우한)하는 Followers를 찾는것
		db.User.belongsToMany(db.User, { through: "Follow", as: "Followers", foreignKey: "FollowingId" }); // 같은걸 할때에는 foreignKey 값 추가
		db.User.belongsToMany(db.User, { through: "Follow", as: "Followings", foreignKey: "FollowerId" });
	};
	return User;
};
