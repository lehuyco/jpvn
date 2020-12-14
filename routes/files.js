const express = require('express');
const router = express.Router();
const File = require('models/File')

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const multer = require('multer')

let FILE_UPLOAD_PATH = __basedir + '/public/uploads/files/' 
if (!fs.existsSync(FILE_UPLOAD_PATH)) fs.mkdirSync(FILE_UPLOAD_PATH)

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    req.newFile = new File()
    var path = FILE_UPLOAD_PATH + req.newFile._id.toString()
    if (!fs.existsSync(path)) fs.mkdirSync(path)
    cb(null, path)
  },
  filename: (req, file, cb) => {
    cb(null, 'original' + path.extname(file.originalname).toLowerCase())
  },
  fileFilter: function(req, file, callback) {
    var ext = path.extname(file.originalname)
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
        return callback( /*res.end('Only images are allowed')*/ null, false)
    }

    callback(null, true)
  }
})
var upload = multer({ storage: storage })

router.post('/upload', upload.single('file'), async (req, res, next) => {
  var file = req.newFile
  let fileId = file._id.toString()
  try {
    if (req.file) {
      var originalFile = FILE_UPLOAD_PATH + fileId + "/" + req.file.filename
      var targetFile = FILE_UPLOAD_PATH + fileId + "/" + "medium.png"
      var info = await sharp(originalFile).resize(1000, 1000, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      }).toFile(targetFile)
      file.image = '/uploads/files/' + fileId + "/" + req.file.filename
      file.thumb = '/uploads/files/' + fileId + "/" + "medium.png"
      await file.save()
      res.json({url: file.thumb})
    }
  } catch (err) {
    console.log(err)
    next(err)
  }
});

module.exports = router;

// render json: { url: p.file.url }