"use server";

import { writeFile } from "fs/promises";
import { join } from "path";
import { mkdir } from "fs/promises";

export async function uploadFile(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file uploaded");
  }

  // Convert the file to a buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Specify the upload directory
  const uploadDir = join(process.cwd(), "public", "uploads");

  // Create the upload directory if it doesn't exist
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (error) {
    console.error("Failed to create upload directory:", error);
    throw new Error("Failed to create upload directory");
  }

  // Generate a unique filename
  const uniqueFilename = `${Date.now()}-${file.name}`;
  const filePath = join(uploadDir, uniqueFilename);

  // Write the file
  try {
    await writeFile(filePath, buffer);
    console.log(`File saved to ${filePath}`);
  } catch (error) {
    console.error("Failed to save the file:", error);
    throw new Error("Failed to save the file");
  }

  // Return the relative path to the file
  return { success: true, path: `/uploads/${uniqueFilename}` };
}
