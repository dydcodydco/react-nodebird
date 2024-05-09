import { HYDRATE } from 'next-redux-wrapper';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import shortId from 'shortid';
import produce from 'immer';
import _ from 'lodash';
import axios from 'axios';
// import { fakerKO as faker } from "@faker-js/faker";
import { faker } from '@faker-js/faker';

// 리듀서란? 이전 상태를 state로 받고, action을 통해 다음 상태로 만들어내는 함수(불변성 지키는게 포인트)
// immer의 produce사용하면 불변성을 지키지 않아도 immer가 자동으로 해준다.
const reducer = (state = initialState, action) => {
  // state가 draft로 바뀐다. 그리고 우리는 draft를 사용한다.
  // 이 draft를 변형시키면 immer가 알아서 불변성을 지켜 다음 상태로 업데이트 해준다.
  return produce(state, draft => {});
};

export const initialState = {
  // 왜 id같이 소문자가 있고, User처럼 대문자가 있는걸까?
  // 데이터베이스에서 사용하는 시퀄라이즈랑 관계있다.
  // 어떤 정보와 다른 정보가 관계가 있으면 합쳐주는게 그게 대문자가 된다.
  // 설정으로 소문자 가능하긴함.
  // 소문자 = 게시글 자체 속성
  // 대문자 = 다른 정보들과 합쳐서 주는 정보 / 서버에서 주는 정보로 고유한 Id를 가지고 있다.
  mainPosts: [],
  singlePost: null,
  imagePaths: [],
  hasMorePosts: true,
  loadPostLoading: false, // 게시글 하나 불러오는중
  loadPostDone: false,
  loadPostError: null,
  loadPostsLoading: false, // 게시글들 불러오는 중
  loadPostsDone: false,
  loadPostsError: null,
  addPostLoading: false, // 게시글 추가 시도중
  addPostDone: false,
  addPostError: null,
  removePostLoading: false, // 게시글 제거 시도중
  removePostDone: false,
  removePostError: null,
  addCommentLoading: false, // 댓글 추가 시도중
  addCommentDone: false,
  addCommentError: null,
  likePostLoading: false, // 좋아요 시도중
  likePostDone: false,
  likePostError: null,
  unLikePostLoading: false, // 좋아요 취소중
  unLikePostDone: false,
  unLikePostError: null,
  uploadImagesLoading: false, // 이미지 업로드 시도중
  uploadImagesDone: false,
  uploadImagesError: null,
  retweetLoading: false, // 리트윗 시도중
  retweetDone: false,
  retweetError: null,
};

// 단일 게시글 생성 함수
faker.seed(123);
const createDummyPost = () => {
  return {
    id: shortId.generate(),
    User: {
      id: shortId.generate(),
      nickname: faker.person.fullName(),
    },
    content: faker.lorem.paragraph(),
    Images: [{ src: faker.image.urlLoremFlickr() }],
    Comments: [
      {
        User: {
          id: shortId.generate(),
          nickname: faker.person.fullName(),
        },
        content: faker.lorem.sentence(),
      },
    ],
  };
};
// 여러 게시글 생성
export const generateDummyPosts = number =>
  faker.helpers.multiple(createDummyPost, {
    count: number,
  });
// 초기 상태에 더미 게시물 추가
// initialState.mainPosts = [...generateDummyPosts(10)];

const dummyPost = ({ id, content }) => {
  return {
    id,
    content,
    User: {
      id: '1',
      nickname: 'WlaWla',
    },
    Images: [],
    Comments: [],
  };
};

const dummyComment = content => ({
  id: shortId.generate(),
  content: content,
  User: {
    id: '1',
    nickname: 'WlaWla',
  },
});
const setQuerystring = payload => {
  let queryObj = {};
  if (payload?.lastId) {
    queryObj.lastId = payload.lastId;
  }
  if (payload?.limit) {
    queryObj.limit = payload.limit;
  }

  return new URLSearchParams(queryObj).toString();
};

export const loadPost = createAsyncThunk('post/loadPost', async id => {
  const response = await axios.get(`/post/${id}`);
  return response.data;
});

const loadPostsThrottle = async payload => {
  const queryStr = setQuerystring(payload);
  const url = `/posts${queryStr ? '?' + queryStr : ''}`;
  const response = await axios.get(url);
  return response;
};
export const loadPosts = createAsyncThunk(
  'post/loadPosts',
  _.throttle(loadPostsThrottle, 5000)
);

