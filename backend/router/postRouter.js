const express = require("express")
const router = express.Router()
const { addPost, getPosts, deletePost, getAllPostsByMonth } = require("../controllers/postController")
const { protect } = require("../middleware/protect")
const parser = require('../models/cloudinary')

router.get('/getPostsByMonth', getAllPostsByMonth)
router.post("/addPost/:id", protect, parser.single('image'), addPost)
router.get("/getPosts/:id", getPosts)
router.delete('/deletePost/:id', protect, deletePost)

module.exports = router
