import fs from 'fs'
import archiver from 'archiver'
import express from 'express'
import { PrismaClient } from '@prisma/client'
import { upload } from '../middleware/upload'

const router = express.Router()
const prisma = new PrismaClient()

router.post('/create', upload.single('file'), async (req: any, res: any) => {
    try {
        const { name, provider, issued_at, expires_at } = req.body
        const uploadedFile = req.file

        if (!name || !provider || !issued_at || !uploadedFile) {
            res.status(400).json({ message: 'Missing required fields' })
            return
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

        res.status(201).json(certificate)
    } catch (error) {
        console.error('Create error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

router.get('/getall', async (_req: any, res: any) => {
    try {
        const certificates = await prisma.certificate.findMany({
            orderBy: { id: 'desc' },
        })

        res.status(200).json(certificates)
    } catch (error) {
        console.error('Fetch error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})
router.delete('/delete-selected', async (req: any, res: any) => {
    try {
        const { ids } = req.body

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            res.status(400).json({ message: 'No certificate ids provided' })
            return
        }

        const certificates = await prisma.certificate.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
        })

        await prisma.certificate.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        })

        for (const certificate of certificates) {
            if (certificate.filePath && fs.existsSync(certificate.filePath)) {
                fs.unlinkSync(certificate.filePath)
            }
        }

        res.status(200).json({
            message: 'Selected certificates deleted successfully',
            deleted: certificates.length,
        })
    } catch (error) {
        console.error('Delete selected error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

router.get('/download-all', async (_req: any, res: any) => {
    try {
        const certificates = await prisma.certificate.findMany()

        if (certificates.length === 0) {
            res.status(404).json({ message: 'No certificates found' })
            return
        }

        res.setHeader('Content-Type', 'application/zip')
        res.setHeader('Content-Disposition', 'attachment; filename="certificates.zip"')

        const archive = archiver('zip', { zlib: { level: 9 } })

        archive.on('error', (error) => {
            throw error
        })

        archive.pipe(res)

        for (const certificate of certificates) {
            archive.file(certificate.filePath, { name: certificate.filename })
        }

        await archive.finalize()
    } catch (error) {
        console.error('Download all error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})
router.get('/download/:filename', (req: any, res: any) => {
    const filePath = `uploads/${req.params.filename}`
    res.download(filePath)
})

export default router
