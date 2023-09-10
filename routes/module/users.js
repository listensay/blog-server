const express = require('express')
const router = express.Router()
const DB = require('../../db/index')
const Bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../../config')

router.post('/login', function (req, res) {
  const { username, password } = req.body
  // 1.判断是否有用户名
  DB.query('select * from users where username = ?', username, function (err, result) {
    if (err) return res.error(err)
    // 2.用户名不存在 退出
    if (result.length === 0) return res.error('用户名或密码错误')

    // 3.用户名存在 进行密码匹配
    const isPasswordValid = Bcrypt.compareSync(password, result[0].password)

    if (isPasswordValid) {
      const token = jwt.sign({ username }, config.token_secret, { expiresIn: '2h' })
      console.log(123)
      res.success(token, '登陆成功')
    } else {
      res.error('用户名或密码错误')
    }
  })
})

// 注册用户
router.post('/register', (req, res) => {
  let { username, password, email } = req.body
  // 1.首先判断注册的用户名是否存在
  DB.query('select * from users where username = ?', username, (err, result) => {
    if (err) return res.error(err)
    if (result.length > 0) return res.error('用户名已存在')
    // 用户名不存在, 检查邮箱是否存在
    DB.query('select * from users where email = ?', email, (err, result) => {
      if (err) return res.error(err)
      if (result.length > 0) return res.error('邮箱已存在')
      // 2.用户名, 邮箱都不存在 可以注册
      // 3.将密码进行加密
      password = Bcrypt.hashSync(password, 10)
      DB.query('INSERT INTO users set ?', { username, password, email }, (err, result) => {
        if (err) return res.error(err)
        if (result.affectedRows !== 1) return res.error('注册失败')
        res.success(null, '注册成功!')
      })
    })
  })
})

module.exports = router
