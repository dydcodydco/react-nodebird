const AWS = require('aws-sdk');
const sharp = require('sharp');

// AWS.config.update({})하지 않는다.
// 람다는 aws에 업로드를 하는데 그럼 알아서 실행될때 사용자 정보를 불러오기 때문에
// 키 값같은걸 넣어줄 필요 없다.
// 백엔드에서 사용한건 ec2 서버기 때문에 위 함수사용했던 것.
// 람다는 aws 자체에서 돌려주기 때문에 따로 인증절차 필요 없다.
const s3 = new AWS.S3();

// 람다는 하나의 기능을 하는 하나의 작은 함수
// s3에 멀터로 이미지 업로드할 때 같이 실행하게 할 것 
exports.handler = async (event, context, callback) => {
  const Bucket = event.Records[0].s3.bucket.name; // zzimzzim-s3 (지정한 s3 이름)
  // Key = 파일명
  const Key = decodeURIComponent(event.Records[0].s3.object.key);
  console.log(Bucket, Key);
  const filename = Key.split('/')[Key.split('/').length - 1];
  const ext = Key.split('.')[Key.split('.').length - 1].toLowerCase();
  const requiredFormat = ext === 'jpg' ? 'jpeg' : ext;
  console.log('filename------------------------------------------', filename, 'ext', ext);

  // 람다가 끝날 땐 callback 함수써서 끝내주면 된다.
  try {
    // *데이터 가져와서
    const s3Object = await s3.getObject({ Bucket, Key }).promise();
    console.log('original', s3Object.Body.length); // Body에 이미지들 저장되있음, 바이트 확인 콘솔
    // *리사이징 해주고
    const resizedImage = await sharp(s3Object.Body)
      .resize(400, 400, { fit: 'inside' })
      .toFormat(requiredFormat)
      .toBuffer();
    // *다시 업로드 해주기
    await s3.putObject({
      Bucket,
      Key: `thumb/${filename}`,
      Body: resizedImage
    }).promise();
    console.log('put', resizedImage.length);
    return callback(null, `thumb/${filename}`);
  } catch (error) {
    console.error(error);
    // (express의 passport의 done과 비슷)
    // 첫번째 인수가 서버쪽 에러, 두번째 인수가 성공
    return callback(error);
  }
}