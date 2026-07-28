import { useState } from "react";
import { getInitials } from "../../utils/channelingUtils";
import { resolveDoctorPhotoUrl } from "../../utils/doctorDisplayUtils";

type DoctorAvatarSize = "sm" | "md" | "lg";

interface DoctorAvatarProps {
  name: string;
  photo?: string | null;
  size?: DoctorAvatarSize;
  className?: string;
  showStatusDot?: boolean;
  statusDotClass?: string;
}

const sizeClasses: Record<DoctorAvatarSize, string> = {
  sm: "h-12 w-12 rounded-2xl text-sm",
  md: "h-16 w-16 rounded-2xl text-lg",
  lg: "h-20 w-20 rounded-3xl text-xl",
};

function DoctorAvatar({
  name,
  photo,
  size = "sm",
  className = "",
  showStatusDot = false,
  statusDotClass = "",
}: DoctorAvatarProps) {
  const [imgError, setImgError] = useState(false);
  const photoUrl = resolveDoctorPhotoUrl(photo);
  const showImage = Boolean(photoUrl) && !imgError;

  return (
    <div className={`relative shrink-0 ${className}`}>
      {showImage ? (
        <img
          src={photoUrl}
          alt=""
          className={`${sizeClasses[size]} object-cover shadow-md shadow-brand-500/25 ring-2 ring-white transition-transform duration-250 group-hover:scale-[1.03]`}
          loading="lazy"
          decoding="async"
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className={`flex items-center justify-center bg-gradient-to-br from-brand-500 to-brand-700 font-bold text-white shadow-md shadow-brand-500/30 transition-transform duration-250 group-hover:scale-[1.03] ${sizeClasses[size]}`}
          aria-hidden="true"
        >
          {getInitials(name)}
        </div>
      )}
      {showStatusDot && statusDotClass ? (
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${statusDotClass}`}
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
}

export default DoctorAvatar;
