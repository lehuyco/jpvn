const express = require('express');
const router = express.Router();
const passport = require('passport')
const Mailers = require('mailers')
const Post = require('models/Post')
const Slide = require('models/Slide')
const Service = require('models/Service')
const Testimonial = require('models/Testimonial')
const Widget = require('models/Widget')
const Category = require('models/Category')
const Project = require('models/Project')
const Partner = require('models/Partner')
const Feature = require('models/Feature')
const Enquiry = require('models/Enquiry')
const i18n = require('i18n')

const validateContact = (req, res, next) => {
  let { name, phone, email, address, request } = req.body
  console.log("========")
  console.log(req.body)
  if (!name || !email || !phone || !address || !request) {
    return res.status(400).json({message: "Vui lòng điền đầy đủ thông tin"})
  }
  next()
}

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    let categories =  await Category.find({language: locale})
    let posts = await Post.find({ categories: { $in: categories.map(c => c._id) } }).sort({createdAt: -1}).limit(3).populate('categories')
    let slides = await Slide.find({language: locale})
    let services = await Service.find({language: locale})
    let projects = await Project.find({language: locale}).limit(3)
    let testimonials = await Testimonial.find({language: locale})
    let features = await Feature.find({language: locale})
    let about = await Widget.findOne({language: locale, position: 'home_about'})
    let partners = await Partner.find()
    res.render('pages/index', { about, slides, services, projects, posts, testimonials, partners, features })
  } catch (err) {
    next(err)
  }
});

router.get('/login', function(req, res, next) {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  if (req.isAuthenticated()) {
    res.redirect('/')
  } else {
    res.render('auth/login');
  }
});

router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }));

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

/* GET Pricacy Policy. */
router.get('/privacy', function(req, res, next) {
  res.render('pages/privacy');
});

/* GET Pricacy Policy. */
router.get('/terms', function(req, res, next) {
  res.render('pages/terms');
});

router.get('/about', async (req, res, next) => {
  try {
    let about = await Widget.findOne({language: locale, position: 'about'})
    let partners = await Partner.find()
    res.render('pages/about', { about, partners });
  } catch (err) {
    next(err)
  }
});

/* GET Contact */
router.get('/contact', function(req, res, next) {
  res.render('pages/contact');
});

router.post('/contact', validateContact, async (req, res, next) => {
  try {
    let { name, phone, email, address, request } = req.body
    var enquiry = new Enquiry({ name, phone, email, address, request })
    await enquiry.save()
    Mailers.contact(enquiry)
    res.json(enquiry)
  } catch (err) {
    next(err)
  }
})

router.get('/recruitment', async (req, res, next) => {
  try {
    let recruiters = await Recruiter.find({user: req.user._id})
    let companyIds = recruiters.map(recruiter => recruiter.company)
    let companies = await Company.find({ _id: {'$in': companyIds}, status: 'active' })
    let companyCount = await Company.countDocuments({ _id: {'$in': companyIds}, status: 'active' })
    res.render('pages/recruitment', {recruiters, companies, companyCount});
  } catch (err) {
    next(err)
  }
});

router.get('/vi', function(req, res, next) {
  i18n.setLocale('vi');
  res.redirect('/')
});

router.get('/en', function(req, res, next) {
  i18n.setLocale('en');
  res.redirect('/')
});

module.exports = router;
