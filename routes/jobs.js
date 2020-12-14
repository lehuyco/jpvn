const express = require('express');
const router = express.Router();
const Job = require('models/Job')
const JobCategory = require('models/JobCategory')
const Application = require('models/Application')
const Company = require('models/Company')

/* GET users listing. */
router.get('/', async (req, res, next) => {
  let page = req.query.page || 1
  let categorySlug = req.query.category
  try {
    var query = {}
    var category = await JobCategory.findOne({slug: categorySlug})
    if (category) {
      query.category = category._id
    }
    var data = await Job.paginate(query, { page: page, limit: 10, populate: 'company category' })
    let jobCategories = await JobCategory.find({})
    let topCompanies =  await Company.find({editorChoice: true})
    res.render('jobs/index', { jobs: data.docs, page, pages: data.pages, total: data.total, jobCategories, category, topCompanies});
  } catch (err) {
    next(err)
  }
});

router.get('/new', (req, res, next) => {
  res.render('jobs/new');
});

router.get('/:slug', async (req, res, next) => {
  try {
    let job = await Job.findOne({slug: req.params.slug}).populate('company')
    res.render('jobs/show', {job});
  } catch (err) {
    next(err)
  }
});

router.get('/:slug/apply', async (req, res, next) => {
  let { letter } = req.body
  try {
    let job = await Job.findOne({slug: req.params.slug}).populate('company')
    res.render('jobs/apply', {job});
  } catch (err) {
    next(err)
  }
});

router.post('/apply', async (req, res, next) => {
  let { letter, jobId } = req.body
  try {
    let job = await Job.findOne({_id: jobId}).populate('company')
    var application = await Application.findOne({job: job._id, user: req.user._id})
    if (!application) {
      application = new Application({letter, job: job._id, user: req.user._id, company: job.company._id})
      await application.save()
    }
    res.redirect('/applications')
  } catch (err) {
    next(err)
  }
});

module.exports = router;
