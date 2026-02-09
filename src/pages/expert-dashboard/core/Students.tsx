import { useState } from "react";

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  course: string;
  status: "active" | "inactive" | "pending";
  progress: number;
  enrolledAt: string;
}

const sampleStudents: Student[] = [
  {
    id: "1",
    name: "Christina Bersh",
    email: "christina@example.com",
    avatar: "CB",
    course: "Dream Fundamentals",
    status: "active",
    progress: 75,
    enrolledAt: "28 Dec, 2025",
  },
  {
    id: "2",
    name: "David Harrison",
    email: "david@example.com",
    avatar: "DH",
    course: "Advanced Techniques",
    status: "active",
    progress: 40,
    enrolledAt: "20 Dec, 2025",
  },
  {
    id: "3",
    name: "Anne Richard",
    email: "anne@example.com",
    avatar: "AR",
    course: "Dream Fundamentals",
    status: "pending",
    progress: 0,
    enrolledAt: "18 Dec, 2025",
  },
  {
    id: "4",
    name: "Samia Kartoon",
    email: "samia@example.com",
    avatar: "SK",
    course: "Lucid Dreaming 101",
    status: "active",
    progress: 100,
    enrolledAt: "15 Dec, 2025",
  },
  {
    id: "5",
    name: "Brian Halligan",
    email: "brian@example.com",
    avatar: "BH",
    course: "Advanced Techniques",
    status: "inactive",
    progress: 60,
    enrolledAt: "11 Dec, 2025",
  },
];

const statusStyles: Record<Student["status"], { bg: string; text: string; label: string }> = {
  active: { bg: "bg-teal-100", text: "text-teal-800", label: "Active" },
  inactive: { bg: "bg-red-100", text: "text-red-800", label: "Inactive" },
  pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
};

export default function Students() {
  const [selectedCourse, setSelectedCourse] = useState<string>("all");

  const courses = [...new Set(sampleStudents.map((s) => s.course))];
  const filteredStudents =
    selectedCourse === "all"
      ? sampleStudents
      : sampleStudents.filter((s) => s.course === selectedCourse);

  return (
    <div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Students</h2>
                  <p className="text-sm text-gray-500">View and manage your enrolled students.</p>
                </div>
                <div>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="py-2 px-3 pe-9 block border border-gray-200 rounded-lg text-sm focus:border-purple-500 focus:ring-purple-500"
                  >
                    <option value="all">All Courses</option>
                    {courses.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table */}
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="ps-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-800">Name</span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-800">Course</span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-800">Status</span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-800">Progress</span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-800">Enrolled</span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.map((student) => {
                    const status = statusStyles[student.status];
                    return (
                      <tr key={student.id}>
                        <td className="size-px whitespace-nowrap">
                          <div className="ps-6 pe-6 py-3">
                            <div className="flex items-center gap-x-3">
                              <span className="inline-flex items-center justify-center size-9 rounded-full bg-purple-100 border border-purple-200">
                                <span className="font-medium text-sm text-purple-700">{student.avatar}</span>
                              </span>
                              <div className="grow">
                                <span className="block text-sm font-semibold text-gray-800">{student.name}</span>
                                <span className="block text-sm text-gray-500">{student.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="h-px w-72 whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="block text-sm font-semibold text-gray-800">{student.course}</span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className={`py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium ${status.bg} ${status.text} rounded-full`}>
                              {status.label}
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <div className="flex items-center gap-x-3">
                              <span className="text-xs text-gray-500">{student.progress}%</span>
                              <div className="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="flex flex-col justify-center overflow-hidden bg-purple-600"
                                  role="progressbar"
                                  style={{ width: `${Math.max(student.progress, 1)}%` }}
                                  aria-valuenow={student.progress}
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                />
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="text-sm text-gray-500">{student.enrolledAt}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Footer */}
              <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-semibold text-gray-800">{filteredStudents.length}</span> of {sampleStudents.length} students
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