const loadUserPostsThrottle = async payload => {
  const queryStr = setQuerystring(payload);
  const url = `/user/${payload.id}/posts${queryStr ? '?' + queryStr : ''}`;
  const response = await axios.get(url);
  return response;
};
export const loadUserPosts = createAsyncThunk(
  'post/loadUserPosts',
  _.throttle(loadUserPostsThrottle, 5000)
);

const loadHashtagPostsThrottle = async payload => {
  const queryStr = setQuerystring(payload);
  const url = `/hashtag/${encodeURIComponent(payload.tag)}${queryStr ? '?' + queryStr : ''}`;
  const response = await axios.get(url);
  return response;
};
export const loadHashtagPosts = createAsyncThunk(
  'post/loadHashtagPosts',
  _.throttle(loadHashtagPostsThrottle, 5000)
);

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    retweetRequestAction: (state, action) => {
      state.retweetLoading = true;
      state.retweetDone = false;
      state.retweetError = null;
    },
    retweetSuccessAction: (state, action) => {
      state.mainPosts.unshift(action.payload);
      state.retweetLoading = false;
      state.retweetDone = true;
    },
    retweetFailureAction: (state, action) => {
      state.retweetLoading = false;
      state.retweetError = action.payload;
    },
    removeImageAction: (state, action) => {
      state.imagePaths = state.imagePaths.filter(
        (d, i) => i !== action.payload
      );
    },
    uploadImagesRequestAction: (state, action) => {
      state.uploadImagesLoading = true;
      state.uploadImagesDone = false;
      state.uploadImagesError = null;
    },
    uploadImagesSuccessAction: (state, action) => {
      state.imagePaths = action.payload;
      state.uploadImagesLoading = false;
      state.uploadImagesDone = true;
    },
    uploadImagesFailureAction: (state, action) => {
      state.uploadImagesLoading = false;
      state.uploadImagesError = action.payload;
    },
    likePostRequestAction: (state, action) => {
      state.likePostLoading = true;
      state.likePostDone = false;
      state.likePostError = null;
    },
    likePostSuccessAction: (state, action) => {
      const post = state.mainPosts.find(v => v.id === action.payload.PostId);
      post.Likers.push({ id: action.payload.UserId });
      state.likePostLoading = false;
      state.likePostDone = true;
    },
    likePostFailureAction: (state, action) => {
      state.likePostLoading = false;
      state.likePostError = action.payload;
    },
    unLikePostRequestAction: (state, action) => {
      state.unLikePostLoading = true;
      state.unLikePostDone = false;
      state.unLikePostError = null;
    },
    unLikePostSuccessAction: (state, action) => {
      const post = state.mainPosts.find(d => d.id === action.payload.PostId);
      post.Likers = post.Likers.filter(d => d.id !== action.payload.UserId);
      state.unLikePostLoading = false;
      state.unLikePostDone = true;
    },
    unLikePostFailureAction: (state, action) => {
      state.unLikePostLoading = false;
      state.unLikePostError = action.payload;
    },
    // loadPostsRequestAction: (state, action) => {
    // 	console.log("-------------------요청-------------------");
    // 	state.loadPostsLoading = true;
    // 	state.loadPostsDone = false;
    // 	state.loadPostsError = null;
    // },
    // loadPostsSuccessAction: (state, action) => {
    // 	console.log("-------------------성공-------------------");
    // 	state.loadPostsLoading = false;
    // 	state.loadPostsDone = true;
    // 	state.mainPosts = [...state.mainPosts, ...action.payload];
    // 	state.hasMorePosts = action.payload.length === 10;
    // },
    // loadPostsFailureAction: (state, action) => {
    // 	console.log("-------------------실패-------------------");
    // 	state.loadPostsLoading = false;
    // 	state.loadPostsError = action.payload;
    // },
    addPostRequestAction: (state, action) => {
      state.addPostLoading = true;
      state.addPostDone = false;
      state.addPostError = null;
    },
    addPostSuccessAction: (state, action) => {
      state.addPostLoading = false;
      state.addPostDone = true;
      state.mainPosts.unshift(action.payload);
      state.imagePaths = [];
    },
    addPostFailureAction: (state, action) => {
      state.addPostLoading = false;
      state.addPostError = action.payload;
    },
    removePostRequestAction: (state, action) => {
      state.removePostLoading = true;
      state.removePostDone = false;
      state.removePostError = null;
    },
    removePostSuccessAction: (state, action) => {
      state.removePostLoading = false;
      state.removePostDone = true;
      state.mainPosts = state.mainPosts.filter(d => d.id !== action.payload);
    },
    removePostFailureAction: (state, action) => {
      state.removePostLoading = false;
      state.removePostError = action.payload;
    },
    addCommentRequestAction: (state, action) => {
      state.addCommentLoading = true;
      state.addCommentDone = false;
      state.addCommentError = null;
    },
    addCommentSuccessAction: (state, action) => {
      const { content, PostId } = action.payload;
      const post = state.mainPosts.find(d => d.id === PostId);
      post.Comments.unshift(action.payload);
      state.addCommentLoading = false;
      state.addCommentDone = true;
    },
    addCommentFailureAction: (state, action) => {
      state.addCommentLoading = false;
      state.addCommentError = action.payload;
    },
  },
  extraReducers: builder =>
    builder
      .addCase(HYDRATE, (state, action) => {
        // console.log("HYDRATE", action);
        return {
          ...state,
          ...action.payload.post,
        };
      })
      .addCase(loadPost.pending, (state, action) => {
        state.loadPostLoading = true;
        state.loadPostDone = false;
        state.loadPostError = null;
      })
      .addCase(loadPost.fulfilled, (state, action) => {
        state.loadPostLoading = false;
        state.loadPostDone = true;
        state.singlePost = action.payload;
      })
      .addCase(loadPost.rejected, (state, action) => {
        state.loadPostLoading = false;
        state.loadPostError = action.error;
      })

      .addCase(loadUserPosts.pending, (state, action) => {
        state.loadPostsLoading = true;
        state.loadPostsDone = false;
        state.loadPostsError = null;
      })
      .addCase(loadUserPosts.fulfilled, (state, action) => {
        state.loadPostsLoading = false;
        state.loadPostsDone = true;
        // console.log(action.payload);
        state.mainPosts = [...state.mainPosts, ...action.payload.data];
        state.hasMorePosts = action.payload.data?.length === 10;
      })
      .addCase(loadUserPosts.rejected, (state, action) => {
        state.loadPostsLoading = false;
        state.loadPostsError = action.error;
      })
      .addCase(loadHashtagPosts.pending, (state, action) => {
        console.log(
          '-----------------------------------------------------요청 ',
          state.loadPostsLoading
        );
        state.loadPostsLoading = true;
        state.loadPostsDone = false;
        state.loadPostsError = null;
      })
      .addCase(loadHashtagPosts.fulfilled, (state, action) => {
        console.log(
          '-----------------------------------------------------성공 ',
          state.loadPostsLoading
        );
        state.loadPostsLoading = false;
        state.loadPostsDone = true;
        // console.log(action.payload);
        state.mainPosts = [...state.mainPosts, ...action.payload.data];
        state.hasMorePosts = action.payload.data?.length === 10;
      })
      .addCase(loadHashtagPosts.rejected, (state, action) => {
        state.loadPostsLoading = false;
        state.loadPostsError = action.error;
      })
      .addCase(loadPosts.pending, (state, action) => {
        state.loadPostsLoading = true;
        state.loadPostsDone = false;
        state.loadPostsError = null;
      })
      .addCase(loadPosts.fulfilled, (state, action) => {
        state.loadPostsLoading = false;
        state.loadPostsDone = true;
        // console.log(action.payload);
        state.mainPosts = [...state.mainPosts, ...action.payload.data];
        state.hasMorePosts = action.payload.data?.length === 10;
      })
      .addCase(loadPosts.rejected, (state, action) => {
        state.loadPostsLoading = false;
        state.loadPostsError = action.error;
      })
      .addDefaultCase(state => state),
});

export const {
  retweetRequestAction,
  retweetSuccessAction,
  retweetFailureAction,
  removeImageAction,
  uploadImagesRequestAction,
  uploadImagesSuccessAction,
  uploadImagesFailureAction,
  likePostRequestAction,
  likePostSuccessAction,
  likePostFailureAction,
  unLikePostRequestAction,
  unLikePostSuccessAction,
  unLikePostFailureAction,
  loadPostsRequestAction,
  loadPostsSuccessAction,
  loadPostsFailureAction,
  addPostRequestAction,
  addPostSuccessAction,
  addPostFailureAction,
  removePostRequestAction,
  removePostSuccessAction,
  removePostFailureAction,
  addCommentRequestAction,
  addCommentSuccessAction,
  addCommentFailureAction,
} = postSlice.actions;
export default postSlice.reducer;
