const User = require('../models/user')

exports.followUser = async (req, res) => {
    try{
      const currentUserId = req.user.id
      const targetUserId = req.params.id

      if(currentUserId === targetUserId){
        return res.status(400).json({ message: "Can't follow yourself" });
      }

      const currentUser = await User.findById(currentUserId)
      const targetUser = await User.findById(targetUserId)

      if (!targetUser.followers.includes(currentUserId)) {
        targetUser.followers.push(currentUserId);
        currentUser.followings.push(targetUserId);
        await targetUser.save();
        await currentUser.save();
      }

      res.status(200).json({message: "Followed successfully" })

    }catch(err){
        res.status(500).json({message: 'error following user', error: err.message})
    }
}

exports.getFollowersAndFollowing  = async (req, res) => {
    const userId = req.params.id
    try{
      const targetUser = await User.findById(userId)
      .populate('followers', 'username imageUrl')
      .populate('followings', 'username imageUrl')

      if (!targetUser) {
        return res.status(404).json({ message: 'User not found' });
      }


      res.status(200).json({message: 'followers get succesfully',
        followers: targetUser.followers,
        followings: targetUser.followings
      })
    }catch(err){
        res.status(500).json({message: 'error get followers list user', error: err.message})
    }
}

exports.unfollow = async (req, res) => {
     const currentUserId = req.user.id 
     const targetUserId = req.params.id
    try{
       await User.findByIdAndUpdate(targetUserId, {
        $pull: {followers: currentUserId}
       })

       await User.findByIdAndUpdate(currentUserId, {
          $pull: {followings: targetUserId}
       })

       res.status(200).json({ message: 'Unfollow successful' });
    }catch(err){
      res.status(500).json({message: 'error deleting fo;lowers', error: err.message})
    }
}