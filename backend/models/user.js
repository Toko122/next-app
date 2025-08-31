const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    email: {type: String, unique: true, required: true},
    username: {type: String, required: true},
    password: {type: String},
    role: {
        type: String,
        enum: ['user', 'admin'],
        required: true,
        default: 'user'
    },
    googleId: {type: String, unique: true, sparse: true},
    imageUrl: {type: String},
    followers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', default: []}],
    followings: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', default: []}],
    posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: []}],
    bio: {type:String},
    job: {type: String},
    resetToken: {type: String},
    resetTokenExpire: {type: Date},
}, {timestamps: true})

module.exports = mongoose.model('User', UserSchema)