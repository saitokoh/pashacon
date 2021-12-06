import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import createStore from "store/store";
import { ConnectedRouter } from "connected-react-router";
import * as History from "history";
import { verifyCredentials } from 'conf/redux-token-auth-config'
import axiosHelper from 'conf/axios_helper'
import App from "App";

const history = History.createBrowserHistory();
export const store = createStore(history);
verifyCredentials(store)
axiosHelper.setupInterceptors(store, verifyCredentials);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);
