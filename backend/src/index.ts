import express, { Request, Response, urlencoded } from "express";
import { blogRouter } from "./routes/blog";
import { userRouter } from "./routes/user";
import { commentRouter } from "./routes/comment";

const app = express()
app.get('/', (req : Request, res: Response)=>{
    res.send("Backend is running");
})
app.use(express.json())

app.use('/api/v1/user', userRouter)
app.use('/api/v1/blog', blogRouter)
app.use('/api/v1/comment', commentRouter)
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log("Server is running on port 4000");
});