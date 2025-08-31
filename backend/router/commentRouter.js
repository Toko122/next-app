const express = require('express')
const router = express.Router()
const {postComments, getComments, deleteComments} = require('../controllers/commentController')
const {protect} = require('../middleware/protect')

router.post('/postComment/:id', protect, postComments)
router.get('/getComment/:id', getComments)
router.delete('/deleteComment/:postId/:commentId', protect, deleteComments)

module.exports = router