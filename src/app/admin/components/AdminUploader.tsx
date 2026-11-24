"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { processImageForUpload } from "@/lib/image-processing";
import {
  CollectionType,
  CategoryType,
  insertPhotoAction,
  replaceMemoryAction,
} from "../actions";

interface UploadItem {
  id: string;
  file: File;
  previewUrl: string;
  title: string;
  alt: string;
  category: CategoryType | "";
  caption: string;
  instagramUrl: string;
  status: "idle" | "resizing" | "uploading" | "saving" | "done" | "failed";
  progress: number;
  errorMessage?: string;
}

interface AdminUploaderProps {
  collection: CollectionType;
  defaultCategory?: CategoryType;
  isMemorySlot?: boolean;
  memoryCategory?: CategoryType;
  existingMemoryId?: string | null;
  existingMemoryStoragePath?: string | null;
  onUploadComplete?: () => void;
}

export default function AdminUploader({
  collection,
  defaultCategory = "nature",
  isMemorySlot = false,
  memoryCategory,
  existingMemoryId,
  existingMemoryStoragePath,
  onUploadComplete,
}: AdminUploaderProps) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const newItems: UploadItem[] = [];

    Array.from(fileList).forEach((file) => {
      // Friendly filename to title derivation (e.g. toronto_sunset_2.jpg -> Toronto Sunset 2)
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      const cleanTitle = baseName
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      newItems.push({
        id: Math.random().toString(36).substring(2, 9),
        file,
        previewUrl: URL.createObjectURL(file),
        title: cleanTitle,
        alt: `${cleanTitle} - Aswin Krishna Photography`,
        category: (memoryCategory || defaultCategory) as CategoryType,
        caption: "",
        instagramUrl: "",
        status: "idle",
        progress: 0,
      });
    });

    if (isMemorySlot) {
      // Memory slot accepts only 1 replacement photo
      setItems(newItems.slice(0, 1));
    } else {
      setItems((prev) => [...prev, ...newItems]);
    }
  };

  const updateItem = (id: string, updates: Partial<UploadItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const uploadSingleItem = async (item: UploadItem) => {
    if (!item.title.trim()) {
      updateItem(item.id, {
        status: "failed",
        errorMessage: "Title is required.",
      });
      return false;
    }

    const supabase = createBrowserClient();
    if (!supabase) {
      updateItem(item.id, {
        status: "failed",
        errorMessage: "Supabase client unconfigured.",
      });
      return false;
    }

    try {
      // 1. Resize & create blur placeholder in browser
      updateItem(item.id, { status: "resizing", progress: 20 });
      const processed = await processImageForUpload(item.file);

      // 2. Upload directly to Supabase Storage (bypasses Next server body size limits)
      updateItem(item.id, { status: "uploading", progress: 50 });
      const fileExt = processed.mimeType === "image/jpeg" ? "jpg" : "webp";
      const storagePath = `${collection}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(storagePath, processed.blob, {
          contentType: processed.mimeType,
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message || "Failed to upload to storage.");
      }

      // 3. Save metadata via server action
      updateItem(item.id, { status: "saving", progress: 85 });

      if (isMemorySlot && memoryCategory) {
        const res = await replaceMemoryAction({
          category: memoryCategory,
          title: item.title,
          alt: item.alt,
          caption: item.caption,
          storage_path: storagePath,
          width: processed.width,
          height: processed.height,
          blur_data_url: processed.blurDataUrl,
          old_id: existingMemoryId,
          old_storage_path: existingMemoryStoragePath,
        });

        if (res.error) throw new Error(res.error);
      } else {
        const res = await insertPhotoAction({
          collection,
          category: (item.category as CategoryType) || null,
          title: item.title,
          alt: item.alt,
          caption: item.caption,
          storage_path: storagePath,
          width: processed.width,
          height: processed.height,
          blur_data_url: processed.blurDataUrl,
          instagram_url: item.instagramUrl || null,
        });

        if (res.error) throw new Error(res.error);
      }

      updateItem(item.id, { status: "done", progress: 100 });
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed.";
      updateItem(item.id, { status: "failed", errorMessage: msg });
      return false;
    }
  };

  const uploadAll = async () => {
    setIsProcessingAll(true);
    for (const item of items) {
      if (item.status !== "done") {
        await uploadSingleItem(item);
      }
    }
    setIsProcessingAll(false);
    if (onUploadComplete) onUploadComplete();
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed p-6 sm:p-10 flex flex-col items-center justify-center text-center transition-colors cursor-pointer bg-[#0b0b0b] ${
          dragActive
            ? "border-[#c8a96a] bg-[#141414]"
            : "border-[#26241f] hover:border-[#8a8780]"
        }`}
      >
        <input
          type="file"
          id={`uploader-${collection}-${memoryCategory || "all"}`}
          accept="image/*"
          multiple={!isMemorySlot}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <label
          htmlFor={`uploader-${collection}-${memoryCategory || "all"}`}
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <div className="w-12 h-12 rounded-full border border-[#26241f] flex items-center justify-center text-[#c8a96a] text-xl mb-1">
            ↑
          </div>
          <span className="text-sm uppercase tracking-[0.18em] text-[#f2efe9] font-medium">
            {isMemorySlot ? "Select replacement photo" : "Choose photos or drag & drop"}
          </span>
          <span className="text-xs uppercase tracking-[0.14em] text-[#8a8780]">
            Resized automatically in browser (max 2400px WebP, &lt; 1.5MB)
          </span>
        </label>
      </div>

      {/* Upload Queue */}
      {items.length > 0 && (
        <div className="flex flex-col gap-4 border border-[#26241f] bg-[#0b0b0b] p-4 sm:p-6">
          <div className="flex justify-between items-center pb-3 border-b border-[#26241f]">
            <span className="text-xs uppercase tracking-[0.2em] text-[#c8a96a] font-medium">
              Ready to Upload ({items.length})
            </span>
            <button
              type="button"
              onClick={uploadAll}
              disabled={isProcessingAll}
              className="px-4 py-2 bg-[#f2efe9] text-black text-xs uppercase tracking-[0.18em] font-semibold hover:bg-[#c8a96a] transition-colors disabled:opacity-50 cursor-pointer min-h-[44px]"
            >
              {isProcessingAll ? "Uploading..." : "Upload All"}
            </button>
          </div>

          <div className="flex flex-col divide-y divide-[#26241f]">
            {items.map((item) => (
              <div
                key={item.id}
                className="py-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
              >
                {/* Thumbnail Preview */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="relative w-16 h-16 shrink-0 border border-[#26241f] overflow-hidden bg-black">
                    <Image
                      src={item.previewUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) =>
                        updateItem(item.id, {
                          title: e.target.value,
                          alt: `${e.target.value} - Aswin Krishna Photography`,
                        })
                      }
                      placeholder="Photo Title *"
                      className="bg-black/60 border border-[#26241f] px-3 py-1.5 text-xs text-[#f2efe9] focus:outline-none focus:border-[#c8a96a] min-h-[38px]"
                    />
                    <input
                      type="text"
                      value={item.alt}
                      onChange={(e) =>
                        updateItem(item.id, { alt: e.target.value })
                      }
                      placeholder="Alt description *"
                      className="bg-black/60 border border-[#26241f] px-3 py-1 text-[11px] text-[#8a8780] focus:outline-none focus:border-[#c8a96a]"
                    />
                  </div>
                </div>

                {/* Optional Collection Specific Inputs */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  {(collection === "gallery" || (!isMemorySlot && collection === "memory")) && (
                    <select
                      value={item.category}
                      onChange={(e) =>
                        updateItem(item.id, {
                          category: e.target.value as CategoryType,
                        })
                      }
                      className="bg-black border border-[#26241f] px-3 py-1.5 text-xs text-[#f2efe9] focus:outline-none focus:border-[#c8a96a] min-h-[38px]"
                    >
                      <option value="nature">Nature</option>
                      <option value="wedding">Wedding</option>
                      <option value="casual">Casual</option>
                    </select>
                  )}

                  {(collection === "hero" || collection === "memory") && (
                    <input
                      type="text"
                      value={item.caption}
                      onChange={(e) =>
                        updateItem(item.id, { caption: e.target.value })
                      }
                      placeholder="Caption (optional)"
                      className="bg-black/60 border border-[#26241f] px-3 py-1.5 text-xs text-[#f2efe9] focus:outline-none focus:border-[#c8a96a] min-h-[38px] w-full md:w-48"
                    />
                  )}

                  {collection === "recent" && (
                    <input
                      type="url"
                      value={item.instagramUrl}
                      onChange={(e) =>
                        updateItem(item.id, { instagramUrl: e.target.value })
                      }
                      placeholder="Instagram URL (optional)"
                      className="bg-black/60 border border-[#26241f] px-3 py-1.5 text-xs text-[#f2efe9] focus:outline-none focus:border-[#c8a96a] min-h-[38px] w-full md:w-48"
                    />
                  )}

                  {/* Status Indicator / Actions */}
                  <div className="flex items-center gap-3 ml-auto">
                    {item.status === "idle" && (
                      <button
                        type="button"
                        onClick={() => uploadSingleItem(item)}
                        className="px-3 py-1.5 border border-[#26241f] text-xs uppercase tracking-wider text-[#f2efe9] hover:border-[#f2efe9] transition-colors cursor-pointer min-h-[38px]"
                      >
                        Upload
                      </button>
                    )}
                    {item.status === "resizing" && (
                      <span className="text-xs text-[#8a8780] animate-pulse">
                        Resizing...
                      </span>
                    )}
                    {item.status === "uploading" && (
                      <span className="text-xs text-[#c8a96a] animate-pulse">
                        Uploading...
                      </span>
                    )}
                    {item.status === "saving" && (
                      <span className="text-xs text-blue-400 animate-pulse">
                        Saving...
                      </span>
                    )}
                    {item.status === "done" && (
                      <span className="text-xs text-emerald-400 font-medium">
                        ✓ Done
                      </span>
                    )}
                    {item.status === "failed" && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-rose-400">
                          {item.errorMessage || "Failed"}
                        </span>
                        <button
                          type="button"
                          onClick={() => uploadSingleItem(item)}
                          className="px-2 py-1 text-xs text-[#c8a96a] underline cursor-pointer"
                        >
                          Retry
                        </button>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-[#8a8780] hover:text-rose-400 p-2 cursor-pointer"
                      title="Remove from queue"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
