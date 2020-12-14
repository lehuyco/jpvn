const express = require('express');
const router = express.Router();

router.get('/become', async (req, res, next) => {
  res.render('recruiters/become');
});

module.exports = router;
