const express = require('express');
const router = express.Router();
const Education = require('models/Education');

router.get('/', async (req, res, next) => {
  try {
    var educations = await Education.find({user: req.user._id})
    res.render('educations/index', { educations })
  } catch (err) {
    next(err)
  } 
})

router.get('/new', (req, res, next) => {
  res.render('educations/new')
});

router.post('/', async (req, res, next) => {
  let { title, graduatedAt } = req.body
  if (!title || !graduatedAt) {
    req.flash('error', 'Vui lòng điền đầy đủ thông tin')
    res.redirect('/educations/new')
  }
  try {
    var education = await Education.create({title, graduatedAt})
    education.user = req.user._id
    await education.save()
    req.flash('success', 'Tạo mới thành công')
    res.redirect('/educations/' + education._id)
  } catch(err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    let education = await Education.findOne({ _id: req.params.id, user: req.user._id })
    res.render('educations/show', {education})
  } catch (err) {
    next(err)
  }
});

router.post('/:id', async (req, res, next) => {
  var education = await Education.findOne({_id: req.params.id})
  let { title, graduatedAt } = req.body
  if (!title || !graduatedAt) {
    req.flash('error', 'Vui lòng điền đầy đủ thông tin')
    res.redirect('/educations/' + education._id)
  }
  try {
    education.title = title
    education.graduatedAt = graduatedAt
    await education.save()
    req.flash('success', 'Cập nhật thành công')
    res.redirect('/educations/' + education._id)
  } catch (err) {
    next(err)
  } 
});

router.get('/:id/delete', async (req, res, next) => {
  try {
    var result = await Education.deleteOne({_id: req.params.id})
    req.flash('success', 'Đã xóa')
    res.redirect('/educations')
  } catch (err) {
    next(err)
  } 
})

module.exports = router