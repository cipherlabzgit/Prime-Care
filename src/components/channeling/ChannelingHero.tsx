function ChannelingHero() {
  return (
    <header className="channeling-hero relative overflow-hidden">
      <div className="channeling-hero__pattern pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="channeling-hero__overlay pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-[200px] max-w-7xl flex-col justify-center px-4 py-10 sm:min-h-[220px] sm:px-6 sm:py-12 lg:min-h-[240px] lg:px-8 lg:py-14">
        <div className="channeling-hero__content max-w-2xl animate-fade-in-up">
          <h1 className="m-0 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
            Channel Your Doctor
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/90 sm:text-base">
            Search live clinic sessions and book your appointment online with
            PremierCare.
          </p>
        </div>
      </div>
    </header>
  );
}

export default ChannelingHero;
