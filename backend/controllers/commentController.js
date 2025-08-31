const Post = require('../models/Post')

exports.postComments = async (req, res) => {
    const {comment} = req.body
    const postId = req.params.id
    try{ 
      
        const post = await Post.findById(postId)

        const newComment = {
            user: req.user.id,
            text: comment
        }

        post.comments.push(newComment)
        await post.save()
        
        const populatedPost = await Post.findById(postId)
        .populate('comments.user', 'username imageUrl')
        

        res.status(201).json({message: "Comment added", comment: populatedPost.comments[populatedPost.comments.length - 1]})

    }catch(err){
        res.status(500).json({message: "error posting comment", error: err.message})
    }
}

exports.getComments = async (req, res) => {
    try{
       const post = await Post.findById(req.params.id).populate('comments.user', 'username imageUrl').sort({createdAt: -1})
       res.status(200).json({comments: post.comments || []})
    }catch(err){
        res.status(500).json({message: 'error getting comment'})
    }
}

exports.deleteComments = async (req, res) => {
     try{
        const {postId, commentId} = req.params
        const userId = req.user.id

        const post = await Post.findById(postId)

        const comment = post.comments.id(commentId)

        if(
            comment.user.toString() !== userId
             &&
            post.userId.toString() !== userId
           ){
            return res.status(403).json({ message: "You don't have permission to delete this comment" })
        }

        comment.deleteOne()
        await post.save()

        res.status(200).json({ message: "Comment deleted successfully" })

     }catch(err){
        res.status(500).json({message: 'error deleting comment'})
     }
}