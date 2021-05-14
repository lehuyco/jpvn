const express = require('express')
const router = express.Router()
const Post = require('models/Post')
const Category = require('models/Category')

const moment = require('moment')
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const multer = require('multer')

let POST_UPLOAD_PATH = __basedir + '/public/uploads/posts/'
if (!fs.existsSync(POST_UPLOAD_PATH)) fs.mkdirSync(POST_UPLOAD_PATH)

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        var path = POST_UPLOAD_PATH + req.post._id.toString()
        if (!fs.existsSync(path)) fs.mkdirSync(path)
        cb(null, path)
    },
    filename: (req, file, cb) => {
        cb(null, 'original' + path.extname(file.originalname).toLowerCase())
    },
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname)
        if (
            ext !== '.png' &&
            ext !== '.jpg' &&
            ext !== '.gif' &&
            ext !== '.jpeg'
        ) {
            return callback(/*res.end('Only images are allowed')*/ null, false)
        }
        callback(null, true)
    },
})
var upload = multer({ storage: storage })

var findPost = async (req, res, next) => {
    if (req.params.id) {
        req.post = await Post.findOne({ _id: req.params.id })
        req.actionType = 'update'
        if (
            req.user.isMod &&
            req.post.creator.toString() != req.user._id.toString()
        ) {
            res.redirect('/admin/posts')
            return
        }
    } else {
        req.post = await new Post()
        req.actionType = 'create'
    }
    next()
}

var updatePost = async (req, res, next) => {
    let {
        title,
        content,
        summary,
        category,
        publishedAt,
        wpslug,
        status,
        categories,
        keywords,
    } = req.body
    var post = req.post
    let postId = post._id.toString()
    try {
        post.title = title
        post.status = status
        post.summary = summary
        post.content = content
        post.category = category
        post.wpslug = wpslug
        post.categories = categories
        post.keywords = keywords
        if (publishedAt) {
            post.publishedAt = moment(publishedAt, 'DD/MM/YYYY')
        }
        if (!post.creator) {
            post.creator = req.user._id
        }
        if (req.file) {
            var timestamp = moment().format('YYMMDDDHHmm')
            post.image =
                '/uploads/posts/' +
                postId +
                '/' +
                req.file.filename +
                '?at=' +
                timestamp
            var targetDir = POST_UPLOAD_PATH + postId + '/'
            await sharp(targetDir + req.file.filename)
                .resize(300, 200)
                .toFile(targetDir + 'medium.png')
            post.thumb =
                '/uploads/posts/' + postId + '/medium.png' + '?at=' + timestamp
        }
        await post.save()
        req.flash(
            'success',
            req.actionType == 'update'
                ? 'Cập nhật thành công'
                : 'Thêm mới thành công'
        )
        res.redirect('/admin/posts/' + postId)
    } catch (err) {
        req.flash('error', err.message)
        if (req.actionType == 'update') {
            res.redirect('/admin/posts/' + postId)
        } else {
            res.render('admin/posts/new')
        }
    }
}

router.get('/', async (req, res, next) => {
    let page = req.query.page || 1
    let { status } = req.query
    try {
        var query = {}
        if (req.user.idMod) {
            query.creator = req.user._id
        }
        if (status) {
            query.status = status
        }
        var data = await Post.paginate(query, {
            page: page,
            limit: 20,
            sort: { createdAt: -1 },
        })
        res.render('admin/posts/index', {
            posts: data.docs,
            page,
            total: data.totalPages,
        })
    } catch (err) {
        next(err)
    }
})

router.post('/', findPost, upload.single('image'), updatePost)

router.get('/new', async (req, res, next) => {
    try {
        let categories = await Category.find({})
        res.render('admin/posts/new', { categories: categories })
    } catch (err) {
        next()
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        let categories = await Category.find({})
        let post = await Post.findOne({ _id: req.params.id })
        res.render('admin/posts/show', { post: post, categories: categories })
    } catch (err) {
        next(err)
    }
})

router.post('/:id', findPost, upload.single('image'), updatePost)

router.get('/:id/delete', async (req, res, next) => {
    try {
        var result = await Post.remove({ _id: req.params.id })
        res.redirect('/admin/posts')
    } catch (err) {
        next(err)
    }
})

module.exports = router
