import express, {Request, Response} from "express"
import { Router } from "express"

export const router = Router()

router.get('/', (req: Request, res: Response) => {
    res.send({
        message: 'Hello World !'
    })
})