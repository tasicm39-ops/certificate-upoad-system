import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import CertificateRouter from './routes/certificate.route'
import path from 'path'
import cors from 'cors'

export const prisma = new PrismaClient()

const app = express()
const port = 8080

async function main() {
    app.use(
        cors({
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        }),
    )

    app.use(express.json())

    app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

    app.use('/api/v1/certificates', CertificateRouter)

    app.all('*', (req: Request, res: Response) => {
        res.status(404).json({ error: `Route ${req.originalUrl} not found` })
    })

    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`)
    })
}

main()
    .then(async () => {
        await prisma.$connect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
