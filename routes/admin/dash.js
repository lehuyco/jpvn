const express = require('express')
const router = express.Router()
const Post = require('models/Post')
const Recruiter = require('models/Recruiter')
const Job = require('models/Job')
const Application = require('models/Application')

/* GET home page. */
router.get('/', async (req, res, next) => {
    res.render('admin/dash/index')
})

module.exports = router
