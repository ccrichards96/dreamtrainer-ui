import { BookOpen, ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && <ChevronRight className="w-5 h-5 text-gray-400 mr-1" />}
            {item.onClick ? (
              <button
                onClick={item.onClick}
                className="inline-flex items-center text-xl font-semibold text-gray-700 hover:text-[#c5a8de]"
              >
                {index === 0 && <BookOpen className="w-6 h-6 mr-2" />}
                {item.label}
              </button>
            ) : (
              <span
                className={`inline-flex items-center text-xl font-semibold ${
                  item.isActive ? "text-[#000]" : "text-gray-500"
                }`}
              >
                {index === 0 && <BookOpen className="w-6 h-6 mr-2" />}
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
