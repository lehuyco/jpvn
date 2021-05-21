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

const canDelete = (user, post) => {
    var canDelete = false
    if (user.isAdmin) {
        canDelete = true
    }
    if (
        (user.isMod ||
            (post.creator && post.creator.toString() == user._id.toString())) &&
        post.status == 'draft'
    ) {
        canDelete = true
    }
    return canDelete
}

const canEdit = (user, post) => {
    var canEdit = false
    if (user.isAdmin) {
        canEdit = true
    }
    if (
        (user.isMod ||
            (post.creator && post.creator.toString() == user._id.toString())) &&
        post.status == 'draft'
    ) {
        canEdit = true
    }
    return canEdit
}

var findPost = async (req, res, next) => {
    if (req.params.id) {
        req.post = await Post.findOne({ _id: req.params.id })
        req.actionType = 'update'
        res.locals.canDelete = canDelete(req.user, req.post)
        res.locals.canEdit = canEdit(req.user, req.post)
    } else {
        req.post = await new Post()
        req.actionType = 'create'
    }
    next()
}

var updatePost = async (req, res, next) => {
    var post = req.post
    let postId = post._id.toString()
    if (req.actionType == 'update' && !res.locals.canEdit) {
        req.flash('success', 'Bạn không có quyền sửa bài này')
        return res.redirect('/admin/posts/' + postId)
    }
    let {
        title,
        content,
        summary,
        category,
        publishedAt,
        wpslug,
        categories,
        keywords,
    } = req.body
    try {
        post.title = title
        post.status = 'draft'
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
        if (req.user.isEditor) {
            query.creator = req.user._id
        }
        if (status) {
            query.status = status
        }
        var data = await Post.paginate(query, {
            page: page,
            limit: 20,
            sort: { updatedAt: -1 },
        })
        res.render('admin/posts/index', {
            posts: data.docs,
            page,
            total: data.totalPages,
            canDelete,
            canEdit,
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

router.get('/:id/status', findPost, async (req, res, next) => {
    try {
        let status = req.query.status
        console.log(status)
        console.log(req.user.isAdmin)
        let post = await Post.findOne({ _id: req.params.id })
        if (req.user.isAdmin) {
            if (status == 'published') {
                post.status = status
                await post.save()
                req.flash('success', 'Duyệt bài thành công')
            }
            if (status == 'draft') {
                post.status = status
                await post.save()
                req.flash('success', 'Đã cho phép sửa bài')
            }
        } else {
            if (status == 'request' && post.status == 'draft') {
                post.status = status
                await post.save()
                req.flash('success', 'Yêu cầu duyệt bài thành công')
            }
            if (status == 'draft' && post.status == 'request') {
                post.status = status
                await post.save()
                req.flash('success', 'Đã hủy yêu cầu duyệt bài')
            }
            if (status == 'needEdit' && post.status == 'published') {
                post.status = status
                await post.save()
                req.flash('success', 'Yêu cầu sửa bài thành công')
            }
        }
        res.redirect('/admin/posts/' + post.id)
    } catch (err) {
        next(err)
    }
})

router.get('/:id/edit', findPost, async (req, res, next) => {
    try {
        let categories = await Category.find({})
        res.render('admin/posts/edit', {
            post: req.post,
            categories: categories,
        })
    } catch (err) {
        next(err)
    }
})

router.get('/:id', findPost, async (req, res, next) => {
    try {
        let categories = await Category.find({})
        res.render('admin/posts/show', {
            post: req.post,
            categories: categories,
        })
    } catch (err) {
        next(err)
    }
})

router.post('/:id', findPost, upload.single('image'), updatePost)

router.get('/:id/delete', async (req, res, next) => {
    if (!res.locals.canDelete) {
        req.flash('success', 'Bạn không có quyền xóa bài này')
        return res.redirect('/admin/posts/' + postId)
    }
    try {
        var result = await Post.remove({ _id: req.params.id })
        res.redirect('/admin/posts')
    } catch (err) {
        next(err)
    }
})

module.exports = router
