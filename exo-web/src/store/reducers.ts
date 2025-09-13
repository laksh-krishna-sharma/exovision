import { combineReducers } from "redux";
import type { AnyAction} from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import {
    loginData,
    signupData,
 } from "./coreReducer";

const persistConfig = {
    key: "root",
    storage,
    version: 1, // Added version to force state reset if needed
};

const rootReducer = combineReducers({
    loginData,
    signupData,
});

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>, AnyAction>(
    persistConfig,
    rootReducer
);

export default persistedReducer;