const express = require('express');
const router = express.Router();
const passport = require('passport')
const User = require('models/User')
const Validator = require('validator')

router.get('/update', (req, res, next) => {
  res.render('auth/update', { errors: req.flash('error') });
});

router.post('/update', async (req, res, next) => {
  let {name, email, phone} = req.body
  var currentUser = req.user
  if (currentUser) {
    if (!name) {
      req.flash('error', 'Bạn chưa nhập tên')
      res.redirect('/auth/update')
    }
    if (!Validator.isEmail(email)) {
      req.flash('error', 'Email không hợp lệ')
      res.redirect('/auth/update')
    }
    currentUser.name = name
    if (!currentUser.email) {
      currentUser.email = email
    }
    currentUser.phone = phone
    currentUser.firstUpdate = true
    await currentUser.save()
    res.redirect('/')
  }
});

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/google', passport.authenticate('google', { scope: ["https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email"] }));
router.get('/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));
router.get('/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }));

router.get('/init', async (req, res, next) => {
  let user = new User({ name: "Anh Le", email: "vuonganh91@gmail.com", role: "admin" })
  await user.hashPassword("123456")
  await user.save()
  res.json({})
})

router.post('/login', (req, res, next) => {
  console.log(req.body)
  next()
}, passport.authenticate('local', { successRedirect: '/admin', failureRedirect: '/login', failureFlash: true }));

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;