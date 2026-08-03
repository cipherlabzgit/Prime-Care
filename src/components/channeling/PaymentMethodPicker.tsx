import type { ChannelingPaymentMethod } from "../../types/channeling";

interface PaymentMethodPickerProps {
  value: ChannelingPaymentMethod | null;
  onChange: (method: ChannelingPaymentMethod) => void;
  disabled?: boolean;
}

const OPTIONS: {
  value: ChannelingPaymentMethod;
  title: string;
  description: string;
  icon: string;
}[] = [
  {
    value: "Cash",
    title: "Cash at hospital",
    description: "Pay at reception when you arrive for your appointment.",
    icon: "🏥",
  },
  {
    value: "Card",
    title: "Card online",
    description: "Pay securely now with your debit or credit card.",
    icon: "💳",
  },
];

function PaymentMethodPicker({
  value,
  onChange,
  disabled = false,
}: PaymentMethodPickerProps) {
  return (
    <fieldset className="payment-method-picker" disabled={disabled}>
      <legend className="payment-method-picker__legend">Payment method</legend>
      <div className="payment-method-picker__grid" role="radiogroup" aria-label="Payment method">
        {OPTIONS.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              className={`payment-method-picker__option${
                selected ? " payment-method-picker__option--selected" : ""
              }`}
              onClick={() => onChange(option.value)}
            >
              <span className="payment-method-picker__icon" aria-hidden="true">
                {option.icon}
              </span>
              <span className="payment-method-picker__text">
                <span className="payment-method-picker__title">{option.title}</span>
                <span className="payment-method-picker__desc">{option.description}</span>
              </span>
              <span
                className={`payment-method-picker__radio${
                  selected ? " payment-method-picker__radio--selected" : ""
                }`}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default PaymentMethodPicker;
