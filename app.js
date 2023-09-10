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

// 响应信息中间件
app.use((req, res, next) => {
  /**
   * 错误信息返回函数
   * @param {*} error 错误的信息
   * @param {*} success 状态, 默认是false
   */
  res.error = (error, success = false) => {
    res.json({
      code: 5000,
      message: error instanceof Error ? error.message : error,
      success
    })
  }
  /**
   * 成功格式
   * @param {*} data 数据 
   * @param {*} success 状态
   */
  res.success = (data, success = true) => {
    res.json({
      code: 2000,
      data: data,
      message: 'ok',
      success: success
    })
  }
  next()
})

// 用户接口
app.use('/api/user', usersRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})


module.exports = app
