import type { ReviewStats } from "../../types/review";
import { formatAverageRating } from "../../utils/reviewUtils";

interface ReviewStatisticsProps {
  stats: ReviewStats | null;
  loading?: boolean;
}

function ReviewStatistics({ stats, loading }: ReviewStatisticsProps) {
  if (loading) {
    return (
      <div className="review-stats review-stats--loading" aria-busy="true">
        <div className="review-stats__skeleton" />
        <div className="review-stats__skeleton" />
        <div className="review-stats__skeleton" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="review-stats" aria-label="Review statistics">
      <div className="review-stats__card">
        <span className="review-stats__icon" aria-hidden="true">
          ★
        </span>
        <div>
          <p className="review-stats__value">
            {formatAverageRating(stats.averageRating)}
          </p>
          <p className="review-stats__label">Average Rating</p>
        </div>
      </div>
      <div className="review-stats__card">
        <span className="review-stats__icon" aria-hidden="true">
          💬
        </span>
        <div>
          <p className="review-stats__value">{stats.totalReviews}</p>
          <p className="review-stats__label">Total Reviews</p>
        </div>
      </div>
      <div className="review-stats__card">
        <span className="review-stats__icon" aria-hidden="true">
          👥
        </span>
        <div>
          <p className="review-stats__value">
            {stats.patientsServed.toLocaleString()}+
          </p>
          <p className="review-stats__label">Patients Served</p>
        </div>
      </div>
    </div>
  );
}

export default ReviewStatistics;
