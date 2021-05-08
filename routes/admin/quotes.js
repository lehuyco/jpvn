const express = require("express");
const router = express.Router();
const Quote = require("models/Quote");

router.get("/", async (req, res, next) => {
  let page = req.query.page || 1;
  let { status } = req.query;
  try {
    var query = {};
    if (status) {
      query.status = status;
    }
    var data = await Quote.paginate(query, {
      page: page,
      limit: 20,
      sort: { createdAt: -1 },
    });
    res.render("admin/quotes/index", {
      quotes: data.docs,
      page,
      total: data.totalPages,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    let quote = await Quote.findOne({ _id: req.params.id });
    res.render("admin/quotes/show", { quote });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
