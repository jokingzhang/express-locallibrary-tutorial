var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require("cors");
const jwt = require('jwt-simple');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var wikiRouter = require('./routes/wiki');
var catalogRouter = require('./routes/catalog');
var authRouter = require('./routes/auth');
var apiRouter = require('./routes/api');

var app = express();

var db = require('./config/db');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// routes
app.use('/', indexRouter);
app.use('/auth', authRouter);

// catch 401 鉴权
app.use(function(req, res, next) {
    const authorization = req.headers['authorization'];
    // 如果存在，则获取 token
    if (authorization) {
        const token = authorization.split(' ')[1];

        try {
            // 对 token 进行校验
            req.user = jwt.decode(token, 'locallibrary');
            next();
        } catch (e) {
            res.status(401).send('Not Allowed');
        }
    } else {
        res.status(401).send('Not Allowed');
    }
});


app.use('/api', apiRouter);
app.use('/users', usersRouter);
app.use('/wiki', wikiRouter);
app.use('/catalog', catalogRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;