
import multer from "multer";
import path from "path";
import fs from "fs";

const tempDir = path.join(process.cwd(), "public");

// Create temporary upload directory if it doesn't exist.
fs.mkdirSync(tempDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    // Temporary unique filename; saveDocuments assigns the final name.
    const uniqueName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 10)}${ext}`;

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".pdf", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(ext)) {
    return cb(
      new Error("Only PDF, DOC, or DOCX files are allowed")
    );
  }

  cb(null, true);
};

export const uploadReferralFiles = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB per file
    files: 20,
  },
}).any();
