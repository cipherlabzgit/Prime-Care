interface StarRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
  id?: string;
}

function StarRatingInput({
  value,
  onChange,
  disabled = false,
  id = "review-rating",
}: StarRatingInputProps) {
  return (
    <div className="star-rating-input" role="group" aria-labelledby={`${id}-label`}>
      <span id={`${id}-label`} className="sr-only">
        Rating
      </span>
      <div className="star-rating-input__stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star-rating-input__star${
              star <= value ? " star-rating-input__star--active" : ""
            }`}
            onClick={() => onChange(star)}
            disabled={disabled}
            aria-label={`${star} star${star === 1 ? "" : "s"}`}
            aria-pressed={star <= value}
          >
            ★
          </button>
        ))}
      </div>
      <span className="star-rating-input__value" aria-live="polite">
        {value > 0 ? `${value} / 5` : "Select rating"}
      </span>
    </div>
  );
}

export default StarRatingInput;
