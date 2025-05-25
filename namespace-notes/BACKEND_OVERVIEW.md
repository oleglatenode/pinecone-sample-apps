# Backend Overview

This document provides a quick reference for the server implementation located in
`namespace-notes/server`.

## Folder Structure

- **controllers** – Express handlers for incoming requests.
- **models** – Interactions with Pinecone and other services.
- **routes** – Express route declarations mapping paths to controllers.
- **utils** – Helper modules such as embedding logic and storage services.
- **utils/storage** – Contains implementations of `ServerStorage` and
  `SpacesStorage` for storing uploaded files.

## Request Flow

1. A client sends a request to a route defined in `routes`.
2. The route calls a controller method which performs validation and orchestration.
3. Controllers rely on models and utilities to interact with Pinecone and
   to process files.
4. Responses are returned to the client once work is complete.

### Worker Threads

File uploads are processed in a worker thread (`utils/workers/fileProcessorWorker`)
to avoid blocking the main event loop. The worker parses the document,
chunks the text and generates embeddings before the controller upserts them into
Pinecone.

## StorageService

`utils/storage/storage.ts` exports a `storageService` instance which resolves to
either `ServerStorage` (local filesystem) or `SpacesStorage` (DigitalOcean
Spaces). This abstraction allows the application to switch storage backends by
configuring environment variables.
