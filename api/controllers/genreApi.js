const async = require('async');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const Genre = require('../models/genre');
const Book = require('../models/book');

// 显示完整的藏书种类列表
exports.genre_list = (req, res) => {
    Genre
        .find()
        .sort([
            ['name']
        ])
        .exec(function(err, list_genres) {
            if (err) {
                return next(err);
            }
            //Successful, so render

            res
                .status(200)
                .send({
                    success: 'true',
                    data: {
                        title: 'Genre List',
                        genre_list: list_genres
                    }
                })
        });
};

// 为每一类藏书显示详细信息的页面
exports.genre_detail = (req, res, next) => {
    async
    .parallel({
        genre: function(callback) {
            Genre
                .findById(req.params.id)
                .exec(callback);
        },

        genre_books: function(callback) {
            Book
                .find({ 'genre': req.params.id })
                .exec(callback);
        }
    }, function(err, results) {
        if (err) {
            return next(err);
        }
        if (results.genre == null) { // No results.
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res
            .status(200)
            .send({
                success: 'true',
                data: {
                    title: 'Genre Detail',
                    genre: results.genre,
                    genre_books: results.genre_books
                }
            })
    });
};

// 由 GET 显示创建藏书种类的表单
exports.genre_create_get = (req, res, next) => {
    // 先传空值
    res
        .status(400)
        .send({ success: 'false', error: 'use post' })
};

// 由 POST 处理藏书种类创建操作
exports.genre_create_post = [

    // Validate that the name field is not empty.
    body('name', 'Genre name required')
    .isLength({ min: 1 })
    .trim(),

    // Sanitize (trim and escape) the name field.
    sanitizeBody('name')
    .trim()
    .escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        if (!errors.isEmpty()) {
            res
                .status(400)
                .send({
                    success: 'false',
                    error: errors.array()
                })
        } else {

            // Data from form is valid. Check if Genre with same name already exists.
            Genre
                .findOne({ 'name': req.body.name })
                .exec(function(err, found_genre) {
                    if (err) {
                        return next(err);
                    }

                    if (found_genre) {
                        // Genre exists, redirect to its detail page.
                        res
                            .status(400)
                            .send({ success: 'false', error: `${req.body.name} is exists` })
                    } else {
                        var genre = new Genre({ name: req.body.name });
                        genre.save(function(err) {
                            if (err) {
                                return next(err);
                            }
                            // Genre saved. Redirect to genre detail page.
                            res
                                .status(200)
                                .send({
                                    success: 'true',
                                    data: {
                                        id: genre._id,
                                        name: req.body.name
                                    }
                                })
                        });

                    }

                });
        }
    }
];

// 由 GET 显示删除藏书种类的表单
exports.genre_delete_get = (req, res) => {
    res
        .status(400)
        .send({ success: 'false', error: 'use post' })
};

// 由 POST 处理藏书种类删除操作
exports.genre_delete_post = (req, res, next) => {
    async
    .parallel({
        genre: function(callback) {
            Genre
                .findById(req.params.id)
                .exec(callback)
        },
        genre_books: function(callback) {
            Book
                .find({ 'genre': req.params.id })
                .exec(callback)
        }
    }, function(err, results) {
        if (err) {
            return next(err);
        }

        // Success
        if (results.genre_books.length > 0) {
            // Author has books. Render in same way as for GET route.
            res
                .status(400)
                .send({ success: 'false', error: 'Genre has books' })
            return;
        }

        if (!results.genre) {
            res
                .status(404)
                .send({ success: 'false', error: `Genre ${req.params.id} not found` })
            return;
        }
        // Author has no books. Delete object and redirect to the list of authors.

        Genre
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
    });
};

// 由 GET 显示更新藏书种类的表单
exports.genre_update_get = (req, res) => {
    res
        .status(400)
        .send({ success: 'false', error: 'use post' })
};

// 由 POST 处理藏书种类更新操作
exports.genre_update_post = [

    // Validate that the name field is not empty.
    body('name', 'Genre name required')
    .isLength({ min: 1 })
    .trim(),

    // Sanitize (trim and escape) the name field.
    sanitizeBody('name')
    .trim()
    .escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        if (!errors.isEmpty()) {
            res
                .status(400)
                .send({
                    success: 'false',
                    error: errors.array()
                })
            return;
        }

        var genre = { name: req.body.name };
        Genre.findByIdAndUpdate(req.params.id, genre, {}, function(err, item) {
            if (err) {
                return next(err);
            }

            if (!item) {
                res
                    .status(404)
                    .send({
                        success: 'false',
                        error: `${req.params.id} is not found`
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
];