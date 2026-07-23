import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import CourseSelector from "../shared/CourseSelector";
import Pagination from "../shared/Pagination";
import OfferCard from "../offers/OfferCard";
import { Offer, OfferAction } from "../offers/types";
import { CourseOffer } from "../../../types/offers";
import { offersService } from "../../../services/api";
import { usePartnerDashboardContext } from "../../../contexts/usePartnerDashboardContext";

const PAGE_SIZE = 6;

export default function Offers() {
  const navigate = useNavigate();
  const { courses, activeCourseId, setActiveCourseId } = usePartnerDashboardContext();
  const [offers, setOffers] = useState<CourseOffer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!activeCourseId) {
      setOffers([]);
      return;
    }

    const fetchOffers = async () => {
      try {
        setIsLoading(true);
        const data = await offersService.getCourseOffers(activeCourseId);
        setOffers(data);
      } catch (error) {
        console.error("Failed to fetch offers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, [activeCourseId]);

  const totalPages = Math.max(1, Math.ceil(offers.length / PAGE_SIZE));
  const pageOffers = offers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleAddOffer = () => {
    if (!activeCourseId) return;
    navigate(`/partner/dashboard/offers/new?courseId=${activeCourseId}`);
  };

  const handleOfferAction = async (action: OfferAction, offer: Offer) => {
    if (action === "edit") {
      navigate(`/partner/dashboard/offers/${offer.id}/edit?courseId=${activeCourseId}`);
      return;
    }
    
    if (action === "delete") {
      if (!activeCourseId) return;
      if (window.confirm("Are you sure you want to delete this offer?")) {
        try {
          await offersService.deleteCourseOffer(activeCourseId, offer.id);
          setOffers((prev) => prev.filter((o) => o.id !== offer.id));
        } catch (error) {
          console.error("Failed to delete offer:", error);
          alert("Failed to delete offer.");
        }
      }
      return;
    }

    // Placeholder for duplicate to be implemented
    console.log(action, offer.id);
  };

  const handleViewEdit = (offer: Offer) => {
    navigate(`/partner/dashboard/offers/${offer.id}/edit?courseId=${activeCourseId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <CourseSelector
          courses={courses}
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

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="size-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
        </div>
      ) : pageOffers.length > 0 ? (
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
