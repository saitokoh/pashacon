import React from "react";
import { Switch, Route } from "react-router-dom";
import LoginedIndex from "pages/logined/index/components/LoginedIndex";
import PreLoginIndex from "pages/preLogin/index/components/PreLoginIndex";
import Login from "pages/preLogin/login/components/Login";
import { generateRequireSignInWrapper } from 'redux-token-auth';

const App = () => {
  const requireSignIn = generateRequireSignInWrapper({
    redirectPathIfNotSignedIn: "/login",
  })
  return (
    <>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/login/:token" component={Login} />
        <Route path="/pre" component={PreLoginIndex} />
        <Route path="/" component={requireSignIn(LoginedIndex)} />
      </Switch>
    </>
  );
}
export default App;