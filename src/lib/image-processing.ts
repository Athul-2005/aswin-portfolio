/**
 * Client-side browser image processing utilities for Admin uploads.
 *
 * Rules (ADMIN-BRIEF section 5 #6):
 * - Longest side max 2400px.
 * - Convert to WebP (fallback JPEG) at quality ~0.85, target under 1.5 MB.
 * - Measure final width and height.
 * - Generate a tiny blur placeholder (~16px wide, base64 data URL) for blur_data_url.
 */

export interface ProcessedImageResult {
  blob: Blob;
  width: number;
  height: number;
  blurDataUrl: string;
  mimeType: string;
}

/**
 * Loads a File into an HTMLImageElement using object URL.
 */
function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to decode image. If this is a HEIC file, please export as JPEG."));
    };

    img.src = url;
  });
}

/**
 * Generates a tiny base64 blur placeholder (~16px width) from an Image element.
 */
function generateBlurPlaceholder(img: HTMLImageElement): string {
  const targetWidth = 16;
  const aspectRatio = img.width / img.height;
  const targetHeight = Math.max(1, Math.round(targetWidth / aspectRatio));

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");

  if (!ctx) return "";

  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  return canvas.toDataURL("image/webp", 0.5) || canvas.toDataURL("image/jpeg", 0.5);
}

/**
 * Resizes and compresses an image in the browser before direct upload to Supabase Storage.
 */
export async function processImageForUpload(
  file: File,
  maxLongestSide = 2400,
  quality = 0.85
): Promise<ProcessedImageResult> {
  // Reject non-images
  if (!file.type.startsWith("image/") && !file.name.match(/\.(jpe?g|png|webp|avif|heic)$/i)) {
    throw new Error("Selected file is not an image. Please choose a JPEG, PNG, or WebP photo.");
  }

  const img = await loadImageFromFile(file);
  const origWidth = img.naturalWidth || img.width;
  const origHeight = img.naturalHeight || img.height;

  if (origWidth === 0 || origHeight === 0) {
    throw new Error("Invalid image dimensions.");
  }

  // Calculate target dimensions keeping aspect ratio
  let targetWidth = origWidth;
  let targetHeight = origHeight;

  if (origWidth > maxLongestSide || origHeight > maxLongestSide) {
    if (origWidth >= origHeight) {
      targetWidth = maxLongestSide;
      targetHeight = Math.round((origHeight / origWidth) * maxLongestSide);
    } else {
      targetHeight = maxLongestSide;
      targetWidth = Math.round((origWidth / origHeight) * maxLongestSide);
    }
  }

  // Draw to canvas for compression
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Browser canvas context not supported.");
  }

  // Enable high-quality smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  // Generate blur placeholder from the loaded image
  const blurDataUrl = generateBlurPlaceholder(img);

  // Attempt WebP export first, fallback to JPEG if browser doesn't support WebP canvas export
  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) {
          resolve(b);
        } else {
          // Fallback to JPEG
          canvas.toBlob(
            (fallbackBlob) => {
              if (fallbackBlob) resolve(fallbackBlob);
              else reject(new Error("Canvas blob conversion failed."));
            },
            "image/jpeg",
            quality
          );
        }
      },
      "image/webp",
      quality
    );
  });

  return {
    blob,
    width: targetWidth,
    height: targetHeight,
    blurDataUrl,
    mimeType: blob.type || "image/webp",
  };
}
