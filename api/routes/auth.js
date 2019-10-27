const express = require('express');
const router = express.Router();
const auth_api = require('../controllers/authApi');

/// 藏书路由 ///

// POST 登录接口
router.post('/login', auth_api.login);

module.exports = router;