import { useEffect, useState } from "react";
import { Download, FileImage, FileSpreadsheet, FileText, Loader2, Paperclip } from "lucide-react";
import {
  getApplicantDocuments,
  getApplicantDocumentDownloadUrl,
} from "../../../services/api/offers";
import type { Attachment } from "../../../types/attachments";
import { ApiError } from "../../../services/api/client";
import { toast } from "../../../components/toast";

interface ApplicationDocumentsProps {
  courseId: string | null;
  applicationId: string;
}

function formatFileSize(bytes: number): string {
  if (!bytes) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function iconFor(mimeType: string) {
  if (mimeType.startsWith("image/")) return FileImage;
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel") || mimeType === "text/csv") {
    return FileSpreadsheet;
  }
  return FileText;
}

export default function ApplicationDocuments({
  courseId,
  applicationId,
}: ApplicationDocumentsProps) {
  const [documents, setDocuments] = useState<Attachment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Id of the document whose signed URL is being fetched
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;

    let cancelled = false;
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getApplicantDocuments(courseId, applicationId);
        if (!cancelled) setDocuments(data);
      } catch (err) {
        if (!cancelled) setError((err as ApiError).message || "Failed to load documents");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchDocuments();
    return () => {
      cancelled = true;
    };
  }, [courseId, applicationId]);

  // Documents are private in S3, so resolve a short-lived signed URL on click.
  const handleDownload = async (document: Attachment) => {
    if (!courseId || downloadingId) return;
    setDownloadingId(document.id);
    try {
      const { downloadUrl } = await getApplicantDocumentDownloadUrl(
        courseId,
        applicationId,
        document.id
      );
      window.open(downloadUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      toast.error((err as ApiError).message || "Failed to open document");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div>
      <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">
        Submitted Documents
      </h4>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="size-4 animate-spin" />
          Loading documents…
        </div>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : documents.length === 0 ? (
        <div className="flex items-center gap-2 rounded-xl border border-dashed border-gray-200 px-4 py-5 text-sm text-gray-500">
          <Paperclip className="size-4 shrink-0 text-gray-400" />
          The applicant didn&apos;t attach any documents.
        </div>
      ) : (
        <ul className="space-y-2">
          {documents.map((document) => {
            const Icon = iconFor(document.mimeType);
            const isDownloading = downloadingId === document.id;
            return (
              <li
                key={document.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Icon className="size-5 shrink-0 text-gray-400" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {document.fileName}
                    </p>
                    <p className="text-xs text-gray-500">{formatFileSize(document.fileSize)}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownload(document)}
                  disabled={isDownloading}
                  className="inline-flex shrink-0 items-center gap-x-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50"
                >
                  {isDownloading ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Download className="size-3.5" />
                  )}
                  Download
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
