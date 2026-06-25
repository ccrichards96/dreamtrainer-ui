import { Pencil, Copy, Trash2, ImageIcon } from "lucide-react";
import DropdownMenu, { DropdownMenuItem } from "../shared/DropdownMenu";
import { Offer, OfferAction } from "./types";

interface OfferCardProps {
  offer: Offer;
  onAction: (action: OfferAction, offer: Offer) => void;
  onViewEdit: (offer: Offer) => void;
}

export default function OfferCard({ offer, onAction, onViewEdit }: OfferCardProps) {
  const menuItems: DropdownMenuItem[] = [
    { key: "edit", label: "Edit", icon: Pencil, onSelect: () => onAction("edit", offer) },
    {
      key: "duplicate",
      label: "Duplicate",
      icon: Copy,
      onSelect: () => onAction("duplicate", offer),
    },
    {
      key: "delete",
      label: "Delete",
      icon: Trash2,
      destructive: true,
      onSelect: () => onAction("delete", offer),
    },
  ];

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <h3 className="font-semibold text-gray-800">{offer.title}</h3>
        <DropdownMenu items={menuItems} ariaLabel={`Actions for ${offer.title}`} />
      </div>

      {/* Preview area */}
      <div className="mx-5 flex aspect-[16/9] items-center justify-center bg-gray-300">
        {offer.imageUrl ? (
          <img src={offer.imageUrl} alt="" className="size-full object-cover" />
        ) : (
          <ImageIcon className="size-10 text-gray-400" />
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end px-5 py-4">
        <button
          type="button"
          onClick={() => onViewEdit(offer)}
          className="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          View / Edit
        </button>
      </div>
    </div>
  );
}
