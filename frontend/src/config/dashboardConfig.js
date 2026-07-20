export const BOX_WIDTH = 150;
export const BOX_HEIGHT = 70;
export const COL_GAP = 220;
export const ROW_GAP = 90;

// Vertical space reserved for one building's whole row-block (4 template
// rows tall + a margin so consecutive buildings don't touch).
export const BUILDING_BLOCK_HEIGHT = 4 * ROW_GAP + 60;

// Convention used to derive a building name from a document name, e.g.
// "Budynek A - Mapa do celów Projektu" -> building "Budynek A".
const BUILDING_SEPARATOR = " - ";

// Shared, single-instance boxes - one per whole project, regardless of how many buildings it has.
// Occupies x = 0..880, kept clear of the per-building template below (which starts at x = 1100) so nothing overlaps.
export const SHARED_BOXES = [
  { id: "mapa_dc", label: "Mapa DC. Informacyjna", x: 0, y: 0 },
  { id: "domiary", label: "Domiary granic, drzew", x: 0, y: 90 },
  { id: "osiedle", label: "Osiedle/Teren PZUP", x: 0, y: 180 },

  { id: "koncepcja_wstepna", label: "Koncepcja Wstępna", x: 220, y: 0 },
  { id: "dane_do_war", label: "Dane do Warunków", x: 220, y: 90 },
  { id: "war_usun_kolizji", label: "Warunki Usunięcia Kolizji", x: 220, y: 180 },

  { id: "odbior1", label: "Odbiór koncepcji wstępnej", x: 440, y: 0 },
  { id: "dane_do_war_woda", label: "Dane do Warunków- Woda", x: 440, y: 90 },
  { id: "dane_do_war_cieplo", label: "Dane do Warunków- Ciepło", x: 440, y: 180 },
  { id: "dane_do_war_elektryka", label: "Dane do Warunków- Elektryka", x: 440, y: 270 },
  { id: "dane_do_war_deszcz", label: "Dane do Warunków- Deszczówka", x: 440, y: 360 },
  { id: "proj_war_usun_kolizji", label: "Projekt- Warunki Usunięcia Kolizji", x: 440, y: 450 },
  { id: "uzg_war_usun_kolizji", label: "Uzgodnienia- Warunki Usunięcia Kolizji", x: 440, y: 540 },

  { id: "pzt_podklad", label: "Plan Zagospodarowania Terenu", x: 660, y: 0 },

  { id: "um_brnz_deszcz", label: "Umowy Branżowe- Deszczówka", x: 880, y: 0 },
  { id: "um_brnz_woda", label: "Umowy Branżowe- Woda", x: 880, y: 90 },
  { id: "um_brnz_drogi", label: "Umowy Branżowe- Drogi", x: 880, y: 180 },
  { id: "um_brnz_elektryka", label: "Umowy Branżowe- Elektryka", x: 880, y: 270 },
];

