"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  endpoint: string;
  value?: string;
  onChange: (url: { url: string }) => void;
}

export const FileUpload = ({
  endpoint,
  value = "",
  onChange,
}: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Send base64 to the API
        onChange({ url: reader.result as string });
      };
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {value ? (
        <div className="relative w-full h-40 mb-4">
          <Image
            fill
            src={value}
            alt="Upload"
            className="object-contain"
          />
          <Button
            onClick={() => onChange({ url: "" })}
            variant="destructive"
            size="sm"
            className="absolute top-0 right-0"
          >
            Remove
          </Button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <Loader2 className="h-10 w-10 text-gray-400 animate-spin" />
            ) : (
              <>
                <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG or WebP (Max: 10MB)
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      )}
    </div>
  );
}; 