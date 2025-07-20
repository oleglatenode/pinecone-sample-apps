export async function uploadFiles(data: FormData) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/documents/add`,
      {
        method: "POST",
        body: data,
      }
    );
    if (response.status === 401) {
      alert('You are not authorized');
      throw new Error('Unauthorized');
    }

    if (response.ok) {
      const responseData = await response.json();
      console.log("Files uploaded successfully:", responseData);
      return { workspaceId: responseData.workspaceId };
    } else {
      throw new Error("Failed to upload files, " + response.statusText);
    }
  } catch (error) {
    console.error("Error uploading files:", error);
    throw error;
  }
}

