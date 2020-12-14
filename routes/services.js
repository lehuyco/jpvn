const express = require('express');
const router = express.Router();
const Service = require('models/Service')
const Page = require('models/Page')

router.get('/', async (req, res, next) => {
  try {
    let services = await Service.find({language: locale})
    let page = await Page.findOne({type: 'services', language: locale})

    if (page) {
      res.locals.title = page.title
      res.locals.ogDescription = page.summary
      if (page.image) {
        res.locals.ogImage = page.image
      }
      res.locals.keywords = page.keywords
    }
    
    res.render('services/index', { services });
  } catch (err) {
    next(err)
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    let service = await Service.findOne({ slug: req.params.slug })
    let services = await Service.find({language: locale})

    res.locals.title = service.title
    res.locals.ogDescription = service.summary
    res.locals.ogImage = __host + service.image
    res.locals.ogUrl = __host + service.path

    res.render('services/show', { service, services });
  } catch (err) {
    next(err)
  }
});

module.exports = router;
