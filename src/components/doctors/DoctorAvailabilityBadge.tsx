import type { DoctorAvailabilityStatus } from "../../utils/doctorAvailability";

interface DoctorAvailabilityBadgeProps {
  status: DoctorAvailabilityStatus;
  label: string;
  className?: string;
}

const statusClasses: Record<DoctorAvailabilityStatus, string> = {
  available:
    "border-emerald-300/80 bg-emerald-50 text-emerald-900 ring-emerald-200/60",
  unavailable: "border-red-300/80 bg-red-50 text-red-900 ring-red-200/60",
  "no-sessions":
    "border-amber-300/80 bg-amber-50 text-amber-950 ring-amber-200/60",
};

function DoctorAvailabilityBadge({
  status,
  label,
  className = "",
}: DoctorAvailabilityBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ring-1 ring-inset ${statusClasses[status]} ${className}`}
    >
      {label}
    </span>
  );
}

export default DoctorAvailabilityBadge;
