import express from 'express'
import multer from 'multer'
import { storageService } from '../services/storage.js'

const upload = multer()
const router = express.Router()

// Accepts either multipart/form-data with field 'file' or JSON with { filename, fileBase64 }
router.post('/', upload.single('file'), async (req, res) => {
  try {
    let buffer: Buffer
    let filename: string
    let mimetype: string | undefined

    if (req.file) {
      buffer = req.file.buffer
      filename = req.file.originalname || `upload_${Date.now()}`
      mimetype = req.file.mimetype
    } else if (req.body && (req.body.fileBase64 || req.body.filebase64)) {
      const b64 = req.body.fileBase64 || req.body.filebase64
      const decoded = Buffer.from(b64, 'base64')
      buffer = decoded
      filename = req.body.filename || `upload_${Date.now()}.bin`
      mimetype = req.body.mimetype || 'application/octet-stream'
    } else {
      return res.status(400).json({ error: 'file required (multipart or JSON fileBase64)' })
    }

  const storedPath = await storageService.store(buffer, filename, { contentType: mimetype || 'application/octet-stream' })
    const url = await storageService.generateSignedUrl(storedPath)

    return res.status(201).json({ filepath: storedPath, url })
  } catch (err) {
    console.error('uploads POST error', err)
    return res.status(500).json({ error: 'internal error' })
  }
})

export default router
