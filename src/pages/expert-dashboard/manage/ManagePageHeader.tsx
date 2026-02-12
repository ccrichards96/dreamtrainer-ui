import { ReactNode } from "react";

interface ManagePageHeaderProps {
  title: string;
  actions?: ReactNode;
}

export default function ManagePageHeader({ title, actions }: ManagePageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
