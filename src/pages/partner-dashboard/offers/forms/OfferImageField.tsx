import { useEffect, useRef, useState } from "react";
import { ImageIcon, Link2, Loader2, Trash2, Upload } from "lucide-react";
import { uploadOfferImage } from "../../../../services/api/offers";
import { ApiError } from "../../../../services/api/client";
import { toast } from "../../../../components/toast";
import { fieldInputClass } from "./FormField";

/** Kept in sync with the offer image limits enforced by the API. */
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface OfferImageFieldProps {
  value: string;
  onChange: (imageUrl: string) => void;
  /** Course the offer belongs to — the upload is scoped to it. */
  courseId: string | null;
}

/**
 * Cover image picker for an offer: drag-and-drop or click to upload, with a
 * paste-a-URL escape hatch for images already hosted elsewhere.
 */
export default function OfferImageField({ value, onChange, courseId }: OfferImageFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  // Shown while the file is in flight so the partner sees their image immediately.
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const handleFile = async (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Unsupported image type", { description: "Use a JPG, PNG, WebP or GIF." });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image is too large", { description: "Pick an image under 5MB." });
      return;
    }
    if (!courseId) {
      toast.error("No course selected", {
        description: "Pick a course before uploading an image.",
      });
      return;
    }

    const preview = URL.createObjectURL(file);
    setLocalPreview(preview);
    setIsUploading(true);

    try {
      const imageUrl = await uploadOfferImage(courseId, file);
      onChange(imageUrl);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error((err as ApiError).message || "Failed to upload image");
    } finally {
      setIsUploading(false);
      setLocalPreview(null);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
    // Reset so picking the same file again still fires a change event.
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const openFilePicker = () => fileInputRef.current?.click();
  const previewSrc = localPreview || value;

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleInputChange}
        className="hidden"
      />

      {previewSrc ? (
        <div className="overflow-hidden rounded-xl border border-gray-300">
          <div className="relative flex aspect-[16/9] items-center justify-center bg-gray-100">
            <img src={previewSrc} alt="Offer cover preview" className="size-full object-cover" />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Loader2 className="size-7 animate-spin text-white" />
              </div>
            )}
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-gray-200 bg-white px-3 py-2">
            <button
              type="button"
              onClick={openFilePicker}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 disabled:opacity-50"
            >
              <Upload className="size-4" />
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-red-600 disabled:opacity-50"
            >
              <Trash2 className="size-4" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={openFilePicker}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex aspect-[16/9] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 text-center transition-colors ${
            isDragging
              ? "border-purple-400 bg-purple-50"
              : "border-gray-300 bg-gray-50 hover:border-purple-300 hover:bg-purple-50/50"
          }`}
        >
          {isUploading ? (
            <Loader2 className="size-7 animate-spin text-purple-600" />
          ) : (
            <>
              <ImageIcon className="size-8 text-gray-400" />
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-purple-600">Click to upload</span> or drag and
                drop
              </p>
              <p className="text-xs text-gray-400">JPG, PNG, WebP or GIF — up to 5MB</p>
            </>
          )}
        </div>
      )}

      {showUrlInput ? (
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className={`${fieldInputClass} mt-3`}
        />
      ) : (
        <button
          type="button"
          onClick={() => setShowUrlInput(true)}
          className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-purple-600"
        >
          <Link2 className="size-3.5" />
          Use an image URL instead
        </button>
      )}
    </div>
  );
}
