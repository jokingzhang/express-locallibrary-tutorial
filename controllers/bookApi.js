const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookinstance');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const async = require('async');

exports.home = (req, res, next) => {
    async
    .parallel({
        book_count: function(callback) {
            Book.count({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        book_instance_count: function(callback) {
            BookInstance.count({}, callback);
        },
        book_instance_available_count: function(callback) {
            BookInstance.count({
                status: '可供借阅'
            }, callback);
        },
        author_count: function(callback) {
            Author.count({}, callback);
        },
        genre_count: function(callback) {
            Genre.count({}, callback);
        }
    }, function(err, results) {
        if (err) {
            return next(err);
        }

        //Successful, so send data.
        res
            .status(200)
            .send({
                success: 'true',
                data: {
                    title: 'Local Library Home',
                    ...results
                }
            })
    });
};

// 显示完整的藏书列表
exports.book_list = (req, res) => {
    Book.find({}, 'title author')
        .populate('author')
        .exec(function(err, list_books) {
            if (err) {
                return next(err);
            }
            //Successful, so send data.
            res
                .status(200)
                .send({
                    success: 'true',
                    data: {
                        title: 'Book List',
                        book_list: list_books
                    }
                })
        });
};

// 为每种藏书显示详细信息的页面
exports.book_detail = (req, res, next) => {
    async
    .parallel({
        book: function(callback) {
            Book
                .findById(req.params.id)
                .populate('author')
                .populate('genre')
                .exec(callback);
        },
        book_instance: function(callback) {
            BookInstance
                .find({ 'book': req.params.id })
                .exec(callback);
        }
    }, function(err, results) {
        if (err) {
            return next(err);
        }
        if (results.book == null) { // No results.
            var err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }
        res
            .status(200)
            .send({
                success: 'true',
                data: {
                    title: 'Book Detail',
                    book: results.book,
                    book_instances: results.book_instance
                }
            })
    });
};

// 由 GET 显示创建藏书的表单
exports.book_create_get = function(req, res, next) {
    res
        .status(400)
        .send({ success: 'false', error: 'use post' })
};

// 由 POST 处理藏书创建操作 Handle book create on POST.
exports.book_create_post = [
    // Convert the genre to an array.
    (req, res, next) => {
        if (!(req.body.genre instanceof Array)) {
            if (typeof req.body.genre === 'undefined')
                req.body.genre = [];
            else
                req.body.genre = new Array(req.body.genre);
        }
        next();
    },

    // Validate fields.
    body('title', 'Title must not be empty.')
    .isLength({ min: 1 })
    .trim(),
    body('author', 'Author must not be empty.')
    .isLength({ min: 1 })
    .trim(),
    body('summary', 'Summary must not be empty.')
    .isLength({ min: 1 })
    .trim(),
    body('isbn', 'ISBN must not be empty')
    .isLength({ min: 1 })
    .trim(),

    // Sanitize fields (using wildcard).
    sanitizeBody('*')
    .trim()
    .escape(),
    sanitizeBody('genre.*').escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages. Get
            // all authors and genres for form.
            res
                .status(400)
                .send({
                    success: 'false',
                    error: errors.array()
                })
        } else {
            // Data from form is valid. Save book.
            var book = new Book({ title: req.body.title, author: req.body.author, summary: req.body.summary, isbn: req.body.isbn, genre: req.body.genre });
            book.save(function(err) {
                if (err) {
                    return next(err);
                }
                res
                    .status(200)
                    .send({
                        success: 'true',
                        data: {
                            ...req.body,
                            id: book._id
                        }
                    })
            });
        }
    }
];
// 由 GET 显示删除藏书的表单
exports.book_delete_get = (req, res) => {
    res
        .status(400)
        .send({ success: 'false', error: 'use post' })
};

// 由 POST 处理藏书删除操作
exports.book_delete_post = (req, res) => {
    async
    .parallel({
        book: function(callback) {
            Book
                .findById(req.params.id)
                .exec(callback)
        },
        instance: function(callback) {
            BookInstance
                .find({ 'book': req.params.id })
                .exec(callback)
        }
    }, function(err, results) {
        if (err) {
            return next(err);
        }
        // Success
        if (results.instance.length > 0) {
            res
                .status(400)
                .send({ success: 'false', error: 'Book has instances' })
            return;
        } else {

            Book
                .findByIdAndRemove(req.params.id, function deleteAuthor(err) {
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

// 由 GET 显示更新藏书的表单
exports.book_update_get = function(req, res, next) {
    res
        .status(400)
        .send({ success: 'false', error: 'use post' })
};

// 由 POST 处理藏书更新操作
exports.book_update_post = [

    // Convert the genre to an array
    (req, res, next) => {
        if (!(req.body.genre instanceof Array)) {
            if (typeof req.body.genre === 'undefined')
                req.body.genre = [];
            else
                req.body.genre = new Array(req.body.genre);
        }
        next();
    },

    // Validate fields.
    body('title', 'Title must not be empty.')
    .isLength({ min: 1 })
    .trim(),
    body('author', 'Author must not be empty.')
    .isLength({ min: 1 })
    .trim(),
    body('summary', 'Summary must not be empty.')
    .isLength({ min: 1 })
    .trim(),
    body('isbn', 'ISBN must not be empty')
    .isLength({ min: 1 })
    .trim(),

    // Sanitize fields.
    sanitizeBody('title')
    .trim()
    .escape(),
    sanitizeBody('author')
    .trim()
    .escape(),
    sanitizeBody('summary')
    .trim()
    .escape(),
    sanitizeBody('isbn')
    .trim()
    .escape(),
    sanitizeBody('genre.*')
    .trim()
    .escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages. Get
            // all authors and genres for form.
            res
                .status(400)
                .send({
                    success: 'false',
                    error: errors.array()
                })
        } else {
            var book = { title: req.body.title, author: req.body.author, summary: req.body.summary, isbn: req.body.isbn, genre: req.body.genre };

            // Data from form is valid. Update the record.
            Book.findByIdAndUpdate(req.params.id, book, {
                new: true
            }, function(err) {
                if (err) {
                    return next(err);
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