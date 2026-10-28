interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  titleId?: string;
  description?: string;
  align?: "center" | "left";
}

function SectionHeader({
  eyebrow,
  title,
  titleId,
  description,
  align = "center",
}: SectionHeaderProps) {
  return (
    <header className={`section-header section-header--${align}`}>
      {eyebrow && <span className="section-header__eyebrow">{eyebrow}</span>}
      <h2 id={titleId} className="section-header__title">
        {title}
      </h2>
      {description && <p className="section-header__desc">{description}</p>}
    </header>
  );
}

export default SectionHeader;
