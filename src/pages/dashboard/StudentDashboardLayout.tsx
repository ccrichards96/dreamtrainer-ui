import { useParams } from "react-router-dom";
import { BookOpen, Tag, Wand2 } from "lucide-react";
import DashboardSidebarLayout, {
  type DashboardNavItem,
} from "../../components/dashboard/DashboardSidebarLayout";

interface StudentDashboardLayoutProps {
  children: React.ReactNode;
}

export default function StudentDashboardLayout({ children }: StudentDashboardLayoutProps) {
  const { slug } = useParams<{ slug?: string }>();

  // Outside a course route, fall back to the last course the student visited
  const courseSlug = slug || localStorage.getItem("last_course_slug");

  const items: DashboardNavItem[] = [
    {
      id: "start",
      label: "Now Learning",
      icon: Wand2,
      to: courseSlug ? `/courses/${courseSlug}/dashboard` : "/courses",
      match: ["/courses/:slug/dashboard"],
    },
    {
      id: "courses",
      label: "My Courses",
      icon: BookOpen,
      to: "/my-courses",
      match: ["/my-courses"],
    },
    {
      id: "offers",
      label: "My Offers",
      icon: Tag,
      to: "/offers/my-offers",
      match: ["/offers/my-offers"],
    },
  ];

  return (
    <DashboardSidebarLayout title="Student Dashboard" items={items}>
      {children}
    </DashboardSidebarLayout>
  );
}
