import React from 'react';
import {NavLink, RouteComponentProps, withRouter} from 'react-router-dom';
import {Layout, Breadcrumb} from 'antd';
import {IRouteCfgProps} from '../../config';
import './style.scss';

const {Content} = Layout

interface ILayoutContentProps extends RouteComponentProps {
    children : React.ReactChild;
    routes : IRouteCfgProps[];
}

const LayoutContent = (props : ILayoutContentProps) => {

    const nav = props
        .routes
        .find((route) => {
            return props.location.pathname === route.path;
        })
    const isRightRoutes = !!nav;

    const navTitle = nav ? nav.title : '';

    return (
        <Content className="c-content">
            {isRightRoutes && 
                (<Breadcrumb className="c-content-breadcrumb">
                    <Breadcrumb.Item>
                        <NavLink to="/">首页</NavLink>
                    </Breadcrumb.Item>
                    {props.location.pathname !== '/' && 
                        <Breadcrumb.Item>
                            <NavLink to={props.location.pathname}>{navTitle}</NavLink>
                        </Breadcrumb.Item>
                    }
                </Breadcrumb>)
            }
            {props.children}
        </Content>
    )
}

export default withRouter(LayoutContent);