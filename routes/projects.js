const express = require('express');
const router = express.Router();
const Project = require('models/Project')
const Page = require('models/Page')

router.get('/', async (req, res, next) => {
  try {
    let projects = await Project.find({language: locale})
    let page = await Page.findOne({type: 'projects', language: locale})

    if (page) {
      res.locals.title = page.title
      res.locals.ogDescription = page.summary
      if (page.image) {
        res.locals.ogImage = page.image
      }
      res.locals.keywords = page.keywords
    }
    
    res.render('projects/index', { projects });
  } catch (err) {
    next(err)
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    let project = await Project.findOne({ slug: req.params.slug })
    let projects = await Project.sample(locale)

    res.locals.title = project.title
    res.locals.ogDescription = project.summary
    res.locals.ogImage = __host + project.image
    res.locals.ogUrl = __host + project.path

    res.render('projects/show', { project, projects });
  } catch (err) {
    next(err)
  }
});

module.exports = router;
