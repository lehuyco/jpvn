const express = require('express');
const router = express.Router();
const Job = require('models/Job');
const Category = require('models/JobCategory');
const Company = require('models/Company');
const Candidate = require('models/Candidate');

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const multer = require('multer')

let JOB_UPLOAD_PATH = __basedir + '/public/uploads/jobs/' 
if (!fs.existsSync(JOB_UPLOAD_PATH)) fs.mkdirSync(JOB_UPLOAD_PATH)

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    var path = JOB_UPLOAD_PATH + req.job._id.toString()
    if (!fs.existsSync(path)) fs.mkdirSync(path)
    cb(null, path)
  },
  filename: (req, file, cb) => {
    cb(null, 'original' + path.extname(file.originalname).toLowerCase())
  },
  fileFilter: function(req, file, callback) {
    var ext = path.extname(file.originalname)
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
        return callback( /*res.end('Only images are allowed')*/ null, false)
    }
    callback(null, true)
  }
})
var upload = multer({ storage: storage })

var findJob = async (req, res, next) => {
  if (req.params.id) {
    req.job = await Job.findOne({_id: req.params.id})
    req.actionType = 'update'
  } else {
    req.job = await new Job()
    req.actionType = 'create'
  }
  next()
}

var updateJob = async (req, res, next) => {
  let { title, description, summary, salary, experience, category, company, status } = req.body
  var job = req.job
  let jobId = job._id.toString()
  try {
    job.title = title
    job.description = description
    job.summary = summary
    job.salary = salary
    job.experience = experience
    job.category = category
    job.company = company
    if (req.file) {
      job.image = '/uploads/jobs/' + jobId + "/" + req.file.filename
      var targetDir = JOB_UPLOAD_PATH + jobId + "/"
      var info = await sharp(targetDir + req.file.filename).resize(300, 200).toFile(targetDir + "medium.png")
      job.thumb = '/uploads/jobs/' + jobId + "/medium.png"
    }
    if (req.user.isAdmin || req.user.isMod) {
      job.status = status
    }
    await job.save()
    if (job.category) {
      var selectedCategory = await Category.findOne({_id: job.category})
      selectedCategory.jobCount = await Job.count({category: job.category})
      await selectedCategory.save()
    }
    req.flash('success', req.actionType == 'update' ? 'Cập nhật thành công' : 'Thêm mới thành công')
    res.redirect('/admin/jobs/' + jobId)
  } catch(err) {
    next(err)
  }
}

router.get('/', async (req, res, next) => {
  let page = req.query.page || 0
  if (page > 0) page = page - 1
  let per = req.query.per || 20

  var query = {}
  try {
    if (req.user.isAdmin) {
      query = {}
    } 

    let candidates = await Candidate.find(query).populate('position').sort({createdAt: -1}).limit(per).skip(page*per)
    res.render('admin/candidates/index', {candidates});
  } catch (err) {
    next()
  }
});

router.post('/', findJob, upload.single('image'), updateJob)

router.get('/new', async (req, res, next) => {
  try {
    let categories = await Category.find({})
    res.render('admin/jobs/new', {categories})
  } catch (err) {
    next()
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    let candidate = await Candidate.findOne({_id: req.params.id}).populate('position')
    res.render('admin/candidates/show', {candidate: candidate})
  } catch (err) {
    next(err)
  }
});

router.post('/:id', findJob, upload.single('image'), updateJob);

router.get('/:id/delete', async (req, res, next) => {
  try {
    var result = await Candidate.deleteOne({_id: req.params.id})
    res.redirect('/admin/candidates')
  } catch (err) {
    next(err)
  } 
})

module.exports = router;
