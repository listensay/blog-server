var createError = require('http-errors')
var express = require('express')
var path = require('path')

// express项目提供的记录日志包
var cookieParser = require('cookie-parser')

// express项目提供的记录日志包
var logger = require('morgan')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/module/users')
var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', indexRouter)

// 用户接口
app.use('/api/user', usersRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

module.exports = app