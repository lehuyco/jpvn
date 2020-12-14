const express = require('express');
const router = express.Router();
const Post = require('models/Post')
const Recruiter = require('models/Recruiter')
const Job = require('models/Job')
const Application = require('models/Application')

/* GET home page. */
router.get('/', async (req, res, next) => {
  var postCount = 0
  var jobCount = 0
  var applicationCount = 0
  if (req.user.isAdmin) {
    postCount = await Post.countDocuments({})
    jobCount = await Job.countDocuments({})
    applicationCount = await Application.countDocuments({})
  } else {
    let recruiters = await Recruiter.find({user: req.user._id})
    let companyIds = recruiters.map(recruiter => recruiter.company)
    let companies = await Company.find({ _id: {'$in': companyIds}, status: 'active' })
    jobCount = await Job.countDocuments({ company: {'$in': companyIds}})
    applicationCount = await Application.countDocuments({ company: {'$in': companyIds}})
  }
  res.render('admin/dash/index', {postCount, jobCount, applicationCount});
});

module.exports = router;
