function HealthcareIllustration() {
  return (
    <svg
      viewBox="0 0 400 320"
      className="h-full w-full max-w-md opacity-90"
      aria-hidden="true"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="200" cy="160" r="120" fill="rgba(255,255,255,0.08)" />
      <circle cx="200" cy="160" r="80" fill="rgba(255,255,255,0.06)" />
      <rect
        x="155"
        y="100"
        width="90"
        height="120"
        rx="12"
        fill="rgba(255,255,255,0.15)"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="2"
      />
      <rect x="185" y="130" width="30" height="60" rx="4" fill="rgba(255,200,94,0.85)" />
      <rect x="170" y="145" width="60" height="30" rx="4" fill="rgba(255,200,94,0.85)" />
      <circle cx="120" cy="200" r="28" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
      <circle cx="280" cy="120" r="22" fill="rgba(255,200,94,0.2)" stroke="rgba(255,200,94,0.4)" strokeWidth="1.5" />
      <path
        d="M80 240 Q120 220 160 240 T240 240 T320 240"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="320" cy="200" r="18" fill="rgba(255,255,255,0.1)" />
      <path
        d="M320 192v16M312 200h16"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const trustItems = [
  { value: "50+", label: "Specialist Doctors" },
  { value: "10+", label: "Medical Centers" },
  { value: "24/7", label: "Online Booking" },
] as const;

function ChannelingHero() {
  return (
    <header className="channeling-hero relative overflow-hidden">
      <div className="channeling-hero__pattern pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="channeling-hero__overlay pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-8">
        <div className="channeling-hero__content max-w-2xl animate-fade-in-up">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white/95 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-500" aria-hidden="true" />
            Online Channeling
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.65rem] lg:leading-tight">
            Book Your Appointment
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/85 sm:text-base">
            Search live hospital sessions, choose your preferred time slot, and
            complete your booking in minutes — trusted by thousands of patients.
          </p>

          <ul className="mt-6 flex flex-wrap gap-3 sm:gap-4" aria-label="Trust indicators">
            {trustItems.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-3.5 py-2 backdrop-blur-md transition hover:bg-white/15"
              >
                <span className="text-base font-bold text-accent-500">{item.value}</span>
                <span className="text-xs font-medium text-white/90">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="channeling-hero__visual hidden shrink-0 animate-fade-in-up lg:block lg:w-[340px]"
          style={{ animationDelay: "120ms" }}
          aria-hidden="true"
        >
          <HealthcareIllustration />
        </div>
      </div>
    </header>
  );
}

export default ChannelingHero;
