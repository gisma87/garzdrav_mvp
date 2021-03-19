import {applyMiddleware, compose, createStore} from "redux";
import reducer from "./reducers";
import thunk from 'redux-thunk';
import apiService from "./service/ApiService";

type ReducerType = typeof reducer;
export type StateType = ReturnType<ReducerType>

// это нужно в dev версии для плагина браузера React Developer Tools
const composeEnhancers =
  typeof window === 'object' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

// третьим параметром thunk в actions будет отдавать apiService
const enhancer = composeEnhancers(applyMiddleware(thunk.withExtraArgument(apiService)));

const store = createStore(reducer, enhancer)

export default store;