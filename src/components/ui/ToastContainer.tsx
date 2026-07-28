import type { ToastItem } from "../../context/ToastContext";
import "../../styles/toast.css";

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}

function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-region" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast--${toast.variant}`}
          role={toast.variant === "error" ? "alert" : "status"}
        >
          <span className="toast__icon" aria-hidden="true">
            {toast.variant === "success" ? "✓" : toast.variant === "error" ? "!" : "i"}
          </span>
          <p className="toast__message">{toast.message}</p>
          <button
            type="button"
            className="toast__close"
            aria-label="Dismiss notification"
            onClick={() => onDismiss(toast.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
