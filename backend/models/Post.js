const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({
    title: {type: String},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }],
    createdAt: {type: Date, default: Date.now},
    imageUrl: {type: String},
})

module.exports = mongoose.model("Post", PostSchema)