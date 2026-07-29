import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Compass, Briefcase, Loader2 } from "lucide-react";
import DashboardLayout, { type SidebarItem } from "../expert-dashboard/DashboardLayout";
import ExploreOffers from "./ExploreOffers";
import MyOffers from "./MyOffers";
import OfferDetailModal from "./OfferDetailModal";
import ApplicationSubmissionModal from "./ApplicationSubmissionModal";
import { StudentOffer } from "./types";
import {
  getOffers,
  getMyApplications,
  applyToOffer,
  withdrawApplication,
} from "../../services/api/offers";
import { ApiError } from "../../services/api/client";
import type { OfferApplicationStatus, MyOfferApplication } from "../../types/offers";
import { toast } from "../../components/toast";

type Tab = "explore" | "my-offers";

const sidebarItems: SidebarItem[] = [
  { id: "explore", label: "Explore Offers", icon: Compass },
  { id: "my-offers", label: "My Offers", icon: Briefcase },
];

const validTabs: Tab[] = ["explore", "my-offers"];

/** Build the offerId -> application-status map from the user's applications (the source of truth). */
const seedStatuses = (
  applications: MyOfferApplication[]
): Record<string, OfferApplicationStatus> => {
  const statuses: Record<string, OfferApplicationStatus> = {};
  for (const application of applications) {
    statuses[application.courseOfferId] = application.status;
  }
  return statuses;
};

