const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development"; // 운영버전일땐 production 개발할땐 development
const config = require("../config/config")[env]; // config데이터를 가져온거에서 development의 데이터 가져옴
const db = {};

// sequelize가 node와 mySQL연결해는 코드
// sequelize는 내부적으로 mySQL툴 사용.
// node와 mySQL을 연결해주는 드라이버역할인 mySQL2라이브러리에 필요정보를 줘서 역할을 수행하게 함
// 연결성공하면 sequelize객체에 연결정보가 담김
// 근데 연결만 성공해서는 아무 의미 없고 mySQL에 테이블들을 만들어줘야한다.
const sequelize = new Sequelize(config.database, config.username, config.password, config);

Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
