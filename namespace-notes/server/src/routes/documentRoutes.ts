import { Router } from "express";
import documentController from "../controllers/documentController";

/**
 * Routes for uploading and managing workspace documents.
 */

const router = Router();

/**
 * POST /add - Upload one or more documents.
 */
router.post("/add", (req, res) => {
  const { namespaceId } = req.query;

  if (typeof namespaceId === "string" && namespaceId.startsWith("default")) {
    return res.status(400).json({ error: "Invalid namespaceId, you cannot edit the demo workspace" });
  }

  documentController.addDocuments(req, res);
});

/**
 * DELETE /files/delete/:namespaceId/:documentId - Remove a specific document.
 */
router.delete(
  "/files/delete/:namespaceId/:documentId",
  documentController.deleteDocument
);

/**
 * DELETE /workspace/:namespaceId - Remove an entire workspace.
 */
router.delete("/workspace/:namespaceId", documentController.deleteWorkspace);

/** GET /files/:namespaceId - List files in a workspace. */
router.get("/files/:namespaceId", documentController.listFilesInNamespace);
/** GET /files/:namespaceId/:documentId/(*) - Serve a stored file. */
router.get(
  "/files/:namespaceId/:documentId/(*)",
  documentController.serveDocument
);

export default router;