export default function StudentOffers() {
  const navigate = useNavigate();
  const { tab } = useParams<{ tab?: string }>();

  // Determine active tab (fallback to explore)
  const activeTab: Tab = validTabs.includes(tab as Tab) ? (tab as Tab) : "explore";

  // All active offers on the platform (GET /offers)
  const [offers, setOffers] = useState<StudentOffer[]>([]);

  // The current user's own applications, every status (GET /offers/me)
  const [myApplications, setMyApplications] = useState<MyOfferApplication[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Current application status per offer, seeded from the API and updated on apply/withdraw.
  const [appStatuses, setAppStatuses] = useState<Record<string, OfferApplicationStatus>>({});
  // Offers with an in-flight apply/withdraw request (buttons disabled while present).
  const [busyIds, setBusyIds] = useState<string[]>([]);

  // State for detail modal
  const [selectedOffer, setSelectedOffer] = useState<StudentOffer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Offer being applied to in the submission modal (null = closed). Applying goes
  // through this modal so the student can attach supporting documents.
  const [applyingOffer, setApplyingOffer] = useState<StudentOffer | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [offersData, applications] = await Promise.all([getOffers(), getMyApplications()]);
        setOffers(offersData);
        setMyApplications(applications);
        setAppStatuses(seedStatuses(applications));
      } catch (err) {
        console.error("Error fetching offers:", err);
        setError((err as ApiError).message || "Failed to load offers");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Re-pull the authoritative application list after an apply/withdraw so both tabs stay in sync.
  const refreshApplications = async () => {
    try {
      const applications = await getMyApplications();
      setMyApplications(applications);
      setAppStatuses(seedStatuses(applications));
    } catch {
      // Keep the optimistic status already applied below if the reconcile fetch fails.
    }
  };

  // Offers the user has an active application for (shown as "Applied") — anything
  // that hasn't reached a terminal state.
  const appliedIds = useMemo(
    () =>
      Object.entries(appStatuses)
        .filter(([, status]) => status !== "opportunity_archived" && status !== "declined")
        .map(([id]) => id),
    [appStatuses]
  );

  // An application can only be withdrawn before the partner starts working it.
  const withdrawableIds = useMemo(
    () =>
      Object.entries(appStatuses)
        .filter(
          ([, status]) => status === "new" || status === "reviewing" || status === "in_review"
        )
        .map(([id]) => id),
    [appStatuses]
  );

  const setStatus = (id: string, status: OfferApplicationStatus) =>
    setAppStatuses((prev) => ({ ...prev, [id]: status }));

  /** The submission modal renders the offer itself, so applying needs the whole record.
   * Re-applying from My Offers can target an offer that has since left the active
   * explore list, so fall back to the copy embedded in the user's own application. */
  const resolveOffer = (id: string): StudentOffer | null => {
    const listed = offers.find((offer) => offer.id === id);
    if (listed) return listed;

    const courseOffer = myApplications.find(
      (application) => application.courseOfferId === id
    )?.courseOffer;
    if (!courseOffer) return null;

    return {
      id: courseOffer.id,
      title: courseOffer.title,
      partnerName: courseOffer.partnerName ?? "",
      description: courseOffer.description,
      requirements: courseOffer.requirements ?? [],
      characteristics: courseOffer.characteristics ?? "",
      expectations: courseOffer.expectations ?? "",
      outcomes: courseOffer.outcomes ?? "",
      imageUrl: courseOffer.imageUrl,
    };
  };

  // Applying is a two-step flow: open the submission modal, then submit with any
  // documents the student attached there.
  const handleApply = (id: string) => {
    if (busyIds.includes(id) || appliedIds.includes(id)) return;
    const offer = resolveOffer(id);
    if (!offer) {
      toast.error("That offer is no longer available");
      return;
    }
    setApplyingOffer(offer);
  };

  const handleSubmitApplication = async (files: File[]) => {
    const offer = applyingOffer;
    if (!offer || busyIds.includes(offer.id)) return;

    setBusyIds((prev) => [...prev, offer.id]);
    try {
      const application = await applyToOffer(offer.id, files);
      setStatus(offer.id, application.status);
      setApplyingOffer(null);
      toast.success(
        files.length > 0
          ? `Applied to offer with ${files.length} document${files.length === 1 ? "" : "s"}`
          : "Applied to offer"
      );
      await refreshApplications();
    } catch (err) {
      const apiError = err as ApiError;
      // "Already applied" is idempotent from the user's perspective — treat as applied (defensive).
      if (apiError.status === 400 && /already applied/i.test(apiError.message)) {
        setStatus(offer.id, "new");
        setApplyingOffer(null);
      } else {
        toast.error(apiError.message || "Failed to apply to offer");
      }
    } finally {
      setBusyIds((prev) => prev.filter((busyId) => busyId !== offer.id));
    }
  };

  const handleWithdraw = async (id: string) => {
    if (busyIds.includes(id)) return;
    setBusyIds((prev) => [...prev, id]);
    try {
      const application = await withdrawApplication(id);
      setStatus(id, application.status);
      toast.success("Application withdrawn");
      await refreshApplications();
    } catch (err) {
      toast.error((err as ApiError).message || "Failed to withdraw application");
    } finally {
      setBusyIds((prev) => prev.filter((busyId) => busyId !== id));
    }
  };

  const handleViewDetails = (offer: StudentOffer) => {
    setSelectedOffer(offer);
    setIsModalOpen(true);
  };

  const handleExploreRedirect = () => {
    navigate("/offers/explore");
  };

  if (loading) {
    return (
      <DashboardLayout
        items={sidebarItems}
        activeTab={activeTab}
        onTabChange={(id) => navigate(`/offers/${id}`)}
        title="Offers for Students"
        breadcrumbRoot="Offers"
      >
        <div className="flex items-center justify-center gap-3 py-24">
          <Loader2 className="size-8 animate-spin text-purple-500" />
          <span className="text-gray-600">Loading offers...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout
        items={sidebarItems}
        activeTab={activeTab}
        onTabChange={(id) => navigate(`/offers/${id}`)}
        title="Offers for Students"
        breadcrumbRoot="Offers"
      >
        <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-medium text-red-600">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const selectedApplied = selectedOffer ? appliedIds.includes(selectedOffer.id) : false;
  const selectedWithdrawable = selectedOffer ? withdrawableIds.includes(selectedOffer.id) : false;
  const selectedBusy = selectedOffer ? busyIds.includes(selectedOffer.id) : false;

  return (
    <DashboardLayout
      items={sidebarItems}
      activeTab={activeTab}
      onTabChange={(id) => navigate(`/offers/${id}`)}
      title="Offers for Students"
      breadcrumbRoot="Offers"
    >
      {activeTab === "explore" && (
        <ExploreOffers
          offers={offers}
          appliedIds={appliedIds}
          withdrawableIds={withdrawableIds}
          busyIds={busyIds}
          onApply={handleApply}
          onWithdraw={handleWithdraw}
          onViewDetails={handleViewDetails}
        />
      )}

      {activeTab === "my-offers" && (
        <MyOffers
          applications={myApplications}
          statuses={appStatuses}
          busyIds={busyIds}
          onApply={handleApply}
          onWithdraw={handleWithdraw}
          onViewDetails={handleViewDetails}
          onExploreRedirect={handleExploreRedirect}
        />
      )}

      <OfferDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        offer={selectedOffer}
        hasApplied={selectedApplied}
        canWithdraw={selectedWithdrawable}
        isBusy={selectedBusy}
        onApply={() => selectedOffer && handleApply(selectedOffer.id)}
        onWithdraw={() => selectedOffer && handleWithdraw(selectedOffer.id)}
      />

      <ApplicationSubmissionModal
        isOpen={applyingOffer !== null}
        onClose={() => setApplyingOffer(null)}
        offer={applyingOffer}
        isSubmitting={applyingOffer ? busyIds.includes(applyingOffer.id) : false}
        onSubmit={handleSubmitApplication}
      />
    </DashboardLayout>
  );
}
