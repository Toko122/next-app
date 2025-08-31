const express = require("express")
const router = express.Router()
const { addPost, getPosts, deletePost } = require("../controllers/postController")
const { protect } = require("../middleware/protect")
const parser = require('../models/cloudinary')


router.post("/addPost/:id", protect, parser.single('image'), addPost)
router.get("/getPosts/:id", getPosts)
router.delete('/deletePost/:id', protect, deletePost)

module.exports = router
