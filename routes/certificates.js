const express = require('express');
const router = express.Router();
const Certificate = require('models/Certificate');

const validate = (req, res, next) => {
  let { title, number, dateIssued, dateExpired } = req.body
  if (!title || !number || !dateIssued || !dateExpired) {
    req.flash('error', 'Vui lòng điền đầy đủ thông tin')
    if (req.params.id) {
      res.redirect('/certificates/' + req.params.id)
    } else {
      res.redirect('/certificates/new')
    }
  } else {
    next()
  }
}

router.get('/', async (req, res, next) => {
  try {
    var certificates = await Certificate.find({user: req.user._id})
    res.render('certificates/index', { certificates })
  } catch (err) {
    next(err)
  } 
})

router.get('/new', (req, res, next) => {
  res.render('certificates/new')
});

router.post('/', validate, async (req, res, next) => {
  let { title, number, dateIssued, dateExpired } = req.body
  try {
    var certificate = await Certificate.create({ title, number, dateIssued, dateExpired  })
    certificate.user = req.user._id
    await certificate.save()
    req.flash('success', 'Tạo mới thành công')
    res.redirect('/certificates/' + certificate._id)
  } catch(err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    let certificate = await Certificate.findOne({ _id: req.params.id })
    res.render('certificates/show', {certificate})
  } catch (err) {
    next(err)
  }
});

router.post('/:id', validate, async (req, res, next) => {
  var certificate = await Certificate.findOne({_id: req.params.id})
  let { title, number, dateIssued, dateExpired } = req.body
  try {
    certificate.title = title
    certificate.number = number
    certificate.dateIssued = dateIssued
    certificate.dateExpired = dateExpired
    await certificate.save()
    req.flash('success', 'Cập nhật thành công')
    res.redirect('/certificates/' + certificate._id)
  } catch (err) {
    next(err)
  } 
});

router.get('/:id/delete', async (req, res, next) => {
  try {
    var result = await Certificate.deleteOne({_id: req.params.id})
    req.flash('success', 'Đã xóa')
    res.redirect('/certificates')
  } catch (err) {
    next(err)
  } 
})

module.exports = router