import { useState, useRef, useEffect } from "react";
import { Upload, X, Trash2 } from "lucide-react";
import Modal from "../../../components/modals/Modal";
import { AssetVisibility, CourseAsset } from "../../../types/course-assets";
import { courseAssetsService } from "../../../services/api/course-assets";

interface UploadResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  onUploadComplete: () => void;
  asset?: CourseAsset | null;
}

export default function UploadResourceModal({
  isOpen,
  onClose,
  courseId,
  onUploadComplete,
  asset,
}: UploadResourceModalProps) {
  const isEditMode = !!asset;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<AssetVisibility>("enrolled_only");
  const [file, setFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && asset) {
      setName(asset.name);
      setDescription(asset.description || "");
      setVisibility(asset.visibility);
    }
  }, [isOpen, asset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!name) {
        setName(selectedFile.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isEditMode) {
      setIsSaving(true);
      try {
        await courseAssetsService.updateAsset(courseId, asset.id, {
          name: name.trim() || undefined,
          description: description.trim() || undefined,
          visibility,
        });
        handleClose();
        onUploadComplete();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update resource.");
      } finally {
        setIsSaving(false);
      }
      return;
    }

    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setIsSaving(true);
    try {
      await courseAssetsService.uploadAsset(courseId, {
        file,
        name: name.trim() || undefined,
        description: description.trim() || undefined,
        visibility,
      });
      handleClose();
      onUploadComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload resource.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!asset || !confirm(`Are you sure you want to delete "${asset.name}"?`)) return;

    setIsDeleting(true);
    setError(null);
    try {
      await courseAssetsService.deleteAsset(courseId, asset.id);
      handleClose();
      onUploadComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete resource.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setVisibility("enrolled_only");
    setFile(null);
    setError(null);
    onClose();
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Resource" : "Add New Resource"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5 p-6">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* File Upload - only shown in create mode */}
        {!isEditMode && (
          <div>
            <label className="block text-sm font-medium text-gray-900">File</label>
            <div className="mt-1.5">
              {file ? (
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-300 bg-gray-50">
                  <div className="flex items-center gap-3 min-w-0">
                    <Upload className="size-5 text-gray-400 shrink-0" />
                    <span className="text-sm text-gray-900 truncate">{file.name}</span>
                    <span className="text-xs text-gray-500 shrink-0">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-400 hover:bg-purple-50/50 transition-colors"
                >
                  <Upload className="size-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to select a file</p>
                  <p className="text-xs text-gray-400 mt-1">or drag and drop</p>
                </div>
              )}
              <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" />
            </div>
          </div>
        )}

        {/* Name Field */}
        <div>
          <label htmlFor="resource-name" className="block text-sm font-medium text-gray-900">
            Display Name
          </label>
          <input
            type="text"
            id="resource-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={isEditMode ? "Resource name" : "Defaults to filename if left blank"}
            className="mt-1.5 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="resource-description" className="block text-sm font-medium text-gray-900">
            Description
          </label>
          <textarea
            id="resource-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
            rows={2}
            className="mt-1.5 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 resize-none"
          />
        </div>

        {/* Visibility Field */}
        <div>
          <label htmlFor="resource-visibility" className="block text-sm font-medium text-gray-900">
            Visibility
          </label>
          <select
            id="resource-visibility"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as AssetVisibility)}
            className="mt-1.5 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="enrolled_only">Enrolled Students Only</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          {isEditMode ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSaving || isDeleting}
              className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
            >
              <Trash2 className="size-4" />
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          ) : (
            <div />
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving || isDeleting}
              className="py-2.5 px-4 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || isDeleting || (!isEditMode && !file)}
              className="py-2.5 px-5 text-sm font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving
                ? isEditMode
                  ? "Saving..."
                  : "Uploading..."
                : isEditMode
                  ? "Save Changes"
                  : "Upload"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
