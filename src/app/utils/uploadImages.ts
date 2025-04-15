
export const uploadImageToCloudinary = async (
  file: File
): Promise<string | null> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "profileImages"); 
  formData.append("folder", "markme"); 

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/djrykc7rt/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  return data.secure_url || null;
};
