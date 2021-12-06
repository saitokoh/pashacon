import {
  createStore as reduxCreateStore,
  combineReducers,
  applyMiddleware,
} from "redux";
import { reduxTokenAuthReducer as reduxTokenAuth } from "redux-token-auth"
import { connectRouter, routerMiddleware } from "connected-react-router";
import thunk from "redux-thunk";

export default function createStore(history) {
  const appReducer = combineReducers({
    reduxTokenAuth,
    router: connectRouter(history),
  });

  const rootReducer = (state, action) => {
    if (action.type === "CLEAR_STATE") {
      const { router, reduxTokenAuth } = state;
      state = { router, reduxTokenAuth };
    }
    return appReducer(state, action);
  }

  return reduxCreateStore(
    rootReducer,
    applyMiddleware(routerMiddleware(history), thunk)
  );
}
