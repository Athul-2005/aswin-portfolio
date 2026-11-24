"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CollectionType,
  CategoryType,
  updatePhotoAction,
  deletePhotoAction,
  reorderPhotoAction,
} from "../actions";

export interface AdminPhotoItem {
  id: string;
  collection: CollectionType;
  category: CategoryType | null;
  title: string;
  alt: string;
  caption: string | null;
  storage_path: string;
  width: number;
  height: number;
  instagram_url: string | null;
  sort_order: number;
  public_url: string;
}

interface AdminPhotoGridProps {
  photos: AdminPhotoItem[];
  collection: CollectionType;
  onRefresh: () => void;
}

export default function AdminPhotoGrid({
  photos,
  collection,
  onRefresh,
}: AdminPhotoGridProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<AdminPhotoItem>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");

  const startEdit = (photo: AdminPhotoItem) => {
    setEditingId(photo.id);
    setEditForm({
      title: photo.title,
      alt: photo.alt,
      caption: photo.caption || "",
      category: photo.category,
      instagram_url: photo.instagram_url || "",
    });
    setActionError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setActionError(null);
  };

  const handleSaveEdit = async (photo: AdminPhotoItem) => {
    setIsSubmitting(true);
    setActionError(null);

    const res = await updatePhotoAction({
      id: photo.id,
      collection,
      title: editForm.title || photo.title,
      alt: editForm.alt || photo.alt,
      caption: editForm.caption !== undefined ? editForm.caption : photo.caption,
      category: (editForm.category as CategoryType) || photo.category,
      instagram_url:
        editForm.instagram_url !== undefined
          ? editForm.instagram_url
          : photo.instagram_url,
    });

    setIsSubmitting(false);

    if (res.error) {
      setActionError(res.error);
    } else {
      setEditingId(null);
      onRefresh();
    }
  };

  const handleDelete = async (photo: AdminPhotoItem) => {
    const confirmed = window.confirm(
      `Delete '${photo.title}'? This removes it permanently from the site.`
    );
    if (!confirmed) return;

    setIsSubmitting(true);
    const res = await deletePhotoAction(photo.id, photo.storage_path, collection);
    setIsSubmitting(false);

    if (res.error) {
      alert(`Error deleting photo: ${res.error}`);
    } else {
      onRefresh();
    }
  };

  const handleReorder = async (photo: AdminPhotoItem, direction: "up" | "down") => {
    setIsSubmitting(true);
    const res = await reorderPhotoAction(photo.id, direction, collection);
    setIsSubmitting(false);

    if (res.error) {
      alert(`Error reordering: ${res.error}`);
    } else {
      onRefresh();
    }
  };

  const filteredPhotos =
    collection === "gallery" && activeCategoryFilter !== "all"
      ? photos.filter((p) => p.category === activeCategoryFilter)
      : photos;

  return (
    <div className="flex flex-col gap-6">
      {/* Category filter chips for Gallery */}
      {collection === "gallery" && (
        <div className="flex flex-wrap gap-2 pt-2">
          {["all", "nature", "wedding", "casual"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-3 py-1 text-xs uppercase tracking-[0.18em] border min-h-[36px] transition-colors cursor-pointer ${
                activeCategoryFilter === cat
                  ? "bg-[#f2efe9] text-black border-[#f2efe9] font-medium"
                  : "border-[#26241f] text-[#8a8780] hover:text-[#f2efe9]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Global Action Error */}
      {actionError && (
        <div className="p-3 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs tracking-wider">
          {actionError}
        </div>
      )}

      {/* Empty State */}
      {filteredPhotos.length === 0 ? (
        <div className="border border-[#26241f] bg-[#0b0b0b] p-8 text-center text-[#8a8780] text-xs uppercase tracking-[0.18em]">
          No photos found in this view. Use the uploader above to add new photos.
        </div>
      ) : (
        /* Photo Grid: 2 columns on mobile, 4 on desktop */
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredPhotos.map((photo, index) => {
            const isEditing = editingId === photo.id;

            return (
              <div
                key={photo.id}
                className="border border-[#26241f] bg-[#0b0b0b] flex flex-col overflow-hidden group"
              >
                {/* Photo Thumbnail */}
                <div className="relative aspect-[4/3] w-full bg-black overflow-hidden">
                  <Image
                    src={photo.public_url}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                  {photo.category && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 border border-white/10 text-[10px] uppercase tracking-wider text-[#c8a96a]">
                      {photo.category}
                    </span>
                  )}
                </div>

                {/* Details / Inline Edit Form */}
                <div className="p-3 flex flex-col flex-1 justify-between gap-3 text-xs">
                  {isEditing ? (
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase text-[#8a8780]">
                        Title
                        <input
                          type="text"
                          value={editForm.title || ""}
                          onChange={(e) =>
                            setEditForm({ ...editForm, title: e.target.value })
                          }
                          className="w-full bg-black border border-[#26241f] px-2 py-1 text-xs text-[#f2efe9] mt-1"
                        />
                      </label>

                      <label className="text-[10px] uppercase text-[#8a8780]">
                        Alt Text
                        <input
                          type="text"
                          value={editForm.alt || ""}
                          onChange={(e) =>
                            setEditForm({ ...editForm, alt: e.target.value })
                          }
                          className="w-full bg-black border border-[#26241f] px-2 py-1 text-xs text-[#f2efe9] mt-1"
                        />
                      </label>

                      {collection === "gallery" && (
                        <label className="text-[10px] uppercase text-[#8a8780]">
                          Category
                          <select
                            value={editForm.category || "nature"}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                category: e.target.value as CategoryType,
                              })
                            }
                            className="w-full bg-black border border-[#26241f] px-2 py-1 text-xs text-[#f2efe9] mt-1"
                          >
                            <option value="nature">Nature</option>
                            <option value="wedding">Wedding</option>
                            <option value="casual">Casual</option>
                          </select>
                        </label>
                      )}

                      {(collection === "hero" || collection === "memory") && (
                        <label className="text-[10px] uppercase text-[#8a8780]">
                          Caption
                          <input
                            type="text"
                            value={editForm.caption || ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                caption: e.target.value,
                              })
                            }
                            className="w-full bg-black border border-[#26241f] px-2 py-1 text-xs text-[#f2efe9] mt-1"
                          />
                        </label>
                      )}

                      {collection === "recent" && (
                        <label className="text-[10px] uppercase text-[#8a8780]">
                          Instagram URL
                          <input
                            type="url"
                            value={editForm.instagram_url || ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                instagram_url: e.target.value,
                              })
                            }
                            className="w-full bg-black border border-[#26241f] px-2 py-1 text-xs text-[#f2efe9] mt-1"
                          />
                        </label>
                      )}

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(photo)}
                          disabled={isSubmitting}
                          className="flex-1 py-1.5 bg-[#f2efe9] text-black text-[11px] uppercase tracking-wider font-semibold cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="px-2 py-1.5 border border-[#26241f] text-[#8a8780] text-[11px] cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-['Bebas_Neue',sans-serif] text-lg text-[#f2efe9] tracking-wide line-clamp-1">
                        {photo.title}
                      </h3>
                      {photo.caption && (
                        <p className="text-[11px] text-[#8a8780] line-clamp-1 italic mt-0.5">
                          &ldquo;{photo.caption}&rdquo;
                        </p>
                      )}
                      <p className="text-[10px] text-[#8a8780]/60 truncate mt-1">
                        {photo.alt}
                      </p>
                    </div>
                  )}

                  {/* Actions Bar */}
                  {!isEditing && (
                    <div className="pt-2 border-t border-[#26241f] flex items-center justify-between gap-1 text-[11px] uppercase tracking-wider">
                      {/* Reorder Up/Down */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleReorder(photo, "up")}
                          disabled={index === 0 || isSubmitting}
                          className="px-2 py-1 border border-[#26241f] text-[#8a8780] hover:text-[#f2efe9] disabled:opacity-30 cursor-pointer min-h-[36px]"
                          title="Move up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReorder(photo, "down")}
                          disabled={
                            index === filteredPhotos.length - 1 || isSubmitting
                          }
                          className="px-2 py-1 border border-[#26241f] text-[#8a8780] hover:text-[#f2efe9] disabled:opacity-30 cursor-pointer min-h-[36px]"
                          title="Move down"
                        >
                          ↓
                        </button>
                      </div>

                      {/* Edit & Delete */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(photo)}
                          className="px-2.5 py-1 border border-[#26241f] text-[#8a8780] hover:text-[#c8a96a] cursor-pointer min-h-[36px]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(photo)}
                          className="px-2.5 py-1 border border-[#26241f] text-rose-400/80 hover:text-rose-300 hover:border-rose-900 cursor-pointer min-h-[36px]"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
