
import multer from 'multer';
import path from 'path';
import fs from 'fs';
const dir = process.env.UPLOAD_DIR || 'uploads';
fs.mkdirSync(dir, {
    recursive: true
});
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${path.extname(file.originalname).toLowerCase()}`)
});
const allowed = new Set(['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']);
export default multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1
    },
    fileFilter: (req, file, cb) => allowed.has(file.mimetype) ? cb(null, true) : cb(new Error('Only PDF, DOC and DOCX resumes are allowed'))
});