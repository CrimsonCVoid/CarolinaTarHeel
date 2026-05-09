/**
 * Brewery-character decorations layered over the spec preview.
 *
 *   <SpecMarqueeTape />  — continuous "NOW POURING · ALLORA PILSNER..."
 *                          ticker, sits above the rendered template.
 *   <SpecStamp />        — fixed bottom-right SVG stamp, slowly rotates,
 *                          hidden on mobile.
 *
 * Both are server components; all motion is CSS in globals.css under
 * `.spec-southern-peak`. Hub-tier motion budget — continuous loops OK.
 */

const TAP_LIST = [
  'Allora Italian Pilsner',
  'Boxcar Belle Amber',
  'Midnight Conductor Porter',
  'One Mile Wheat',
  'Tropiköl IPA',
  'Peak Haze IPA',
];

const TAGLINES = ['Now pouring', 'Apex, NC', 'Two locations', 'Brewed on Windy Road'];

export function SpecMarqueeTape() {
  // Build one logical content row, then duplicate it inside the track so the
  // CSS marquee can translateX(-50%) for a seamless loop.
  const items: { label: string; accent?: boolean }[] = [];
  for (let i = 0; i < TAP_LIST.length; i++) {
    items.push({ label: TAGLINES[i % TAGLINES.length] ?? 'On tap', accent: true });
    items.push({ label: TAP_LIST[i] ?? '' });
  }

  const row = (
    <>
      {items.map((item, i) => (
        <span key={i} className={`sp-marquee-item${item.accent ? ' sp-marquee-item--accent' : ''}`}>
          {item.label}
          <span className="sp-marquee-dot" aria-hidden />
        </span>
      ))}
    </>
  );

  return (
    <div className="sp-marquee-tape" aria-hidden>
      <div className="sp-marquee-track">
        {row}
        {row}
      </div>
    </div>
  );
}

export function SpecStamp() {
  // Rotating SVG circular stamp. textPath wraps the outer ring; inner pip
  // shows EST. year + city.
  return (
    <svg
      className="sp-stamp"
      viewBox="0 0 132 132"
      role="img"
      aria-label="Southern Peak Brewery — established 2014, Apex, North Carolina"
    >
      <defs>
        <path
          id="sp-stamp-outer-path"
          d="M 66,66 m -54,0 a 54,54 0 1,1 108,0 a 54,54 0 1,1 -108,0"
          fill="none"
        />
      </defs>
      <circle cx="66" cy="66" r="62" />
      <circle cx="66" cy="66" r="48" className="sp-stamp-inner" />
      <text>
        <textPath href="#sp-stamp-outer-path" startOffset="0%">
          Southern Peak Brewery · Apex NC · Two Taprooms · Apex NC ·
        </textPath>
      </text>
      <text x="66" y="60" textAnchor="middle" className="sp-stamp-inner-text">
        EST.
      </text>
      <text x="66" y="76" textAnchor="middle" className="sp-stamp-inner-text" style={{ fontSize: '18px' }}>
        2014
      </text>
    </svg>
  );
}
