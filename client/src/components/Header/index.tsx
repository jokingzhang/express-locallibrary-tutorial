import React, { useEffect } from "react";
import { Layout, Menu, Dropdown, Avatar } from "antd";
import { Switch, Route, NavLink, withRouter, RouteComponentProps } from "react-router-dom";
import { routeCfg } from "../../config";
import { AuthContext } from "../../store/Auth";

const { Header, Footer } = Layout;

const App = (props: RouteComponentProps) => {
  const { state, dispatch } = React.useContext(AuthContext);

  const handleLogout = () => {
    dispatch({
      type: "LOGOUT"
    });
  };

  return (
    <Header className="l-header">
      <Menu className="l-menu" theme="dark" mode="horizontal" selectedKeys={[props.location.pathname]}>
        {routeCfg
          .filter(route => {
            return route.inMenu;
          })
          .map(route => {
            return (
              <Menu.Item key={route.path}>
                <NavLink to={route.path}>{route.title}</NavLink>
              </Menu.Item>
            );
          })}

        <Dropdown
          overlay={
            <Menu>
              <Menu.Item>
                <a onClick={handleLogout}>登出</a>
              </Menu.Item>
            </Menu>
          }
        >
          <a className="ant-dropdown-link" href="#">
            <Avatar icon="user" /> {state.user || "admin"}
          </a>
        </Dropdown>
      </Menu>
    </Header>
  );
};

export default withRouter(App);
