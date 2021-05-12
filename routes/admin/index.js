const express = require('express')
const router = express.Router()
const middleware = require('../middleware')
const Company = require('models/Company')
const Recruiter = require('models/Recruiter')

router.use('/', require('./dash'))
router.use('/users', middleware.requireAdmin, require('./users'))
router.use('/posts', middleware.requireMod, require('./posts'))
router.use('/categories', middleware.requireMod, require('./categories'))
router.use(
    '/jobCategories',
    middleware.requireAdmin,
    require('./jobCategories')
)
router.use('/jobs', middleware.requireAdmin, require('./jobs'))
router.use('/candidates', middleware.requireAdmin, require('./candidates'))

router.use('/quotes', require('./quotes'))
router.use('/enquiries', require('./enquiries'))
router.use('/companies', require('./companies'))
router.use('/pages', require('./pages'))
router.use('/slides', require('./slides'))
router.use('/projects', require('./projects'))
router.use('/widgets', require('./widgets'))
router.use('/services', require('./services'))
router.use('/testimonials', require('./testimonials'))
router.use('/partners', require('./partners'))
router.use('/features', require('./features'))
router.use('/members', require('./members'))
router.use('/settings', require('./settings'))

module.exports = router
