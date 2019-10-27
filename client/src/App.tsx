import React, { useEffect, useReducer } from "react";
import { Layout, Menu } from "antd";
import { Switch, Route, NavLink, withRouter, RouteComponentProps } from "react-router-dom";
import NotFound from "./modules/NotFound";
import Content from "./components/Content";
import Header from "./components/Header";

import { routeCfg } from "./config";
import "./App.scss";

const { Footer } = Layout;

const App = (props: RouteComponentProps) => {
  useEffect(function() {
    document.title = "Express Locallibrary Tutorial Demo";
  }, []);

  return (
    <div className="App">
      <Layout>
        <Header />
        <Content routes={routeCfg}>
          <Switch>
            {routeCfg.map(route => {
              return <Route exact={!!route.exact} component={route.component} path={route.path} />;
            })}
            <Route component={NotFound} />
          </Switch>
        </Content>
        <Footer className="l-footer">Express Locallibrary Tutorial Demo ©2019 Created by zhangbx</Footer>
      </Layout>
    </div>
  );
};

export default withRouter(App);
