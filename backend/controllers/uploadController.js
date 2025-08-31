const cloudinary = require('../models/cloudinary')
const User = require('../models/user')

exports.uploadImage = async(req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const userId = req.user.id

    const imageUrl = req.file.path

    const user = await User.findByIdAndUpdate(
      userId,
      {imageUrl},
      {new: true}
    )
    
    res.json({imageUrl: user.imageUrl})

  } catch (err) {
    res.status(500).json({ message: "Error uploading image", error: err.message });
  }
};

exports.getImage = async (req, res) => {
     try{
        const image = await User.findById(req.params.id).select('imageUrl')
        if (!image) return res.status(404).json({ message: 'User not found' });
        res.json({imageUrl: image.imageUrl});
     }catch(err){
        res.status(400).json({message: "error getting image", error: err.message})
     }
}