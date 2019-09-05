
import React from 'react';
import Home from './modules/Home';
import Book from './modules/Book';
import BookDetail from './modules/Book/Detail';
import Author from './modules/Author';
import AuthorDetail from './modules/Author/Detail';
import Genre from './modules/Genre';
import GenreDetail from './modules/Genre/Detail';
import Bookinstance from './modules/Bookinstance';
import BookinstanceDetail from './modules/Bookinstance/Detail';

export interface IRouteCfgProps {
    key: string;
    title: string;
    path: string;
    exact?: boolean;
    inMenu?: boolean;
    component: React.ComponentType<any>;
}

export const routeCfg: IRouteCfgProps[] = [{
    key: 'home',
    title: '首页',
    exact: true,
    component: Home,
    inMenu: true,
    path: '/',
},{
    key: 'book',
    title: '书籍',
    path: '/book',
    exact: true,
    component: Book,
    inMenu: true,
},{
    key: 'book-detail',
    title: '书籍详情',
    path: '/book/:id',
    component: BookDetail,
},{
    key: 'author',
    title: '作者',
    path: '/author',
    exact: true,
    component: Author,
    inMenu: true,
},{
    key: 'author-detail',
    title: '作者详情',
    path: '/author/:id',
    component: AuthorDetail,
},{
    key: 'genre',
    title: '分类',
    path: '/genre',
    exact: true,
    component: Genre,
    inMenu: true,
},{
    key: 'genre-detail',
    title: '分类详情',
    path: '/genre/:id',
    component: GenreDetail,
},{
    key: 'bookinstance',
    title: '书籍实例',
    path: '/bookinstance',
    exact: true,
    component: Bookinstance,
    inMenu: true,
},{
    key: 'bookinstance-detail',
    title: '书籍实例详情',
    path: '/bookinstance/:id',
    component: BookinstanceDetail,
}]