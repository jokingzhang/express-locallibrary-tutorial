const async = require('async');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const Author = require('../models/author');
const Book = require('../models/book');

// 显示完整的作者列表
exports.author_list = (req, res, next) => {
    Author
        .find()
        .sort([
            ['family_name', 'ascending']
        ])
        .exec(function(err, list_authors) {
            if (err) {
                return next(err);
            }
            //Successful, so send data.
            res
                .status(200)
                .send({
                    success: 'true',
                    data: {
                        title: 'Author List',
                        author_list: list_authors
                    }
                })

        });
};

// 为每位作者显示详细信息的页面
exports.author_detail = (req, res, next) => {
    async
    .parallel({
        author: function(callback) {
            Author
                .findById(req.params.id)
                .exec(callback)
        },
        authors_books: function(callback) {
            Book.find({
                'author': req.params.id
            }, 'title summary').exec(callback)
        }
    }, function(err, results) {
        if (err) {
            return next(err);
        } // Error in API usage.
        if (results.author == null) { // No results.
            var err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so send data.
        res
            .status(200)
            .send({
                success: 'true',
                data: {
                    title: 'Author Detail',
                    author: results.author,
                    author_books: results.authors_books
                }
            })
    });
};

// 由 GET 显示创建作者的表单
exports.author_create_get = (req, res, next) => {
    res
        .status(400)
        .send({ success: 'false', error: 'use post' })
};

// 由 POST 处理作者创建操作
exports.author_create_post = [

    // Validate fields.
    body('first_name')
    .isLength({ min: 1 })
    .trim()
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.'),
    body('family_name')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Family name must be specified.')
    .isAlphanumeric()
    .withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth')
    .optional({ checkFalsy: true })
    .isISO8601(),
    body('date_of_death', 'Invalid date of death')
    .optional({ checkFalsy: true })
    .isISO8601(),

    // Sanitize fields.
    sanitizeBody('first_name')
    .trim()
    .escape(),
    sanitizeBody('family_name')
    .trim()
    .escape(),
    sanitizeBody('date_of_birth').toDate(),
    sanitizeBody('date_of_death').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res
                .status(400)
                .send({
                    success: 'false',
                    error: errors.array()
                })
        } else {
            // Data from form is valid. Create an Author object with escaped and trimmed
            // data.
            var author = new Author({ first_name: req.body.first_name, family_name: req.body.family_name, date_of_birth: req.body.date_of_birth, date_of_death: req.body.date_of_death });
            author.save(function(err) {
                if (err) {
                    return next(err);
                }

                res
                    .status(200)
                    .send({
                        success: 'true',
                        data: {
                            ...req.body,
                            id: author._id,
                            name: author.name
                        }
                    })
            });
        }
    }
];
// 由 GET 显示删除作者的表单
exports.author_delete_get = (req, res, next) => {
    res
        .status(400)
        .send({ success: 'false', error: 'use post' })
};

// 由 POST 处理作者删除操作
exports.author_delete_post = function(req, res, next) {

    async
    .parallel({
        author: function(callback) {
            Author
                .findById(req.params.id)
                .exec(callback)
        },
        authors_books: function(callback) {
            Book
                .find({ 'author': req.params.id })
                .exec(callback)
        }
    }, function(err, results) {
        if (err) {
            return next(err);
        }
        // Success
        if (results.authors_books.length > 0) {
            // Author has books. Render in same way as for GET route.
            res
                .status(400)
                .send({ success: 'false', error: 'Author has books' })
            return;
        } else {
            // Author has no books. Delete object and redirect to the list of authors.

            Author
                .findByIdAndRemove(req.params.id, function(err) {
                    if (err) {
                        return next(err);
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
        }
    });
};

// 由 GET 显示更新作者的表单
exports.author_update_get = (req, res) => {
    res
        .status(400)
        .send({ success: 'false', error: 'use post' })
};

// 由 POST 处理作者更新操作
exports.author_update_post = [

    // Validate fields.
    body('first_name')
    .isLength({ min: 1 })
    .trim()
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.'),
    body('family_name')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Family name must be specified.')
    .isAlphanumeric()
    .withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth')
    .optional({ checkFalsy: true })
    .isISO8601(),
    body('date_of_death', 'Invalid date of death')
    .optional({ checkFalsy: true })
    .isISO8601(),

    // Sanitize fields.
    sanitizeBody('first_name')
    .trim()
    .escape(),
    sanitizeBody('family_name')
    .trim()
    .escape(),
    sanitizeBody('date_of_birth').toDate(),
    sanitizeBody('date_of_death').toDate(),

    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res
                .status(400)
                .send({
                    success: 'false',
                    error: errors.array()
                })
        } else {
            // Data from form is valid. Create an Author object with escaped and trimmed
            // data.
            var author = { first_name: req.body.first_name, family_name: req.body.family_name, date_of_birth: req.body.date_of_birth, date_of_death: req.body.date_of_death };

            Author.findByIdAndUpdate(req.params.id, author, {
                new: true
            }, function(err) {
                if (err) {
                    return next(err);
                }
                // Success - go to author list
                res
                    .status(200)
                    .send({
                        success: 'true',
                        data: {
                            ...req.body,
                            name: author.name,
                            id: req.params.id
                        }
                    })
            })
        }
    }
];