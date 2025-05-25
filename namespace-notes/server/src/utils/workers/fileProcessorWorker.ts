import { parentPort, workerData } from "worker_threads";
import { chunkAndEmbedFile, processFile } from "../documentProcessor";

/**
 * Worker thread entry used to process an uploaded file without blocking the
 * main event loop. It reads the file, chunks and embeds it then returns the
 * resulting document back to the parent thread.
 */

/**
 * Perform document processing and send the result back to the parent.
 */
async function processFileWorker() {
  const { fileData, fileType, fileName, documentId, documentUrl } = workerData;
  try {
    const { documentContent } = await processFile(
      fileName,
      fileData,
      fileType
    );
    const { document } = await chunkAndEmbedFile(
      documentId,
      documentUrl,
      documentContent
    );
    parentPort?.postMessage({ document });
  } catch (error: any) {
    parentPort?.postMessage({ error: error.message });
  }
}

processFileWorker();
