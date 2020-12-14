const express = require('express');
const router = express.Router();
const Candidate = require('models/Candidate');
const Job = require('models/Job');
const Mailer = require('mailers')

const moment = require('moment')
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const multer = require('multer')

let UPLOAD_PATH = __basedir + '/public/uploads/careers/'
if (!fs.existsSync(UPLOAD_PATH)) fs.mkdirSync(UPLOAD_PATH)

const fileFilter = (req, file, callback) => {
  var ext = path.extname(file.originalname)
  console.log(ext)
  if (ext == ".pdf" || ext == ".PDF") {
    return callback(null, true)
      
  }
  return callback(new Error("Chỉ cho phép file pdf"))
}

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    req.candidate = new Candidate()
    var path = UPLOAD_PATH + req.candidate._id.toString()
    if (!fs.existsSync(path)) fs.mkdirSync(path)
    cb(null, path)
  },
  filename: (req, file, cb) => {
    cb(null, 'original' + path.extname(file.originalname).toLowerCase())
  }
})

var upload = multer({
  storage, 
  limits:{
    fileSize: 2*1024*1024
  },
  fileFilter
}).single('file')

var fileHandler = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code == "LIMIT_FILE_SIZE") {
        return res.status(400).json({message: "File đính kèm quá lớn. Dung lượng tối đa 2MB"})
      }
      return res.status(400).json({message: "Có lỗi xảy ra. Vui lòng thử lại"})
    } else if (err) {
      return res.status(400).json({message: "Có lỗi xảy ra. Vui lòng thử lại"})
    }
    next()
  })
}

const validate = (req, res, next) => {
  let { position, name, address, email, phone, comment, attach } = req.body
  console.log("========")
  console.log(req.body)
  if (!position || !name || !email || !phone) {
    req.flash('error', 'Vui lòng điền đầy đủ thông tin')
    if (req.params.id) {
      res.redirect('/career/' + req.params.id)
    } else {
      res.redirect('/career')
    }
  } else {
    next()
  }
}

const validateCandidate = (req, res, next) => {
  let { position, name, address, email, phone } = req.body
  console.log("========")
  console.log(req.body)
  if (!position || !name || !email || !phone || !address) {
    return res.status(400).json({message: "Vui lòng điền đầy đủ thông tin"})
  }
  if (!req.file) {
    return res.status(400).json({message: "Vui lòng đính kèm CV, bằng cấp, chứng chỉ liên quan"})
  }
  next()
}

router.get('/', async (req, res, next) => {
  try {
    jobs = await Job.find({}).limit(10)
    // , csrfToken: req.csrfToken()
    res.render('pages/career', { jobs })
  } catch (err) {
    next(err)
  } 
})

router.post('/apply', fileHandler, validateCandidate, async (req, res, next) => {
  let { position, name, address, email, phone, comment } = req.body
  try {
    let job = await Job.findOne({_id: position})
    var candidate = req.candidate
    candidate.set({ position, name, address, email, phone, comment })
    candidate.position = job._id
    if (req.file) {
      candidate.file = req.file
    }
    await candidate.save()
    Mailer.hr(candidate, job)
    res.json(candidate)
  } catch (err) {
    console.log(err)
    next(err)
  }
})

router.get('/:slug', async (req, res, next) => {
  try {
    let job = await Job.findOne({slug: req.params.slug})
    res.render('career/show', { job })
  } catch (err) {
    next(err)
  } 
})

router.post('/', validate, async (req, res, next) => {
  console.log("========")
  let { position, name, address, email, phone, comment, attach } = req.body
  try {
    var candidate = await Candidate.create({ position, name, address, email, phone, comment, attach })
    
    await candidate.save()
    req.flash('success', 'Ứng tuyển thành công')
    res.redirect('/career')
  } catch(err) {
    next(err)
  }
})

module.exports = router