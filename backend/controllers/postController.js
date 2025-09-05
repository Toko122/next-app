const Post = require("../models/Post");

exports.addPost = async (req, res) => {
  try {
    const { title } = req.body
    const userId = req.user.id

    let imageUrl = null
    if (req.file) {
      imageUrl = req.file.path
    }

    if (!title && !imageUrl) {
      return res.status(400).json({ message: "Post must have at least a title or an image" })
    }

    const post = await Post.create({
      title,
      imageUrl,
      userId
    })

    res.status(201).json({ message: "Post created", post })
  } catch (err) {
    res.status(500).json({ message: "error adding post", error: err.message })
  }
}


exports.getPosts = async (req, res) => {
     try{
         const userId = req.params.id
         const posts = await Post.find({userId}).sort({createdAt: -1})
         res.json({posts})
     }catch(err){
        res.status(500).json({message: 'error getting post', error: err.message})
     }
}

exports.deletePost = async (req, res) =>{
    const postId = req.params.id
    const userId = req.user.id;
    try{
      const deletedPost = await Post.findOneAndDelete({_id: postId, userId: userId})
      res.status(200).json({ message: "Post deleted successfully", deletedPost });
    }catch(err){
      res.status(500).json({message: 'cannot delete post', error: err.message})
    }
}

exports.getAllPostsByMonth = async(req, res) => {
      try{
        const post = await Post.aggregate([
          {
            $group: {
              _id: {$month: '$createdAt'},
              count: {$sum: 1}
            }
          },
          {$sort: {'_id': 1}}
       ])

       

       const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

      const result = post.map((u) => ({
        month: months[u._id - 1],
        posts: u.count
      }))
      res.status(200).json(result);

      }catch(err){
        res.status(500).json({message: "error getting posts by month", error: err.message})
      }
}