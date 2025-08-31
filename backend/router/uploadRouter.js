const express = require('express')
const router = express.Router()
const parser = require('../models/cloudinary')
const {uploadImage, getImage} = require('../controllers/uploadController')
const {protect} = require('../middleware/protect')

router.post('/uploadImage', protect, parser.single('image'), uploadImage)
router.get('/getImage/:id', getImage)

module.exports = router