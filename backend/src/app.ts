import express, { Request, Response } from 'express'
import dotenv from "dotenv"
import cors from "cors"
import { router } from './routes'

dotenv.config()
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())
app.use("/api", router)

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}/api`)
    })
}

export default app  