import type { ReviewSortOption } from "../../types/review";

interface ReviewSortControlsProps {
  value: ReviewSortOption;
  onChange: (value: ReviewSortOption) => void;
}

const SORT_OPTIONS: { value: ReviewSortOption; label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "highest", label: "Highest Rated" },
  { value: "lowest", label: "Lowest Rated" },
];

function ReviewSortControls({ value, onChange }: ReviewSortControlsProps) {
  return (
    <div className="review-sort">
      <label className="review-sort__label" htmlFor="review-sort-select">
        Sort by
      </label>
      <select
        id="review-sort-select"
        className="review-sort__select"
        value={value}
        onChange={(event) => onChange(event.target.value as ReviewSortOption)}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ReviewSortControls;
