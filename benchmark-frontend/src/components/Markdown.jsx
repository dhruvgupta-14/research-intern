/**
 * A small Markdown renderer for the category info.md files.
 *
 * Those files use a known subset - headings, tables, fenced code, numbered
 * lists with indented continuation lines, `code`, **bold** and links - so a
 * ~100 line renderer covers them without pulling in a Markdown dependency and
 * its plugins. Anything unrecognised falls through as a paragraph, which
 * degrades to plain text rather than disappearing.
 */

import { C } from "./ui";

function inline(text, keyPrefix = "i") {
  // split on the three inline constructs, keeping the delimiters
  const parts = String(text).split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return parts.filter(Boolean).map((p, i) => {
    const key = `${keyPrefix}-${i}`;
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <strong key={key} style={{ color: C.dark }}>
          {p.slice(2, -2)}
        </strong>
      );
    }
    if (p.startsWith("`") && p.endsWith("`")) {
      return (
        <code
          key={key}
          className="px-1 py-0.5 rounded text-[0.85em]"
          style={{ background: C.chip, color: C.mid }}
        >
          {p.slice(1, -1)}
        </code>
      );
    }
    const link = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <a
          key={key}
          href={link[2]}
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
          style={{ color: C.accent }}
        >
          {link[1]}
        </a>
      );
    }
    return <span key={key}>{p}</span>;
  });
}

const isDivider = (cells) => cells.every((c) => /^:?-{2,}:?$/.test(c.trim()));
const splitRow = (line) =>
  line.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());

export default function Markdown({ text }) {
  const lines = String(text || "").split("\n");
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { i += 1; continue; }

    // fenced code
    if (line.startsWith("```")) {
      const body = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith("```")) body.push(lines[i++]);
      i += 1;
      blocks.push(
        <pre
          key={`c${i}`}
          className="rounded-lg p-3 my-3 text-xs overflow-x-auto"
          style={{ background: "#F6F9FD", border: `0.5px solid ${C.border}`, color: C.dark }}
        >
          {body.join("\n")}
        </pre>
      );
      continue;
    }

    // heading
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      const size = ["text-xl", "text-lg", "text-base", "text-sm"][level - 1];
      blocks.push(
        <p
          key={`h${i}`}
          className={`${size} font-semibold mt-5 mb-2 first:mt-0`}
          style={{ color: C.dark }}
        >
          {inline(h[2], `h${i}`)}
        </p>
      );
      i += 1;
      continue;
    }

    // table: a header row, a --- divider, then body rows
    if (line.trim().startsWith("|") && lines[i + 1] && isDivider(splitRow(lines[i + 1]))) {
      const head = splitRow(line);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(splitRow(lines[i++]));
      }
      blocks.push(
        <div key={`t${i}`} className="my-3 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {head.map((cell, n) => (
                  <th
                    key={n}
                    className="text-left font-medium py-1.5 px-2"
                    style={{ color: C.mid, borderBottom: `1px solid ${C.border}` }}
                  >
                    {inline(cell, `th${n}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, rn) => (
                <tr key={rn}>
                  {r.map((cell, cn) => (
                    <td
                      key={cn}
                      className="py-1.5 px-2 align-top"
                      style={{ color: C.dark, borderBottom: `0.5px solid ${C.border}` }}
                    >
                      {inline(cell, `td${rn}-${cn}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // numbered item, with its indented continuation lines folded in
    const ol = line.match(/^(\d+)\.\s+(.*)$/);
    if (ol) {
      const body = [ol[2]];
      i += 1;
      while (i < lines.length && /^\s{2,}\S/.test(lines[i])) body.push(lines[i++].trim());
      blocks.push(
        <div key={`o${i}`} className="flex gap-2.5 my-2">
          <span className="text-sm tabular-nums shrink-0" style={{ color: C.accent }}>
            {ol[1]}.
          </span>
          <p className="text-sm leading-relaxed" style={{ color: C.dark }}>
            {inline(body.join(" "), `o${i}`)}
          </p>
        </div>
      );
      continue;
    }

    // paragraph: consume until a blank line or the start of another block
    const para = [line.trim()];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,4}\s|```|\d+\.\s)/.test(lines[i]) &&
      !lines[i].trim().startsWith("|")
    ) {
      para.push(lines[i++].trim());
    }
    blocks.push(
      <p key={`p${i}`} className="text-sm leading-relaxed my-2" style={{ color: C.dark }}>
        {inline(para.join(" "), `p${i}`)}
      </p>
    );
  }

  return <div>{blocks}</div>;
}
