const express = require('express');
const router = express.Router();
const Enquiry = require('models/Enquiry');

router.get('/', async (req, res, next) => {
  let page = req.query.page || 1
  let { status } = req.query
  try {
    var query = {}
    if (status) {
      query.status = status
    }
    var data = await Enquiry.paginate(query, { page: page, limit: 20, sort: { createdAt: -1 }})
    res.render('admin/enquiries/index', { enquiries: data.docs, page, total: data.pages })
  } catch (err) {
    next(err)
  } 
})

router.get('/:id', async (req, res, next) => {
  try {
    let enquiry = await Enquiry.findOne({ _id: req.params.id })
    res.render('admin/enquiries/show', { enquiry })
  } catch (err) {
    next(err)
  }
});

module.exports = router