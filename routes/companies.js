const express = require('express');
const router = express.Router();
const Job = require('models/Job')
const JobCategory = require('models/JobCategory')
const Company = require('models/Company')

/* GET users listing. */
router.get('/', async (req, res, next) => {
  let page = req.query.page || 1
  try {
    let companies = await Company.find({status: 'active'})
    res.render('companies/index', { companies });
  } catch (err) {
    next(err)
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    let company = await Company.findOne({slug: req.params.slug})
    let jobs = await Job.find({company: company._id}).populate('company')
    res.render('companies/show', { company, jobs });
  } catch (err) {
    next(err)
  }
});

module.exports = router;
