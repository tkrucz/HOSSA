export const BOX_WIDTH = 150;
export const BOX_HEIGHT = 70;
export const ROW_GAP = 90;
export const COL_GAP = 220;

// Variables to calculate in which row, column place a document block
const ROW = (n) => n * ROW_GAP
const COL = (n) => n * COL_GAP

// Vertical space reserved for one building's whole row-block.
export const BUILDING_BLOCK_HEIGHT = 4 * ROW_GAP + 60;

// Buildings start below all the shared "intro" content (input boxes,
// Warunki usunięcia kolizji chain, Dane do warunków fan-out) so nothing overlaps regardless of how tall that shared content is.
export const BUILDING_Y_BASE = ROW(10);

// Column each building's anchor box sits in - one step right of
// "Koncepcja Wstępna", one step left of the building's own mapa_cel/geodezja/koncepcja_arch fan-out.
export const ANCHOR_X = COL(2);

// Convention used to derive a building name from a document name, e.g.
// "Budynek A - Mapa do celów Projektu" -> building "Budynek A".
const BUILDING_SEPARATOR = " - ";

// Shared, single-instance boxes - one per whole project, regardless of how many buildings it has.
export const SHARED_BOXES = [
  { id: "mapa_dc", label: "Mapa DC. Informacyjna", x: COL(0), y: ROW(0) },
  { id: "domiary", label: "Domiary granic, drzew", x: COL(0), y: ROW(1) },
  { id: "osiedle", label: "Osiedle/Teren PZUP", x: COL(0), y: ROW(2) },

  { id: "koncepcja_wstepna", label: "Koncepcja Wstępna", x: COL(1), y: ROW(1) },

  // "Warunki usunięcia kolizji -> Projekt -> Uzgodnienia" chain
  { id: "war_usun_kolizji", label: "Warunki usunięcia kolizji", x: COL(2), y: ROW(0) },
  { id: "proj_war_usun_kolizji", label: "Projekt", x: COL(3), y: ROW(0) },
  { id: "uzg_war_usun_kolizji", label: "Uzgodnienia", x: COL(4), y: ROW(0) },

  // "Dane do warunków"
  { id: "dane_do_war", label: "Dane do warunków", x: COL(2), y: ROW(2) },
  { id: "dane_do_war_woda", label: "Dane do Warunków Woda", x: COL(3), y: ROW(2) },
  { id: "dane_do_war_cieplo", label: "Dane do Warunków- Ciepło", x: COL(3), y: ROW(3) },
  { id: "dane_do_war_elektryka", label: "Dane do Warunków- Elektryka", x: COL(3), y: ROW(4) },
  { id: "dane_do_war_deszcz", label: "Dane do Warunków- Deszczówka", x: COL(3), y: ROW(5) },

  // "Koncepcja Wstępna" -> "Plan Zagospodarowania Terenu" -> Umowy Branżowe
  { id: "pzt_podklad", label: "Plan Zagospodarowania Terenu", x: COL(2), y: ROW(6) },
  { id: "um_brnz_deszcz", label: "Umowy Branżowe- Deszczówka", x: COL(3), y: ROW(6) },
  { id: "um_brnz_woda", label: "Umowy Branżowe- Woda", x: COL(3), y: ROW(7) },
  { id: "um_brnz_drogi", label: "Umowy Branżowe- Drogi", x: COL(3), y: ROW(8) },
  { id: "um_brnz_elektryka", label: "Umowy Branżowe- Elektryka", x: COL(3), y: ROW(9) },
];

