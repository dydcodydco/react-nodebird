// mySQL에서는 테이블, sequelize에서는 model 같은 의미
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
			collate: "utf8_general_cli", // 한글 저장
		}
	);
	// 테이블간의 관계에서는 associate 사용 (글과 글을 쓴사람, 팔로워와 팔로잉 등등 여러테이블이 관계 되어있을때)
	// 그래서 mySQL같은걸 관계형 데이터베이스라고도 한다.
	User.associate = (db) => {};
	return User;
};
