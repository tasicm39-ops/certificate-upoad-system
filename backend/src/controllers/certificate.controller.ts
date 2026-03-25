import express from 'express'
import multer from 'multer'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    },
})

const upload = multer({ storage })

router.post('/create', upload.single('file'), async (req, res) => {
    try {
        const { name, provider, issued_at, expires_at } = req.body
        const uploadedFile = req.file

        if (!name || !provider || !issued_at || !uploadedFile) {
            return res.status(400).json({ message: 'Missing required fields' })
        }

        const certificate = await prisma.certificate.create({
            data: {
                name,
                provider,
                issued_at: new Date(issued_at),
                expires_at: expires_at ? new Date(expires_at) : null,
                filename: uploadedFile.filename,
                filePath: uploadedFile.path,
            },
        })

        return res.status(201).json(certificate)
    } catch (error) {
        console.error('Create certificate error:', error)
        return res.status(500).json({ message: 'Server error' })
    }
})

router.get('/getall', async (req, res) => {
    try {
        const certificates = await prisma.certificate.findMany({
            orderBy: {
                id: 'desc',
            },
        })

        return res.status(200).json(certificates)
    } catch (error) {
        console.error('Get certificates error:', error)
        return res.status(500).json({ message: 'Server error' })
    }
})

export default router
