const express = require('express');
const router = express.Router();
const Job = require('models/Job');
const Category = require('models/JobCategory');
const Recruiter = require('models/Recruiter');
const Application = require('models/Application');
const Education = require('models/Education');
const Passport = require('models/Passport');
const Experience = require('models/Experience');
const Certificate = require('models/Certificate');

router.get('/', async (req, res, next) => {
  let page = req.query.page || 0
  if (page > 0) page = page - 1
  let per = req.query.per || 20

  var query = {}
  try {
    if (req.user.isAdmin) {
      query = {}
    } else {
      let recruiters = await Recruiter.find({ user: req.user._id }).populate('company')
      let companyIds = recruiters.map(recruiter => recruiter.company)
      query = { _id: {'$in': companyIds} }
    }  
    let applications = await Application.find(query).sort({createdAt: -1}).populate('user job').limit(per).skip(page*per)
    res.render('admin/applications/index', {applications});
  } catch (err) {
    next()
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    let application = await Application.findOne({_id: req.params.id}).populate('user job')
    let user = application.user
    var educations = await Education.find({ user: user._id })
    var passports = await Passport.find({ user: user._id })
    var experiences = await Experience.find({ user: user._id })
    var certificates = await Certificate.find({ user: req.user._id })
    res.render('admin/applications/show', {application, user, educations, passports, experiences, certificates})
  } catch (err) {
    next(err)
  }
});

module.exports = router;