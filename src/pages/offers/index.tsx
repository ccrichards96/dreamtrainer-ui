import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Compass, Briefcase } from "lucide-react";
import DashboardLayout, { type SidebarItem } from "../expert-dashboard/DashboardLayout";
import ExploreOffers from "./ExploreOffers";
import MyOffers from "./MyOffers";
import OfferDetailModal from "./OfferDetailModal";
import { StudentOffer } from "./types";

type Tab = "explore" | "my-offers";

const sidebarItems: SidebarItem[] = [
  { id: "explore", label: "Explore Offers", icon: Compass },
  { id: "my-offers", label: "My Offers", icon: Briefcase },
];

const validTabs: Tab[] = ["explore", "my-offers"];

export default function StudentOffers() {
  const navigate = useNavigate();
  const { tab } = useParams<{ tab?: string }>();

  // Determine active tab (fallback to explore)
  const activeTab: Tab = validTabs.includes(tab as Tab) ? (tab as Tab) : "explore";

  // State to track all available offers (empty for API wiring next)
  const [offers, setOffers] = useState<StudentOffer[]>([]);

  // State to track applied offers
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  // State for detail modal
  const [selectedOffer, setSelectedOffer] = useState<StudentOffer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApply = (id: string) => {
    if (!appliedIds.includes(id)) {
      setAppliedIds((prev) => [...prev, id]);
    }
  };

  const handleViewDetails = (offer: StudentOffer) => {
    setSelectedOffer(offer);
    setIsModalOpen(true);
  };

  const handleApplyInModal = () => {
    if (selectedOffer) {
      handleApply(selectedOffer.id);
    }
  };

  const handleExploreRedirect = () => {
    navigate("/offers/explore");
  };

  return (
    <DashboardLayout
      items={sidebarItems}
      activeTab={activeTab}
      onTabChange={(id) => navigate(`/offers/${id}`)}
      title="Student Placements"
      breadcrumbRoot="Offers"
    >
      {activeTab === "explore" && (
        <ExploreOffers
          offers={offers}
          appliedIds={appliedIds}
          onApply={handleApply}
          onViewDetails={handleViewDetails}
        />
      )}

      {activeTab === "my-offers" && (
        <MyOffers
          offers={offers}
          appliedIds={appliedIds}
          onViewDetails={handleViewDetails}
          onExploreRedirect={handleExploreRedirect}
        />
      )}

      <OfferDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        offer={selectedOffer}
        hasApplied={selectedOffer ? appliedIds.includes(selectedOffer.id) : false}
        onApply={handleApplyInModal}
      />
    </DashboardLayout>
  );
}
