const express = require('express');
const router = express.Router();
const Company = require('models/Company');
const Recruiter = require('models/Recruiter')

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const multer = require('multer')
const Mailers = require('mailers')

let COMPANY_UPLOAD_PATH = __basedir + '/public/uploads/companies/' 
if (!fs.existsSync(COMPANY_UPLOAD_PATH)) fs.mkdirSync(COMPANY_UPLOAD_PATH)

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    var path = COMPANY_UPLOAD_PATH + req.company._id.toString()
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

var findCompany = async (req, res, next) => {
  if (req.params.id) {
    req.company = await Company.findOne({_id: req.params.id})
    req.actionType = 'update'
  } else {
    req.company = await new Company()
    req.actionType = 'create'
  }
  next()
}

var updateCompany = async (req, res, next) => {
  let { title, email, website, phone, address, overview, status, editorChoice } = req.body
  var company = req.company
  let companyId = company._id.toString()
  try {
    company.title = title
    company.email = email
    company.website = website
    company.phone = phone
    company.address = address
    company.overview = overview
    
    if (req.user.isAdmin) {
      if (company.status != status && status == 'active' && req.user.email) {
        Mailers.companyApproved(req.user.email)
      }
      company.status = status
      company.editorChoice = (editorChoice == 'on')
    }
    if (req.file) {
      company.image = '/uploads/companies/' + companyId + "/" + req.file.filename
      var targetDir = COMPANY_UPLOAD_PATH + companyId + "/"
      var info = await sharp(targetDir + req.file.filename).resize(300, 300).toFile(targetDir + "medium.png")
      company.thumb = '/uploads/companies/' + companyId + "/medium.png"
    }
    await company.save()
    req.flash('success', req.actionType == 'update' ? 'Cập nhật thành công' : 'Thêm mới thành công')
    var recruiter = await Recruiter.findOne({user: req.user._id, company: company._id})
    if (!recruiter) {
      Mailers.newCompany()
      recruiter = await new Recruiter({user: req.user._id, company: company._id})
      await recruiter.save()
    }
    res.redirect('/admin/companies/' + req.company._id.toString())
  } catch(err) {
    next(err)
  }
}

router.get('/', async (req, res, next) => {
  let page = req.query.page || 0
  if (page > 0) page = page - 1
  let per = req.query.per || 20

  try {
    var companies;
    if (req.user.isAdmin) {
      res.locals.companies = await Company.find({}).limit(per).skip(page*per)
    } else {
      let recruiters = await Recruiter.find({user: req.user._id}).populate('company')
      let companyIds = recruiters.map(recruiter => recruiter.company)
      res.locals.companies = await Company.find({ _id: {'$in': companyIds}})
    }
    res.render('admin/companies/index');
  } catch (err) {
    next(err)
  }
});

router.post('/', findCompany, upload.single('image'), updateCompany)

router.get('/new', async (req, res, next) => {
  try {
    res.render('admin/companies/new')
  } catch (err) {
    next()
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    let company = await Company.findOne({_id: req.params.id})
    res.render('admin/companies/show', { company })
  } catch (err) {
    next(err)
  }
});

router.post('/:id', findCompany, upload.single('image'), updateCompany);

router.get('/:id/delete', async (req, res, next) => {
  try {
    var result = await Company.deleteOne({_id: req.params.id})
    res.redirect('/admin/companies')
  } catch (err) {
    next(err)
  } 
})

module.exports = router;
