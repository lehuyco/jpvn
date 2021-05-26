const express = require('express')
const router = express.Router()
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
const Member = require('models/Member')
const i18n = require('i18n')

// Sitemap
const { SitemapStream, streamToPromise } = require('sitemap')
const { createGzip } = require('zlib')
const { Readable } = require('stream')
const { post } = require('./blog')
var sitemap

const validateContact = (req, res, next) => {
    let { name, phone, email, address, request } = req.body
    if (!name || !email || !phone || !address || !request) {
        return res
            .status(400)
            .json({ message: 'Vui lòng điền đầy đủ thông tin' })
    }
    next()
}

/* GET home page. */
router.get('/', async (req, res, next) => {
    try {
        let locale = i18n.getLocale()
        let categories = await Category.find({ language: locale })
        let posts = await Post.find({
            categories: { $in: categories.map((c) => c._id) },
        })
            .sort({ createdAt: -1 })
            .limit(3)
            .populate('categories')
        let slides = await Slide.find({ language: locale })
        let services = await Service.find({ language: locale })
        let projects = await Project.find({ language: locale }).limit(3)
        let testimonials = await Testimonial.find({ language: locale })
        let features = await Feature.find({ language: locale })
        let about = await Widget.findOne({
            language: locale,
            position: 'home_about',
        })
        let partners = await Partner.find()
        res.render('pages/index', {
            about,
            slides,
            services,
            projects,
            posts,
            testimonials,
            partners,
            features,
        })
    } catch (err) {
        next(err)
    }
})

router.get('/login', function (req, res, next) {
    res.locals.error = req.flash('error')
    res.locals.success = req.flash('success')
    if (req.isAuthenticated()) {
        res.redirect('/')
    } else {
        res.render('auth/login', { customClass: 'wide-template' })
    }
})

router.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true,
    })
)

router.get('/logout', function (req, res) {
    req.logout()
    res.redirect('/')
})

/* GET Pricacy Policy. */
router.get('/privacy', function (req, res, next) {
    res.render('pages/privacy')
})

/* GET Pricacy Policy. */
router.get('/terms', function (req, res, next) {
    res.render('pages/terms')
})

router.get('/about', async (req, res, next) => {
    try {
        let locale = i18n.getLocale()
        let about = await Widget.findOne({
            language: locale,
            position: 'about',
        })
        let partners = await Partner.find()
        let services = await Service.find({ language: locale })
        let testimonials = await Testimonial.find({ language: locale })
        let members = await Member.find({ language: locale })
        res.render('pages/about', {
            about,
            partners,
            services,
            testimonials,
            members,
        })
    } catch (err) {
        next(err)
    }
})

/* GET Contact */
router.get('/contact', function (req, res, next) {
    res.render('pages/contact')
})

router.post('/contact', validateContact, async (req, res, next) => {
    try {
        let { name, phone, email, address, request } = req.body
        var enquiry = new Enquiry({ name, phone, email, address, request })
        await enquiry.save()
        await Mailers.contact(enquiry)
        res.json(enquiry)
    } catch (err) {
        next(err)
    }
})

router.get('/recruitment', async (req, res, next) => {
    try {
        let recruiters = await Recruiter.find({ user: req.user._id })
        let companyIds = recruiters.map((recruiter) => recruiter.company)
        let companies = await Company.find({
            _id: { $in: companyIds },
            status: 'active',
        })
        let companyCount = await Company.countDocuments({
            _id: { $in: companyIds },
            status: 'active',
        })
        res.render('pages/recruitment', { recruiters, companies, companyCount })
    } catch (err) {
        next(err)
    }
})

router.get('/vi', function (req, res, next) {
    i18n.setLocale('vi')
    res.redirect('/')
})

router.get('/en', function (req, res, next) {
    i18n.setLocale('en')
    res.redirect('/')
})

router.get('/sitemap.xml', async (req, res) => {
    res.header('Content-Type', 'application/xml');
    res.header('Content-Encoding', 'gzip');
    // if we have a cached entry send it
    if (sitemap) {
      res.send(sitemap)
      return
    }
  
    try {
      const smStream = new SitemapStream({ hostname: 'https://luathungviet.vn/' })
      const pipeline = smStream.pipe(createGzip())
  
      // links: [
      //   { lang: 'en', url: '/?lang=en' },
      //   { lang: 'vi', url: '/?lang=vi' }
      // ],
      // pipe your entries or directly write them.
      smStream.write({ url: '/?lang=vi', priority: 0.3 })
      smStream.write({ url: '/?lang=en', priority: 0.3 })
      smStream.write({url: '/vi', priority: 0.3 })
      smStream.write({ url: '/en', priority: 0.3 })
      smStream.write({ url: '/about?lang=vi', priority: 0.3 })
      smStream.write({ url: '/about?lang=en', priority: 0.3 })
      smStream.write({ url: '/career?lang=vi',  changefreq: 'daily',  priority: 0.7 })
      smStream.write({ url: '/career?lang=en',  changefreq: 'daily',  priority: 0.7 })
      smStream.write({ url: '/news',  changefreq: 'daily',  priority: 0.7 })
      smStream.write({ url: '/contact?lang=vi' })
      smStream.write({ url: '/contact?lang=en' })

      let categories = await Category.find({})
      for (var category of categories) {
        smStream.write({ url: `/cat/${category.slug}`, lang: category.locale })
      }

      let posts = await Post.find({})
      for (var post of posts) {
        var meta = {
          url: post.path,
          news: {
            publication: {
              name: 'Luật Hưng Việt',
              language: 'vi'
            },
            genres: 'PressRelease, Blog',
            publication_date: post.publicationDate,
            title: post.title,
            keywords: post.keywords
          }
        }
        if (post.thumb) {
          meta.img = [
            {
              url: post.thumb,
              title: post.title,
              license: 'https://creativecommons.org/licenses/by/4.0/'
            },
          ]
        }
        smStream.write(meta)
      }

      /* or use
      Readable.from([{url: '/page-1'}...]).pipe(smStream)
      if you are looking to avoid writing your own loop.
      */
  
      // cache the response
      streamToPromise(pipeline).then(sm => sitemap = sm)
      // make sure to attach a write stream such as streamToPromise before ending
      smStream.end()
      // stream write the response
      pipeline.pipe(res).on('error', (e) => {throw e})
    } catch (e) {
      console.log(e)
      res.status(500).end()
    }
  })
  

module.exports = router
