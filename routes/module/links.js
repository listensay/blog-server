const express = require('express')
const router = express.Router()
const DB = require('../../db/index')

// 友情链接查询
router.get('/links', (req, res) => {
  DB.query('select * from category', (err, result) => {
    if (err) return res.error(err)
    if (result.length <= 0) res.error('查询失败')
    res.success(result)
  })
})

// 友情链接修改
router.put('/links', (req, res) => {
  const category = req.body
  DB.query('update category set ? where category_id = ?', [category, category.category_id], (err, result) => {
    if (err) return res.error(err)
    if (result.affectedRows !== 1) res.error('修改失败')
    res.success(null, '修改成功')
  })
})

// 添加友情链接
router.post('/links', (req, res) => {
  const { category_name, category_img = '', category_desc } = req.body
  DB.query('INSERT INTO category set ?', { category_name, category_img, category_desc }, (err, result) => {
    if (err) return res.error(err)
    if (result.affectedRows !== 1) return res.error('添加失败')
    res.success(null, '添加成功!')
  })
})

// 删除分类
router.delete('/links/:categoryId', (req, res) => {
  const { categoryId } = req.params

  DB.query('DELETE FROM category WHERE category_id = ?', [categoryId], (err, result) => {
    if (err) return res.error(err)
    if (result.affectedRows !== 1) return res.error('删除失败')
    res.success(null, '删除成功!')
  })
})

module.exports = router
