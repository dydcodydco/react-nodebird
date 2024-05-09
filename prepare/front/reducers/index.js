import axios from 'axios';
import { combineReducers } from 'redux';

import post from './post';
import user from './user';
import { backUrl } from '../config/config';

axios.defaults.baseURL = backUrl;
axios.defaults.withCredentials = true;

const rootReducer = combineReducers({
  user,
  post,
});

export default rootReducer;
