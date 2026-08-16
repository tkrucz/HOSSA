export const BOX_WIDTH = 150;
export const BOX_HEIGHT = 70;
export const ROW_GAP = 90;
export const COL_GAP = 220;

// Helpers to place a box by row/column index instead of raw pixel numbers.
const ROW = (n) => n * ROW_GAP;
const COL = (n) => n * COL_GAP;

// Vertical space reserved for one building's whole row-block.
export const BUILDING_BLOCK_HEIGHT = 10 * ROW_GAP;

// Buildings start below all the shared "intro" content (input boxes,
// Warunki usunięcia kolizji chain, Dane do warunków fan-out) so nothing overlaps regardless of how tall that shared content is.
export const BUILDING_Y_BASE = ROW(15);

// Column each building's anchor box sits in - one step right of
// "Koncepcja Wstępna", one step left of the building's own mapa_cel/geologia/koncepcja_arch fan-out.
export const ANCHOR_X = COL(2);

// Shared, single-instance boxes - one per whole project, regardless of how many buildings it has.
export const SHARED_BOXES = [
  { id: "mapa_dc", label: "Mapa DC. Informacyjna", x: COL(0), y: ROW(0) },
  { id: "domiary", label: "Domiary granic, drzew", x: COL(0), y: ROW(1) },
  { id: "osiedle", label: "Osiedle/Teren PZUP", x: COL(0), y: ROW(2) },

  { id: "koncepcja_wstepna", label: "Koncepcja Wstępna", x: COL(1), y: ROW(1) },

  { id: "war_usun_kolizji", label: "Warunki usunięcia kolizji", x: COL(2), y: ROW(0) },
  { id: "dane_do_war", label: "Dane do warunków", x: COL(2), y: ROW(3.5) },
  { id: "pzt_podklad", label: "PZT podkład", x: COL(2), y: ROW(9) },

  { id: "proj_war_usun_kolizji", label: "Projekt", x: COL(3), y: ROW(0) },
  { id: "dane_do_war_woda", label: "Dane do Warunków Woda", x: COL(3), y: ROW(2) },
  { id: "dane_do_war_cieplo", label: "Dane do Warunków- Ciepło", x: COL(3), y: ROW(3) },
  { id: "dane_do_war_elektryka", label: "Dane do Warunków- Elektryka", x: COL(3), y: ROW(4) },
  { id: "dane_do_war_deszcz", label: "Dane do Warunków- Deszczówka", x: COL(3), y: ROW(5) },
  { id: "um_brnz_deszcz", label: "Umowy Branżowe- Deszczówka", x: COL(3), y: ROW(8) },
  { id: "um_brnz_woda", label: "Umowy Branżowe- Woda", x: COL(3), y: ROW(9) },
  { id: "um_brnz_drogi", label: "Umowy Branżowe- Drogi", x: COL(3), y: ROW(10) },
  { id: "um_brnz_elektryka", label: "Umowy Branżowe- Elektryka", x: COL(3), y: ROW(11) },

  { id: "uzg_war_usun_kolizji", label: "Uzgodnienia Warunków Usunięcia Kolizji", x: COL(4), y: ROW(0) },
  { id: "wt_woda_kan", label: "WT Woda Kan.", x: COL(4), y: ROW(2) },
  { id: "wt_gaz", label: "WT Gaz", x: COL(4), y: ROW(3) },
  { id: "umowa_przyl_co", label: "Umowa przył. C.O", x: COL(4), y: ROW(4) },
  { id: "wt_trafo", label: "WT trafo", x: COL(4), y: ROW(5) },
  { id: "umowa_przyl_nn", label: "Umowa przył. NN", x: COL(4), y: ROW(6) },
  { id: "pzt", label: "PZT", x: COL(4), y: ROW(9) },

  { id: "koncepcja_wody_deszczowej_big", label: "Koncepcja Zagospodarowania Wód Deszczowych- Rury Spustowe/Plansza Zlewni", x: COL(5), y: ROW(1) }, //too long name
  { id: "pozw_na_bud", label: "Pozwolenie na Budowę", x: COL(5), y: ROW(9) },

  { id: "pt_odwodnienia", label: "P.T. Odwodnienia", x: COL(6), y: ROW(0) },
  { id: "proj_lok_trafo", label: "Projekt Lokalizacji Trafo", x: COL(6), y: ROW(2.5) },
  { id: "pb_trafo", label: "PB Trafo", x: COL(6), y: ROW(4) },
  { id: "pt_trafo", label: "PT Trafo", x: COL(6), y: ROW(5) },
  { id: "proj_tech_wody", label: "Projekt Techniczny Przyłączy Wody/Kanalizacji", x: COL(6), y: ROW(6) },
  { id: "proj_tech_gaz_zew", label: "Projekt Techniczny Instalacji Gazowej Zew.", x: COL(6), y: ROW(7) },
  { id: "proj_tech_gaz_wew", label: "Projekt Techniczny Instalacji Gazowej Wew.", x: COL(6), y: ROW(8) },
  { id: "odbior3", label: "Odbiór pozwolenia na budowę", x: COL(6), y: ROW(9) },

  //  !! Also add those block to be nested inside {id: koncepcja_wody_deszczowej_big} !!
  // { id: "koncepcja_mal_arch", label: "Koncepcja Małej Architektury", x: COL(?), y: ROW(?) },
  // { id: "koncpecja_wod_deszcz", label: "Koncepcja Zagospodarowania Wód Deszczowych", x: COL(?), y: ROW(?) },
  // { id: "koncepcja_drog", label: "Koncepcja Drogowa", x: COL(?), y: ROW(?) },
  // { id: "koncepcja_zasil", label: "Konepcja Zasilania IS/CO/GAZ", x: COL(?), y: ROW(?) },

  { id: "zbiornik", label: "Zbiornik", x: COL(7), y: ROW(0) },
  { id: "podklad_mal_arch", label: "Podkład Małej Architektury", x: COL(7), y: ROW(9) },
  { id: "uzg_lok_trafo", label: "Uzgodnienie Lokalizacji Trafo", x: COL(7), y: ROW(2.5) },
  { id: "uzg_pb_pt_trafo", label: "Uzgodnienia PB", x: COL(7), y: ROW(4.5) },
  { id: "uzg_proj_tech_wody", label: "Uzgodnienia Wody", x: COL(7), y: ROW(6) },
  { id: "uzg_proj_tech_gaz_zew", label: "Uzgodnienia Gazu", x: COL(7), y: ROW(7) },

  { id: "operat", label: "Operat", x: COL(8), y: ROW(0) },

  { id: "pozw_wodnoprawne", label: "Pozowlenie Wodnoprawne", x: COL(9), y: ROW(0) },
  { id: "dane_do_kip", label: "Dane do KIP", x: COL(9), y: ROW(1) },

  { id: "kip", label: "Karta Informacyjna Przedsięwzięcia", x: COL(10), y: ROW(1) },

  { id: "decyzja_srod", label: "Decyzja Środowiskowa", x: COL(11), y: ROW(1) },
  { id: "umowa_ziel", label: "Umowa Zieleń", x: COL(11), y: ROW(2) },
  { id: "p_t_drogi", label: "P.T. Drogi", x: COL(11), y: ROW(3) },
  { id: "proj_osw_trn", label: "Projekt Oświetlenia Terenu", x: COL(11), y: ROW(4) },

  { id: "proj_ziel", label: "Projekt Zieleni", x: COL(12), y: ROW(2) },

  { id: "sprawdzenie_pt_proj_ziel", label: "Sprawdzenie", x: COL(13), y: ROW(3) },

  { id: "proj_drg", label: "Projekt Wykonawczy Drogi", x: COL(14), y: ROW(6) },
  { id: "proj_mal_arch", label: "Projekt Małej Architektury", x: COL(14), y: ROW(7) },
  { id: "proj_ziel_final", label: "Projekt Zieleni", x: COL(14), y: ROW(8) },
];

