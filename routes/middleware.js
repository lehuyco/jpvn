const Mailers = require('mailers')
const moment = require('moment')
const i18n = require('i18n')

const Setting = require('models/Setting')
const Service = require('models/Service')
const Page = require('models/Page')

exports.initLocals = async (req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.title = 'Luật Hưng Việt'

    if (req.query.lang == 'en') {
        i18n.setLocale('en')
    }

    if (req.query.lang == 'vi') {
        i18n.setLocale(req, 'vi')
    }

    let locale = i18n.getLocale()
    res.locals.locale = locale
    res.locals.flash = req.flash()

    let setting = await Setting.findOne({ language: locale })
    res.locals.setting = setting
    if (setting) {
        res.locals.title = setting.title
        res.locals.ogDescription = setting.description
        res.locals.ogImage = setting.imageUrl
        res.locals.ogUrl = 'https://luathungviet.vn'
        res.locals.keywords = setting.keywords
    }

    // res.locals.services = await Service.find({language: locale})
    res.locals.aboutPages = await Page.find({ language: locale, type: 'about' })
    res.locals.termPages = await Page.find({ language: locale, type: 'terms' })

    // res.locals.headerType = 'transparent'
    res.locals.headerType = 'classic'

    // if (req.user && req.user.email && !req.user.sendWelcomeEmail) {
    //   Mailers.welcome(req.user.email)
    //   req.user.sendWelcomeEmail = true
    //   req.user.save()
    // }

    if (!Date.prototype.toFormat) {
        ;(function () {
            Date.prototype.toFormat = function (formatString) {
                return moment(this).format(formatString)
            }
        })()
    }
    next()
}

exports.requireAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.isAdmin) {
        next()
    } else {
        res.redirect('/login')
    }
}

exports.requireMod = (req, res, next) => {
    if (
        req.isAuthenticated() &&
        (req.user.isAdmin || req.user.isMod || req.user.isEditor)
    ) {
        next()
    } else {
        res.redirect('/login')
    }
}

exports.requireUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/login')
    }
}
