import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DocumentModal from "../components/DocumentModal";
import DocumentPickerModal from "../components/DocumentPickerModal";
import { API_URL } from "../api";
import { useAuth, authHeaders } from "../authContext";
import { STATUS_LEGEND } from "../statusLegend";
import {
  BOX_WIDTH,
  BOX_HEIGHT,
  SHARED_BOXES,
  BUILDING_BOX_TEMPLATE,
  discoverBuildings,
  buildDashboardGraph,
} from "../config/dashboardConfig";

const DEFAULT_COLOR = "9E9D9B"; // "brak" - no matching document found

// True if `name` starts with `suffix` AND the next character (if any) isn't
// a letter/digit - so "Geodezja (Robocza)" and "Geodezja - X" both count as
// matching "Geodezja", but "GeodezjaAnnex" does not.
const WORD_CHAR = /[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/;
function isPrefixMatch(name, suffix) {
  if (!name.startsWith(suffix)) return false;
  const nextChar = name.charAt(suffix.length);
  return nextChar === "" || !WORD_CHAR.test(nextChar);
}

// When several documents match one box, this decides which status "wins"
// for the box's fill color - most-needs-attention first, so a single
// problem document isn't hidden behind others that are further along.
const STATUS_PRIORITY = [
  "wymaga zmian",
  "w trakcie przygotowania",
  "brak",
  "przygotowany",
  "zatwierdzony",
  "nie dotyczy",
];

function pickRepresentative(matches) {
  if (matches.length === 0) return null;

  return matches.reduce((best, doc) => {
    const bestRank = STATUS_PRIORITY.indexOf(best.status);
    const rank = STATUS_PRIORITY.indexOf(doc.status);
    return rank !== -1 && (bestRank === -1 || rank < bestRank) ? doc : best;
  }, matches[0]);
}

function wrapLabel(label) {
  // Guards against a config entry with a missing suffix/label (e.g. a
  // BUILDING_BOX_TEMPLATE item that used `label:` instead of `suffix:`) -
  // shows a visible placeholder on that one box instead of throwing and
  // blanking the entire dashboard.
  if (!label) return ["(brak nazwy)"];

  const words = label.split(" ");
  const lines = [];
  let current = "";

  words.forEach((word) => {
    const test = current ? `${current} ${word}` : word;
    if (test.length > 14 && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  });

  if (current) lines.push(current);
  return lines.slice(0, 4);
}

export default function DashboardPage() {
  const { projectId } = useParams();
  const { token } = useAuth();
  const [docs, setDocs] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [pickerDocs, setPickerDocs] = useState(null);

  const loadDocs = () => {
    fetch(`${API_URL}/projects/${projectId}/documents`)
      .then((res) => res.json())
      .then(setDocs)
      .catch(console.error);
  };

  const loadMarkers = () => {
    fetch(`${API_URL}/projects/${projectId}/not-applicable-markers`)
      .then((res) => res.json())
      .then(setMarkers)
      .catch(console.error);
  };

  useEffect(() => {
    fetch(`${API_URL}/statuses`)
      .then((res) => res.json())
      .then(setStatuses)
      .catch(console.error);
  }, []);

  // Derived live from the DB's `status` table, not hardcoded - so if the
  // color is ever changed there (as with the legend), markers stay in sync
  // automatically instead of drifting out of sync like the old hardcoded
  // value did.
  const notApplicableColor =
    statuses.find((s) => s.name === "nie dotyczy")?.color || "9E9D9B";

  const loadAll = () => {
    loadDocs();
    loadMarkers();
  };

  useEffect(loadAll, [projectId]);

  // Quick lookup: is this (folder, stage name) marked "nie dotyczy"?
  const markerSet = useMemo(() => {
    const set = new Set();
    markers.forEach((m) => set.add(`${m.folder || ""}::${m.stage_name}`));
    return set;
  }, [markers]);

  const isMarkedNotApplicable = (box) => {
    const stageName = box.suffix || box.label;
    return markerSet.has(`${box.building || ""}::${stageName}`);
  };

  // Assigns every document to the SHARED_BOXES entry whose label is the
  // LONGEST matching prefix of its name - same idea as docsByBoxId below,
  // but for boxes that aren't scoped to a building/folder (e.g.
  // "Plan Zagospodarowania Terenu" and "Plan Zagospodarowania Terenu
  // Konserwator" both resolve to the same box instead of the second one
  // being invisible).
  const docsBySharedBoxId = useMemo(() => {
    const map = {};

    docs.forEach((doc) => {
      let best = null;
      SHARED_BOXES.forEach((box) => {
        if (
          isPrefixMatch(doc.name, box.label) &&
          (!best || box.label.length > best.label.length)
        ) {
          best = box;
        }
      });

      if (!best) return;

      (map[best.id] ||= []).push(doc);
    });

    return map;
  }, [docs]);

  // Buildings are discovered from folder names present in the project's
  // documents (see discoverBuildings() in dashboardConfig.js) - the graph
  // is generated to fit exactly that many, growing or shrinking with data.
  const buildings = useMemo(() => discoverBuildings(docs), [docs]);

  const { boxes, edges } = useMemo(
    () => buildDashboardGraph(buildings),
    [buildings]
  );

  const boxesById = useMemo(() => {
    const map = {};
    boxes.forEach((box) => {
      map[box.id] = box;
    });
    return map;
  }, [boxes]);

  // Assigns every document (within a building's folder) to the box whose
  // stage suffix is the LONGEST matching prefix of its name - so
  // "PT wentylacji po sprawdzeniu ..." goes to that box specifically,
  // rather than also matching the shorter "PT wentylacji" box. Computed
  // once for the whole project rather than independently per box.
  const docsByBoxId = useMemo(() => {
    const map = {};

    docs.forEach((doc) => {
      if (!doc.folder) return;

      let best = null;
      BUILDING_BOX_TEMPLATE.forEach((template) => {
        if (
          isPrefixMatch(doc.name, template.suffix) &&
          (!best || template.suffix.length > best.suffix.length)
        ) {
          best = template;
        }
      });

      if (!best) return;

      const boxId = `${best.id}::${doc.folder}`;
      (map[boxId] ||= []).push(doc);
    });

    return map;
  }, [docs]);

  // For a per-building box, use the building assignment above; for a
  // shared box, use the shared assignment above.
  const matchesFor = (box) => {
    if (box.isAnchor) return [];
    if (box.building) return docsByBoxId[box.id] || [];
    return docsBySharedBoxId[box.id] || [];
  };

  const handleBoxClick = (matches) => {
    if (matches.length === 1) {
      setSelectedId(matches[0].id);
    } else {
      setPickerDocs(matches);
    }
  };

  // Marks an otherwise-empty ("brak") box as "nie dotyczy" - no documents
  // row is created, just a lightweight marker (see backend/main.py). Sync
  // will auto-clear this the moment a real matching file gets scanned.
  const handleMarkNotApplicable = (box) => {
    const stageName = box.suffix || box.label;

    if (!window.confirm(`Oznaczyć "${stageName}" jako "nie dotyczy"?`)) return;

    fetch(`${API_URL}/projects/${projectId}/not-applicable-markers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(token),
      },
      body: JSON.stringify({
        stage_name: stageName,
        folder: box.building || null,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => loadMarkers())
      .catch(() =>
        alert('Nie udało się oznaczyć jako "nie dotyczy". Czy jesteś zalogowany?')
      );
  };

  // Undoes a "nie dotyczy" marking. This is the ONLY interaction available
  // on a marked box - there's no real document behind it, so there's
  // nothing to open a status-editing modal for.
  const handleUnmarkNotApplicable = (box) => {
    const stageName = box.suffix || box.label;

    if (!window.confirm(`Cofnąć oznaczenie "nie dotyczy" dla "${stageName}"?`)) return;

    fetch(`${API_URL}/projects/${projectId}/not-applicable-markers`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(token),
      },
      body: JSON.stringify({
        stage_name: stageName,
        folder: box.building || null,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => loadMarkers())
      .catch(() => alert("Nie udało się cofnąć oznaczenia."));
  };

  const canvasWidth =
    (boxes.length ? Math.max(...boxes.map((b) => b.x)) : 0) + BOX_WIDTH + 40;
  const canvasHeight =
    (boxes.length ? Math.max(...boxes.map((b) => b.y)) : 0) + BOX_HEIGHT + 40;

  return (
    <div className="page dashboard-page">
      <div className="breadcrumb">
        <Link to="/">Projekty</Link> / {projectId}
      </div>

      <div className="page-header">
        <h1>{projectId} - Dashboard</h1>

        <div className="view-tabs">
          <Link to={`/projects/${projectId}/folders`} className="view-tab">
            Widok folderów
          </Link>
          <span className="view-tab view-tab-active">Dashboard</span>
        </div>
      </div>

      {buildings.length === 0 && (
        <p className="dashboard-hint">
          Nie wykryto jeszcze żadnego budynku - pojawi się tu, gdy w projekcie
          znajdzie się folder z dokumentami, np. "Projekt 1\Budynek A\...".
        </p>
      )}

      <div className="dashboard-scroll">
        <svg
          className="dashboard-svg"
          viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
          width={canvasWidth}
          height={canvasHeight}
        >
          {edges.map(([fromId, toId]) => {
            const from = boxesById[fromId];
            const to = boxesById[toId];
            if (!from || !to) return null;

            return (
              <line
                key={`${fromId}-${toId}`}
                x1={from.x + BOX_WIDTH}
                y1={from.y + BOX_HEIGHT / 2}
                x2={to.x}
                y2={to.y + BOX_HEIGHT / 2}
                stroke="#9ca3af"
                strokeWidth="1.5"
              />
            );
          })}

          {boxes.map((box) => {
            const matches = matchesFor(box);
            const markedNA = !box.isAnchor && matches.length === 0 && isMarkedNotApplicable(box);
            const representative = pickRepresentative(matches);
            const color = markedNA
              ? notApplicableColor
              : representative
              ? representative.color
              : DEFAULT_COLOR;
            const lines = wrapLabel(box.label);
            const clickable = matches.length > 0 || markedNA;

            const handleClick = markedNA
              ? () => handleUnmarkNotApplicable(box)
              : matches.length > 0
              ? () => handleBoxClick(matches)
              : undefined;

            return (
              <g
                key={box.id}
                transform={`translate(${box.x}, ${box.y})`}
                onClick={handleClick}
                className={
                  box.isAnchor
                    ? "dashboard-box anchor"
                    : clickable
                    ? "dashboard-box clickable"
                    : "dashboard-box"
                }
              >
                <rect
                  width={BOX_WIDTH}
                  height={BOX_HEIGHT}
                  rx="8"
                  fill={box.isAnchor ? "#ffffff" : `#${color}`}
                  stroke="#1f2430"
                  strokeWidth={box.isAnchor ? "2" : "1"}
                  strokeOpacity={box.isAnchor ? "0.6" : "0.15"}
                />
                {!box.isAnchor && matches.length > 1 && (
                  <circle
                    cx={BOX_WIDTH - 10}
                    cy={10}
                    r="9"
                    fill="#1f2430"
                  />
                )}
                {!box.isAnchor && matches.length > 1 && (
                  <text
                    x={BOX_WIDTH - 10}
                    y={13}
                    textAnchor="middle"
                    className="dashboard-box-count"
                  >
                    {matches.length}
                  </text>
                )}
                {!box.isAnchor && matches.length === 0 && !markedNA && (
                  <g
                    className="dashboard-box-na"
                    transform="translate(6, 6)"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkNotApplicable(box);
                    }}
                  >
                    <title>Oznacz jako "nie dotyczy"</title>
                    <rect
                      width="16"
                      height="16"
                      rx="3"
                      fill="#ffffff"
                      stroke="#1f2430"
                      strokeWidth="1.5"
                    />
                  </g>
                )}
                <text
                  x={BOX_WIDTH / 2}
                  y={BOX_HEIGHT / 2 - ((lines.length - 1) * 12) / 2 + 4}
                  textAnchor="middle"
                  className={
                    box.isAnchor
                      ? "dashboard-box-label anchor-label"
                      : "dashboard-box-label"
                  }
                >
                  {lines.map((line, i) => (
                    <tspan key={i} x={BOX_WIDTH / 2} dy={i === 0 ? 0 : 12}>
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="legend">
        {STATUS_LEGEND.map((item) => (
          <span key={item.status} className="legend-item">
            <span
              className="legend-dot"
              style={{ backgroundColor: `#${item.color}` }}
            />
            {item.status}
          </span>
        ))}
      </div>

      <DocumentPickerModal
        docs={pickerDocs}
        onClose={() => setPickerDocs(null)}
        onSelect={(id) => {
          setPickerDocs(null);
          setSelectedId(id);
        }}
      />

      <DocumentModal
        documentId={selectedId}
        onClose={() => setSelectedId(null)}
        onSaved={loadAll}
      />
    </div>
  );
}