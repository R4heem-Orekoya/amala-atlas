import { AmalaSpot, Vote } from "@/types";

export const calculateVerificationScore = (votes: Vote[]): number => {
  const upvotes = votes.filter((v) => v.type === "up").length;
  const totalVotes = votes.length;

  if (totalVotes === 0) return 0;

  return Math.round((upvotes / totalVotes) * 100);
};

export const shouldMarkAsVerified = (spot: AmalaSpot): boolean => {
  // A spot is verified if it has at least 10 votes and 80% positive rating
  if (spot.votes.length < 10) return false;

  const verificationScore = calculateVerificationScore(spot.votes);
  return verificationScore >= 80;
};

export const getVerificationTier = (score: number): string => {
  if (score >= 90) return "highly-trusted";
  if (score >= 70) return "trusted";
  if (score >= 50) return "community-reviewed";
  return "new-listing";
};
