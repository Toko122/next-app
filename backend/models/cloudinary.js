const cloudinary = require('cloudinary').v2
const multer = require('multer')
const {CloudinaryStorage} = require('multer-storage-cloudinary')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_SECRET,
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads/',
        allowed_formats: ['jpg', 'jpeg', 'png']
    }
})

const parser = multer({storage: storage})

module.exports = parser