import { GraphQLClient } from "graphql-request";
import type { LeetCodeApiResponse } from "./types";

const client = new GraphQLClient("https://leetcode.com/graphql");

export const LEETCODE_QUERY = `
  query getUserSubmissions($username: String!) {
    matchedUser(username: $username) {
      username
      submitStats: submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
      }
        profile {
            ranking
            userAvatar
            realName
            aboutMe
            school
            websites
            countryName
            company
            jobTitle
            skillTags
            postViewCount
            postViewCountDiff
            reputation
            reputationDiff
            solutionCount
            solutionCountDiff
            categoryDiscussCount
            categoryDiscussCountDiff
            certificationLevel
        }
    }
  }
`;

export async function fetchUserSubmissions(
  username: string
): Promise<LeetCodeApiResponse> {
  try {
    const response = await client.request<LeetCodeApiResponse>(LEETCODE_QUERY, {
      username,
    });

    if (!response || !response.matchedUser) {
      throw new Error(`No data found for user: ${username}`);
    }
    return response;
  } catch (error) {
    console.error(`Error fetching data for ${username}:`, error);
    throw error;
  }
}
