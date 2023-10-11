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
    const user_id = result[0].user_id
    if (isPasswordValid) {
      const token = jwt.sign({ username, user_id }, config.token_secret, { expiresIn: '2h' })
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

// 获取用户信息
router.get('/userinfo', (req, res) => {
  const { username } = req.auth
  DB.query('select username, email, avatar, nickname, registration_date, bg, description  from users where username = ?', username, (err, result) => {
    if (err) return res.error(err)
    if (result.length === 0) return res.error('用户信息不存在')
    const userinfo = result[0]
    res.success({ userinfo })
  })
})

// 修改用户资料
router.post('/changeUserInfo', (req, res) => {
  const userinfo = req.body
  const { username } = req.auth
  // 1 查询邮箱是否存在

  DB.query('select email,nickname,username from users where email = ?', userinfo.email, (err, result) => {
    if (err) return res.error(err)
    // 查询是否有重复的邮箱
    if (result.length > 0) {
      // 如果有重复的邮箱,查询这个邮箱的有户名是否和用户修改的用户名一样
      // 如果一样说明这个用户只是想修改其它资料而已并不想修改邮箱
      if (result[0].username === username) {
        DB.query('update users set ? where username = ?', [userinfo, username], (err, result) => {
          if (err) return res.error(err)
          if (result.affectedRows === 1) {
            return res.success()
          }
        })
      } else {
        // 用户名不一样,是其它用户的邮箱,则不能修改邮箱
        return res.error('邮箱已存在')
      }
    } else {
      // 2 邮箱没有重复, 进行修改资料
      DB.query('update users set ? where username = ?', [userinfo, username], (err, result) => {
        if (err) return res.error(err)
        if (result.affectedRows === 1) {
          res.success(null, '修改成功')
        }
      })
    }

  })
})

router.post('/setUserProfile', (req, res) => {
  const result = req.body
  const { username } = req.auth
  const { profiles } = result
  DB.query(`update users set profiles = ? where username = "${username}"`, profiles, (err, result) => {
    if (err) return res.error(err)
    if (result.affectedRows === 1) {
      res.success(null, '设置成功')
    }
  })
})

router.get('/userProfile', (req, res) => {
  const { username } = req.auth
  DB.query('select profiles from users where username = ?', username, (err, result) => {
    if (err) return res.error(err)
    if (result.length !== 0) {
      res.success(...result)
    }
  })
})

module.exports = router
