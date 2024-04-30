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

// 빈 객체 db에 모델 5개 등록
db.Comment = require("./comment")(sequelize, Sequelize); // comment.js에서 module.exports로 가져온 함수 실행 -> 모델이 sequelize에 등록
db.Hashtag = require("./hashtag")(sequelize, Sequelize);
db.Image = require("./image")(sequelize, Sequelize);
db.Post = require("./post")(sequelize, Sequelize);
db.User = require("./user")(sequelize, Sequelize);

// 모델이 채워진 db객체를 반복문 돌려서 associate 실행
Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
