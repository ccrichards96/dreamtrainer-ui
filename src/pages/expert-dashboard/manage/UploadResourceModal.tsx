import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import Modal from "../../../components/modals/Modal";
import { AssetType } from "../../../types/course-assets";

interface UploadResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: { name: string; type: AssetType; file: File }) => Promise<void>;
}

export default function UploadResourceModal({
  isOpen,
  onClose,
  onUpload,
}: UploadResourceModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<AssetType>(AssetType.DOCUMENT);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    if (!name.trim()) {
      setError("Please enter a name for the resource.");
      return;
    }

    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    try {
      await onUpload({ name: name.trim(), type, file });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload resource.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setType(AssetType.DOCUMENT);
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
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Resource" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5 p-6">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
            {error}
          </div>
        )}

                {/* File Upload */}
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
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Name Field */}
        <div>
          <label htmlFor="resource-name" className="block text-sm font-medium text-gray-900">
            Resource Name
          </label>
          <input
            type="text"
            id="resource-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter resource name"
            className="mt-1.5 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        {/* Type Field */}
        <div>
          <label htmlFor="resource-type" className="block text-sm font-medium text-gray-900">
            Resource Type
          </label>
          <select
            id="resource-type"
            value={type}
            onChange={(e) => setType(e.target.value as AssetType)}
            className="mt-1.5 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-purple-500 focus:ring-purple-500"
          >
            <option value={AssetType.VIDEO}>Video</option>
            <option value={AssetType.IMAGE}>Image</option>
            <option value={AssetType.DOCUMENT}>Document</option>
            <option value={AssetType.AUDIO}>Audio</option>
            <option value={AssetType.OTHER}>Other</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={isUploading}
            className="py-2.5 px-4 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUploading || !file}
            className="py-2.5 px-5 text-sm font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
