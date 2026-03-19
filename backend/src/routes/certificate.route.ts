import PostController from '../controllers/certificate.controller'
import express from 'express'
import { upload } from '../middleware/upload'

const router = express.Router()

router.get('/getall', (req, res) => {
    PostController.getCertificates(req, res)
})

router.get('/download-all', (req, res) => {
    PostController.downloadAllCertificates(req, res)
})

router.post('/create', upload.single('file'), (req, res) => {
    PostController.createCertificate(req, res)
})

router.delete('/delete-selected', (req, res) => {
    PostController.deleteSelectedCertificates(req, res)
})

export default router
