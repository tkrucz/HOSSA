export const BOX_WIDTH = 150;
export const BOX_HEIGHT = 70;
export const ROW_GAP = 90;
export const COL_GAP = 220;

// Helpers to place a box by row/column index instead of raw pixel numbers.
const ROW = (n) => n * ROW_GAP;
const COL = (n) => n * COL_GAP;

// Vertical space reserved for one building's whole row-block.
export const BUILDING_BLOCK_HEIGHT = 8 * ROW_GAP;

// Buildings start below all the shared "intro" content (input boxes,
// Warunki usunięcia kolizji chain, Dane do warunków fan-out) so nothing overlaps regardless of how tall that shared content is.
export const BUILDING_Y_BASE = ROW(10);

// Column each building's anchor box sits in - one step right of
// "Koncepcja Wstępna", one step left of the building's own mapa_cel/geologia/koncepcja_arch fan-out.
export const ANCHOR_X = COL(2);

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

  // "Dane do warunków" fan-out
  { id: "dane_do_war", label: "Dane do warunków", x: COL(2), y: ROW(2) },
  { id: "dane_do_war_woda", label: "Dane do Warunków Woda", x: COL(3), y: ROW(2) },
  { id: "dane_do_war_cieplo", label: "Dane do Warunków- Ciepło", x: COL(3), y: ROW(3) },
  { id: "dane_do_war_elektryka", label: "Dane do Warunków- Elektryka", x: COL(3), y: ROW(4) },
  { id: "dane_do_war_deszcz", label: "Dane do Warunków- Deszczówka", x: COL(3), y: ROW(5) },

  // Koncepcja zagospodarowania wód deszczowych- rury spustowe/plansza zlewni
  // "Koncepcja Wstępna" -> "Projekt Zagospodarowania Terenu" -> Umowy Branżowe
  { id: "pzt_podklad", label: "Projekt Zagospodarowania Terenu podkład", x: COL(2), y: ROW(6) },
  { id: "um_brnz_deszcz", label: "Umowy Branżowe- Deszczówka", x: COL(3), y: ROW(6) },
  { id: "um_brnz_woda", label: "Umowy Branżowe- Woda", x: COL(3), y: ROW(7) },
  { id: "um_brnz_drogi", label: "Umowy Branżowe- Drogi", x: COL(3), y: ROW(8) },
  { id: "um_brnz_elektryka", label: "Umowy Branżowe- Elektryka", x: COL(3), y: ROW(9) },
];

