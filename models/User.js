const mongoose = require('mongoose')
const Validator = require('validator')
const SALT_WORK_FACTOR = 10
const bcrypt = require('bcryptjs')

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        zaloId: {
            type: String,
            index: true,
        },
        email: {
            type: String,
            lowercase: true,
            unique: true,
            index: true,
        },
        password: {
            type: String,
        },
        image: {
            type: String,
        },
        role: {
            type: String,
            default: 'user',
        },
        firstUpdate: {
            type: Boolean,
            default: false,
        },
        dateBirth: {
            type: Date,
        },
        placeBirth: {
            type: String,
        },
        address: {
            type: String,
        },
        relativePhone: {
            type: String,
        },
        nationalId: {
            type: String,
        },
        dateIssued: {
            type: Date,
        },
        placeIssued: {
            type: String,
        },
        height: {
            type: String,
        },
        weight: {
            type: String,
        },
        blood: {
            type: String,
        },
        clothingSize: {
            type: String,
        },
        shoeSize: {
            type: String,
        },
        sendWelcomeEmail: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
        },
    }
)

// Validation
schema.virtual('isAdmin').get(function () {
    return this.role == 'admin'
})

schema.virtual('isMod').get(function () {
    return this.role == 'mod'
})

schema.virtual('isEditor').get(function () {
    return this.role == 'editor'
})

schema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}

schema.methods.renewToken = function () {
    const token = jwt.sign(
        {
            id: this._id,
            at: moment().format('YYYYMMDD'),
        },
        __secret
    )
    this.token = token
    return token
}

schema.methods.hashPassword = function (password) {
    var self = this
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, SALT_WORK_FACTOR, (err, hash) => {
            if (err) {
                reject(err)
            }
            self.password = hash
            self.resetPasswordToken = null
            resolve(self)
        })
    })
}

schema.methods.changePassword = async function (password) {
    var hash = bcrypt.hashSync(password, SALT_WORK_FACTOR)
    this.password = hash
    this.resetPasswordToken = null
    await this.save()
}

schema.statics.findOneOrCreate = async function (condition) {
    const one = await this.findOne(condition)

    return one || (await this.create(condition))
}

const User = mongoose.model('User', schema)

module.exports = User
