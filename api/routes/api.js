const express = require('express');
const router = express.Router();

// 导入控制器模块
const book_api = require('../controllers/bookApi');
const author_api = require('../controllers/authorApi');
const genre_api = require('../controllers/genreApi');
const book_instance_api = require('../controllers/bookinstanceApi');
const auth_api = require('../controllers/authApi');

/// 藏书路由 ///

// POST 登录接口
router.post('/login', auth_api.login)

// GET 获取藏书编目主页
router.get('/home', book_api.home);

// GET 请求添加新的藏书。注意此项必须位于显示藏书的路由（使用了 id）之前。
router.get('/book/create', book_api.book_create_get);

// POST 请求添加新的藏书
router.post('/book/create', book_api.book_create_post);

// GET 请求删除藏书
router.get('/book/:id/delete', book_api.book_delete_get);

// POST 请求删除藏书
router.post('/book/:id/delete', book_api.book_delete_post);

// GET 请求更新藏书
router.get('/book/:id/update', book_api.book_update_get);

// POST 请求更新藏书
router.post('/book/:id/update', book_api.book_update_post);

// GET 请求藏书
router.get('/book/:id', book_api.book_detail);

// GET 请求完整藏书列表
router.get('/books', book_api.book_list);

/// 藏书副本、藏书种类、作者的路由与藏书路由结构基本一致，只是无需获取主页 ///

// author

// GET 请求添加新的藏书。注意此项必须位于显示藏书的路由（使用了 id）之前。
router.get('/author/create', author_api.author_create_get);

// POST 请求添加新的藏书
router.post('/author/create', author_api.author_create_post);

// GET 请求删除藏书
router.get('/author/:id/delete', author_api.author_delete_get);

// POST 请求删除藏书
router.post('/author/:id/delete', author_api.author_delete_post);

// GET 请求更新藏书
router.get('/author/:id/update', author_api.author_update_get);

// POST 请求更新藏书
router.post('/author/:id/update', author_api.author_update_post);

// GET 请求藏书
router.get('/author/:id', author_api.author_detail);

// GET 请求完整藏书列表
router.get('/authors', author_api.author_list);

// genre

// GET 请求添加新的藏书。注意此项必须位于显示藏书的路由（使用了 id）之前。
router.get('/genre/create', genre_api.genre_create_get);

// POST 请求添加新的藏书
router.post('/genre/create', genre_api.genre_create_post);

// GET 请求删除藏书
router.get('/genre/:id/delete', genre_api.genre_delete_get);

// POST 请求删除藏书
router.post('/genre/:id/delete', genre_api.genre_delete_post);

// GET 请求更新藏书
router.get('/genre/:id/update', genre_api.genre_update_get);

// POST 请求更新藏书
router.post('/genre/:id/update', genre_api.genre_update_post);

// GET 请求藏书
router.get('/genre/:id', genre_api.genre_detail);

// GET 请求完整藏书列表
router.get('/genres', genre_api.genre_list);

// bookinstance

// GET 请求添加新的藏书。注意此项必须位于显示藏书的路由（使用了 id）之前。
router.get('/bookinstance/create', book_instance_api.bookinstance_create_get);

// POST 请求添加新的藏书
router.post('/bookinstance/create', book_instance_api.bookinstance_create_post);

// GET 请求删除藏书
router.get('/bookinstance/:id/delete', book_instance_api.bookinstance_delete_get);

// POST 请求删除藏书
router.post('/bookinstance/:id/delete', book_instance_api.bookinstance_delete_post);

// GET 请求更新藏书
router.get('/bookinstance/:id/update', book_instance_api.bookinstance_update_get);

// POST 请求更新藏书
router.post('/bookinstance/:id/update', book_instance_api.bookinstance_update_post);

// GET 请求藏书
router.get('/bookinstance/:id', book_instance_api.bookinstance_detail);

// GET 请求完整藏书列表
router.get('/bookinstances', book_instance_api.bookinstance_list);

module.exports = router;