// Per-building template. `x` is the stage column - shared across all buildings, since every building goes through the same process stages.
// `y` is relative to that building's own block; buildDashboardGraph() offsets it by BUILDING_Y_BASE + BUILDING_BLOCK_HEIGHT * buildingIndex.
// Columns start one step right of each building's anchor box at x = ANCHOR_X.
export const BUILDING_BOX_TEMPLATE = [
  { id: "mapa_cel", suffix: "Mapa do celów Projektu", x: COL(3), y: ROW(0) }, // osobny element
  { id: "geologia", suffix: "Geologia", x: COL(3), y: ROW(1) }, // osobny element
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
  { id: "pab_podkład", suffix: "Podkład do PAB", x: COL(6), y: ROW(4) }, // osobny element nad PT

  { id: "sprawdzenie_pt", suffix: "Sprawdzenie planów technicznych", x: COL(7), y: ROW(1.5) },
  { id: "pab", suffix: "Projekt Architektury Budynku", x: COL(7), y: ROW(-1.5) }, // osobny element nad PT
  { id: "uw", suffix: "Umowa Wnętrza", x : COL(7), y: ROW(5)},

  { id: "pt_went_final", suffix: "PT wentylacji po sprawdzeniu", x: COL(8), y: ROW(0) },
  { id: "pt_woda_final", suffix: "PT wody kanalizacyjnej po sprawdzeniu", x: COL(8), y: ROW(1) },
  { id: "pt_elektryki_final", suffix: "PT elektryki po sprawdzeniu", x: COL(8), y: ROW(2) },
  { id: "pt_konstr_final", suffix: "PT Konstrukcji po sprawdzeniu", x: COL(8), y: ROW(3) },
  { id: "koncepcja_wntrz", suffix: "Koncepcja Wnętrz", x: COL(8), y : ROW(5)},

  { id: "podkład_el", suffix: "Podkład dla Elektryków", x: COL(9), y : ROW(5)},

  { id: "odbior3", suffix: "Odbiór planu architektury budynku", x: COL(11), y: ROW(1.5) },
  { id: "pw_podkladow", suffix: "Plan wykonawczy podkładów", x: COL(11), y: ROW(1.5) },

  {id : "pw_went", suffix: "Plan Wykonawczy Wnetylacji", x : COL(12), y : ROW(4)},
  {id : "pw_woda", suffix: "Plan Wykonawczy Wody Kanalizacyjnej", x : COL(12), y : ROW(5)},
  {id : "pw_konstr", suffix: "Plan Wykonawczy Konstrukcji", x : COL(12), y : ROW(6)},
  {id : "pw_el", suffix: "Plan Wykonawczy Elektryki", x : COL(12), y : ROW(7)},
  {id : "mat_ofert", suffix: "Materiały Ofertowe", x : COL(12), y : ROW(3)},

  { id: "sprawdzenie_pw", suffix: "Sprawdzenie planów wykonawczych", x: COL(13), y: ROW(5.5) },

  {id : "pw_went_final", suffix: "Plan Wykonawczy Wnetylacji po sprawdzeniu", x : COL(14), y : ROW(4)},
  {id : "pw_woda_final", suffix: "Plan Wykonawczy Wody Kanalizacyjnej po sprawdzeniu", x : COL(14), y : ROW(5)},
  {id : "pw_konstr_final", suffix: "Plan Wykonawczy Konstrukcji po sprawdzeniu", x : COL(14), y : ROW(6)},
  {id : "pw_el_final", suffix: "Plan Wykonawczy Elektryki po sprawdzeniu", x : COL(14), y : ROW(7)},
  {id : "mat_ofert_final", suffix: "Materiały Ofertowe po sprawdzeniu", x : COL(14), y : ROW(3)},

  {id : "pw_archt_bud", suffix: "Plan Wykonawczy Architektury Budynku", x : COL (15), y : ROW(4)},

  {id : "mat_ofert_po_pw", suffix: "Materiały Ofertowe Po PW", x : COL(16), y : ROW(2)}
];

// Template edges among SHARED boxes and among BUILDING_BOX_TEMPLATE boxes.
// Edges connecting koncepcja_wstepna to each building's anchor, and each anchor to its own mapa_cel/geologia/koncepcja_arch,
// are generated separately in buildDashboardGraph() below - they're not "template ids", they're synthetic per-building nodes.
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
  ["pt_went_final", "pw_podkladow"],
  ["pt_woda_final", "pw_podkladow"],
  ["pt_elektryki_final", "pw_podkladow"],
  ["pt_konstr_final", "pw_podkladow"],
  ["pab", "pw_podkladow"],
  ["pw_podkladow", "odbior3"],
];

const REPEATABLE_IDS = new Set(BUILDING_BOX_TEMPLATE.map((t) => t.id));

// Buildings are just the folder names present in this project's documents (e.g. a file under "Projekt 1\Budynek A\..." belongs to building "Budynek A") -
// the same `folder` value the regular folder-browsing view already uses. Returns a sorted, deduped list of every distinct folder that has at least one document in it.
//
// Caveat: this treats every subfolder in the project as "a building". If a project ever mixes building folders with other kinds of folders
// (e.g. a flat "Architektura"/"Konstrukcja" layout with no buildings at all),
// this would show every one of those as a building block too.
export function discoverBuildings(docs) {
  const names = new Set();

  docs.forEach((doc) => {
    if (doc.folder) names.add(doc.folder);
  });

  return Array.from(names).sort();
}

// Builds the full box + edge list for a given list of building names.
// Each building gets: one anchor box (id `anchor::{building}`, a purely visual node - not matched to any document), plus one box per
// BUILDING_BOX_TEMPLATE entry. Box `label` is just the stage name - building context comes from the anchor box and vertical grouping,
// not a text prefix. `suffix`/`building` are kept on each box so the page can match it against real documents
// (any doc in that building's folder whose name equals or starts with "{suffix} - ").
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
        label: template.suffix,
        suffix: template.suffix,
        x: template.x,
        y: template.y + yOffset,
        building,
      });
    });

    edges.push([anchorId, `mapa_cel::${building}`]);
    edges.push([anchorId, `geologia::${building}`]);
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