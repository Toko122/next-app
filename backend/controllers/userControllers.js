const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const { group } = require('console')

const Client = new OAuth2Client(process.env.CLIENT_ID)

exports.registerUser = async (req, res) => {
    const { email, password, username, job } = req.body;
    try {
        const existedUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existedUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        if(!password || password.trim().length < 6){
            return res.status(400).json({ message: 'Password must be more than 6 characters' });
        }

        if(!username || username.trim().length < 6){
            return res.status(400).json({ message: 'Username must be more than 6 characters' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            username,
            job,
            password: hashedPassword
        });

        return res.status(201).json({ user });
    } catch (err) {
        return res.status(500).json({ message: 'Error registering user', error: err.message });
    }
};

exports.loginUser = async(req, res) => {
    const {username, password} = req.body
    try{

        const user = await User.findOne({username}).populate('username')
        if(!user) return res.status(400).json({message: 'user not found'})

      const isMatch = await bcrypt.compare(password, user.password)
      if(!isMatch) return res.status(404).json({message: "invalid username or password"})

      const token = jwt.sign({id: user.id}, process.env.JWT, {expiresIn: '1d'})
      
      res.status(200).json({user: user._id, username: user.username, token})
      
    }catch(err){
        res.status(500).json({message: 'error login user', error: err.message})
    }
}


exports.googleAuth = async (req, res) => {
  const { token } = req.body

  if (!token) return res.status(400).json({ message: 'Token is required' });

  try {
      const client = await Client.verifyIdToken({
          idToken: token,
          audience: process.env.CLIENT_ID
      });

      const payload = client.getPayload();
      const googleId = payload.sub;
      const email = payload.email;
      const username = payload.name || email.split("@")[0];

      
      let user = await User.findOne({ email });

      if (!user) {
          
          user = await User.create({
              email,
              username,
              googleId
          });
      } else {
          
          let modified = false;

          if (!user.googleId && googleId) {
              user.googleId = googleId;
              modified = true;
          }

          if (!user.username) {
              user.username = username;
              modified = true;
          }

          if (modified) await user.save();
      }

      const appToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT, { expiresIn: '1d' });

      res.status(200).json({ user, token: appToken });

  } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Error login with Google', error: err.message });
  }
}



exports.getAllUser = async (req, res) => {
      try{
         const users = await User.find().select('username imageUrl _id bio job')
         res.json(users)
      }catch(err){
        res.status(500).json({ message: 'Error fetching users', error: err.message });
      }
}


exports.editProfile = async(req, res) => {
     const userId = req.user.id
     const {bio, job, username} = req.body
     try{
        
        const updates = {}
        if(bio) updates.bio = bio
        if(job) updates.job = job
        if(username) updates.username = username
  
        const existedUser  = await User.findOne({username})
        if(existedUser){
          return res.status(409).json({ message: "Username already taken" });
        }
        
        if (username) {
          const existedUser  = await User.findOne({username});
          if(existedUser){
              return res.status(409).json({ message: "Username already taken" });
          }
          updates.username = username;
      }

        const updatedUser = await User.findByIdAndUpdate(userId, updates, {new: true})  

        res.status(200).json({ message: "Profile updated", user: updatedUser });
     }catch(err){
      res.status(500).json({message: 'error posting bio', error: err})
     }
}

exports.sendEmail = async (req, res) => {
     const {email} = req.body
     try{

        const user = await User.findOne({email})

        const resetToken = crypto.randomBytes(32).toString('hex')
        user.resetToken = resetToken
        user.resetTokenExpire = Date.now() + 1000 * 60 * 15
        await user.save()

        const resetLink = `https://next-app-ocg8-ofevrlumn-toko122s-projects.vercel.app/auth/reset-password/${resetToken}`

        const transporter = await nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.USER,
                pass: process.env.NODEMAILER_CODE
            }
        })

        const mailOptions = {
            from: process.env.USER,
            to: email,
            subject: "🔐 Password Reset Request",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 24px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; background-color: #fff;">
      <h2 style="color: #333; text-align: center;">Reset Your Password</h2>

      <p style="font-size: 16px; color: #444;">
        Hello <strong>${email}</strong>,
      </p>

      <p style="font-size: 15px; color: #555;">
        We received a request to reset your password. If you made this request, please click the button below:
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" 
           style="background-color: #4CAF50; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
          🔁 Reset Password
        </a>
      </div>

      <p style="font-size: 14px; color: #888;">
        If you didn’t request a password reset, you can safely ignore this email.
      </p>

      <p style="font-size: 14px; color: #aaa; text-align: center; margin-top: 40px;">
        &mdash; Your Security Team
      </p>
    </div>
        `
        }

        await transporter.sendMail(mailOptions)
        res.status(200).json({message: 'email sent'})

     }catch(err){
        res.status(500).json({message: 'cant send email', error: err.message})
     }
}

exports.resetPassword = async (req, res) => {
     const {password} = req.body
     const {token} = req.params
     try{
         const user = await User.findOne({
            resetToken: token,
            resetTokenExpire: {$gt: Date.now()}
         })

         if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
          }

          const isMatch = await bcrypt.compare(password, user.password)
          if(isMatch){
            return res.status(404).json({message: "password is same"})
          }

          const hashedPassword = await bcrypt.hash(password, 10)
          user.password = hashedPassword

          user.resetToken = undefined
          user.resetTokenExpire = undefined
          await user.save()

          res.status(200).json({message: 'password updated'})

     }catch(err){
        res.status(500).json({message: 'error reseting password', error: err.message})

     }
}


exports.getUserByMonth = async (req, res) => {
     try{
       const user = await User.aggregate([
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

      const result = user.map((u) => ({
        month: months[u._id - 1],
        users: u.count
      }))
      res.status(200).json(result);
     }catch(err){
      res.status(500).json({message: "error getting all users by month", error: err.message})
     }
}