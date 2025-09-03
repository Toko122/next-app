const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

app.use(express.json())
app.use(cors({
    origin: ['https://next-app-ocg8-6r12leuqx-toko122s-projects.vercel.app', 'http://localhost:3000'],
    credentials: true
}))

const userRouter = require('./router/userRouter')
const imageRouter = require('./router/uploadRouter')
const followRouter = require('./router/followRouter')
const postRouter = require('./router/postRouter')
const commentRouter = require('./router/commentRouter')

app.use('/api/users', userRouter)
app.use('/api/images', imageRouter)
app.use('/api/follow', followRouter)
app.use('/api/post', postRouter)
app.use('/api/comments', commentRouter)


mongoose.connect(process.env.MONGODB)
.then(() => {
    console.log('backend connected well');
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
      })
}).catch((err) => {
    console.log('error connecting mongodb', err); 
})
