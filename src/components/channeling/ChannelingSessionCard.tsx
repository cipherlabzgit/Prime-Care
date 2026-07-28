import type { ReactNode } from "react";
import { useState } from "react";
import type { ChannelingSession } from "../../services/channelingService";
import {
  formatDisplayDate,
  formatFee,
  formatTime,
} from "../../utils/channelingUtils";
import {
  formatExperienceDisplay,
  formatSlotsAvailable,
  getProfileSummaryPreview,
  getQualificationDisplay,
  getSessionDoctorName,
  getSlotAvailabilityTier,
  hasProfileSummary,
} from "../../utils/doctorDisplayUtils";
import { getSessionBadges } from "../../utils/sessionBadges";
import Button from "../ui/Button";
import DoctorAvatar from "../ui/DoctorAvatar";
import ProfileSummaryDialog from "./ProfileSummaryDialog";

interface ChannelingSessionCardProps {
  session: ChannelingSession;
  isActive: boolean;
  onSelect: () => void;
}

const badgeStyles: Record<string, string> = {
  "Available Today": "bg-emerald-50 text-emerald-800 border-emerald-200",
  "Top Rated": "bg-accent-50 text-amber-900 border-accent-300",
  "Most Booked": "bg-brand-50 text-brand-800 border-brand-200",
};

const slotDotClass: Record<string, string> = {
  none: "bg-red-500",
  low: "bg-red-500",
  medium: "bg-amber-500",
  high: "bg-emerald-500",
};

function SlotAvailabilityBadge({ count }: { count: number }) {
  const tier = getSlotAvailabilityTier(count);
  return (
    <span className={`slot-availability-badge slot-availability-badge--${tier}`}>
      {formatSlotsAvailable(count)}
    </span>
  );
}

function DoctorMetaRow({
  icon,
  children,
}: {
  icon: string;
  children: ReactNode;
}) {
  return (
    <p className="flex items-start gap-2 text-sm font-medium leading-snug text-slate-800">
      <span className="mt-0.5 shrink-0 text-base" aria-hidden="true">
        {icon}
      </span>
      <span>{children}</span>
    </p>
  );
}

function ChannelingSessionCard({
  session,
  isActive,
  onSelect,
}: ChannelingSessionCardProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const noSlots = session.availableSlotCount <= 0;
  const badges = getSessionBadges(session);
  const slotTier = getSlotAvailabilityTier(session.availableSlotCount);

  const doctorName = getSessionDoctorName(session);
  const qualification = getQualificationDisplay(session.qualification);
  const experience = formatExperienceDisplay(session.experienceYears);
  const summaryPreview = getProfileSummaryPreview(session.profileSummary);
  const showProfileDialog = hasProfileSummary(session.profileSummary);

  return (
    <>
      <article
        className={`session-card group flex flex-col overflow-hidden rounded-3xl border bg-white shadow-[0_12px_40px_-24px_rgba(2,100,105,0.35)] transition-all duration-250 ease-out focus-within:ring-2 focus-within:ring-brand-500/25 ${
          isActive
            ? "session-card--selected border-brand-500 ring-2 ring-brand-400/40"
            : "border-slate-200/90 hover:shadow-[0_22px_52px_-22px_rgba(2,100,105,0.48)]"
        }`}
      >
        <div className="border-b border-slate-100/80 px-4 pb-4 pt-4 sm:px-5 sm:pt-5">
          <div className="flex gap-3.5">
            <DoctorAvatar
              name={doctorName}
              photo={session.profileImage ?? session.profilePhoto}
              showStatusDot
              statusDotClass={slotDotClass[slotTier]}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-base font-bold leading-snug text-slate-900">
                    {doctorName}
                  </h3>
                  <p className="mt-0.5 text-sm font-semibold text-brand-700">
                    {session.specialization}
                  </p>
                </div>
                {showProfileDialog && (
                  <button
                    type="button"
                    onClick={() => setProfileOpen(true)}
                    className="shrink-0 rounded-lg border border-brand-200 bg-brand-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-700 transition hover:bg-brand-100 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                    aria-label={`View profile summary for ${doctorName}`}
                  >
                    Profile
                  </button>
                )}
              </div>

              <div className="mt-2.5 space-y-1.5">
                {qualification ? (
                  <DoctorMetaRow icon="🎓">{qualification}</DoctorMetaRow>
                ) : null}
                {experience ? (
                  <DoctorMetaRow icon="💼">{experience}</DoctorMetaRow>
                ) : null}
              </div>

              {summaryPreview ? (
                <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-slate-600">
                  {summaryPreview}
                </p>
              ) : null}
            </div>
          </div>

          {badges.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badgeStyles[badge]}`}
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 border-b border-slate-100/80 px-4 py-3.5 sm:px-5">
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Center
            </dt>
            <dd className="mt-0.5 text-sm font-semibold text-slate-800">
              {session.centerName}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Room
            </dt>
            <dd className="mt-0.5 text-sm font-semibold text-slate-800">
              {session.roomCode}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Date
            </dt>
            <dd className="mt-0.5 text-sm font-semibold text-slate-800">
              {formatDisplayDate(session.sessionDate)}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Time
            </dt>
            <dd className="mt-0.5 text-sm font-semibold text-slate-800">
              {formatTime(session.startTime)} – {formatTime(session.endTime)}
            </dd>
          </div>
        </dl>

        <div className="mt-auto bg-gradient-to-br from-slate-50/90 to-white px-4 py-4 sm:px-5">
          <div className="mb-3.5 flex items-center justify-between gap-3">
            <p className="text-xl font-bold text-brand-700">
              {formatFee(session.consultationFee)}
            </p>
            <SlotAvailabilityBadge count={session.availableSlotCount} />
          </div>

          <Button
            fullWidth
            variant={isActive ? "secondary" : "accent"}
            disabled={noSlots}
            onClick={onSelect}
            className="py-2.5 shadow-md transition-all duration-250 hover:shadow-lg"
          >
            {isActive ? "✓ Selected" : "Book Appointment"}
          </Button>
        </div>
      </article>

      {showProfileDialog && session.profileSummary && (
        <ProfileSummaryDialog
          open={profileOpen}
          doctorName={doctorName}
          profilePhoto={session.profilePhoto}
          profileSummary={session.profileSummary}
          slmcNumber={session.slmcNumber}
          onClose={() => setProfileOpen(false)}
        />
      )}
    </>
  );
}

export default ChannelingSessionCard;
