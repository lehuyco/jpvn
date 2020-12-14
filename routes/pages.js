const express = require('express');
const router = express.Router();
const Page = require('models/Page')
/* GET posts listing. */

router.get('/:slug', async (req, res, next) => {
  try {
    let page = await Page.findOne({slug: req.params.slug})
    if (page)
      res.render('pages/show', { page });
    else
      next()
  } catch (err) {
    next(err)
  }
});

module.exports = router;