// Per-building template. `x` is the stage column - shared across all buildings, since every building goes through the same process stages.
// `y` is relative to that building's own block; buildDashboardGraph() offsets it by BUILDING_Y_BASE + BUILDING_BLOCK_HEIGHT * buildingIndex.
// Columns start one step right of each building's anchor box at x = ANCHOR_X.
export const BUILDING_BOX_TEMPLATE = [
  { id: "mapa_cel", suffix: "Mapa do celów Projektu", x: COL(3), y: ROW(0) },
  { id: "geologia", suffix: "Geologia", x: COL(3), y: ROW(1) },
  { id: "koncepcja_arch", suffix: "Koncepcja Architektury Budynku", x: COL(3), y: ROW(2) },

  { id: "odbior1", suffix: "Odbiór koncepcji architektury budynku", x: COL(4), y: ROW(2) },

  { id: "wentylacje", suffix: "Umowa Branżowa- wentylacje", x: COL(5), y: ROW(0) },
  { id: "woda", suffix: "Umowa Branżowa- woda kanalizacyjna CO", x: COL(5), y: ROW(1) },
  { id: "nn", suffix: "Umowa Branżowa- NN", x: COL(5), y: ROW(2) },
  { id: "konstrukcja", suffix: "Umowa Branżowa- konstrukcja", x: COL(5), y: ROW(3) },
  { id: "uw", suffix: "Umowa Wnętrza", x: COL(5), y: ROW(5) },

  { id: "pab_podklad", suffix: "Podkład do PAB", x: COL(6), y: ROW(-1.5) },
  { id: "pt_went", suffix: "PT wentylacji", x: COL(6), y: ROW(0) },
  { id: "pt_woda", suffix: "PT wody kan. CO", x: COL(6), y: ROW(1) },
  { id: "pt_elektryki", suffix: "PT elektryki", x: COL(6), y: ROW(2) },
  { id: "pt_konstr", suffix: "PT Konstrukcji", x: COL(6), y: ROW(3) },

  { id: "koncepcja_wntrz", suffix: "Koncepcja Wnętrz", x: COL(6.5), y: ROW(5) },

  { id: "sprawdzenie_pt", suffix: "Sprawdzenie planów technicznych", x: COL(7), y: ROW(1.5) },
  { id: "pab", suffix: "Projekt Architektury Budynku", x: COL(7), y: ROW(-1.5) },

  { id: "pt_went_final", suffix: "PT wentylacji po sprawdzeniu", x: COL(8), y: ROW(0) },
  { id: "pt_woda_final", suffix: "PT wody kanalizacyjnej po sprawdzeniu", x: COL(8), y: ROW(1) },
  { id: "pt_elektryki_final", suffix: "PT elektryki po sprawdzeniu", x: COL(8), y: ROW(2) },
  { id: "pt_konstr_final", suffix: "PT Konstrukcji po sprawdzeniu", x: COL(8), y: ROW(3) },
  { id: "podklad_el", suffix: "Podkład dla Elektryków", x: COL(8), y: ROW(5) },

  { id: "odbior2", suffix: "Odbiór planu architektury budynku", x: COL(9), y: ROW(-1.5) },

  { id: "pw_podkladow", suffix: "Plan wykonawczy podkładów", x: COL(10), y: ROW(1.5) },

  { id: "pw_went", suffix: "Plan Wykonawczy Wnetylacji", x: COL(11), y: ROW(4) },
  { id: "pw_woda", suffix: "Plan Wykonawczy Wody Kanalizacyjnej", x: COL(11), y: ROW(5) },
  { id: "pw_konstr", suffix: "Plan Wykonawczy Konstrukcji", x: COL(11), y: ROW(6) },
  { id: "pw_el", suffix: "Plan Wykonawczy Elektryki", x: COL(11), y: ROW(7) },

  { id: "sprawdzenie_pw", suffix: "Sprawdzenie planów wykonawczych", x: COL(12), y: ROW(5.5) },

  { id: "pw_went_final", suffix: "Plan Wykonawczy Wnetylacji po sprawdzeniu", x: COL(13), y: ROW(4) },
  { id: "pw_woda_final", suffix: "Plan Wykonawczy Wody Kanalizacyjnej po sprawdzeniu", x: COL(13), y: ROW(5) },
  { id: "pw_konstr_final", suffix: "Plan Wykonawczy Konstrukcji po sprawdzeniu", x: COL(13), y: ROW(6) },
  { id: "pw_el_final", suffix: "Plan Wykonawczy Elektryki po sprawdzeniu", x: COL(13), y: ROW(7) },

  { id: "proj_wntrz", suffix: "Projekt Wnętrz", x: COL(14), y: ROW(0) },
  { id: "mat_ofert", suffix: "Materiały Ofertowe", x: COL(14), y: ROW(1.5) },
  { id: "pw_archt_bud", suffix: "Plan Wykonawczy Architektury Budynku", x: COL(14), y: ROW(3) },

  { id: "mat_ofert_po_pw", suffix: "Materiały Ofertowe Po PW", x: COL(15), y: ROW(1.5) }
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

  ["dane_do_war_woda", "wt_woda_kan"],
  ["dane_do_war_cieplo", "wt_gaz"],
  ["dane_do_war_cieplo", "umowa_przyl_co"],
  ["dane_do_war_elektryka", "wt_trafo"],
  ["dane_do_war_elektryka", "umowa_przyl_nn"],

  ["koncepcja_wstepna", "pzt_podklad"],
  ["pzt_podklad", "um_brnz_deszcz"],
  ["pzt_podklad", "um_brnz_woda"],
  ["pzt_podklad", "um_brnz_drogi"],
  ["pzt_podklad", "um_brnz_elektryka"],

  ["koncepcja_wstepna", "koncepcja_wody_deszczowej_big"],

  ["um_brnz_deszcz", "pzt"],
  ["um_brnz_woda", "pzt"],
  ["um_brnz_drogi", "pzt"],
  ["um_brnz_elektryka", "pzt"],

  ["pzt", "pozw_na_bud"],
  ["pozw_na_bud", "odbior3"],
  ["odbior3", "podklad_mal_arch"],

  ["pt_odwodnienia", "zbiornik"],
  ["zbiornik", "operat"],
  ["operat", "pozw_wodnoprawne"],

  ["pb_trafo", "uzg_pb_pt_trafo"],
  ["pt_trafo", "uzg_pb_pt_trafo"],
  ["proj_lok_trafo", "uzg_lok_trafo"],
  ["proj_tech_wody", "uzg_proj_tech_wody"],
  ["proj_tech_gaz_zew", "uzg_proj_tech_gaz_zew"],

  ["koncepcja_arch", "odbior1"],

  ["odbior1", "wentylacje"],
  ["odbior1", "woda"],
  ["odbior1", "nn"],
  ["odbior1", "konstrukcja"],
  ["odbior1", "uw"],

  ["uw", "koncepcja_wntrz"],

  ["koncepcja_wntrz", "podklad_el"],

  ["podklad_el", "pw_el"],
  ["podklad_el", "proj_wntrz"],

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

  ["pab_podklad", "pab"],
  ["pab", "odbior2"],

  ["pt_went_final", "pw_podkladow"],
  ["pt_woda_final", "pw_podkladow"],
  ["pt_elektryki_final", "pw_podkladow"],
  ["pt_konstr_final", "pw_podkladow"],
  ["odbior2", "pw_podkladow"],

  ["pw_podkladow", "pw_archt_bud"],

  ["dane_do_kip", "kip"],
  ["kip", "decyzja_srod"],
  ["decyzja_srod", "pzt"],

  ["umowa_ziel", "proj_ziel"],
  ["proj_ziel", "sprawdzenie_pt_proj_ziel"],
  ["p_t_drogi", "sprawdzenie_pt_proj_ziel"],
  ["sprawdzenie_pt_proj_ziel", "proj_drg"],
  ["sprawdzenie_pt_proj_ziel", "proj_mal_arch"],
  ["sprawdzenie_pt_proj_ziel", "proj_ziel_final"],
  ["proj_osw_trn", "proj_ziel_final"],

  ["pw_went", "sprawdzenie_pw"],
  ["pw_woda", "sprawdzenie_pw"],
  ["pw_konstr", "sprawdzenie_pw"],
  ["pw_el", "sprawdzenie_pw"],

  ["sprawdzenie_pw", "pw_went_final"],
  ["sprawdzenie_pw", "pw_woda_final"],
  ["sprawdzenie_pw", "pw_konstr_final"],
  ["sprawdzenie_pw", "pw_el_final"],

  ["pw_went_final", "pw_archt_bud"],
  ["pw_woda_final", "pw_archt_bud"],
  ["pw_konstr_final", "pw_archt_bud"],
  ["pw_el_final", "pw_archt_bud"],

  ["pw_archt_bud", "mat_ofert_po_pw"],
  ["mat_ofert", "mat_ofert_po_pw"],
  ["proj_wntrz", "mat_ofert_po_pw"]
];

const REPEATABLE_IDS = new Set(BUILDING_BOX_TEMPLATE.map((t) => t.id));

// Buildings are just the folder names present in this project's documents
// (e.g. a file under "Projekt 1\Budynek A\..." belongs to building
// "Budynek A") - the same `folder` value the regular folder-browsing view
// already uses. Returns a sorted, deduped list of every distinct folder
// that has at least one document in it.
//
// Caveat: this treats every subfolder in the project as "a building". If a project ever mixes building folders with other kinds of folders
// (e.g. a flat "Architektura"/"Konstrukcja" layout with no buildings at all), this would show every one of those as a building block too.
export function discoverBuildings(docs) {
  const names = new Set();

  docs.forEach((doc) => {
    if (doc.folder) names.add(doc.folder);
  });

  return Array.from(names).sort();
}

// Builds the full box + edge list for a given list of building names.
// Each building gets: one anchor box (id `anchor::{building}`, a purely visual node - not matched to any document), plus one box per
// BUILDING_BOX_TEMPLATE entry. Box `label` is just the stage name - building context comes from the anchor box and vertical grouping, not a
// text prefix. `suffix`/`building` are kept on each box so the page can match it against real documents.
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
      y: yOffset + ROW_GAP,
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