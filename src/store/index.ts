import { legacy_createStore as createStore, compose } from "redux";
import rootReducer from './reducers';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

const store = createStore(rootReducer, composeEnhancers());

export default store;