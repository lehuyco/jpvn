const express = require('express')
const router = express.Router()

const middleware = require('./middleware')

router.use(middleware.initLocals)

router.use('/', require('./common'))
router.use('/', require('./blog'))
router.use('/quote', require('./quote'))
router.use('/career', require('./career'))
router.use('/jobs', require('./jobs'))
router.use('/companies', require('./companies'))
router.use('/services', require('./services'))
router.use('/projects', require('./projects'))
router.use('/auth', require('./auth'))
router.use('/me', middleware.requireUser, require('./me'))
router.use('/educations', middleware.requireUser, require('./educations'))
router.use('/passports', middleware.requireUser, require('./passports'))
router.use('/certificates', middleware.requireUser, require('./certificates'))
router.use('/experiences', middleware.requireUser, require('./experiences'))
router.use('/applications', middleware.requireUser, require('./applications'))
router.use('/files', require('./files'))
router.use('/admin', require('./admin'))
router.use('/', require('./pages'))

module.exports = router
