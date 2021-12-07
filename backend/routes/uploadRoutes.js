import path from 'path'
import express from 'express'
import multer from 'multer'
const router = express.Router()

// Ici on utilise la syntaxe de multer. Voir site web pour obtenir un example.
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}` )
  },
})

// fct qui vérifie si l'extension est 'jpg|jpeg|png'... retourne true ou le texte 'Images only!'
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)
  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb('Images only!')
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  },
})

// Pour uploader plusieurs images; on change 'upload.single' pour 'upload.multiple'
router.post('/', upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`)
})

export default router
