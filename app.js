var express = require('express')
var path = require('path')
const { expressjwt: jwt } = require('express-jwt')
const config = require('./config')
const { errorMessage } = require('./utils/errorMessage')

// express项目提供的记录日志包
var cookieParser = require('cookie-parser')

// express项目提供的记录日志包
var logger = require('morgan')

var app = express()

// 跨域配置
const cors = require('cors')
app.use(cors())

// Token
app.use(jwt({ secret: config.token_secret, algorithms: ['HS256'] }).unless({
  path: [
    '/api/user/login',
    '/api/user/register',
    /images/,
    /index/
  ]
}))

// 路由
var indexRouter = require('./routes/index')
var usersRouter = require('./routes/module/users')
const image = require('./routes/module/images')
const postRouter = require('./routes/module/post')
const FrontAPI = require('./routes/module/FrontAPI')
const categoryRouter = require('./routes/module/category')

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(logger('dev'))
// 图片静态资源地址
app.use('/images', express.static('./public/assets/images'))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// 响应信息中间件
app.use((req, res, next) => {
  /**
   * 错误信息返回函数
   * @param {*} error 错误的信息
   * @param {*} success 状态, 默认是false
   */
  res.error = (error, success = false) => {
    console.log(error)
    res.json({
      code: 5000,
      message: error instanceof Error ? errorMessage(error.code).message : error,
      success
    })
  }
  /**
   * 成功格式
   * @param {*} data 数据 
   * @param {*} success 状态
   */
  res.success = (data, message) => {
    res.json({
      code: 2000,
      data,
      message,
      success: true
    })
  }
  next()
})

app.use('/', indexRouter)
// 用户接口
app.use('/api/user', usersRouter)
// 图片接口
app.use('/api/upload', image)
// 文章接口
app.use('/api/post', postRouter)
// 分类接口
app.use('/api/category', categoryRouter)

// 前台接口
app.use('/index', FrontAPI)

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.json(errorMessage(err.code))
})

module.exports = app
