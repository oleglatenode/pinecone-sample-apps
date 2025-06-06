// storage.ts

/** Details about a stored file. */
export interface FileDetail {
  documentId: string;
  name: string;
  url: string;
}

/**
 * Generic file storage interface used by the application.
 */
export interface StorageService {
  saveFile(file: Express.Multer.File, fileKey: string): Promise<void>;
  constructFileUrl(fileKey: string): string;
  getFilePath(fileKey: string): Promise<string>;
  listFilesInNamespace(namespaceId: string): Promise<FileDetail[]>;
  deleteWorkspaceFiles(namespaceId: string): Promise<void>;
  deleteFileFromWorkspace(
    namespaceId: string,
    documentId: string
  ): Promise<void>;
}

import { ServerStorage } from "./serverStorage";
import { SpacesStorage } from "./spacesStorage";

const useSpaces =
  process.env.DO_SPACES_ACCESS_KEY_ID &&
  process.env.DO_SPACES_SECRET_ACCESS_KEY;
/** Chosen implementation of {@link StorageService} based on environment vars. */
export const storageService: StorageService = useSpaces
  ? new SpacesStorage()
  : new ServerStorage();
