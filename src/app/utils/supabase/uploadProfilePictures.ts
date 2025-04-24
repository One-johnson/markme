import { supabaseBrowser } from "@/app/utils/supabase/client";

export async function uploadProfilePicture(
  file: File,
  teacherId: string
): Promise<string> {
  const filePath = `${teacherId}/${Date.now()}-${file.name}`;

  const { error } = await supabaseBrowser.storage
    .from("profile-pictures")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    console.error("Upload error:", error.message);
    throw new Error("Failed to upload profile picture");
  }

  const { data: urlData } = supabaseBrowser.storage
    .from("profile-pictures")
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}
