import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { USER_MESSAGES } from "../utils/userMessages";
import ChannelingPageLayout from "../components/channeling/ChannelingPageLayout";
import PageState from "../components/ui/PageState";
import Button from "../components/ui/Button";
import {
  approveReview,
  deleteReview,
  fetchAllReviewsAdmin,
  rejectReview,
} from "../services/reviewService";
import type { Review } from "../types/review";
import {
  formatReviewDate,
  formatReviewLocation,
  reviewStatusClass,
} from "../utils/reviewUtils";

function ReviewManagementPage() {
  usePageTitle("Review Management");
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<number | null>(null);
  const [selected, setSelected] = useState<Review | null>(null);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllReviewsAdmin();
      setReviews(data);
    } catch {
      setError(USER_MESSAGES.loadFailed);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  const runAction = async (
    reviewId: number,
    action: () => Promise<void>,
    successMessage?: string,
  ) => {
    setActionId(reviewId);
    try {
      await action();
      await loadReviews();
      if (selected?.reviewId === reviewId) {
        setSelected(null);
      }
      if (successMessage) {
        showToast(successMessage);
      }
    } catch {
      showToast(USER_MESSAGES.loadFailed, "error");
    } finally {
      setActionId(null);
    }
  };

  const pendingCount = reviews.filter((r) => r.status === "Pending").length;

  return (
    <ChannelingPageLayout>
      <div className="review-admin">
        <header className="review-admin__header">
          <div>
            <nav className="review-admin__breadcrumb" aria-label="Breadcrumb">
              <Link to="/channeling">Channeling</Link>
              <span aria-hidden="true">/</span>
              <span>Review Management</span>
            </nav>
            <h1 className="review-admin__title">Review Management</h1>
            <p className="review-admin__subtitle">
              Moderate patient reviews before they appear on the Home and About pages.
            </p>
          </div>
          <div className="review-admin__summary">
            <span className="review-admin__chip">
              {reviews.length} total
            </span>
            {pendingCount > 0 ? (
              <span className="review-admin__chip review-admin__chip--pending">
                {pendingCount} pending
              </span>
            ) : null}
          </div>
        </header>

        {loading && (
          <div className="review-admin__loading" aria-busy="true">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="review-admin__skeleton" />
            ))}
          </div>
        )}

        {!loading && error && (
          <PageState
            variant="error"
            icon="reviews"
            title="Unable to load reviews"
            message={USER_MESSAGES.loadFailed}
            onRetry={loadReviews}
            retryLabel="Try Again"
          />
        )}

        {!loading && !error && reviews.length === 0 && (
          <PageState
            variant="empty"
            icon="reviews"
            title="No reviews yet"
            message="Patient submissions will appear here for moderation once reviews are submitted."
          />
        )}

        {!loading && !error && reviews.length > 0 && (
          <div className="review-admin__layout">
            <div className="review-admin__list" role="list">
              {reviews.map((review) => (
                <article
                  key={review.reviewId}
                  className={`review-admin__item${
                    selected?.reviewId === review.reviewId
                      ? " review-admin__item--active"
                      : ""
                  }`}
                  role="listitem"
                >
                  <button
                    type="button"
                    className="review-admin__item-main"
                    onClick={() => setSelected(review)}
                  >
                    <div className="review-admin__item-top">
                      <strong>{review.fullName}</strong>
                      <span
                        className={`review-status ${reviewStatusClass(review.status)}`}
                      >
                        {review.status}
                      </span>
                    </div>
                    <div className="review-admin__item-meta">
                      <span>{"★".repeat(review.rating)}</span>
                      <span>{formatReviewDate(review.createdDate)}</span>
                    </div>
                    <p className="review-admin__item-preview">
                      {review.reviewText}
                    </p>
                  </button>
                  <div className="review-admin__item-actions">
                    {review.status !== "Approved" ? (
                      <Button
                        variant="secondary"
                        disabled={actionId === review.reviewId}
                        onClick={() =>
                          void runAction(
                            review.reviewId,
                            async () => {
                              await approveReview(review.reviewId);
                            },
                            USER_MESSAGES.reviewApproved,
                          )
                        }
                      >
                        Approve
                      </Button>
                    ) : null}
                    {review.status !== "Rejected" ? (
                      <Button
                        variant="secondary"
                        disabled={actionId === review.reviewId}
                        onClick={() =>
                          void runAction(
                            review.reviewId,
                            async () => {
                              await rejectReview(review.reviewId);
                            },
                            USER_MESSAGES.reviewRejected,
                          )
                        }
                      >
                        Reject
                      </Button>
                    ) : null}
                    <Button
                      variant="secondary"
                      disabled={actionId === review.reviewId}
                      onClick={() => {
                        if (
                          window.confirm(
                            "Delete this review permanently?",
                          )
                        ) {
                          void runAction(
                            review.reviewId,
                            () => deleteReview(review.reviewId),
                            USER_MESSAGES.reviewDeleted,
                          );
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </article>
              ))}
            </div>

            {selected ? (
              <aside className="review-admin__detail" aria-label="Review details">
                <h2>Review Details</h2>
                <dl className="review-admin__detail-list">
                  <div>
                    <dt>Name</dt>
                    <dd>{selected.fullName}</dd>
                  </div>
                  {selected.email ? (
                    <div>
                      <dt>Email</dt>
                      <dd>{selected.email}</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt>Rating</dt>
                    <dd>{selected.rating} / 5</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>
                      <span
                        className={`review-status ${reviewStatusClass(selected.status)}`}
                      >
                        {selected.status}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt>Submitted</dt>
                    <dd>{formatReviewDate(selected.createdDate)}</dd>
                  </div>
                  {selected.approvedDate ? (
                    <div>
                      <dt>Approved</dt>
                      <dd>{formatReviewDate(selected.approvedDate)}</dd>
                    </div>
                  ) : null}
                  {selected.location ? (
                    <div>
                      <dt>Location</dt>
                      <dd>{formatReviewLocation(selected)}</dd>
                    </div>
                  ) : null}
                </dl>
                <p className="review-admin__detail-text">{selected.reviewText}</p>
              </aside>
            ) : (
              <aside className="review-admin__detail review-admin__detail--empty">
                <p>Select a review to view full details.</p>
              </aside>
            )}
          </div>
        )}

      </div>
    </ChannelingPageLayout>
  );
}

export default ReviewManagementPage;
