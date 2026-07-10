export const BOX_WIDTH = 150;
export const BOX_HEIGHT = 60;
export const COL_GAP = 220;
export const ROW_GAP = 90;

// x/y are in SVG units. Each box's `label` must match `doc_name` in the database exactly - that's how status color gets attached to a box.
//
// NOTE: "Odbiór" appears three times here, same as in the hand-drawn
// diagram. If your project has multiple documents literally named "Odbiór",
// exact-name matching can't tell them apart - all three boxes will resolve
// to whichever one the lookup finds. If that happens in practice, rename
// the underlying files to be distinct (e.g. "Odbiór - koncepcja.pdf").
export const BOXES = [
  { id: "mapa_dc", label: "Mapa DC. Informacyjna", x: 0, y: 0 },
  { id: "domiary", label: "Domiary granic, drzew", x: 0, y: 90 },
  { id: "osiedle", label: "Osiedle/teren PZUP", x: 0, y: 180 },

  { id: "mapa_cel", label: "Mapa do celów Projektu", x: 220, y: 0 },
  { id: "geodezja", label: "Geodezja", x: 220, y: 90 },
  { id: "koncepcja_wstepna", label: "Koncepcja wstępna", x: 220, y: 180 },

  { id: "odbior1", label: "Odbiór", x: 440, y: 90 },

  { id: "koncepcja_arch", label: "Koncepcja Architektury budynku", x: 660, y: 90 },

  { id: "odbior2", label: "Odbiór", x: 880, y: 90 },

  { id: "wentylacje", label: "Wentylacje", x: 1100, y: 0 },
  { id: "woda", label: "Woda kan. CO", x: 1100, y: 90 },
  { id: "nn", label: "NN", x: 1100, y: 180 },
  { id: "konstrukcja", label: "Konstrukcja", x: 1100, y: 270 },

  { id: "pt_went", label: "PT wentylacji", x: 1320, y: 0 },
  { id: "pt_woda", label: "PT wody kan. CO", x: 1320, y: 90 },
  { id: "pt_elektryki", label: "PT elektryki", x: 1320, y: 180 },
  { id: "pt_konstr", label: "PT Konstrukcji", x: 1320, y: 270 },

  { id: "pab", label: "PAB", x: 1540, y: 90 },
  { id: "rzeczoznawca", label: "Rzeczoznawca", x: 1540, y: 180 },

  { id: "odbior3", label: "Odbiór", x: 1760, y: 135 },
];

export const EDGES = [
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
  ["pt_went", "pab"],
  ["pt_woda", "pab"],
  ["pt_elektryki", "pab"],
  ["pt_konstr", "pab"],
  ["pab", "rzeczoznawca"],
  ["rzeczoznawca", "odbior3"],
];