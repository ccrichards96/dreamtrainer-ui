import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  FileText,
  Image,
  Video,
  Music,
  File,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  Table2,
  Presentation,
} from "lucide-react";
import { CourseAsset, AssetType, AssetStatus, AssetPagination } from "../../../types/course-assets";
import { courseAssetsService } from "../../../services/api/course-assets";
import UploadResourceModal from "./UploadResourceModal";

const LIMIT = 10;

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getAssetIcon(type: AssetType) {
  switch (type) {
    case "video":
      return <Video className="size-5 text-purple-600" />;
    case "image":
      return <Image className="size-5 text-blue-600" />;
    case "document":
      return <FileText className="size-5 text-red-600" />;
    case "audio":
      return <Music className="size-5 text-green-600" />;
    case "spreadsheet":
      return <Table2 className="size-5 text-emerald-600" />;
    case "presentation":
      return <Presentation className="size-5 text-orange-600" />;
    default:
      return <File className="size-5 text-gray-600" />;
  }
}

function getStatusBadge(status: AssetStatus) {
  const styles: Record<AssetStatus, string> = {
    ready: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    failed: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function Resources() {
  const { id: courseId } = useParams<{ id: string }>();
  const [assets, setAssets] = useState<CourseAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<AssetPagination>({
    total: 0,
    page: 1,
    limit: LIMIT,
    totalPages: 0,
  });
  const [showUploadModal, setShowUploadModal] = useState(false);

  const fetchAssets = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await courseAssetsService.listAssets(courseId, { page, limit: LIMIT });
      setAssets(result.assets);
      setPagination(result.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load resources");
    } finally {
      setLoading(false);
    }
  }, [courseId, page]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const handleUploadComplete = () => {
    // Re-fetch the first page to show the new asset at the top
    setPage(1);
    if (page === 1) {
      fetchAssets();
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600">Loading resources...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="text-center py-12">
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={fetchAssets}
            className="mt-3 text-sm font-medium text-purple-600 hover:text-purple-800"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header with Add Button */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          Manage your course resources and downloadable materials.
        </p>
        <button
          type="button"
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center gap-x-2 py-2.5 px-4 text-sm font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:bg-purple-700"
        >
          <Plus className="size-4" />
          Add New Resource
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Uploaded
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assets.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No resources uploaded yet.
                </td>
              </tr>
            ) : (
              assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {getAssetIcon(asset.type)}
                      <div>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!courseId) return;
                            const { downloadUrl } = await courseAssetsService.getDownloadUrl(courseId, asset.id);
                            window.open(downloadUrl, "_blank", "noopener,noreferrer");
                          }}
                          className="text-sm font-medium text-purple-600 hover:text-purple-800 hover:underline text-left"
                        >
                          {asset.name}
                        </button>
                        {asset.description && (
                          <p className="text-xs text-gray-500">{asset.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 capitalize">{asset.type}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{formatFileSize(asset.fileSize)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(asset.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{formatDate(asset.createdAt)}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.total > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {(page - 1) * pagination.limit + 1} to{" "}
            {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} resources
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {pagination.totalPages || 1}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page >= pagination.totalPages}
              className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}
      </div>

      {/* Upload Modal */}
      <UploadResourceModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        courseId={courseId || ""}
        onUploadComplete={handleUploadComplete}
      />
    </>
  );
}
