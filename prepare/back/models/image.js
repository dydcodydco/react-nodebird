// mySQL에서는 테이블, sequelize에서는 model 같은 의미
module.exports = (sequelize, DataTypes) => {
	// define한 User은 모델의 이름.
	// mySQL에는 자동으로 소문자, 복수가 되어서 users 테이블로 저장됨.
	// 첫번째 객체 : user 정보
	// 두번째 객체 : user모델에 대한 세팅
	const Image = sequelize.define(
		"Image",
		{
			//id: {}, // id는 mySQL에서 자동으로 넣어주기 때문에 여기서 만들 필요 없다.
			src: {
				type: DataTypes.STRING(200),
				allowNull: false,
			},
		},
		{
			charset: "utf8",
			collate: "utf8_general_ci", // 한글 저장 + 이모티콘 저장 가능
		}
	);
	Image.associate = (db) => {
		db.Image.belongsTo(db.Post);
	};
	return Image;
};
