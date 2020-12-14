var express = require('express');
var router = express.Router();
const moment = require('moment')
const User = require('models/User');

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const multer = require('multer')

let USER_UPLOAD_PATH = __basedir + '/public/uploads/users/' 
if (!fs.existsSync(USER_UPLOAD_PATH)) fs.mkdirSync(USER_UPLOAD_PATH)

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    var path = USER_UPLOAD_PATH + req.user._id.toString()
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

router.get('/', function(req, res, next) {
  res.render('me/index', {user: req.user});
});

router.get('/edit', function(req, res, next) {
  res.render('me/edit', {user: req.user});
});

router.post('/', upload.single('image'), async (req, res, next) => {
  let { name, dateBirth, placeBirth, address, relativePhone, nationalId, dateIssued, placeIssued, height, weight, blood, clothingSize, shoeSize } = req.body
  var user = req.user
  let userId = user._id.toString()
  if (!name) {
    req.flash('error', 'Vui lòng điền tên')
    res.redirect('/me/edit')
  }
  if (!moment(dateBirth, 'DD/MM/YYYY').isValid()) {
    req.flash('error', 'Ngày sinh không hợp lệ')
    res.redirect('/me/edit')
  }
  if (!moment(dateIssued, 'DD/MM/YYYY').isValid()) {
    req.flash('error', 'Ngày cấp không hợp lệ')
    res.redirect('/me/edit')
  }
  try {
    user.name = name
    user.placeBirth = placeBirth
    if (dateBirth && moment(dateBirth, 'DD/MM/YYYY').isValid()) {
      user.dateBirth = moment(dateBirth, "DD/MM/YYYY")
    }
    user.address = address
    user.relativePhone = relativePhone
    user.nationalId = nationalId
    user.dateIssued = dateIssued
    if (dateIssued && moment(dateIssued, 'DD/MM/YYYY').isValid()) {
      user.dateIssued = moment(dateIssued, "DD/MM/YYYY")
    }
    user.placeIssued = placeIssued
    user.height = height
    user.weight = weight
    user.height = height
    user.weight = weight
    user.blood = blood
    user.clothingSize = clothingSize
    user.shoeSize = shoeSize
    if (req.file) {
      user.image = '/uploads/users/' + userId + "/" + req.file.filename
      var targetDir = USER_UPLOAD_PATH + userId + "/"
      var info = await sharp(targetDir + req.file.filename).resize(300, 300).toFile(targetDir + "medium.png")
      user.thumb = '/uploads/users/' + userId + "/medium.png"
    }
    await user.save()
    req.flash('success', 'Cập nhật thành công')
    res.redirect('/me/edit')
  } catch(err) {
    next(err)
  }
})

module.exports = router;