// Per-building template. `
// x` is the stage column - shared across all buildings, since every building goes through the same process stages.
// y` is relative to that building's own block;
// buildDashboardGraph() offsets it by BUILDING_Y_BASE + BUILDING_BLOCK_HEIGHT * buildingIndex.
// Columns start one step right of each building's anchor box at x = ANCHOR_X
export const BUILDING_BOX_TEMPLATE = [
  { id: "mapa_cel", suffix: "Mapa do celów Projektu", x: COL(3), y: ROW(0) },
  { id: "geodezja", suffix: "Geodezja", x: COL(3), y: ROW(1) },
  { id: "koncepcja_arch", suffix: "Koncepcja Architektury Budynku", x: COL(3), y: ROW(2) },

  { id: "odbior2", suffix: "Odbiór koncepcji architektury budynku", x: COL(4), y: ROW(2) },

  { id: "wentylacje", suffix: "Umowa Branżowa- wentylacje", x: COL(5), y: ROW(0) },
  { id: "woda", suffix: "Umowa Branżowa- woda kanalizacyjna CO", x: COL(5), y: ROW(1) },
  { id: "nn", suffix: "Umowa Branżowa- NN", x: COL(5), y: ROW(2) },
  { id: "konstrukcja", suffix: "Umowa Branżowa- konstrukcja", x: COL(5), y: ROW(3) },

  { id: "pt_went", suffix: "PT wentylacji", x: COL(6), y: ROW(0) },
  { id: "pt_woda", suffix: "PT wody kan. CO", x: COL(6), y: ROW(1) },
  { id: "pt_elektryki", suffix: "PT elektryki", x: COL(6), y: ROW(2) },
  { id: "pt_konstr", suffix: "PT Konstrukcji", x: COL(6), y: ROW(3) },

  { id: "sprawdzenie_pt", suffix: "Sprawdzenie planów technicznych", x: COL(7), y: ROW(1.5) },

  { id: "pt_went_final", suffix: "PT wentylacji po sprawdzeniu", x: COL(8), y: ROW(0) },
  { id: "pt_woda_final", suffix: "PT wody kanalizacyjnej po sprawdzeniu", x: COL(8), y: ROW(1) },
  { id: "pt_elektryki_final", suffix: "PT elektryki po sprawdzeniu", x: COL(8), y: ROW(2) },
  { id: "pt_konstr_final", suffix: "PT Konstrukcji po sprawdzeniu", x: COL(8), y: ROW(3) },

  { id: "pab", suffix: "Plan Architektury Budynku", x: COL(9), y: ROW(1.5) },

  { id: "pw_podkladow", suffix: "Plan wykonawczy podkładów", x: COL(10), y: ROW(1.5) },

  { id: "odbior3", suffix: "Odbiór planu architektury budynku", x: COL(11), y: ROW(1.5) },
];

// Template edges among SHARED boxes and among BUILDING_BOX_TEMPLATE boxes.
// Edges connecting koncepcja_wstepna to each building's anchor, and each anchor to its own mapa_cel/geodezja/koncepcja_arch.
// They are generated separately in buildDashboardGraph() below- they're not "template ids", they're synthetic per-building nodes.
export const EDGE_TEMPLATE = [
  ["mapa_dc", "koncepcja_wstepna"],
  ["domiary", "koncepcja_wstepna"],
  ["osiedle", "koncepcja_wstepna"],

  ["koncepcja_wstepna", "war_usun_kolizji"],
  ["war_usun_kolizji", "proj_war_usun_kolizji"],
  ["proj_war_usun_kolizji", "uzg_war_usun_kolizji"],

  ["koncepcja_wstepna", "dane_do_war"],
  ["dane_do_war", "dane_do_war_woda"],
  ["dane_do_war", "dane_do_war_cieplo"],
  ["dane_do_war", "dane_do_war_elektryka"],
  ["dane_do_war", "dane_do_war_deszcz"],

  ["koncepcja_wstepna", "pzt_podklad"],
  ["pzt_podklad", "um_brnz_deszcz"],
  ["pzt_podklad", "um_brnz_woda"],
  ["pzt_podklad", "um_brnz_drogi"],
  ["pzt_podklad", "um_brnz_elektryka"],

  ["koncepcja_arch", "odbior2"],
  ["odbior2", "wentylacje"],
  ["odbior2", "woda"],
  ["odbior2", "nn"],
  ["odbior2", "konstrukcja"],
  ["wentylacje", "pt_went"],
  ["woda", "pt_woda"],
  ["nn", "pt_elektryki"],
  ["konstrukcja", "pt_konstr"],
  ["pt_went", "sprawdzenie_pt"],
  ["pt_woda", "sprawdzenie_pt"],
  ["pt_elektryki", "sprawdzenie_pt"],
  ["pt_konstr", "sprawdzenie_pt"],
  ["sprawdzenie_pt", "pt_went_final"],
  ["sprawdzenie_pt", "pt_woda_final"],
  ["sprawdzenie_pt", "pt_elektryki_final"],
  ["sprawdzenie_pt", "pt_konstr_final"],
  ["pt_went_final", "pab"],
  ["pt_woda_final", "pab"],
  ["pt_elektryki_final", "pab"],
  ["pt_konstr_final", "pab"],
  ["pab", "pw_podkladow"],
  ["pw_podkladow", "odbior3"],
];

