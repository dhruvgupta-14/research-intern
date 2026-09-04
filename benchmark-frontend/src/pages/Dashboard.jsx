import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getStats, refreshCatalogue } from "../api/client";
import {
  C, Card, Chip, DifficultyBar, StatsTable, Page, Spinner, ErrorBox, LEVELS, levelColor,
} from "../components/ui";

export default function Dashboard() {
  const { logout } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      setError("");
      const res = await getStats();
      setData(res.data);
    } catch {
      setError("Could not reach the API. Is the backend running?");
    }
  }

  useEffect(() => { load(); }, []);

  async function handleRefresh() {
    setBusy(true);
    try {
      await refreshCatalogue();
      await load();
    } catch {
      setError("Refresh failed.");
    } finally {
      setBusy(false);
    }
  }

  if (error) return <Page><ErrorBox>{error}</ErrorBox></Page>;
  if (!data) return <Page><Spinner /></Page>;

  const { totals, categories, warnings, repo } = data;

  return (
    <Page>
      {/* header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-medium" style={{ color: C.dark }}>
            Benchmark Dataset Dashboard
          </h1>
          <p className="text-sm mt-0.5" style={{ color: C.mid }}>
            Indian context AI Benchmark ·{" "}
            {repo?.configured ? (
              <a
                href={`https://github.com/${repo.owner}/${repo.name}`}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
                style={{ color: C.accent }}
              >
                {repo.owner}/{repo.name}
              </a>
            ) : (
              <span style={{ color: C.muted }}>GitHub repo not configured</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRefresh}
            disabled={busy}
            className="text-xs px-3 py-1.5 rounded-lg disabled:opacity-50"
            style={{ background: C.chip, color: C.mid, border: `0.5px solid ${C.border}` }}
          >
            {busy ? "Rescanning…" : "Rescan"}
          </button>
          <button
            onClick={logout}
            className="text-xs px-3 py-1.5 rounded-lg"
            style={{ color: C.mid, border: `0.5px solid ${C.border}` }}
          >
            Sign out
          </button>
        </div>
      </div>

      {/* overall */}
      <Card className="p-5 mb-4">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-sm font-medium" style={{ color: C.dark }}>
            Difficulty by task type
          </h2>
          <span className="text-xs" style={{ color: C.muted }}>
            {totals.overall.total.toLocaleString()} labelled rows across{" "}
            {totals.labelledFiles} files
          </span>
        </div>

        <div className="flex gap-5 mb-4">
          {LEVELS.map((l) => (
            <div key={l}>
              <div className="text-lg font-medium tabular-nums" style={{ color: levelColor[l] }}>
                {totals.overall[l].toLocaleString()}
              </div>
              <div className="text-xs" style={{ color: C.muted }}>{l}</div>
            </div>
          ))}
        </div>

        <StatsTable stats={totals.stats} />
      </Card>

      {/* categories */}
      <h2 className="text-sm font-medium mb-2 mt-6" style={{ color: C.dark }}>
        Categories
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {categories.map((c) => (
          <Link key={c.slug} to={`/c/${c.slug}`}>
            <Card className="p-4 h-full transition hover:shadow-sm">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="font-medium text-sm" style={{ color: C.dark }}>
                    {c.short}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: C.muted }}>
                    {c.name}
                  </div>
                </div>
                <Chip tone={c.status === "labelled" ? "ok" : "warn"}>
                  {c.status === "labelled" ? "labelled" : "pending"}
                </Chip>
              </div>

              <DifficultyBar counts={c.overall} />

              <div className="flex items-center gap-3 mt-2.5 text-xs" style={{ color: C.mid }}>
                <span className="tabular-nums">
                  {c.overall.total.toLocaleString()} rows
                </span>
                <span style={{ color: C.border }}>|</span>
                <span>{c.files.original} original</span>
                <span>{c.files.labelled} labelled</span>
                <span>{c.files.scripts} scripts</span>
                {!c.hasInfo && (
                  <>
                    <span style={{ color: C.border }}>|</span>
                    <span style={{ color: "#8A5D0F" }}>no info.md</span>
                  </>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* warnings */}
      {warnings.length > 0 && (
        <details className="mt-6">
          <summary className="text-sm cursor-pointer" style={{ color: C.mid }}>
            {warnings.length} scan warning{warnings.length === 1 ? "" : "s"}
          </summary>
          <Card className="p-4 mt-2">
            <ul className="space-y-1">
              {warnings.map((w, i) => (
                <li key={i} className="text-xs" style={{ color: C.mid }}>
                  <span style={{ color: C.dark }}>{w.category}</span>
                  {w.file ? ` · ${w.file}` : ""} — {w.message}
                </li>
              ))}
            </ul>
          </Card>
        </details>
      )}

      <p className="text-xs mt-6" style={{ color: C.muted }}>
        Statistics come only from Difficulty Labelled Data. Scanned{" "}
        {new Date(data.generatedAt).toLocaleString()}.
      </p>
    </Page>
  );
}
