const jwt = require('jwt-simple');


// 由 POST 处理作者创建操作
exports.login = [
    // Process request after validation and sanitization.
    (req, res, next) => {

        let {
            username,
            password
        } = req.body;

        try {

            if (username === 'admin' && password === 'password') {
                // 生成 token
                let token = jwt.encode({
                    id: username,
                    username,
                    exp: Date.now() + 1000 * 10
                }, 'locallibrary');

                res
                    .status(200)
                    .send({
                        success: 'true',
                        data: {
                            token
                        }
                    })
            } else {
                res
                    .status(400)
                    .send({
                        success: 'false',
                        error: '用户不存在'
                    })
            }
        } catch (e) {
            res
                .status(400)
                .send({
                    success: 'false',
                    error: '登录失败'
                })
        }
    }
];