const express = require('express')
const router = express.Router()
const {registerUser, loginUser, googleAuth, getAllUser, editProfile, resetPassword, sendEmail} = require('../controllers/userControllers.js')
const User = require('../models/user.js')
const {protect} = require('../middleware/protect.js')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/google-auth/callback', googleAuth)
router.get('/allUsers', getAllUser)
router.put('/editProfile/:id', protect, editProfile)
router.post('/sendEmail', sendEmail)
router.post('/resetPassword/:token', resetPassword)


router.get('/:id', async(req, res) => {
     try{
        const user = await User.findById(req.params.id)
        .select('username imageUrl bio job followers followings posts')
        .populate('followers', 'username imageUrl')
        .populate('followings', 'username imageUrl')
        .populate('posts', 'createdAt')
        res.json(user)
     }catch(err){
        res.status(500).json({message: 'error getind userData', error: err.message})
     }
})


module.exports = router
