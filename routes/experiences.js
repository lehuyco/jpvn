const express = require('express');
const router = express.Router();
const Experience = require('models/Experience');

const validate = (req, res, next) => {
  let { shipname, title, manager, nationality, gt, power, dateBoarding, dateLeaved } = req.body
  if (!shipname || !title || !manager || !nationality || !gt || !power || !dateBoarding || !dateLeaved) {
    req.flash('error', 'Vui lòng điền đầy đủ thông tin')
    if (req.params.id) {
      res.redirect('/experiences/' + req.params.id)
    } else {
      res.redirect('/experiences/new')
    }
  } else {
    next()
  }
}

router.get('/', async (req, res, next) => {
  try {
    var experiences = await Experience.find({user: req.user._id})
    res.render('experiences/index', { experiences })
  } catch (err) {
    next(err)
  } 
})

router.get('/new', (req, res, next) => {
  res.render('experiences/new')
});

router.post('/', validate, async (req, res, next) => {
  let { shipname, title, manager, nationality, gt, power, dateBoarding, dateLeaved } = req.body
  try {
    var experience = await Experience.create({ shipname, title, manager, nationality, gt, power, dateBoarding, dateLeaved })
    experience.user = req.user._id
    await experience.save()
    req.flash('success', 'Tạo mới thành công')
    res.redirect('/experiences/' + experience._id)
  } catch(err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    let experience = await Experience.findOne({ _id: req.params.id, user: req.user._id })
    res.render('experiences/show', {experience})
  } catch (err) {
    next(err)
  }
});

router.post('/:id', validate, async (req, res, next) => {
  var experience = await Experience.findOne({_id: req.params.id})
  let { shipname, title, manager, nationality, gt, power, dateBoarding, dateLeaved } = req.body
  try {
    experience.shipname = shipname
    experience.title = title
    experience.manager = manager
    experience.nationality = nationality
    experience.gt = gt
    experience.power = power
    experience.dateBoarding = dateBoarding
    experience.dateLeaved = dateLeaved
    await experience.save()
    req.flash('success', 'Cập nhật thành công')
    res.redirect('/experiences/' + experience._id)
  } catch (err) {
    next(err)
  } 
});

router.get('/:id/delete', async (req, res, next) => {
  try {
    var result = await Experience.deleteOne({_id: req.params.id})
    req.flash('success', 'Đã xóa')
    res.redirect('/experiences')
  } catch (err) {
    next(err)
  } 
})

module.exports = router