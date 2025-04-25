"use client";

import { useState, useRef } from "react";
import axios from "axios";
import { User } from "lucide-react";
import Image from "next/image";

export default function ProfileImageUploader({
  onUpload,
}: {
  onUpload: (url: string) => void;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null); // State to hold error message

  // Create a reference to the file input so we can trigger it programmatically
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // File validation: check file type and size
    const isValidType = file.type.startsWith("image/");
    const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit

    if (!isValidType) {
      setError("Please upload a valid image file.");
      return;
    }

    if (!isValidSize) {
      setError("Image size should not exceed 5MB.");
      return;
    }

    // Reset error before uploading
    setError(null);

    // Show preview
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    // Upload file
    const formData = new FormData();
    formData.append("profileImage", file);
    setUploading(true);

    try {
      const response = await axios.post("/api/uploadImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        onUpload(response.data.filePath);
      } else {
        alert(response.data.error || "Upload failed");
      }
    } catch {
      setError("Something went wrong with the upload.");
    } finally {
      setUploading(false);
    }
  };

  // Trigger the file input when the avatar is clicked
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative flex justify-center items-center">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        disabled={uploading}
        className="hidden"
      />

      {/* Avatar icon or image */}
      <div
        className="w-24 h-24 rounded-full cursor-pointer flex items-center justify-center bg-gray-100"
        onClick={handleAvatarClick}
      >
        {uploading ? (
          <div className="w-12 h-12 animate-spin border-4 border-blue-500 rounded-full border-t-transparent"></div> // Custom spinner for uploading
        ) : previewUrl ? (
          <Image
            src={previewUrl}
            alt="Preview"
            className="object-cover w-full h-full rounded-full"
            width={120}
            height={120}
          />
        ) : (
          <User className="w-12 h-12 text-gray-500 items-center" />
        )}
      </div>

      {/* Error message */}
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}
