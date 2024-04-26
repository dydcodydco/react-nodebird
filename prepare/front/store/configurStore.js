import { createWrapper } from "next-redux-wrapper";
import { configureStore } from "@reduxjs/toolkit";
import reducer from "../reducers";

const makeStore = () =>
	configureStore({
		reducer,
		middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
	});

const wrapper = createWrapper(makeStore, {
	debug: process.env.NODE_ENV === "development",
});

export default wrapper;
