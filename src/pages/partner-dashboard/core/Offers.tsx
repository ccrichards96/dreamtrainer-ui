import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import CourseSelector from "../shared/CourseSelector";
import Pagination from "../shared/Pagination";
import OfferCard from "../offers/OfferCard";
import { Offer, OfferAction } from "../offers/types";
import { mockOffers } from "../offers/mockOffers";
import { mockCourses } from "../applicants/mockApplicants";

const PAGE_SIZE = 6;

export default function Offers() {
  const navigate = useNavigate();
  const [activeCourseId, setActiveCourseId] = useState(mockCourses[0]?.id ?? "");
  const [offers] = useState(mockOffers);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(offers.length / PAGE_SIZE));
  const pageOffers = offers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleAddOffer = () => navigate("/partner/dashboard/offers/new");

  const handleOfferAction = (action: OfferAction, offer: Offer) => {
    if (action === "edit") {
      navigate(`/partner/dashboard/offers/${offer.id}/edit`);
      return;
    }
    // Placeholder — duplicate/delete to be implemented
    console.log(action, offer.id);
  };

  const handleViewEdit = (offer: Offer) => {
    navigate(`/partner/dashboard/offers/${offer.id}/edit`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <CourseSelector
          courses={mockCourses}
          selectedCourseId={activeCourseId}
          onChange={setActiveCourseId}
        />
        <button
          type="button"
          onClick={handleAddOffer}
          className="inline-flex items-center gap-x-2 self-start rounded-lg bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 sm:self-end"
        >
          <Plus className="size-4" />
          Add New Offer
        </button>
      </div>

      {pageOffers.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pageOffers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onAction={handleOfferAction}
              onViewEdit={handleViewEdit}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">No offers yet</h2>
          <p className="mt-1 text-sm text-gray-600">
            Create your first offer to start receiving applicants.
          </p>
        </div>
      )}

      <div className="pt-2">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          label="Offers pagination"
        />
      </div>
    </div>
  );
}
