import React from 'react';
import { Switch, Route } from 'react-router-dom'
import { preloginRoutes } from 'conf/routes'
// component
import Header from 'pages/common/components/PreLoginHeader'
import Footer from 'pages/common/components/Footer'

export default function PreLoginIndex() {

  return (
    <>
      <Header/>
      <Switch>
        {preloginRoutes.map((route, i) => (
          <Route
            path={route.path}
            exact={route.exact}
            key={`route${i}`}
          >
            <route.component/>
          </Route>
        ))}
      </Switch>
      <Footer/>
    </>
  );
}