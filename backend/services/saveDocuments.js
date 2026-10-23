
import path from "path";
import fs from "fs/promises";

export async function saveDocuments(formId, documents) {
 
  const uploadDir = path.join(process.cwd(), "public", String(formId));
  await fs.mkdir(uploadDir, { recursive: true });

  const savedFiles = [];

  for (const { id, file } of documents) {
    if (!id || !file) {
      throw new Error("Each document must contain an ID and file");
    }

    // Supports files supplied as Multer objects.
    const sourcePath = file.path;

    if (!sourcePath) {
      throw new Error(`Missing source path for document ${id}`);
    }

    const ext = path.extname(file.originalname || sourcePath);

    if (![".pdf", ".doc", ".docx"].includes(ext.toLowerCase())) {
      throw new Error(`Unsupported file type for document ${id}`);
    }

    const filename = `${id}${ext.toLowerCase()}`;
    const destination = path.join(uploadDir, filename);

    await fs.copyFile(sourcePath, destination);

    savedFiles.push({
      id,
      filename,
      path: destination,
    });
  }

  return savedFiles;
}
