import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { listCourseStudentLeaders } from "../../../services/api/enrollment";
import type { CourseStudent } from "../../../types/enrollment";
import ManagePageHeader from "./ManagePageHeader";

export default function CourseStudentLeaders() {
  const { id: courseId } = useParams<{ id: string }>();

  const [students, setStudents] = useState<CourseStudent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });

  const fetchStudentLeaders = useCallback(async () => {
    if (!courseId) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await listCourseStudentLeaders(courseId, { page, limit: 20, sort: "desc" });
      setStudents(result.data);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load student leaders");
    } finally {
      setIsLoading(false);
    }
  }, [courseId, page]);

  useEffect(() => {
    fetchStudentLeaders();
  }, [fetchStudentLeaders]);

  const getInitials = (student: CourseStudent) => {
    const first = student.user.firstName?.[0] ?? "";
    const last = student.user.lastName?.[0] ?? "";
    return (first + last).toUpperCase() || "?";
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <ManagePageHeader title="Student Leaders" />

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-center text-sm text-gray-500">Loading student leaders...</div>
        ) : error ? (
          <div className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-red-600 text-sm">
              <AlertCircle className="size-4" />
              {error}
            </div>
            <button
              type="button"
              onClick={fetchStudentLeaders}
              className="mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              Try again
            </button>
          </div>
        ) : students.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500">No student leaders yet.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="ps-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-800">Name</span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-800">Email</span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-800">Joined</span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="size-px whitespace-nowrap">
                        <div className="ps-6 pe-6 py-3">
                          <div className="flex items-center gap-x-3">
                            {student.user.avatarUrl ? (
                              <img
                                src={student.user.avatarUrl}
                                alt=""
                                className="size-9 rounded-full object-cover"
                              />
                            ) : (
                              <span className="inline-flex items-center justify-center size-9 rounded-full bg-purple-100 border border-purple-200">
                                <span className="font-medium text-sm text-purple-700">
                                  {getInitials(student)}
                                </span>
                              </span>
                            )}
                            <span className="block text-sm font-semibold text-gray-800">
                              {student.user.firstName} {student.user.lastName}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="size-px whitespace-nowrap">
                        <div className="px-6 py-3">
                          <span className="text-sm text-gray-500">{student.user.email}</span>
                        </div>
                      </td>
                      <td className="size-px whitespace-nowrap">
                        <div className="px-6 py-3">
                          <span className="text-sm text-gray-500">
                            {formatDate(student.dateJoined)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 px-6 py-3">
              <p className="text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-800">{students.length}</span> of{" "}
                {meta.total} student leaders
              </p>
              {meta.totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="p-1.5 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <span className="text-xs text-gray-500">
                    Page {meta.page} of {meta.totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                    disabled={page >= meta.totalPages}
                    className="p-1.5 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
