import React from 'react';
import { Switch, Route } from 'react-router-dom'
import { connect, useDispatch } from "react-redux";
import { loginedRoutes } from 'conf/routes'
import { signOutUser } from 'conf/redux-token-auth-config';

import Header from 'pages/common/components/LoginedHeader'
import Footer from 'pages/common/components/Footer'

function LoginedIndex({ signOutUser}) {
  const dispatch = useDispatch();

  // methods
  const signOut = () => {
    signOutUser();
    dispatch({ type: "CLEAR_STATE" });
  }
  
  return (
  <>
    <Header signOut={signOut}/>
    <Switch>
      {loginedRoutes.map((route, i) => (
        <Route
          path={route.path}
          exact={route.exact}
          key={`route${i}`}
        >
          <route.component />
        </Route>
      ))}
    </Switch>
    <Footer/>
  </>
  );
}

export default connect(
  null,
  { signOutUser },
)(LoginedIndex)