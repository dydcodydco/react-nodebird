import { combineReducers } from 'redux';
import user from './user';
import post from './post';
import axios from 'axios';
import { backUrl } from '../config/config';

axios.defaults.baseURL = backUrl;
axios.defaults.withCredentials = true;

const rootReducer = combineReducers({
	user,
	post,
});

export default rootReducer;
