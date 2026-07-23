import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import PartnerShell from "../PartnerShell";
import OfferDetailsSection from "./forms/OfferDetailsSection";
import IdealCandidatesSection from "./forms/IdealCandidatesSection";
import { OfferFormData } from "./types";
import { CourseOffer } from "../../../types/offers";
import {
  getCourseOfferById,
  createCourseOffer,
  updateCourseOffer,
} from "../../../services/api/offers";
import { usePartnerDashboardContext } from "../../../contexts/usePartnerDashboardContext";
import { ApiError } from "../../../services/api/client";
import { toast } from "../../../components/toast";

const toFormData = (offer: CourseOffer): OfferFormData => ({
  name: offer.title,
  description: offer.description ?? "",
  imageUrl: offer.imageUrl ?? "",
  requirements:
    offer.requirements && offer.requirements.length > 0 ? offer.requirements : ["", "", ""],
  characteristics: offer.characteristics ?? "",
  expectations: offer.expectations ?? "",
  outcomes: offer.outcomes ?? "",
});

/** Empty form used when creating a new offer or as a fallback. */
export const emptyOfferForm: OfferFormData = {
  name: "",
  description: "",
  imageUrl: "",
  requirements: ["", "", ""],
  characteristics: "",
  expectations: "",
  outcomes: "",
};

export default function OfferDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { activeCourseId } = usePartnerDashboardContext();

  // Prefer the course the partner was viewing when they clicked in from the offers list;
  // fall back to the dashboard's active course (e.g. on a direct link/reload).
  const courseId = searchParams.get("courseId") || activeCourseId;
  const isEditing = Boolean(id);

  const [form, setForm] = useState<OfferFormData>(emptyOfferForm);
  const [title, setTitle] = useState("New Offer");
  const [status, setStatus] = useState<string>("draft");
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEditing || !id || !courseId) {
      setIsLoading(false);
      return;
    }

    const fetchOffer = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const offer = await getCourseOfferById(courseId, id);
        setForm(toFormData(offer));
        setTitle(offer.title);
        setStatus(offer.status);
      } catch (err) {
        setError((err as ApiError).message || "Failed to load offer");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffer();
  }, [courseId, id, isEditing]);

  const updateForm = (patch: Partial<OfferFormData>) => setForm((prev) => ({ ...prev, ...patch }));

  const handleSave = async () => {
    if (!courseId) {
      setError("No course selected for this offer.");
      return;
    }

    const data = {
      title: form.name,
      description: form.description,
      imageUrl: form.imageUrl.trim() || null,
      requirements: form.requirements.filter((req) => req.trim() !== ""),
      characteristics: form.characteristics,
      expectations: form.expectations,
      outcomes: form.outcomes,
    };

    try {
      setIsSaving(true);
      setError(null);
      if (isEditing && id) {
        await updateCourseOffer(courseId, id, data);
      } else {
        await createCourseOffer(courseId, data);
      }
      toast.success(isEditing ? "Offer updated" : "Offer created");
      navigate("/partner/dashboard/offers");
    } catch (err) {
      toast.error((err as ApiError).message || "Failed to save offer");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async () => {
    if (!courseId || !id) return;
    const isPublishing = status !== "active";
    const nextStatus = isPublishing ? "active" : "draft";

    try {
      setIsSaving(true);
      await updateCourseOffer(courseId, id, { status: nextStatus });
      setStatus(nextStatus);
      toast.success(isPublishing ? "Offer is now published live" : "Offer is no longer published", {
        description: isPublishing
          ? "It's now visible to students."
          : "It's back to draft and hidden from students.",
      });
    } catch (err) {
      toast.error(
        (err as ApiError).message || `Failed to ${isPublishing ? "publish" : "unpublish"} offer`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleArchive = async () => {
    if (!courseId || !id) return;
    if (!window.confirm("Archive this offer? It will no longer be visible to students.")) return;

    try {
      setIsSaving(true);
      await updateCourseOffer(courseId, id, { status: "archived" });
      toast.success("Offer archived");
      navigate("/partner/dashboard/offers");
    } catch (err) {
      toast.error((err as ApiError).message || "Failed to archive offer");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => navigate("/partner/dashboard/offers");

  if (isLoading) {
    return (
      <PartnerShell activeTab="offers">
        <div className="flex items-center justify-center py-24">
          <div className="size-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
        </div>
      </PartnerShell>
    );
  }

  return (
    <PartnerShell activeTab="offers">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">{isEditing ? title : "New Offer"}</h1>
          {isEditing && (
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${
                status === "active"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : status === "archived"
                    ? "border-gray-200 bg-gray-100 text-gray-600"
                    : "border-amber-200 bg-amber-50 text-amber-700"
              }`}
            >
              {status}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-xl bg-purple-600 px-7 py-3 text-base font-semibold text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
          {isEditing && status !== "archived" && (
            <button
              type="button"
              onClick={handleTogglePublish}
              disabled={isSaving}
              className={`rounded-xl px-6 py-3 text-base font-semibold text-white focus:outline-none focus:ring-2 disabled:opacity-50 ${
                status === "active"
                  ? "bg-amber-600 hover:bg-amber-700 focus:ring-amber-400"
                  : "bg-green-600 hover:bg-green-700 focus:ring-green-400"
              }`}
            >
              {status === "active" ? "Unpublish" : "Publish"}
            </button>
          )}
          {isEditing && (
            <button
              type="button"
              onClick={handleArchive}
              disabled={isSaving || status === "archived"}
              className="rounded-xl bg-red-700 px-6 py-3 text-base font-semibold text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50"
            >
              Archive
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 rounded-3xl bg-white p-8 shadow-sm lg:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <OfferDetailsSection form={form} onChange={updateForm} />
          <IdealCandidatesSection form={form} onChange={updateForm} />
        </div>
      </div>
    </PartnerShell>
  );
}
