import PropTypes from 'prop-types';
import Link from 'next/link';

// postData = 글 내용 #해시태그 #익스프레스
const PostCardContent = ({ postData }) => {
  // regex에서 . 은 모든글자 하나, .. 은 모든 글자 두개.
  // + 는 이후 모든 글자
  // 해시태그 찾는 정규 표현식 (/#[^\s#]+/g)
  return (
    <div>
      {postData.split(/(#[^\s#]+)/g).map((v, i) => {
        if (v.match(/(#[^\s#]+)/)) {
          return (
            <Link key={v + i} href={`/hashtag/${v.slice(1)}`}>
              {v}
            </Link>
          );
        }
        return v;
      })}
    </div>
  );
};

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
};

export default PostCardContent;
