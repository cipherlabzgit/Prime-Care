import { useEffect, useRef } from "react";
import DoctorAvatar from "../ui/DoctorAvatar";

interface ProfileSummaryDialogProps {
  doctorName: string;
  profileSummary: string;
  profilePhoto?: string;
  slmcNumber?: string;
  open: boolean;
  onClose: () => void;
}

function ProfileSummaryDialog({
  doctorName,
  profileSummary,
  profilePhoto,
  slmcNumber,
  open,
  onClose,
}: ProfileSummaryDialogProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-summary-title"
        className="relative w-full max-w-md rounded-3xl border border-white/80 bg-white p-5 shadow-[0_24px_60px_-20px_rgba(2,100,105,0.45)] sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex gap-3">
            <DoctorAvatar name={doctorName} photo={profilePhoto} size="sm" />
            <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
              Doctor Profile
            </p>
            <h2 id="profile-summary-title" className="mt-1 text-lg font-bold text-slate-900">
              {doctorName}
            </h2>
            {slmcNumber ? (
              <p className="mt-1 text-xs text-neutral-500">SLMC: {slmcNumber}</p>
            ) : null}
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            aria-label="Close profile summary"
          >
            ✕
          </button>
        </div>
        <p className="text-sm leading-relaxed text-slate-600">{profileSummary}</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-2xl bg-brand-500 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ProfileSummaryDialog;
