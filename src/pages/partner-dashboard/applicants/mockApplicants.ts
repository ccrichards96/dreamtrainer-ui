import { Applicant, ApplicantStatus, Cohort, Course } from "./types";

const SAMPLE_BIO = "I am a medical student learning in Austin...";

export const mockCourses: Course[] = [
  { id: "toefl-2026", name: "TOEFL: The New Program 2026" },
  { id: "ielts-2026", name: "IELTS: Accelerated 2026" },
];

export const mockCohorts: Cohort[] = [
  { id: "great-july", name: "Great Applicants - July" },
  { id: "fair-july", name: "Fair Applicants - July" },
  { id: "poor-aug", name: "Poor Applicants - Aug" },
  { id: "high-june", name: "High Experience - June" },
  { id: "applicants-may", name: "Applicants - May" },
];

export const mockApplicants: Applicant[] = [
  {
    id: "1",
    appliedAt: "2026-05-21",
    name: "Adam Zee",
    bio: SAMPLE_BIO,
    status: ApplicantStatus.New,
    cohortId: null,
  },
  {
    id: "2",
    appliedAt: "2026-05-21",
    name: "Bob Yee",
    bio: SAMPLE_BIO,
    status: ApplicantStatus.InReview,
    cohortId: "great-july",
  },
  {
    id: "3",
    appliedAt: "2026-05-21",
    name: "Chris Xee",
    bio: SAMPLE_BIO,
    status: ApplicantStatus.PendingMeetingResponse,
    cohortId: "fair-july",
  },
  {
    id: "4",
    appliedAt: "2026-05-21",
    name: "Denise Wee",
    bio: SAMPLE_BIO,
    status: ApplicantStatus.MeetingScheduled,
    cohortId: "poor-aug",
  },
  {
    id: "5",
    appliedAt: "2026-05-21",
    name: "Elaine Tee",
    bio: SAMPLE_BIO,
    status: ApplicantStatus.MeetingCompleted,
    cohortId: "fair-july",
  },
  {
    id: "6",
    appliedAt: "2026-05-21",
    name: "Fran See",
    bio: SAMPLE_BIO,
    status: ApplicantStatus.PendingOfferResponse,
    cohortId: "high-june",
  },
  {
    id: "7",
    appliedAt: "2026-05-21",
    name: "Gary Ree",
    bio: SAMPLE_BIO,
    status: ApplicantStatus.OfferAccepted,
    cohortId: "high-june",
  },
  {
    id: "8",
    appliedAt: "2026-05-21",
    name: "Hana Qee",
    bio: SAMPLE_BIO,
    status: ApplicantStatus.Declined,
    cohortId: "applicants-may",
  },
];
