import { BookOpen, MessageSquare, Wand2 } from "lucide-react";
import DashboardSidebarLayout, {
  type DashboardNavItem,
} from "../../components/dashboard/DashboardSidebarLayout";

const items: DashboardNavItem[] = [
  {
    id: "start",
    label: "Start & Succeed",
    icon: Wand2,
    to: "/expert/dashboard",
    match: ["/expert/dashboard", "/expert/dashboard/start"],
  },
  {
    id: "courses",
    label: "My Courses",
    icon: BookOpen,
    to: "/expert/dashboard/courses",
    match: ["/expert/dashboard/courses"],
  },
  {
    id: "communications",
    label: "Communications",
    icon: MessageSquare,
    to: "/expert/dashboard/communications",
    match: ["/expert/dashboard/communications"],
  },
];

interface ExpertDashboardLayoutProps {
  children: React.ReactNode;
}

export default function ExpertDashboardLayout({ children }: ExpertDashboardLayoutProps) {
  return (
    <DashboardSidebarLayout title="Expert Dashboard" items={items}>
      {children}
    </DashboardSidebarLayout>
  );
}
