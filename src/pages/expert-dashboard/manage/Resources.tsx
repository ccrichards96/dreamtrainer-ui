import { useState, useEffect } from "react";
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
} from "lucide-react";
import { CourseAsset, AssetType, AssetStatus, AssetVisibility } from "../../../types/course-assets";
import UploadResourceModal from "./UploadResourceModal";

// Mock data for development - replace with actual API call
const mockAssets: CourseAsset[] = [
  {
    id: "1",
    name: "Introduction Video.mp4",
    description: "Course introduction",
    s3Key: "courses/123/intro.mp4",
    mimeType: "video/mp4",
    fileSize: 52428800,
    type: AssetType.VIDEO,
    status: AssetStatus.READY,
    visibility: AssetVisibility.ENROLLED_ONLY,
    thumbnailS3Key: null,
    courseId: "123",
    uploadedById: "user1",
    metadata: null,
    order: 0,
    createdAt: "2026-02-01T10:00:00Z",
    updatedAt: "2026-02-01T10:00:00Z",
  },
  {
    id: "2",
    name: "Course Slides.pdf",
    description: "Lesson slides",
    s3Key: "courses/123/slides.pdf",
    mimeType: "application/pdf",
    fileSize: 2097152,
    type: AssetType.DOCUMENT,
    status: AssetStatus.READY,
    visibility: AssetVisibility.ENROLLED_ONLY,
    thumbnailS3Key: null,
    courseId: "123",
    uploadedById: "user1",
    metadata: null,
    order: 1,
    createdAt: "2026-02-02T14:30:00Z",
    updatedAt: "2026-02-02T14:30:00Z",
  },
];

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
    case AssetType.VIDEO:
      return <Video className="size-5 text-purple-600" />;
    case AssetType.IMAGE:
      return <Image className="size-5 text-blue-600" />;
    case AssetType.DOCUMENT:
      return <FileText className="size-5 text-red-600" />;
    case AssetType.AUDIO:
      return <Music className="size-5 text-green-600" />;
    default:
      return <File className="size-5 text-gray-600" />;
  }
}

function getStatusBadge(status: AssetStatus) {
  const styles = {
    [AssetStatus.READY]: "bg-green-100 text-green-700",
    [AssetStatus.PENDING]: "bg-yellow-100 text-yellow-700",
    [AssetStatus.PROCESSING]: "bg-blue-100 text-blue-700",
    [AssetStatus.FAILED]: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[status]}`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

export default function Resources() {
  const { id: courseId } = useParams<{ id: string }>();
  const [assets, setAssets] = useState<CourseAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
  });
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await getAssetsByCourse(courseId, page, 10);
        // setAssets(response.data);
        // setPagination(response.pagination);

        // Mock data for now
        await new Promise((resolve) => setTimeout(resolve, 500));
        setAssets(mockAssets);
        setPagination({ total: mockAssets.length, page: 1, limit: 10 });
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [courseId, page]);

  const handleUpload = async (data: { name: string; type: AssetType; file: File }) => {
    // TODO: Replace with actual API call
    console.log("Uploading resource:", data);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock adding the new asset
    const newAsset: CourseAsset = {
      id: crypto.randomUUID(),
      name: data.name,
      description: null,
      s3Key: `courses/${courseId}/${data.file.name}`,
      mimeType: data.file.type,
      fileSize: data.file.size,
      type: data.type,
      status: AssetStatus.PENDING,
      visibility: AssetVisibility.ENROLLED_ONLY,
      thumbnailS3Key: null,
      courseId: courseId || "",
      uploadedById: "current-user",
      metadata: null,
      order: assets.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setAssets((prev) => [newAsset, ...prev]);
    setPagination((prev) => ({ ...prev, total: prev.total + 1 }));
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

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
                        <p className="text-sm font-medium text-gray-900">{asset.name}</p>
                        {asset.description && (
                          <p className="text-xs text-gray-500">{asset.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{asset.type}</span>
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
              Page {page} of {totalPages || 1}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
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
        onUpload={handleUpload}
      />
    </>
  );
}
