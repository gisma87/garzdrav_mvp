import {applyMiddleware, compose, createStore} from "redux";
import reducer from "./reducers";

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

const loggerMiddleware = store => next => action => {
  return next(action)
}

const enhancer = composeEnhancers(applyMiddleware(loggerMiddleware));

const store = createStore(reducer, enhancer)

export default store;