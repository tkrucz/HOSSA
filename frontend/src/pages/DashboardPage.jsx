import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DocumentModal from "../components/DocumentModal";
import { API_URL } from "../api";
import { STATUS_LEGEND } from "../statusLegend";
import { BOXES, EDGES, BOX_WIDTH, BOX_HEIGHT } from "../config/dashboardConfig";

const DEFAULT_COLOR = "9E9D9B"; // "brak" - no matching document found

function wrapLabel(label) {
  const words = label.split(" ");
  const lines = [];
  let current = "";

  words.forEach((word) => {
    const test = current ? `${current} ${word}` : word;
    if (test.length > 16 && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  });

  if (current) lines.push(current);
  return lines.slice(0, 3);
}

export default function DashboardPage() {
  const { projectId } = useParams();
  const [docs, setDocs] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const loadDocs = () => {
    fetch(`${API_URL}/projects/${projectId}/documents`)
      .then((res) => res.json())
      .then(setDocs)
      .catch(console.error);
  };

  useEffect(loadDocs, [projectId]);

  // Exact doc_name -> document lookup. If a name repeats within the
  // project (see the "Odbiór" caveat in dashboardConfig.js), the last
  // match found wins.
  const docsByName = useMemo(() => {
    const map = {};
    docs.forEach((doc) => {
      map[doc.name] = doc;
    });
    return map;
  }, [docs]);

  const boxesById = useMemo(() => {
    const map = {};
    BOXES.forEach((box) => {
      map[box.id] = box;
    });
    return map;
  }, []);

  const canvasWidth = Math.max(...BOXES.map((b) => b.x)) + BOX_WIDTH + 40;
  const canvasHeight = Math.max(...BOXES.map((b) => b.y)) + BOX_HEIGHT + 40;

  return (
    <div className="page">
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

      <div className="dashboard-scroll">
        <svg
          className="dashboard-svg"
          viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
          width={canvasWidth}
          height={canvasHeight}
        >
          {EDGES.map(([fromId, toId]) => {
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

          {BOXES.map((box) => {
            const doc = docsByName[box.label];
            const color = doc ? doc.color : DEFAULT_COLOR;
            const lines = wrapLabel(box.label);
            const clickable = Boolean(doc);

            return (
              <g
                key={box.id}
                transform={`translate(${box.x}, ${box.y})`}
                onClick={clickable ? () => setSelectedId(doc.id) : undefined}
                className={
                  clickable ? "dashboard-box clickable" : "dashboard-box"
                }
              >
                <rect
                  width={BOX_WIDTH}
                  height={BOX_HEIGHT}
                  rx="8"
                  fill={`#${color}`}
                  stroke="#1f2430"
                  strokeOpacity="0.15"
                />
                <text
                  x={BOX_WIDTH / 2}
                  y={BOX_HEIGHT / 2 - ((lines.length - 1) * 12) / 2 + 4}
                  textAnchor="middle"
                  className="dashboard-box-label"
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

      <DocumentModal
        documentId={selectedId}
        onClose={() => setSelectedId(null)}
        onSaved={loadDocs}
      />
    </div>
  );
}