// Per-building template. `x` is the stage column - shared across all buildings, since every building goes through the same process stages.
// y` is relative to that building's own block; buildDashboardGraph() offsets it by BUILDING_BLOCK_HEIGHT * buildingIndex so blocks stack
// vertically without overlapping, however many buildings there turn out to be. Columns start at x = 1100, clear of SHARED_BOXES above.
export const BUILDING_BOX_TEMPLATE = [
  { id: "mapa_cel", suffix: "Mapa do celów Projektu", x: 1100, y: 0 },
  { id: "geodezja", suffix: "Geodezja", x: 1100, y: 90 },
  { id: "koncepcja_arch", suffix: "Koncepcja Architektury Budynku", x: 1100, y: 180 },

  { id: "odbior2", suffix: "Odbiór koncepcji architektury budynku", x: 1320, y: 180 },

  { id: "wentylacje", suffix: "Umowa Branżowa- wentylacje", x: 1540, y: 0 },
  { id: "woda", suffix: "Umowa Branżowa- woda kanalizacyjna CO", x: 1540, y: 90 },
  { id: "nn", suffix: "Umowa Branżowa- NN", x: 1540, y: 180 },
  { id: "konstrukcja", suffix: "Umowa Branżowa- konstrukcja", x: 1540, y: 270 },

  { id: "pt_went", suffix: "PT wentylacji", x: 1760, y: 0 },
  { id: "pt_woda", suffix: "PT wody kan. CO", x: 1760, y: 90 },
  { id: "pt_elektryki", suffix: "PT elektryki", x: 1760, y: 180 },
  { id: "pt_konstr", suffix: "PT Konstrukcji", x: 1760, y: 270 },

  { id: "sprawdzenie_pt", suffix: "Sprawdzenie planów technicznych", x: 1980, y: 135 },

  { id: "pt_went_final", suffix: "PT wentylacji po sprawdzeniu", x: 2200, y: 0 },
  { id: "pt_woda_final", suffix: "PT wody kanalizacyjnej po sprawdzeniu", x: 2200, y: 90 },
  { id: "pt_elektryki_final", suffix: "PT elektryki po sprawdzeniu", x: 2200, y: 180 },
  { id: "pt_konstr_final", suffix: "PT Konstrukcji po sprawdzeniu", x: 2200, y: 270 },

  { id: "pab", suffix: "Plan Architektury Budynku", x: 2420, y: 90 },
  { id: "rzeczoznawca", suffix: "Rzeczoznawca", x: 2420, y: 180 },

  { id: "pw_podkladow", suffix: "Plan wykonawczy podkładów", x: 2640, y: 135 },

  { id: "odbior3", suffix: "Odbiór planu architektury budynku", x: 2860, y: 135 },
];

// Template edges. Each id is either a SHARED_BOXES id (kept as-is - only one instance ever exists) or a BUILDING_BOX_TEMPLATE id (expanded per
// building). A shared -> per-building edge fans out to every building.
// A per-building -> shared edge fans in from every building.
// A fully per-building -> per-building edge is duplicated once per building, connecting that building's own boxes to each other.
export const EDGE_TEMPLATE = [
  ["mapa_dc", "koncepcja_wstepna"],
  ["domiary", "koncepcja_wstepna"],
  ["osiedle", "koncepcja_wstepna"],
  ["mapa_cel", "odbior1"],
  ["geodezja", "odbior1"],
  ["koncepcja_wstepna", "odbior1"],
  ["odbior1", "koncepcja_arch"],
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
  ["pab", "rzeczoznawca"],
  ["rzeczoznawca", "pw_podkladow"],
  ["pw_podkladow", "odbior3"],
];

const REPEATABLE_IDS = new Set(BUILDING_BOX_TEMPLATE.map((t) => t.id));

export function buildLabel(building, suffix) {
  return `${building}${BUILDING_SEPARATOR}${suffix}`;
}

// Looks at the actual documents fetched for a project and figures out which building names are present, by finding doc names that end with
// "{BUILDING_SEPARATOR}{known stage suffix}". Returns a sorted, deduped list - no manual configuration needed, and it naturally grows as more
// buildings' documents get added to the folder.
//
// Caveat: a building with zero matching documents yet (nothing scanned for it at all) won't show up here,
// since there's nothing to detect it from.  If you need placeholder blocks for buildings that haven't started,
// that would need an explicit list instead of pure discovery.
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
// Shared boxes appear once; every BUILDING_BOX_TEMPLATE entry gets one box per building, positioned by stacking each building's block vertically.
export function buildDashboardGraph(buildings) {
  const boxes = [...SHARED_BOXES];

  buildings.forEach((building, buildingIndex) => {
    const yOffset = buildingIndex * BUILDING_BLOCK_HEIGHT;

    BUILDING_BOX_TEMPLATE.forEach((template) => {
      boxes.push({
        id: `${template.id}::${building}`,
        label: buildLabel(building, template.suffix),
        x: template.x,
        y: template.y + yOffset,
        building,
      });
    });
  });

  const edges = [];

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