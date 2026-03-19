import { Request, Response } from 'express'
import { prisma } from '../server'
import fs from 'fs'
import path from 'path'
import archiver from 'archiver'

class PostController {
    static async getCertificates(req: Request, res: Response) {
        try {
            const certificates = await prisma.certificate.findMany({
                orderBy: {
                    createdAt: 'desc',
                },
            })

            res.status(200).json(certificates)
        } catch (error) {
            console.error('Get certificates error:', error)
            res.status(500).json({ error: 'Failed to fetch certificates' })
        }
    }
    static async downloadAllCertificates(req: Request, res: Response) {
        try {
            const certificates = await prisma.certificate.findMany()

            if (!certificates.length) {
                return res.status(404).json({ error: 'Nema sertifikata za download' })
            }

            res.setHeader('Content-Type', 'application/zip')
            res.setHeader('Content-Disposition', 'attachment; filename=all-certificates.zip')

            const archive = archiver('zip', {
                zlib: { level: 9 },
            })

            archive.pipe(res)

            certificates.forEach((certificate) => {
                const filePath = path.join(__dirname, '../../uploads', certificate.filename)

                if (fs.existsSync(filePath)) {
                    archive.file(filePath, { name: certificate.filename })
                }
            })

            await archive.finalize()
        } catch (error) {
            console.error('Download all certificates error:', error)
            res.status(500).json({ error: 'Failed to download all certificates' })
        }
    }
    static async createCertificate(req: Request, res: Response) {
        try {
            const { name, provider, issued_at, expires_at } = req.body
            const file = req.file as Express.Multer.File

            if (!name || !provider || !issued_at) {
                return res.status(400).json({
                    error: 'name, provider i issued_at su obavezni',
                })
            }

            if (!file) {
                return res.status(400).json({
                    error: 'Fajl je obavezan',
                })
            }

            const certificate = await prisma.certificate.create({
                data: {
                    name,
                    provider,
                    issued_at: new Date(issued_at),
                    expires_at: expires_at ? new Date(expires_at) : null,
                    filename: file.filename,
                    filePath: file.path,
                },
            })

            res.status(201).json(certificate)
        } catch (error) {
            console.error('Create certificate error:', error)
            res.status(500).json({ error: 'Failed to create certificate' })
        }
    }
    static async deleteSelectedCertificates(req: Request, res: Response) {
        try {
            const { ids } = req.body

            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                return res.status(400).json({ error: 'IDs are required' })
            }

            const certificates = await prisma.certificate.findMany({
                where: {
                    id: {
                        in: ids,
                    },
                },
            })

            for (const cert of certificates) {
                const fullPath = path.join(__dirname, '../../', cert.filePath)

                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath)
                }
            }

            await prisma.certificate.deleteMany({
                where: {
                    id: {
                        in: ids,
                    },
                },
            })

            res.status(200).json({ message: 'Selected certificates deleted successfully' })
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Failed to delete selected certificates' })
        }
    }
}

export default PostController
