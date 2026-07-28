import type { Review, ReviewSortOption } from "../types/review";

export function getReviewInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function formatReviewDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatReviewLocation(review: Review): string | null {
  if (review.location?.trim()) {
    return `Patient · ${review.location.trim()}`;
  }
  return "Patient";
}

export function sortReviews(
  reviews: Review[],
  sort: ReviewSortOption,
): Review[] {
  const list = [...reviews];
  switch (sort) {
    case "highest":
      return list.sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return (
          new Date(b.approvedDate || b.createdDate).getTime() -
          new Date(a.approvedDate || a.createdDate).getTime()
        );
      });
    case "lowest":
      return list.sort((a, b) => {
        if (a.rating !== b.rating) return a.rating - b.rating;
        return (
          new Date(b.approvedDate || b.createdDate).getTime() -
          new Date(a.approvedDate || a.createdDate).getTime()
        );
      });
    case "latest":
    default:
      return list.sort(
        (a, b) =>
          new Date(b.approvedDate || b.createdDate).getTime() -
          new Date(a.approvedDate || a.createdDate).getTime(),
      );
  }
}

export function formatAverageRating(value: number): string {
  if (!value || value <= 0) return "—";
  return value.toFixed(1);
}

export function reviewStatusClass(status: Review["status"]): string {
  switch (status) {
    case "Approved":
      return "review-status--approved";
    case "Rejected":
      return "review-status--rejected";
    default:
      return "review-status--pending";
  }
}
