export interface SubmissionStats {
  difficulty: string;
  count: number;
  submissions: number;
}

export interface LeetCodeUser {
  profileUrl: string;
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalSubmissions: number;
  score: number;
  previousRank: number;
  currentRank: number;
  lastUpdated: Date;
}

export interface LeetCodeApiResponse {
  matchedUser: {
    username: string;
    submitStats: {
      acSubmissionNum: SubmissionStats[];
    };
    profile: {
      ranking: number;
      userAvatar: string;
      realName: string;
      aboutMe: string;
      school: string | null;
      websites: string[];
      countryName: string;
      company: string | null;
      jobTitle: string | null;
      skillTags: string[];
      postViewCount: number;
      postViewCountDiff: number;
      reputation: number;
      reputationDiff: number;
      solutionCount: number;
      solutionCountDiff: number;
      categoryDiscussCount: number;
      categoryDiscussCountDiff: number;
      certificationLevel: "NORMAL" | string;
    };
  };
}
