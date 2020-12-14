const express = require('express');
const router = express.Router();
const Passport = require('models/Passport');

const validate = (req, res, next) => {
  let { type, placeIssued, number, dateIssued, dateExpired} = req.body
  if (!type || !placeIssued || !number || !dateIssued || !dateExpired) {
    req.flash('error', 'Vui lòng điền đầy đủ thông tin')
    if (req.params.id) {
      res.redirect('/passports/' + req.params.id)
    } else {
      res.redirect('/passports/new')
    }
  } else {
    next()
  }
}

router.get('/', async (req, res, next) => {
  try {
    var passports = await Passport.find({user: req.user._id})
    res.render('passports/index', { passports })
  } catch (err) {
    next(err)
  } 
})

router.get('/new', (req, res, next) => {
  res.render('passports/new')
});

router.post('/', validate, async (req, res, next) => {
  let { type, placeIssued, number, dateIssued, dateExpired } = req.body
  try {
    var passport = await Passport.create({ type, placeIssued, number, dateIssued, dateExpired })
    passport.user = req.user._id
    await passport.save()
    req.flash('success', 'Tạo mới thành công')
    res.redirect('/passports/' + passport._id)
  } catch(err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    let passport = await Passport.findOne({ _id: req.params.id, user: req.user._id })
    res.render('passports/show', {passport})
  } catch (err) {
    next(err)
  }
});

router.post('/:id', validate, async (req, res, next) => {
  var passport = await Passport.findOne({_id: req.params.id})
  let { type, placeIssued, number, dateIssued, dateExpired } = req.body
  try {
    passport.type = type
    passport.placeIssued = placeIssued
    passport.number = number
    passport.dateIssued = dateIssued
    passport.dateExpired = dateExpired
    await passport.save()
    req.flash('success', 'Cập nhật thành công')
    res.redirect('/passports/' + passport._id)
  } catch (err) {
    next(err)
  } 
});

router.get('/:id/delete', async (req, res, next) => {
  try {
    var result = await Passport.deleteOne({_id: req.params.id})
    req.flash('success', 'Đã xóa')
    res.redirect('/passports')
  } catch (err) {
    next(err)
  } 
})

module.exports = router