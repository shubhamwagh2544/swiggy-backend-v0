import { Request, Response } from 'express';

async function search(req: Request, res: Response) {
    return res.status(200).json({
        message: 'Search OK!'
    })
}

export {
    search
}