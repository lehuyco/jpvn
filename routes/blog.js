const express = require("express");
const router = express.Router();
const Post = require("models/Post");
const Category = require("models/Category");
/* GET posts listing. */

let init = (req, res, next) => {
  res.locals.headerType = "classic";
  next();
};

let findCategories = async (req, res, next) => {
  res.locals.categories = await Category.find({ language: locale });
  res.locals.categorieIds = res.locals.categories.map((c) => c._id);
  next();
};

let findRecentPosts = async (req, res, next) => {
  res.locals.recentPosts = await Post.find({}).sort({ createdAt: -1 }).limit(5);
  next();
};

router.use(init, findCategories, findRecentPosts);

router.get("/news", async (req, res, next) => {
  let page = req.query.page || 1;
  try {
    var data = await Post.paginate(
      { categories: { $in: res.locals.categorieIds } },
      { sort: { createdAt: -1 }, populate: "categories", page: page, limit: 10 }
    );

    res.locals.title = __("menu.blog");
    res.locals.ogUrl = __host + "/blog";

    res.render("blog/index", {
      posts: data.docs,
      page,
      total: data.totalPages,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/cat/:slug", async (req, res, next) => {
  let page = req.query.page || 1;
  try {
    let category = await Category.findOne({ slug: req.params.slug });
    let title = category.title;
    let data = await Post.paginate(
      { categories: { $in: [category._id] } },
      { sort: { createdAt: -1 }, populate: "categories", page: page, limit: 10 }
    );

    res.locals.title = category.title;
    res.locals.ogUrl = __host + "/" + category.slug;

    res.render("blog/index", {
      title,
      category,
      posts: data.docs,
      page,
      total: data.totalPages,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/post/:slug", async (req, res, next) => {
  try {
    let post = await Post.findOne({ slug: req.params.slug }).populate(
      "categories"
    );
    let category = await Category.findOne({ _id: post.category });

    res.locals.title = post.title;
    res.locals.ogDescription = post.summary;
    res.locals.ogImage = __host + post.bigThumbnail;
    res.locals.ogUrl = __host + "/post/" + post.slug;
    res.locals.keywords = post.keywords;

    res.render("blog/show", { post, category });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
