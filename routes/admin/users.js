const express = require('express');
const router = express.Router();
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

var findUser = async (req, res, next) => {
  if (req.params.id) {
    req.user = await User.findOne({_id: req.params.id})
  } else {
    req.user = await new User()
  }
  next()
}

router.get('/', async (req, res, next) => {
  let page = req.query.page || 0
  if (page > 0) page = page - 1
  let per = req.query.per || 20

  try {
    let users = await User.find({}).limit(per).skip(page*per)
    res.render('admin/users/index', { users: users });
  } catch (err) {
    next(err)
  }
});

router.post('/', findUser, upload.single('image'), async (req, res, next) => {
  let { name, email, role, password } = req.body
  var user = req.user
  let userId = user._id.toString()
  try {
    user.name = name
    user.email = email
    user.role = role
    if (password) {
      await user.hashPassword(password)
    }
    if (req.file) {
      user.image = '/uploads/users/' + userId + "/" + req.file.filename
      var targetDir = USER_UPLOAD_PATH + userId + "/"
      var info = await sharp(targetDir + req.file.filename).resize(300, 300).toFile(targetDir + "medium.png")
    }
    await user.save()
    req.flash('success', 'Thêm mới thành công')
    res.redirect('/admin/users/' + userId)
  } catch(err) {
    next(err)
  }
})

router.get('/new', async (req, res, next) => {
  try {
    res.render('admin/users/new')
  } catch (err) {
    next()
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    let user = await User.findOne({_id: req.params.id})
    res.render('admin/users/show', {user: user})
  } catch (err) {
    next(err)
  }
});

router.post('/:id', findUser, upload.single('image'), async (req, res, next) => {
  let { name, email, role, password } = req.body
  try {
    var user = req.user
    user.name = name
    user.email = email
    user.role = role
    if (password) {
      await user.hashPassword(password)
    }
    if (req.file) {
      user.image = '/uploads/users/' + req.params.id + "/" + req.file.filename
      var targetDir = USER_UPLOAD_PATH + req.params.id + "/"
      var info = await sharp(targetDir + req.file.filename).resize(300, 300).toFile(targetDir + "medium.png")
    }
    await user.save()
    req.flash('success', 'Cập nhật thành công')
    res.redirect('/admin/users/' + user._id)
  } catch (err) {
    next(err)
  } 
});

router.get('/:id/delete', async (req, res, next) => {
  try {
    var result = await User.deleteOne({_id: req.params.id})
    res.redirect('/admin/users')
  } catch (err) {
    next(err)
  } 
})

module.exports = router;
