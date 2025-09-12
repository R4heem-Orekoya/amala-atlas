"use client";

import { useDropzone } from "react-dropzone";
import { ControllerRenderProps } from "react-hook-form";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type ImageDropzoneProps = {
  //eslint-disable-next-line
  field: ControllerRenderProps<any, any>;
  value: File[];
  onChange: (files: File[]) => void;
};

export function ImageDropzone({ field, value, onChange }: ImageDropzoneProps) {
  const onDrop = (acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter((file) => {
      if (!file.type.startsWith("image/")) {
        alert("Only image files allowed");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("File must be smaller than 5MB");
        return false;
      }
      return true;
    });
    onChange([...value, ...validFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg h-56 flex flex-col justify-center items-center p-6 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25"
        )}
      >
        <input
          {...getInputProps()}
          name={field.name}
        />
        <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          Drag & drop or click to upload (PNG, JPG, GIF, ≤5MB)
        </p>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {value.map((file, index) => (
            <div
              key={index}
              className="relative group"
            >
              <Image
                src={URL.createObjectURL(file)}
                alt={`Preview ${index + 1}`}
                width={200}
                height={200}
                className="h-24 w-full object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => {
                  const newFiles = value.filter((_, i) => i !== index);
                  onChange(newFiles);
                }}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
