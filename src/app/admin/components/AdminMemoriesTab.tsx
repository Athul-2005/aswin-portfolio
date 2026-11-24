"use client";

import { useState } from "react";
import Image from "next/image";
import AdminUploader from "./AdminUploader";
import { CategoryType, deletePhotoAction, updatePhotoAction } from "../actions";

export interface MemorySlotData {
  id: string;
  category: CategoryType;
  title: string;
  alt: string;
  caption: string | null;
  storage_path: string;
  public_url: string;
}

interface AdminMemoriesTabProps {
  memories: Record<CategoryType, MemorySlotData | null>;
  onRefresh: () => void;
}

const MEMORY_SLOTS: {
  category: CategoryType;
  label: string;
  defaultTitle: string;
  defaultCaption: string;
}[] = [
  {
    category: "nature",
    label: "Scene I · Nature & Travel",
    defaultTitle: "Nature & Travel",
    defaultCaption: "Where the light lands first.",
  },
  {
    category: "wedding",
    label: "Scene II · Weddings",
    defaultTitle: "Weddings",
    defaultCaption: "The in-between moments.",
  },
  {
    category: "casual",
    label: "Scene III · Everyday",
    defaultTitle: "Everyday",
    defaultCaption: "Ordinary, until it isn't.",
  },
];

export default function AdminMemoriesTab({
  memories,
  onRefresh,
}: AdminMemoriesTabProps) {
  const [replacingCategory, setReplacingCategory] = useState<CategoryType | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryType | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startEdit = (slot: MemorySlotData) => {
    setEditingCategory(slot.category);
    setEditTitle(slot.title);
    setEditCaption(slot.caption || "");
  };

  const handleSaveEdit = async (slot: MemorySlotData) => {
    setIsSubmitting(true);
    const res = await updatePhotoAction({
      id: slot.id,
      collection: "memory",
      title: editTitle,
      alt: slot.alt,
      caption: editCaption,
      category: slot.category,
    });
    setIsSubmitting(false);

    if (res.error) {
      alert(`Error updating: ${res.error}`);
    } else {
      setEditingCategory(null);
      onRefresh();
    }
  };

  const handleRemove = async (slot: MemorySlotData) => {
    const confirmed = window.confirm(
      `Remove memory photo for ${slot.title}? The home scene will be skipped until a replacement is uploaded.`
    );
    if (!confirmed) return;

    setIsSubmitting(true);
    const res = await deletePhotoAction(slot.id, slot.storage_path, "memory");
    setIsSubmitting(false);

    if (res.error) {
      alert(`Error removing memory: ${res.error}`);
    } else {
      onRefresh();
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center pb-4 border-b border-[#26241f]">
        <div>
          <h2 className="text-sm uppercase tracking-[0.2em] text-[#c8a96a] font-medium">
            Home Memory Scenes
          </h2>
          <p className="text-xs uppercase tracking-[0.14em] text-[#8a8780] mt-1">
            Exactly three continuous scenes on the home page (Nature, Wedding, Everyday).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MEMORY_SLOTS.map((slotConfig) => {
          const current = memories[slotConfig.category];
          const isReplacing = replacingCategory === slotConfig.category;
          const isEditing = editingCategory === slotConfig.category;

          return (
            <div
              key={slotConfig.category}
              className="border border-[#26241f] bg-[#0b0b0b] flex flex-col overflow-hidden"
            >
              {/* Header Label */}
              <div className="p-4 border-b border-[#26241f] flex justify-between items-center">
                <span className="text-xs uppercase tracking-[0.18em] font-semibold text-[#f2efe9]">
                  {slotConfig.label}
                </span>
                <span
                  className={`text-[10px] uppercase tracking-wider px-2 py-0.5 border ${
                    current
                      ? "border-emerald-800 text-emerald-400 bg-emerald-950/40"
                      : "border-amber-800 text-amber-400 bg-amber-950/40"
                  }`}
                >
                  {current ? "Active" : "Empty"}
                </span>
              </div>

              {/* Photo View / Empty */}
              <div className="relative aspect-[16/10] w-full bg-black overflow-hidden border-b border-[#26241f]">
                {current ? (
                  <Image
                    src={current.public_url}
                    alt={current.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-6 text-center text-xs uppercase tracking-wider text-[#8a8780]">
                    <span>No image assigned</span>
                    <span className="text-[10px] text-[#8a8780]/60 mt-1">
                      Scene skipped on home page
                    </span>
                  </div>
                )}
              </div>

              {/* Information & Edit */}
              <div className="p-4 flex flex-col flex-1 justify-between gap-4">
                {current && !isEditing && (
                  <div className="flex flex-col gap-1 text-xs">
                    <span className="font-['Bebas_Neue',sans-serif] text-xl text-[#f2efe9] tracking-wide">
                      {current.title}
                    </span>
                    <span className="font-serif italic text-sm text-[#8a8780]">
                      &ldquo;{current.caption || slotConfig.defaultCaption}&rdquo;
                    </span>
                  </div>
                )}

                {current && isEditing && (
                  <div className="flex flex-col gap-2 text-xs">
                    <label className="text-[10px] uppercase text-[#8a8780]">
                      Title
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full bg-black border border-[#26241f] px-2 py-1.5 text-xs text-[#f2efe9] mt-1"
                      />
                    </label>
                    <label className="text-[10px] uppercase text-[#8a8780]">
                      Caption
                      <input
                        type="text"
                        value={editCaption}
                        onChange={(e) => setEditCaption(e.target.value)}
                        className="w-full bg-black border border-[#26241f] px-2 py-1.5 text-xs text-[#f2efe9] mt-1"
                      />
                    </label>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(current)}
                        disabled={isSubmitting}
                        className="flex-1 py-1.5 bg-[#f2efe9] text-black text-xs uppercase tracking-wider font-semibold cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCategory(null)}
                        className="px-3 py-1.5 border border-[#26241f] text-[#8a8780] text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Replacement Uploader */}
                {isReplacing ? (
                  <div className="pt-2 border-t border-[#26241f]">
                    <AdminUploader
                      collection="memory"
                      isMemorySlot={true}
                      memoryCategory={slotConfig.category}
                      existingMemoryId={current?.id}
                      existingMemoryStoragePath={current?.storage_path}
                      onUploadComplete={() => {
                        setReplacingCategory(null);
                        onRefresh();
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setReplacingCategory(null)}
                      className="mt-2 text-xs text-[#8a8780] hover:text-[#f2efe9] underline cursor-pointer"
                    >
                      Cancel replacement
                    </button>
                  </div>
                ) : (
                  /* Action Buttons */
                  <div className="pt-3 border-t border-[#26241f] flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-wider">
                    <button
                      type="button"
                      onClick={() => setReplacingCategory(slotConfig.category)}
                      className="px-3 py-2 bg-[#f2efe9] text-black font-semibold hover:bg-[#c8a96a] transition-colors cursor-pointer min-h-[40px]"
                    >
                      {current ? "Replace Photo" : "Upload Photo"}
                    </button>

                    {current && !isEditing && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(current)}
                          className="px-3 py-2 border border-[#26241f] text-[#8a8780] hover:text-[#f2efe9] cursor-pointer min-h-[40px]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemove(current)}
                          className="px-3 py-2 border border-[#26241f] text-rose-400 hover:border-rose-900 cursor-pointer min-h-[40px]"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
