export default function CourseStructure() {
  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Course Structure</h3>
        <p className="text-gray-600">- Insert instuctions on the ideal learning structure-</p>
      </div>

      <div className="mt-5 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Course Requirements</h3>
        <ul>
          <li className="mt-3 text-gray-600 list-disc list-inside">
            Your course must pass our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              course requirements list
            </a>{" "}
            for ensuring course quality.
          </li>
          <li className="mt-3 text-gray-600 list-disc list-inside">
            Define clear learning outcomes for your course.
          </li>
          <li className="mt-3 text-gray-600 list-disc list-inside">
            Your course must have <b>at least 3 sections.</b>
          </li>
          <li className="mt-1 text-gray-600 list-disc list-inside">
            Ensure outcomes for sections are measurable and achievable.
          </li>
        </ul>
      </div>
    </>
  );
}
