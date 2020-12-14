const express = require('express');
const router = express.Router();
const Category = require('models/JobCategory');

router.get('/', async (req, res, next) => {
  try {
    var categories = await Category.find({})
    res.render('admin/jobCategories/index', { categories })
  } catch (err) {
    next(err)
  } 
})

router.get('/new', (req, res, next) => {
  res.render('admin/jobCategories/new')
});

router.post('/', async (req, res, next) => {
  let { title, summary, icon } = req.body
  try {
    var category = await Category.create({title, summary, icon})
    await category.save()
    res.redirect('/admin/jobCategories/' + category._id)
  } catch(err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    let category = await Category.findOne({ _id: req.params.id })
    res.render('admin/jobCategories/show', {category: category})
  } catch (err) {
    next(err)
  }
});

router.post('/:id', async (req, res, next) => {
  let { title, summary, icon } = req.body
  try {
    var category = await Category.findOne({_id: req.params.id})
    category.title = title
    category.summary = summary
    category.icon = icon
    await category.save()
    res.render('admin/jobCategories/show', {category: category, success: "Cập nhật thành công"})
  } catch (err) {
    next(err)
  } 
});

router.get('/:id/delete', async (req, res, next) => {
  try {
    var result = await Category.deleteOne({_id: req.params.id})
    res.redirect('/admin/jobCategories')
  } catch (err) {
    next(err)
  } 
})

module.exports = router