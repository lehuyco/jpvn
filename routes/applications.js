const express = require('express');
const router = express.Router();
const Application = require('models/Application');
const Job = require('models/Job');

router.get('/', async (req, res, next) => {
  try {
    var applications = await Application.find({user: req.user._id}).populate('company user job')
    res.render('applications/index', { applications })
  } catch (err) {
    next(err)
  } 
})

router.get('/:id', async (req, res, next) => {
  try {
    let application = await Application.findOne({ _id: req.params.id }).populate('job company')
    let job = await Job.findOne({ _id: application.job }).populate('company')
    res.render('applications/show', {application, job})
  } catch (err) {
    next(err)
  }
});

router.get('/:id/delete', async (req, res, next) => {
  try {
    var result = await Application.deleteOne({_id: req.params.id})
    req.flash('success', 'Đã xóa')
    res.redirect('/applications')
  } catch (err) {
    next(err)
  } 
})

module.exports = router