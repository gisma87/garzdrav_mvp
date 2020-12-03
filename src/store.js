import {applyMiddleware, compose, createStore} from "redux";
import reducer from "./reducers";
import thunk from 'redux-thunk';
import apiService from "./service/ApiService";

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const enhancer = composeEnhancers(applyMiddleware(thunk.withExtraArgument(apiService)));

const store = createStore(reducer, enhancer)

export default store;