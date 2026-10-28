interface ContactSectionHeaderProps {
  id?: string;
  eyebrow: string;
  titleLead: string;
  titleAccent?: string;
  description?: string;
  align?: "center" | "left";
  compact?: boolean;
}

function ContactSectionHeader({
  id,
  eyebrow,
  titleLead,
  titleAccent,
  description,
  align = "center",
  compact = false,
}: ContactSectionHeaderProps) {
  const titleClass = [
    "home-big-title",
    align === "left" ? "home-big-title--left" : "",
    compact ? "home-big-title--compact" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header
      id={id}
      className={`section-header section-header--${align} contact-section__header`}
    >
      <span className="section-header__eyebrow">{eyebrow}</span>
      <h2 className={titleClass}>
        <span>{titleLead}</span>
        {titleAccent ? <span>{titleAccent}</span> : null}
      </h2>
      {description ? (
        <p className="section-header__desc">{description}</p>
      ) : null}
    </header>
  );
}

export default ContactSectionHeader;
