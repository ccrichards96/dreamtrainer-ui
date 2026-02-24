export interface ExpertPerformanceData {
  overview: {
    totalRevenue: number;
    totalStudents: number;
    avgRating: number;
    completionRate: number;
  };
  revenue: {
    thisMonth: number;
    lastMonth: number;
    lifetime: number;
    pendingPayout: number;
  };
  students: {
    totalStudents: number;
    newSignupsThisMonth: number;
    activeThisWeek: number;
    completionRate: number;
  };
  reviews: {
    averageRating: number;
    totalReviews: number;
    fiveStar: number;
    responseRate: number;
  };
  traffic: {
    pageViews: number;
    uniqueVisitors: number;
    conversionRate: number;
    topSource: string;
  };
  affiliates: {
    totalReferrals: number;
    activeAffiliates: number;
    affiliateRevenue: number;
    conversionRate: number;
  };
}