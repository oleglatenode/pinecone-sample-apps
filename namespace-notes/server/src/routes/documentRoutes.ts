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
  const { workspaceId } = req.query;

  if (typeof workspaceId === "string" && workspaceId.startsWith("default")) {
    return res.status(400).json({ error: "Invalid workspaceId, you cannot edit the demo workspace" });
  }

  documentController.addDocuments(req, res);
});

/**
 * DELETE /files/delete/:namespaceId/:documentId - Remove a specific document.
 */
router.delete(
  "/files/delete/:workspaceId/:documentId",
  documentController.deleteDocument
);

/**
 * DELETE /workspace/:namespaceId - Remove an entire workspace.
 */
router.delete("/workspace/:workspaceId", documentController.deleteWorkspace);

/** GET /files/:namespaceId - List files in a workspace. */
router.get("/files/:workspaceId", documentController.listFilesInNamespace);
/** GET /files/:namespaceId/:documentId/(*) - Serve a stored file. */
router.get(
  "/files/:workspaceId/:documentId/(*)",
  documentController.serveDocument
);

export default router;
