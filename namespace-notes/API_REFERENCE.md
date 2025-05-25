# API Reference

All endpoints are prefixed with `/api` as configured in `server/src/index.ts`.

## POST `/api/documents/add`
Add one or more documents to a workspace. Accepts `multipart/form-data` with a
`files` field.
- **Query Parameters**
  - `namespaceId` (optional) – existing workspace identifier. If omitted and
    `newWorkspace` is `true`, a new ID will be generated.
  - `newWorkspace` (optional) – set to `true` to create a new workspace.
- **Response**: JSON containing the resulting `namespaceId` and document
  information.

## DELETE `/api/documents/files/delete/:namespaceId/:documentId`
Delete a document and its chunks from Pinecone and storage.
- **Response**: `{ message: string }`

## DELETE `/api/documents/workspace/:namespaceId`
Remove an entire workspace including all files.
- **Response**: `{ message: string }`

## GET `/api/documents/files/:namespaceId`
List files stored in a workspace.
- **Response**: array of file metadata.

## GET `/api/documents/files/:namespaceId/:documentId/*`
Serve a specific uploaded file. When using local storage the file contents are
sent directly; otherwise a redirect to the storage URL is returned.

## POST `/api/context/fetch`
Retrieve chat context for a series of messages.
- **Request Body**: `{ namespaceId: string, messages: ChatMessage[] }`
- **Response**: `{ query: string, context: string }`
