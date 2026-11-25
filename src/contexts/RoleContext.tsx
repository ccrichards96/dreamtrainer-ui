import React, { createContext, useCallback, useEffect, useMemo, useState, ReactNode } from "react";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import { DashboardRole } from "../types/user";
import { useApp } from "./useAppContext";

export interface RoleContextType {
  activeRole: DashboardRole;
  availableRoles: DashboardRole[];
  setActiveRole: (role: DashboardRole) => void;
  goToRoleHome: (role: DashboardRole) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const storageKey = (userId: string) => `active_role:${userId}`;

const isDashboardRole = (value: string | null): value is DashboardRole =>
  value === "student" || value === "expert" || value === "partner";

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { userProfile } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [storedRole, setStoredRole] = useState<DashboardRole | null>(null);

  const userId = userProfile?.id;

  const availableRoles = useMemo<DashboardRole[]>(() => {
    const roles: DashboardRole[] = ["student"];
    if (userProfile?.expertProfile) roles.push("expert");
    if (userProfile?.partnerProfile) roles.push("partner");
    return roles;
  }, [userProfile?.expertProfile, userProfile?.partnerProfile]);

  // Load the persisted role whenever the signed-in user changes
  useEffect(() => {
    const saved = userId ? localStorage.getItem(storageKey(userId)) : null;
    setStoredRole(isDashboardRole(saved) ? saved : null);
  }, [userId]);

  // Fall back to student if the stored role is no longer available (e.g. profile removed)
  const activeRole: DashboardRole =
    storedRole && availableRoles.includes(storedRole) ? storedRole : "student";

  const setActiveRole = useCallback(
    (role: DashboardRole) => {
      if (userId) localStorage.setItem(storageKey(userId), role);
      setStoredRole(role);
    },
    [userId]
  );

  const goToRoleHome = useCallback(
    (role: DashboardRole) => {
      if (role === "expert") {
        navigate("/expert/dashboard");
      } else if (role === "partner") {
        navigate("/partner/dashboard");
      } else {
        const lastCourseSlug = localStorage.getItem("last_course_slug");
        const lastSectionId = localStorage.getItem("last_section_id");
        if (!lastCourseSlug) {
          // No remembered course (e.g. fresh browser) — let them pick from their enrolled courses
          navigate("/my-courses");
          return;
        }
        if (lastSectionId) {
          localStorage.setItem("selected_section_id", lastSectionId);
        }
        navigate(`/courses/${lastCourseSlug}/dashboard`);
      }
    },
    [navigate]
  );

  // Keep the active role in sync when the user lands on a role-specific dashboard directly
  useEffect(() => {
    const { pathname } = location;
    let routeRole: DashboardRole | null = null;
    if (pathname.startsWith("/expert/dashboard")) routeRole = "expert";
    else if (pathname.startsWith("/partner/dashboard")) routeRole = "partner";
    else if (
      matchPath("/courses/:slug/dashboard", pathname) ||
      pathname === "/my-courses" ||
      pathname === "/offers/my-offers"
    )
      routeRole = "student";

    if (routeRole && routeRole !== activeRole && availableRoles.includes(routeRole)) {
      setActiveRole(routeRole);
    }
  }, [location, activeRole, availableRoles, setActiveRole]);

  const value: RoleContextType = {
    activeRole,
    availableRoles,
    setActiveRole,
    goToRoleHome,
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

export { RoleContext };
