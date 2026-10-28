import {
  formatTime,
  sessionDateKey,
} from "../../utils/channelingUtils";

interface ChannelingBookingStatusBarProps {
  sessionDate: string;
  time: string;
  patientNo?: string | null;
  timerLabel?: string | null;
  centerName?: string | null;
}

export function formatBookingStatusDate(isoDate: string, time: string): string {
  const key = sessionDateKey(isoDate);
  const monthDay = new Date(`${key}T12:00:00`)
    .toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
  const day = new Date(`${key}T12:00:00`)
    .toLocaleDateString("en-US", { weekday: "short" })
    .toUpperCase();
  return `${monthDay} ${day} ${formatTime(time)}`;
}

function ChannelingBookingStatusBar({
  sessionDate,
  time,
  patientNo,
  timerLabel,
  centerName,
}: ChannelingBookingStatusBarProps) {
  return (
    <div className="channeling-booking-status" role="status">
      <div className="channeling-booking-status__when">
        {formatBookingStatusDate(sessionDate, time)}
      </div>
      <div className="channeling-booking-status__meta">
        {patientNo ? <span>PATIENT NO. {patientNo}</span> : null}
        {centerName ? <span>{centerName}</span> : null}
        <span className="channeling-booking-status__available">AVAILABLE</span>
      </div>
      {timerLabel ? (
        <div className="channeling-booking-status__timer">
          <span>COMPLETE WITHIN</span>
          <strong>{timerLabel}</strong>
        </div>
      ) : null}
    </div>
  );
}

export default ChannelingBookingStatusBar;
