import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PartnerShell from "../PartnerShell";
import OfferDetailsSection from "./forms/OfferDetailsSection";
import IdealCandidatesSection from "./forms/IdealCandidatesSection";
import { OfferFormData } from "./types";
import { emptyOfferForm, getOfferById } from "./mockOffers";

export default function OfferDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const loaded = id ? getOfferById(id) : null;
  const title = loaded?.offer.title ?? "New Offer";

  const [form, setForm] = useState<OfferFormData>(loaded?.form ?? emptyOfferForm);

  const updateForm = (patch: Partial<OfferFormData>) => setForm((prev) => ({ ...prev, ...patch }));

  const handleSave = () => {
    // Placeholder — persist the offer, then return to the offers list
    console.log("Save offer", id, form);
    navigate("/partner/dashboard/offers");
  };

  const handleArchive = () => {
    // Placeholder — archive the offer
    console.log("Archive offer", id);
  };

  const handleCancel = () => navigate("/partner/dashboard/offers");

  return (
    <PartnerShell activeTab="offers">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-xl bg-purple-600 px-7 py-3 text-base font-semibold text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleArchive}
            className="rounded-xl bg-red-700 px-6 py-3 text-base font-semibold text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Archive
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-white p-8 shadow-sm lg:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <OfferDetailsSection form={form} onChange={updateForm} />
          <IdealCandidatesSection form={form} onChange={updateForm} />
        </div>
      </div>
    </PartnerShell>
  );
}
