const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const BookInstance = require('../models/bookinstance');
const Book = require('../models/book');

// 显示完整的藏书副本列表
exports.bookinstance_list = (req, res, next) => {
    BookInstance
        .find()
        .populate('book')
        .exec(function(err, list_bookinstances) {
            if (err) {
                return next(err);
            }
            // Successful, so send

            res
                .status(200)
                .send({
                    success: 'true',
                    data: {
                        title: 'Book Instance',
                        bookinstance_list: list_bookinstances
                    }
                })
        });
};

// 为藏书的每一本副本显示详细信息的页面
exports.bookinstance_detail = (req, res, next) => {
    BookInstance
        .findById(req.params.id)
        .populate('book')
        .exec(function(err, bookinstance) {
            if (err) {
                return next(err);
            }
            if (bookinstance == null) { // No results.
                var err = new Error('Book copy not found');
                err.status = 404;
                return next(err);
            }

            res
                .status(200)
                .send({
                    success: 'true',
                    data: {
                        title: 'Book',
                        bookinstance: bookinstance
                    }
                })
        })
};

// 由 GET 显示创建藏书副本的表单
exports.bookinstance_create_get = function(req, res, next) {
    res
        .status(400)
        .send({ success: 'false', error: 'use post' })
};

// 由 POST 处理藏书副本创建操作
exports.bookinstance_create_post = [

    // Validate fields.
    body('book', 'Book must be specified')
    .isLength({ min: 1 })
    .trim(),
    body('imprint', 'Imprint must be specified')
    .isLength({ min: 1 })
    .trim(),
    body('due_back', 'Invalid date')
    .optional({ checkFalsy: true })
    .isISO8601(),

    // Sanitize fields.
    sanitizeBody('book')
    .trim()
    .escape(),
    sanitizeBody('imprint')
    .trim()
    .escape(),
    sanitizeBody('status')
    .trim()
    .escape(),
    sanitizeBody('due_back').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
            res
                .status(400)
                .send({
                    success: 'false',
                    error: errors.array()
                })
        } else {
            var bookinstance = new BookInstance({ book: req.body.book, imprint: req.body.imprint, status: req.body.status, due_back: req.body.due_back });
            // Data from form is valid.
            bookinstance
                .save(function(err) {
                    if (err) {
                        return next(err);
                    }
                    // Successful - redirect to new record.
                    res
                        .status(200)
                        .send({
                            success: 'true',
                            data: {
                                ...req.body,
                                id: bookinstance._id,
                            }
                        })
                });
        }
    }
];
// 由 GET 显示删除藏书副本的表单
exports.bookinstance_delete_get = (req, res) => {
    res
        .status(400)
        .send({ success: 'false', error: 'use post' })
};

// 由 POST 处理藏书副本删除操作
exports.bookinstance_delete_post = (req, res, next) => {
    BookInstance
        .findByIdAndRemove(req.params.id, function(err) {

            if (err) {
                res
                    .status(404)
                    .send({
                        success: 'false',
                        error: `${req.params.id} is not found`,
                        ...err
                    })
                return;
            }
            // Success - go to author list
            res
                .status(200)
                .send({
                    success: 'true',
                    data: {
                        id: req.params.id
                    }
                })
        })
};

// 由 GET 显示更新藏书副本的表单
exports.bookinstance_update_get = (req, res) => {
    res
        .status(400)
        .send({ success: 'false', error: 'use post' })
};

// 由 POST 处理藏书副本更新操作
exports.bookinstance_update_post = [

    // Validate fields.
    body('book', 'Book must be specified')
    .isLength({ min: 1 })
    .trim(),
    body('imprint', 'Imprint must be specified')
    .isLength({ min: 1 })
    .trim(),
    body('due_back', 'Invalid date')
    .optional({ checkFalsy: true })
    .isISO8601(),

    // Sanitize fields.
    sanitizeBody('book')
    .trim()
    .escape(),
    sanitizeBody('imprint')
    .trim()
    .escape(),
    sanitizeBody('status')
    .trim()
    .escape(),
    sanitizeBody('due_back').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
            res
                .status(400)
                .send({
                    success: 'false',
                    error: errors.array()
                })
        } else {
            var bookinstance = { book: req.body.book, imprint: req.body.imprint, status: req.body.status, due_back: req.body.due_back };
            // Data from form is valid.
            BookInstance.findByIdAndUpdate(req.params.id, bookinstance, {
                new: true
            }, function(err) {
                if (err) {
                    res
                        .status(404)
                        .send({
                            success: 'false',
                            error: `${req.params.id} is not found`,
                            ...err
                        })
                    return;
                }
                // Successful - redirect to book detail page.
                res
                    .status(200)
                    .send({
                        success: 'true',
                        data: {
                            ...req.body,
                            id: req.params.id
                        }
                    })
            });
        }
    }
];