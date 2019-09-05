import React, {useEffect} from 'react';
import {Layout, Menu} from 'antd';
import {Switch, Route, NavLink, withRouter, RouteComponentProps} from 'react-router-dom';
import NotFound from './modules/NotFound';
import Content from './components/Content'
import {routeCfg} from './config';
import './App.scss';

const {Header, Footer} = Layout;

const App = (props: RouteComponentProps) => {

    useEffect(function () {
        document.title = 'Express Locallibrary Tutorial Demo';
    }, [])

    return (
        <div className="App">
            <Layout>
                <Header className="l-header">
                    <Menu
                        className="l-menu"
                        theme="dark"
                        mode="horizontal"
                        selectedKeys={[props.location.pathname]}>
                        {routeCfg.filter((route) => {
                            return route.inMenu;
                        }).map((route) => {
                            return (
                                <Menu.Item key={route.path}>
                                    <NavLink to={route.path}>
                                        {route.title}
                                    </NavLink>
                                </Menu.Item>
                            )
                        })}
                    </Menu>
                </Header>
                <Content routes={routeCfg}>
                  <Switch>
                      {routeCfg.map((route) => {
                        return (
                          <Route exact={!!route.exact} component={route.component} path={route.path}/>
                          )
                        })}
                      <Route component={NotFound}/>
                  </Switch>
                </Content>
                <Footer className="l-footer">
                    Express Locallibrary Tutorial Demo ©2019 Created by zhangbx
                </Footer>
            </Layout>
        </div>
    );
}

export default withRouter(App);
