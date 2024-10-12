"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export async function uploadPdf(formData: FormData) {
  const file = formData.get("pdf") as File;
  if (!file) {
    return { error: "No file uploaded" };
  }

  try {
    const blob = await put(file.name, file, { access: "public" });
    revalidatePath("/");
    return { url: blob.url };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { error: "Error uploading file" };
  }
}
