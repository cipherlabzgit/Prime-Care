interface ReviewSubmissionSuccessProps {
  onSubmitAnother?: () => void;
}

function ReviewSubmissionSuccess({ onSubmitAnother }: ReviewSubmissionSuccessProps) {
  return (
    <div className="review-success" role="status" aria-live="polite">
      <div className="review-success__icon" aria-hidden="true">
        ✓
      </div>
      <h3 className="review-success__title">Thank You for Your Feedback!</h3>
      <p className="review-success__message">
        Your review has been received and is now pending approval. Once verified by
        our team, it will appear on the About page for other patients to read.
      </p>
      <div className="review-success__notice">
        <strong>Pending approval</strong>
        <p>
          We review all submissions to ensure they come from verified patients and
          meet our community guidelines. This usually takes 1–2 business days.
        </p>
      </div>
      {onSubmitAnother ? (
        <button
          type="button"
          className="review-success__btn"
          onClick={onSubmitAnother}
        >
          Submit Another Review
        </button>
      ) : null}
    </div>
  );
}

export default ReviewSubmissionSuccess;
