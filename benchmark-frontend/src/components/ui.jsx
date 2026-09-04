/**
 * Shared bits of chrome: the palette, the page frame, and the two small
 * displays the dashboard is built from (a difficulty bar and a stats table).
 *
 * Everything the dashboard shows comes from the labelled data, so there is
 * deliberately nothing here for row counts or coverage.
 */

export const C = {
  bg: "#EBF2FB",
  card: "#FFFFFF",
  border: "#B5D4F4",
  accent: "#378ADD",
  dark: "#042C53",
  mid: "#185FA5",
  chip: "#E6F1FB",
  easy: "#2E9E6B",
  medium: "#C98A20",
  hard: "#A32D2D",
  muted: "#7DA6D0",
};

export const LEVELS = ["Easy", "Medium", "Hard"];
export const levelColor = { Easy: C.easy, Medium: C.medium, Hard: C.hard };

export function Card({ children, className = "", style = {} }) {
  return (
    <div
      className={`bg-white rounded-2xl ${className}`}
      style={{ border: `0.5px solid ${C.border}`, ...style }}
    >
      {children}
    </div>
  );
}

export function Chip({ children, tone = "default" }) {
  const tones = {
    default: { background: C.chip, color: C.mid },
    ok: { background: "#E7F4EE", color: "#1F7A52" },
    warn: { background: "#FCF3E3", color: "#8A5D0F" },
  };
  return (
    <span
      className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full whitespace-nowrap"
      style={tones[tone] || tones.default}
    >
      {children}
    </span>
  );
}

/** Proportional Easy/Medium/Hard bar. Renders nothing when there is no data. */
export function DifficultyBar({ counts, height = 8 }) {
  const total = LEVELS.reduce((a, l) => a + (counts?.[l] || 0), 0);
  if (!total) {
    return (
      <div className="rounded-full w-full" style={{ height, background: C.chip }} />
    );
  }
  return (
    <div className="flex rounded-full overflow-hidden w-full" style={{ height }}>
      {LEVELS.map((l) => {
        const pct = ((counts[l] || 0) / total) * 100;
        if (!pct) return null;
        return (
          <div
            key={l}
            style={{ width: `${pct}%`, background: levelColor[l] }}
            title={`${l}: ${counts[l]} (${pct.toFixed(0)}%)`}
          />
        );
      })}
    </div>
  );
}

/** task_type -> Easy / Medium / Hard. The only statistic in the dashboard. */
export function StatsTable({ stats, dense = false }) {
  const tasks = Object.keys(stats || {}).sort();
  if (!tasks.length) {
    return (
      <p className="text-sm" style={{ color: C.muted }}>
        No labelled data yet.
      </p>
    );
  }
  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const s = stats[task];
        const total = LEVELS.reduce((a, l) => a + (s[l] || 0), 0);
        return (
          <div key={task}>
            <div className="flex items-baseline justify-between mb-1.5 gap-3">
              <span
                className={`font-medium ${dense ? "text-xs" : "text-sm"}`}
                style={{ color: C.dark }}
              >
                {task}
              </span>
              <span className="text-xs tabular-nums" style={{ color: C.muted }}>
                {total.toLocaleString()}
              </span>
            </div>
            <DifficultyBar counts={s} height={dense ? 6 : 10} />
            {!dense && (
              <div className="flex gap-4 mt-1.5">
                {LEVELS.map((l) => (
                  <span key={l} className="text-xs tabular-nums" style={{ color: C.mid }}>
                    <span
                      className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle"
                      style={{ background: levelColor[l] }}
                    />
                    {l} {(s[l] || 0).toLocaleString()}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Page({ children }) {
  return (
    <div className="min-h-screen" style={{ background: C.bg }}>
      <div className="max-w-5xl mx-auto px-6 py-8">{children}</div>
    </div>
  );
}

export function GithubLink({ href, children }) {
  if (!href) {
    return (
      <span className="text-xs" style={{ color: C.muted }}>
        no link
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-xs hover:underline"
      style={{ color: C.accent }}
    >
      {children || "GitHub"}
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M7 17L17 7M17 7H8M17 7v9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

export function Spinner({ label = "Loading" }) {
  return (
    <div className="flex items-center gap-2 text-sm py-16 justify-center" style={{ color: C.mid }}>
      <span
        className="inline-block w-3.5 h-3.5 rounded-full animate-spin"
        style={{ border: `2px solid ${C.border}`, borderTopColor: C.accent }}
      />
      {label}…
    </div>
  );
}

export function ErrorBox({ children }) {
  return (
    <div
      className="text-sm px-3 py-2 rounded-lg"
      style={{ background: "#FCEBEB", border: "0.5px solid #F7C1C1", color: "#A32D2D" }}
    >
      {children}
    </div>
  );
}
