const express = require('express');
const router = express.Router();
const Quote = require('models/Quote');
const Mailers = require('mailers')

const validate = (req, res, next) => {
  let { company_name, address, email, phone, service_request, country_of_origin, country_of_destination, cargo_quantity, specific_comment, shipping_term, cargo_type, delivery_address, pickup_address, details_of_weight } = req.body
  if (!company_name || !address || !email || !phone || !service_request || !country_of_origin || !country_of_destination || !cargo_quantity || !specific_comment || !shipping_term || !cargo_type || !delivery_address || !pickup_address || !details_of_weight) {
    return res.status(400).json({message: 'Vui lòng điền đầy đủ thông tin'})
  }
  next()
}

router.get('/', async (req, res, next) => {
  try {
    serviceTypes = [
      'sea_freight',
      'air_freight',
      'road_freight',
      'project_transport',
      'warehousing',
      'courier',
      'others'
    ]
    res.render('pages/quote', { serviceTypes })
  } catch (err) {
    next(err)
  } 
})

router.post('/', validate, async (req, res, next) => {
  let { company_name, address, email, phone, service_request, country_of_origin, country_of_destination, cargo_quantity, specific_comment, shipping_term, cargo_type, delivery_address, pickup_address, details_of_weight } = req.body
  console.log(req.body)
  try {
    var quote = await Quote.create({ company_name, address, email, phone, service_request, country_of_origin, country_of_destination, cargo_quantity, specific_comment, shipping_term, cargo_type, delivery_address, pickup_address, details_of_weight })
    await quote.save()
    Mailers.quote(quote)
    res.json(quote)
  } catch(err) {
    next(err)
  }
})

module.exports = router