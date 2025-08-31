const express = require('express')
const router = express.Router()
const {followUser, getFollowersAndFollowing , unfollow} = require('../controllers/followController')
const {protect} = require('../middleware/protect')

router.post('/postFollow/:id', protect, followUser)
router.get('/getFollowersAndFollowing/:id', getFollowersAndFollowing )
router.put('/unfollow/:id', protect, unfollow)

module.exports = router