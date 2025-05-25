// serverStorage.ts
import fs from "fs";
import path from "path";
import { FileDetail, StorageService } from "./storage";

/**
 * Local filesystem-based implementation of {@link StorageService}.
 */
export class ServerStorage implements StorageService {
  private readonly uploadDir = "uploads";

  /**
   * Save an uploaded file to the server's local filesystem.
   */
  async saveFile(file: Express.Multer.File, fileKey: string): Promise<void> {
    const [namespaceId, documentId, ...rest] = fileKey.split("/");
    const fileName = rest.join("/");
    const documentDirectory = path.join(
      this.uploadDir,
      namespaceId,
      documentId
    );

    if (!fs.existsSync(documentDirectory)) {
      fs.mkdirSync(documentDirectory, { recursive: true });
    }

    const destinationPath = path.join(documentDirectory, fileName);
    await fs.promises.rename(file.path, destinationPath);
  }

  /**
   * Construct the public URL for a stored file.
   */
  constructFileUrl(fileKey: string): string {
    const domain =
      process.env.SERVER_URL || `http://localhost:${process.env.PORT || 4001}`;
    return `${domain}/api/documents/files/${fileKey}`;
  }

  /**
   * Resolve the absolute path to a stored file.
   */
  async getFilePath(fileKey: string): Promise<string> {
    const filePath = path.join(this.uploadDir, fileKey);
    const files = await fs.promises.readdir(filePath);
    const firstFile = files[0];
    return path.join(filePath, firstFile);
  }

  /**
   * Remove all files for a namespace from disk.
   */
  async deleteWorkspaceFiles(namespaceId: string): Promise<void> {
    const namespaceDirectory = path.join(this.uploadDir, namespaceId);
    if (fs.existsSync(namespaceDirectory)) {
      fs.rmdirSync(namespaceDirectory, { recursive: true });
    }
  }

  /**
   * Delete a specific document from a namespace.
   */
  async deleteFileFromWorkspace(
    namespaceId: string,
    documentId: string
  ): Promise<void> {
    try {
      const documentDirectory = path.join(
        this.uploadDir,
        namespaceId,
        documentId
      );
      if (fs.existsSync(documentDirectory)) {
        fs.rmdirSync(documentDirectory, { recursive: true });
      }
    } catch (error) {
      console.error("Failed to delete file from server storage:", error);
      throw error;
    }
  }

  /**
   * List all files stored for a namespace.
   */
  async listFilesInNamespace(namespaceId: string): Promise<FileDetail[]> {
    const namespacePath = path.join(this.uploadDir, namespaceId);
    try {
      const documentDirs = fs
        .readdirSync(namespacePath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

      const allFiles: FileDetail[] = [];
      for (const documentId of documentDirs) {
        const documentPath = path.join(namespacePath, documentId);
        const files = fs.readdirSync(documentPath);
        allFiles.push(
          ...files.map((filename) => ({
            documentId: documentId,
            name: filename,
            url: this.constructFileUrl(
              `${namespaceId}/${documentId}/${filename}`
            ),
          }))
        );
      }
      return allFiles;
    } catch (error) {
      console.error(
        "Failed to list files in namespace from server storage:",
        error
      );
      throw error;
    }
  }
}
