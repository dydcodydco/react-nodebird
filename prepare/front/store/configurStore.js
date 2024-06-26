import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import createSagaMiddleware from 'redux-saga';

import reducer from '../reducers'; // reducers/index의 rootReducer불러온 것
import rootSaga from '../sagas';

// redux-thunk를 참조해서 만든 미들웨어
const loggerMiddleware =
  ({ dispatch, getState }) =>
    (next) =>
      (action) => {
        // console.log(action, "------------------------------------------loggerMiddleware");
        return next(action);
      };

const sagaMiddleware = createSagaMiddleware();

function getServerState() {
  return typeof document !== 'undefined'
    ? JSON.parse(document.querySelector('#__NEXT_DATA__').textContent)?.props
      .pageProps.initialState
    : undefined;
}
const serverState = getServerState();
// console.log("serverState", serverState);
// configureStore 자체에서 Redux DevTools 설정을 자동으로 처리합니다.
const makeStore = () => {
  // configureStore: store 를 생성
  const store = configureStore({
    reducer, // 리듀서 모듈들이 합쳐진 루트 리듀서
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([sagaMiddleware, loggerMiddleware]),
    // redux-toolkit 은 devTools 등의 미들웨어들을 기본적으로 제공
    // 추가 미들웨어나 enhancers가 필요하다면 여기에 포함시킬 수 있습니다.
    preloadedState: serverState, // SSR
  });
  sagaMiddleware.run(rootSaga);
  // store.sagaTask = sagaMiddleware.run(rootSaga);
  return store;
};

const wrapper = createWrapper(makeStore, {
  // createWrapper: wrapper 생성, wrapper 에 store 바인딩
  debug: process.env.NODE_ENV === 'development', // true이면 리덕스에 관한
});

export default wrapper;
