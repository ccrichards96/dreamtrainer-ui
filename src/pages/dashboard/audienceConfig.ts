/** Who the course dashboard is being shown to — drives copy and side effects. */
export type DashboardAudience = "student" | "expert";

interface WelcomeStep {
  title: string;
  description: string;
}

interface AudienceConfig {
  welcomeVideoLabel: string;
  helpHeading: (expertName: string) => string;
  welcomeTitle: string;
  welcomeGuide?: {
    intro: string;
    steps: WelcomeStep[];
  };
  firstVisitStorageKey: string;
}

export const audienceConfig: Record<DashboardAudience, AudienceConfig> = {
  student: {
    welcomeVideoLabel: "Watch Your Student Welcome Video!",
    helpHeading: (name) => `Want to schedule time with ${name}?`,
    welcomeTitle: "Welcome Student!",
    firstVisitStorageKey: "hasVisitedDashboard",
  },
  expert: {
    welcomeVideoLabel: "Watch Your Expert Welcome Video!",
    helpHeading: (name) => `Get help from ${name} of Dream Trainer`,
    welcomeTitle: "Welcome Expert!",
    welcomeGuide: {
      intro:
        "Monetize expertise, help students achieve meaningful outcomes, and build a reputation through measurable success.",
      steps: [
        {
          title: "Discover",
          description: "Visit Become an Expert and explore courses by Pathway and Milestone.",
        },
        { title: "Select", description: "Choose the course or milestone they want to teach." },
        {
          title: "Register",
          description: "Sign up, complete onboarding, and access the Expert Dashboard.",
        },
        {
          title: "Create",
          description: "Build the course and submit it for Administrator approval.",
        },
        {
          title: "Teach",
          description: "Deliver training, support students, and review associated Partner Offers.",
        },
        {
          title: "Evaluate",
          description:
            "Assess student achievement, approve qualified graduates, and help connect them with opportunities.",
        },
      ],
    },
    firstVisitStorageKey: "hasVisitedExpertDashboard",
  },
};