const REPEATABLE_IDS = new Set(BUILDING_BOX_TEMPLATE.map((t) => t.id));

export function buildLabel(building, suffix) {
  return `${building}${BUILDING_SEPARATOR}${suffix}`;
}

// Looks at the actual documents fetched for a project and figures out which building names are present,
// by finding doc names that end with "{BUILDING_SEPARATOR}{known stage suffix}".
// Returns a sorted, deduped list - no manual configuration needed.
export function discoverBuildings(docs) {
  const names = new Set();

  docs.forEach((doc) => {
    BUILDING_BOX_TEMPLATE.forEach((template) => {
      const marker = `${BUILDING_SEPARATOR}${template.suffix}`;
      if (doc.name && doc.name.endsWith(marker)) {
        names.add(doc.name.slice(0, doc.name.length - marker.length));
      }
    });
  });

  return Array.from(names).sort();
}

// Builds the full box + edge list for a given list of building names.
// Each building gets: one anchor box (id `anchor::{building}`, a purely visual node - not matched to any document),
// plus one box per BUILDING_BOX_TEMPLATE entry.
export function buildDashboardGraph(buildings) {
  const boxes = [...SHARED_BOXES];
  const edges = [];

  buildings.forEach((building, buildingIndex) => {
    const yOffset = BUILDING_Y_BASE + buildingIndex * BUILDING_BLOCK_HEIGHT;
    const anchorId = `anchor::${building}`;

    boxes.push({
      id: anchorId,
      label: building,
      x: ANCHOR_X,
      y: yOffset + ROW_GAP, // vertically centered against the 3-row fan-out
      building,
      isAnchor: true,
    });
    edges.push(["koncepcja_wstepna", anchorId]);

    BUILDING_BOX_TEMPLATE.forEach((template) => {
      boxes.push({
        id: `${template.id}::${building}`,
        label: buildLabel(building, template.suffix),
        x: template.x,
        y: template.y + yOffset,
        building,
      });
    });

    edges.push([anchorId, `mapa_cel::${building}`]);
    edges.push([anchorId, `geodezja::${building}`]);
    edges.push([anchorId, `koncepcja_arch::${building}`]);
  });

  EDGE_TEMPLATE.forEach(([fromId, toId]) => {
    const fromRepeatable = REPEATABLE_IDS.has(fromId);
    const toRepeatable = REPEATABLE_IDS.has(toId);

    if (!fromRepeatable && !toRepeatable) {
      edges.push([fromId, toId]);
      return;
    }

    buildings.forEach((building) => {
      const from = fromRepeatable ? `${fromId}::${building}` : fromId;
      const to = toRepeatable ? `${toId}::${building}` : toId;
      edges.push([from, to]);
    });
  });

  return { boxes, edges };
}