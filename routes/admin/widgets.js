const express = require("express");
const router = express.Router();

const moment = require("moment");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const multer = require("multer");

const Model = require("models/Widget");
const UPLOAD_FOLDER = __basedir + "/public/uploads/widgets/";
const UPLOAD_PATH = "/uploads/widgets/";
const ADMIN_PATH = "/admin/widgets/";
const VIEW_PATH = "admin/widgets/";

if (!fs.existsSync(UPLOAD_FOLDER)) fs.mkdirSync(UPLOAD_FOLDER);

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    var path = UPLOAD_FOLDER + req.doc._id.toString();
    if (!fs.existsSync(path)) fs.mkdirSync(path);
    cb(null, path);
  },
  filename: (req, file, cb) => {
    cb(null, "original" + path.extname(file.originalname).toLowerCase());
  },
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      return callback(/*res.end('Only images are allowed')*/ null, false);
    }
    callback(null, true);
  },
});

var upload = multer({ storage: storage });

var findOrInit = async (req, res, next) => {
  if (req.params.id) {
    req.doc = await Model.findOne({ _id: req.params.id });
    req.actionType = "update";
  } else {
    req.doc = await new Model();
    req.actionType = "create";
  }
  next();
};

var createOrUpdate = async (req, res, next) => {
  let { title, position, content, language } = req.body;
  var doc = req.doc;
  let docId = doc._id.toString();
  try {
    doc.title = title;
    doc.position = position;
    doc.language = language;
    doc.content = content;
    if (req.file) {
      var timestamp = moment().format("YYMMDDDHHmm");
      doc.image =
        UPLOAD_PATH + docId + "/" + req.file.filename + "?at=" + timestamp;
      var targetDir = UPLOAD_FOLDER + docId + "/";
      var info = await sharp(targetDir + req.file.filename)
        .resize(200, 200)
        .toFile(targetDir + "medium.png");
      doc.thumb = UPLOAD_PATH + docId + "/medium.png" + "?at=" + timestamp;
    }
    await doc.save();
    req.flash(
      "success",
      req.actionType == "update" ? "Cập nhật thành công" : "Thêm mới thành công"
    );
    res.redirect(ADMIN_PATH + docId);
  } catch (err) {
    req.flash("error", err.message);
    if (req.actionType == "update") {
      res.redirect(ADMIN_PATH + docId);
    } else {
      res.redirect(ADMIN_PATH + "new");
    }
  }
};

router.use((req, res, next) => {
  res.locals.ADMIN_PATH = ADMIN_PATH;
  next();
});

router.get("/", async (req, res, next) => {
  let page = req.query.page || 1;
  try {
    var data = await Model.paginate({}, { page: page, limit: 20 });
    res.render(VIEW_PATH + "index", {
      docs: data.docs,
      page,
      total: data.totalPages,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/", findOrInit, upload.single("image"), createOrUpdate);

router.get("/new", async (req, res, next) => {
  try {
    res.render(VIEW_PATH + "new");
  } catch (err) {
    next();
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    let doc = await Model.findOne({ _id: req.params.id });
    res.render(VIEW_PATH + "show", { doc });
  } catch (err) {
    next(err);
  }
});

router.post("/:id", findOrInit, upload.single("image"), createOrUpdate);

router.get("/:id/delete", async (req, res, next) => {
  try {
    var result = await Model.deleteOne({ _id: req.params.id });
    res.redirect(ADMIN_PATH);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
