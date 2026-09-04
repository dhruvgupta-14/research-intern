import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCategory, getCategoryInfo } from "../api/client";
import Markdown from "../components/Markdown";
import {
  C, Card, Chip, StatsTable, Page, Spinner, ErrorBox, GithubLink,
} from "../components/ui";

const SECTION_LABELS = {
  original: "Original Datasets",
  labelled: "Difficulty Labelled Data",
  scripts: "Scripts",
};

function FileRow({ file, showStats }) {
  const tasks = Object.keys(file.stats || {});
  return (
    <div
      className="flex items-center justify-between gap-3 py-2"
      style={{ borderTop: `0.5px solid ${C.border}` }}
    >
      <div className="min-w-0">
        <div className="text-sm truncate" style={{ color: C.dark }}>
          {file.name}
        </div>
        {showStats && tasks.length > 0 && (
          <div className="text-xs mt-0.5" style={{ color: C.mid }}>
            {tasks.map((t) => {
              const s = file.stats[t];
              return `${t}: ${s.Easy} / ${s.Medium} / ${s.Hard}`;
            }).join("   ·   ")}
          </div>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs tabular-nums" style={{ color: C.muted }}>
          {file.sizeKB.toLocaleString()} kB
        </span>
        <GithubLink href={file.url} />
      </div>
    </div>
  );
}

function Section({ id, section }) {
  const files = section.files || [];
  return (
    <Card className="p-4 mb-3">
      <div className="flex items-baseline justify-between mb-1">
        <h3 className="text-sm font-medium" style={{ color: C.dark }}>
          {SECTION_LABELS[id]}
        </h3>
        <span className="text-xs" style={{ color: C.muted }}>
          {files.length} file{files.length === 1 ? "" : "s"}
        </span>
      </div>
      {section.folder === null ? (
        <p className="text-xs pt-1" style={{ color: "#8A5D0F" }}>
          Folder not found in this category.
        </p>
      ) : files.length === 0 ? (
        <p className="text-xs pt-1" style={{ color: C.muted }}>
          Empty.
        </p>
      ) : (
        files.map((f) => (
          <FileRow key={f.path} file={f} showStats={id === "labelled"} />
        ))
      )}
    </Card>
  );
}

export default function Category() {
  const { slug } = useParams();
  const [cat, setCat] = useState(null);
  const [info, setInfo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setCat(null);
    setInfo(null);
    setError("");
    getCategory(slug)
      .then((r) => setCat(r.data))
      .catch((e) =>
        setError(e.response?.status === 404 ? "Unknown category." : "Could not load category.")
      );
    // a missing info.md is normal, not an error
    getCategoryInfo(slug).then((r) => setInfo(r.data)).catch(() => setInfo(null));
  }, [slug]);

  if (error) return <Page><ErrorBox>{error}</ErrorBox></Page>;
  if (!cat) return <Page><Spinner /></Page>;

  return (
    <Page>
      <Link to="/" className="text-xs hover:underline" style={{ color: C.accent }}>
        ← All categories
      </Link>

      <div className="flex items-start justify-between gap-4 mt-3 mb-5">
        <div>
          <h1 className="text-xl font-medium" style={{ color: C.dark }}>
            {cat.short}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: C.mid }}>
            {cat.name}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Chip tone={cat.status === "labelled" ? "ok" : "warn"}>{cat.status}</Chip>
          <GithubLink href={cat.links.folder}>Open folder</GithubLink>
        </div>
      </div>

      <Card className="p-5 mb-4">
        <h2 className="text-sm font-medium mb-3" style={{ color: C.dark }}>
          Difficulty by task type
        </h2>
        <StatsTable stats={cat.stats} />
      </Card>

      {["original", "labelled", "scripts"].map((id) => (
        <Section key={id} id={id} section={cat.sections[id]} />
      ))}

      <Card className="p-5 mt-4">
        <div className="flex items-baseline justify-between mb-2">
          <h2 className="text-sm font-medium" style={{ color: C.dark }}>
            info.md
          </h2>
          {cat.links.info && <GithubLink href={cat.links.info}>Edit on GitHub</GithubLink>}
        </div>
        {info ? (
          <Markdown text={info.markdown} />
        ) : (
          <p className="text-sm" style={{ color: C.muted }}>
            No info.md for this category yet.
          </p>
        )}
      </Card>

      {cat.warnings?.length > 0 && (
        <details className="mt-4">
          <summary className="text-sm cursor-pointer" style={{ color: C.mid }}>
            {cat.warnings.length} scan warning{cat.warnings.length === 1 ? "" : "s"}
          </summary>
          <Card className="p-4 mt-2">
            <ul className="space-y-1">
              {cat.warnings.map((w, i) => (
                <li key={i} className="text-xs" style={{ color: C.mid }}>
                  {w.file ? `${w.file} — ` : ""}{w.message}
                </li>
              ))}
            </ul>
          </Card>
        </details>
      )}
    </Page>
  );
}
