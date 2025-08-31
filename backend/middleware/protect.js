const jwt = require('jsonwebtoken')

exports.protect = (req, res, next) => {
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith(`Bearer`)){
        return res.status(404).json({message: 'invalid token'})
    }

    const token = authHeader.split(' ')[1]

    try{
       const decode = jwt.verify(token, process.env.JWT)

       req.user = decode
       next()
    }catch(err){
        return res.status(401).json({ message: 'Token is not valid' });
    }
}
