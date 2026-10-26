// ===== Sport: Trainingsplan ab 26.10.2026 =====
// Woche 1–5 übernommen aus Nicos Lauf-App (Screenshots vom 26.10.2026),
// ab Do 26.11. eigener Plan mit mehr Intervallen und Bergläufen.
// Abgehakt wird pro Tag, welche Einheiten erledigt sind (Position in der Liste):
// { "2026-10-26": [0] }

// art: "lauf" | "mobility" | "athletik" | "kettlebell"
// sek = Dauer in Sekunden, km = ungefähre Distanz, stufe = Intensität 1–3 (Flammen)
const L = (titel, sek, km, stufe = 1, hinweis = "") => ({ art: "lauf", titel, sek, km, stufe, hinweis });

// Strukturierte Läufe (Intervalle, Bergläufe): Dauer und Strecke werden aus dem Ablauf berechnet.
// ein/aus = Ein- und Auslaufen in Sekunden; teile = [[Belastung, Pause, Wiederholungen], …]
const INT = (titel, stufe, ein, teile, aus, wie, pauseWie = "Trabpause") =>
  ({ art: "lauf", titel, stufe, struktur: { ein, teile, aus, wie, pauseWie } });
const KM_PRO_MIN = 0.075; // grobe Schätzung aus den bisherigen Läufen (Lauf-Geh-Tempo)
const MOB = (sek, uebungen) => ({ art: "mobility", titel: "Mobility Training", sek, uebungen });
const ATH = (sek, uebungen) => ({ art: "athletik", titel: "Athletik Training", sek, uebungen });
const KB = (sek) => ({ art: "kettlebell", titel: "Kettlebell-Training", sek });
const RUHE = [];

// ----- Eigene Einheiten -----
const INTERVALLE = INT("Intervalle", 2, 600, [[60, 120, 6]], 300, "zügig");
const PYRAMIDE   = INT("Pyramiden-Intervalle", 2, 600, [[60, 120, 1], [120, 120, 1], [180, 120, 1], [120, 120, 1], [60, 120, 1]], 300, "zügig");
const BERG       = INT("Berganläufe", 3, 600, [[45, 90, 6]], 300, "bergauf zügig", "locker zurück");
const STEIGERUNG = INT("Lockerer Lauf mit Steigerungen", 1, 1200, [[20, 60, 4]], 300, "von locker bis zügig steigern", "locker");
const HUEGEL     = L("Hügellauf", 35 * 60, 2.6, 2, "Wellige Strecke wählen, Anstiege locker hochlaufen, oben kurz durchatmen");
BERG.symbol = "⛰️";
HUEGEL.symbol = "⛰️";
const LOCKER     = L("Gleichmäßiger lockerer Lauf", 30 * 60, 2.2);
const GRUNDLAGE  = L("Grundlagenausdauer", 30 * 60, 2.2);

// Drei Wochenvorlagen, die sich nach dem Lauf-App-Plan wiederholen
const WOCHE_A = [[KB(30 * 60)], [INTERVALLE], RUHE, [GRUNDLAGE], [ATH(17 * 60 + 27, 5)], [BERG], [MOB(10 * 60 + 30, 5)]];
const WOCHE_B = [[KB(30 * 60)], [LOCKER], [PYRAMIDE], RUHE, [HUEGEL], [ATH(17 * 60 + 12, 5)], [MOB(10 * 60 + 12, 5)]];
const WOCHE_R = [RUHE, [KB(30 * 60)], RUHE, [STEIGERUNG], [LOCKER], [ATH(17 * 60 + 27, 5)], [MOB(10 * 60 + 12, 5)]];

const SPORT_WOCHEN = [
  { phase: "First Steps", name: "Belastung 1", tage: [
    [L("Erweitertes Lauf-Geh-Training", 35 * 60, 2.4)],   // Mo 26.10.
    [L("Erweitertes Lauf-Geh-Training", 35 * 60, 2.4)],   // Di 27.10.
    [MOB(10 * 60 + 42, 4)],                               // Mi 28.10.
    RUHE,                                                 // Do 29.10.
    [L("Entspannter Rhythmuslauf", 34 * 60, 2.4)],        // Fr 30.10.
    RUHE,                                                 // Sa 31.10.
    [ATH(19 * 60 + 54, 6)]                                // So 01.11.
  ]},
  { phase: "First Steps", name: "Belastung 2", tage: [
    [L("Entspannter Rhythmuslauf", 31 * 60, 2.2)],        // Mo 02.11.
    RUHE,                                                 // Di 03.11.
    [L("Erweitertes Lauf-Geh-Training", 26 * 60 + 32, 1.8)], // Mi 04.11.
    [L("Erweitertes Lauf-Geh-Training", 26 * 60, 1.8)],   // Do 05.11.
    [MOB(10 * 60 + 30, 4)],                               // Fr 06.11.
    [L("Erweitertes Lauf-Geh-Training", 26 * 60, 1.8)],   // Sa 07.11.
    [ATH(18 * 60 + 25, 5)]                                // So 08.11.
  ]},
  { phase: "Grow", name: "Belastung 3", tage: [
    [KB(30 * 60)],                                        // Mo 09.11. (statt lockerem Lauf)
    RUHE,                                                 // Di 10.11.
    [L("Tempowechsel-Intervalle", 28 * 60, 2.0, 2)],      // Mi 11.11.
    RUHE,                                                 // Do 12.11.
    [L("Grundlagenausdauer", 28 * 60 + 15, 2.1)],         // Fr 13.11.
    [L("Tempo-Gefühl Lauf", 18 * 60 + 16, 1.3, 2)],       // Sa 14.11.
    [MOB(10 * 60 + 30, 5), ATH(17 * 60 + 12, 5)]          // So 15.11.
  ]},
  { phase: "Grow", name: "Ruhewoche", tage: [
    RUHE,                                                 // Mo 16.11.
    [KB(30 * 60)],                                        // Di 17.11. (statt lockerem Lauf)
    RUHE,                                                 // Mi 18.11.
    [L("Tempo-Gefühl Lauf", 19 * 60 + 26, 1.4, 2)],       // Do 19.11.
    [L("Gleichmäßiger lockerer Lauf", 35 * 60, 2.6)],     // Fr 20.11.
    [ATH(17 * 60 + 27, 5)],                               // Sa 21.11.
    [MOB(10 * 60 + 12, 5)]                                // So 22.11.
  ]},
  { phase: "Grind", name: "Belastung 1", tage: [
    [KB(30 * 60)],                                        // Mo 23.11. (statt lockerem Lauf)
    [L("Grundlagenausdauer", 25 * 60 + 30, 1.9)],         // Di 24.11.
    RUHE,                                                 // Mi 25.11.
    // Ab hier eigener Plan (aus der Lauf-App waren nur Symbole zu sehen):
    [INTERVALLE],                                         // Do 26.11.
    [ATH(17 * 60 + 27, 5)],                               // Fr 27.11.
    [BERG],                                               // Sa 28.11.
    [MOB(10 * 60 + 30, 5)]                                // So 29.11.
  ]}
];

// ===== Verlängerung nach Woche 5 =====
// Danach geht es in Drei-Wochen-Blöcken weiter: Belastung 1, Belastung 2, Ruhewoche.
// Pro Woche: Kettlebell, Intervalle und ein Berglauf (in der Ruhewoche nur Steigerungen).
const VORLAGEN = [
  { tage: WOCHE_A, name: "Belastung 1" },
  { tage: WOCHE_B, name: "Belastung 2" },
  { tage: WOCHE_R, name: "Ruhewoche" }
];
const PLAN_WOCHEN = 13; // bis einschließlich 24.01.2027, bei Bedarf einfach erhöhen
for (let w = SPORT_WOCHEN.length; w < PLAN_WOCHEN; w++) {
  const vorlage = VORLAGEN[(w - 4) % 3];
  SPORT_WOCHEN.push({ phase: "Build", name: vorlage.name, tage: vorlage.tage });
}

const SPORT_START = new Date(2026, 9, 26); // Montag, 26. Oktober 2026
const SPORT_SYMBOL = { lauf: "🏃", mobility: "🧘", athletik: "💪", kettlebell: "🏋️" };

// ===== Steigerung =====
// Ab Woche 5 werden Läufe und Kettlebell-Training länger, und zwar alle 3 Wochen um weitere 10 %:
// Woche 5–7: +10 %, Woche 8–10: +20 %, Woche 11–13: +30 % …
// Mobility und Athletik bleiben wie in der Lauf-App.
const STEIGERUNG_AB_WOCHE = 5;
const STEIGERUNG_SCHRITT = 0.10;
const STEIGERUNG_ALLE_WOCHEN = 3;
const steigerung = (woche) => woche + 1 >= STEIGERUNG_AB_WOCHE
  ? STEIGERUNG_SCHRITT * (Math.floor((woche + 1 - STEIGERUNG_AB_WOCHE) / STEIGERUNG_ALLE_WOCHEN) + 1) : 0;

// ===== Hilfsfunktionen =====
function sportLaden() {
  try { return JSON.parse(localStorage.getItem("sport")) || {}; }
  catch (fehler) { return {}; }
}
function sportSpeichern() { localStorage.setItem("sport", JSON.stringify(sportDaten)); }
let sportDaten = sportLaden();

const SPORT_TAGE = SPORT_WOCHEN.length * 7;
const sportDatum = (i) => new Date(SPORT_START.getFullYear(), SPORT_START.getMonth(), SPORT_START.getDate() + i);
// Kurze Zeitangabe: 45 → "45 Sek.", 60 → "1 Min.", 90 → "1:30 Min."
function kurz(sek) {
  if (sek < 60) return `${sek} Sek.`;
  const m = Math.floor(sek / 60), s = sek % 60;
  return s ? `${m}:${String(s).padStart(2, "0")} Min.` : `${m} Min.`;
}

// Rechnet einen strukturierten Lauf aus (mit Steigerung) und beschreibt den Ablauf
function strukturAusrechnen(e, plus) {
  const st = e.struktur;
  // Ein Block: pro Steigerungsstufe (+10 %) eine Wiederholung mehr.
  // Pyramide: Belastungen werden um den Prozentsatz länger, auf halbe Minuten gerundet.
  const stufen = Math.round(plus / STEIGERUNG_SCHRITT);
  const teile = st.teile.length === 1
    ? [[st.teile[0][0], st.teile[0][1], st.teile[0][2] + stufen]]
    : st.teile.map(([an, pause, wdh]) => [Math.round(an * (1 + plus) / 30) * 30, pause, wdh]);

  const sek = st.ein + st.aus + teile.reduce((summe, [an, pause, wdh]) => summe + (an + pause) * wdh, 0);
  const kern = teile.length === 1
    ? `${teile[0][2]}× ${kurz(teile[0][0])} ${st.wie}, je ${kurz(teile[0][1])} ${st.pauseWie}`
    : teile.map(([an]) => an % 60 ? `${Math.floor(an / 60)}:${String(an % 60).padStart(2, "0")}` : an / 60).join("–") +
      ` Min. ${st.wie}, je ${kurz(teile[0][1])} ${st.pauseWie}`;

  return {
    ...e,
    sek,
    km: Math.round((sek / 60) * KM_PRO_MIN * 10) / 10,
    ablauf: `${kurz(st.ein)} einlaufen · ${kern} · ${kurz(st.aus)} auslaufen`
  };
}

function einheitenAm(i) {
  const woche = Math.floor(i / 7);
  const plus = steigerung(woche);
  return SPORT_WOCHEN[woche].tage[i % 7].map(e => {
    if (e.struktur) return { ...strukturAusrechnen(e, plus), plus };
    if (!plus || !["lauf", "kettlebell"].includes(e.art)) return e;
    return {
      ...e,
      plus,
      // auf 15 Sekunden bzw. 0,1 km gerundet, damit die Zahlen handlich bleiben
      sek: e.sek ? Math.round(e.sek * (1 + plus) / 15) * 15 : e.sek,
      km: e.km ? Math.round(e.km * (1 + plus) * 10) / 10 : e.km
    };
  });
}
const sportErledigt = (i) => sportDaten[tagesSchluessel(sportDatum(i))] || [];

function sportHeuteIndex() {
  const h = new Date();
  return Math.round((new Date(h.getFullYear(), h.getMonth(), h.getDate()) - SPORT_START) / 86400000);
}

// 2130 Sekunden → "35 Min." bzw. 642 → "10 Min. 42 Sek."
function dauerText(sek) {
  const m = Math.floor(sek / 60), s = sek % 60;
  return s ? `${m} Min. ${s} Sek.` : `${m} Min.`;
}
const kmText = (km) => "~" + km.toLocaleString("de-DE") + " km";

let sportTag = 0; // gewählter Tag (0 … 34)

// ===== Anzeige =====
function sportAnzeigen() {
  const woche = Math.floor(sportTag / 7);
  const heute = sportHeuteIndex();
  const info = SPORT_WOCHEN[woche];

  document.getElementById("sport-phase").textContent = `${info.phase} · ${info.name}`;
  document.getElementById("sport-wochenzeit").textContent =
    `Woche ${woche + 1}/${SPORT_WOCHEN.length} · ` +
    sportDatum(woche * 7).toLocaleDateString("de-DE", { day: "numeric", month: "numeric" }) + "–" +
    sportDatum(woche * 7 + 6).toLocaleDateString("de-DE", { day: "numeric", month: "numeric" }) +
    (steigerung(woche) ? ` · +${Math.round(steigerung(woche) * 100)}\u00a0%` : "");
  document.getElementById("sport-woche-zurueck").style.visibility = woche > 0 ? "visible" : "hidden";
  document.getElementById("sport-woche-vor").style.visibility = woche < SPORT_WOCHEN.length - 1 ? "visible" : "hidden";

  // Wochenleiste Mo–So
  const leiste = document.getElementById("sport-leiste");
  leiste.innerHTML = "";
  let wocheGeplant = 0, wocheErledigt = 0;
  for (let t = 0; t < 7; t++) {
    const i = woche * 7 + t;
    const einheiten = einheitenAm(i);
    const erledigt = sportErledigt(i);
    wocheGeplant += einheiten.length;
    wocheErledigt += erledigt.length;

    const knopf = document.createElement("button");
    knopf.className = "sport-tag";
    if (i === heute) knopf.classList.add("heute");
    if (i === sportTag) knopf.classList.add("gewaehlt");
    if (einheiten.length && erledigt.length === einheiten.length) knopf.classList.add("fertig");

    const wt = document.createElement("small");
    wt.textContent = sportDatum(i).toLocaleDateString("de-DE", { weekday: "short" }).replace(".", "");
    const zahl = document.createElement("b");
    zahl.textContent = sportDatum(i).getDate();
    const sym = document.createElement("span");
    sym.textContent = einheiten.length ? einheiten.map(e => e.symbol || SPORT_SYMBOL[e.art]).join("") : "🌙";

    knopf.append(wt, zahl, sym);
    knopf.addEventListener("click", () => { sportTag = i; sportAnzeigen(); });
    leiste.appendChild(knopf);
  }
  document.getElementById("sport-woche-stand").textContent = `${wocheErledigt} von ${wocheGeplant} Einheiten diese Woche`;

  // Gewählter Tag
  const datum = sportDatum(sportTag);
  document.getElementById("sport-tag-titel").textContent =
    (sportTag === heute ? "Heute · " : "") + datum.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" });

  const liste = document.getElementById("sport-einheiten");
  liste.innerHTML = "";
  const einheiten = einheitenAm(sportTag);
  const erledigt = sportErledigt(sportTag);

  if (einheiten.length === 0) {
    const ruhe = document.createElement("li");
    ruhe.className = "sport-ruhe";
    ruhe.textContent = "🌙  Ruhetag – Erholung gehört zum Training.";
    liste.appendChild(ruhe);
  }

  einheiten.forEach((e, n) => {
    const zeile = document.createElement("li");
    if (erledigt.includes(n)) zeile.classList.add("erledigt");

    const sym = document.createElement("span");
    sym.className = "sport-symbol";
    sym.textContent = e.symbol || SPORT_SYMBOL[e.art];

    const text = document.createElement("span");
    text.className = "fokus-text";
    const titel = document.createElement("b");
    titel.textContent = e.titel;
    const details = document.createElement("small");
    const plusText = e.plus ? ` · +${Math.round(e.plus * 100)}\u00a0%` : "";
    if (e.offen) details.textContent = "Details siehe Lauf-App" + (e.plus ? `, dann +${Math.round(e.plus * 100)} %` : "");
    else if (e.art === "lauf") details.textContent = `${dauerText(e.sek)} · ${kmText(e.km)} · ` + "🔥".repeat(e.stufe) + plusText;
    else if (e.art === "kettlebell") details.textContent = `${dauerText(e.sek)} · Kraft, Ganzkörper` + plusText;
    else details.textContent = `${dauerText(e.sek)} · ${e.uebungen} Übungen`;
    text.append(titel, details);
    // Ablauf bei Intervallen bzw. Hinweis bei besonderen Läufen
    const zusatz = e.ablauf || e.hinweis;
    if (zusatz) {
      const ablauf = document.createElement("small");
      ablauf.className = "sport-ablauf";
      ablauf.textContent = zusatz;
      text.appendChild(ablauf);
    }

    const haken = document.createElement("button");
    haken.className = "todo-haken";
    haken.textContent = erledigt.includes(n) ? "✓" : "";
    if (sportTag > heute) haken.classList.add("gesperrt");
    haken.setAttribute("aria-label", e.titel + (erledigt.includes(n) ? " – erledigt" : " – abhaken"));
    haken.addEventListener("click", () => {
      if (sportTag > heute) { sportHinweis("Diese Einheit kannst du erst am Trainingstag abhaken."); return; }
      const schluessel = tagesSchluessel(datum);
      const liste = sportDaten[schluessel] || [];
      sportDaten[schluessel] = liste.includes(n) ? liste.filter(x => x !== n) : [...liste, n];
      if (!sportDaten[schluessel].length) delete sportDaten[schluessel];
      sportSpeichern();
      sportAnzeigen();
    });

    zeile.append(sym, text, haken);
    liste.appendChild(zeile);
  });

  sportGesamt();
}

function sportGesamt() {
  let geplant = 0, fertig = 0, km = 0, sek = 0;
  for (let i = 0; i < SPORT_TAGE; i++) {
    const einheiten = einheitenAm(i);
    geplant += einheiten.length;
    sportErledigt(i).forEach(n => {
      const e = einheiten[n];
      if (!e) return;
      fertig++;
      km += e.km || 0;
      sek += e.sek || 0;
    });
  }
  document.getElementById("sport-gesamt").textContent = `${fertig} / ${geplant} (${Math.round(fertig / geplant * 100)} %)`;
  document.getElementById("sport-km").textContent = "~" + km.toLocaleString("de-DE", { maximumFractionDigits: 1 }) + " km";
  document.getElementById("sport-zeit").textContent = `${Math.floor(sek / 3600)} Std. ${Math.round((sek % 3600) / 60)} Min.`;

  // Kachel auf der Startseite
  const heute = sportHeuteIndex();
  let text;
  if (heute < 0) text = "Start am 26.10.";
  else if (heute >= SPORT_TAGE) text = `Plan geschafft: ${fertig} / ${geplant} Einheiten`;
  else {
    const einheiten = einheitenAm(heute);
    const offen = einheiten.length - sportErledigt(heute).length;
    text = !einheiten.length ? "Heute: Ruhetag 🌙"
      : offen === 0 ? "Heute erledigt ✓"
      : "Heute: " + einheiten.filter((e, n) => !sportErledigt(heute).includes(n)).map(e => e.titel).join(" + ");
  }
  document.getElementById("kachel-sport-info").textContent = text;
}

function sportHinweis(text) {
  const feld = document.getElementById("hinweis");
  feld.textContent = text;
  feld.classList.add("sichtbar");
  clearTimeout(hinweisTimer);
  hinweisTimer = setTimeout(() => feld.classList.remove("sichtbar"), 3000);
}

// ===== Navigation =====
function sportWocheWechseln(richtung) {
  const neu = Math.floor(sportTag / 7) + richtung;
  if (neu < 0 || neu >= SPORT_WOCHEN.length) return;
  sportTag = neu * 7 + (sportTag % 7);
  sportAnzeigen();
  const karte = document.getElementById("sport-woche");
  karte.classList.remove("rein-links", "rein-rechts");
  void karte.offsetWidth;
  karte.classList.add(richtung > 0 ? "rein-links" : "rein-rechts");
}
document.getElementById("sport-woche-zurueck").addEventListener("click", () => sportWocheWechseln(-1));
document.getElementById("sport-woche-vor").addEventListener("click", () => sportWocheWechseln(1));

// Wischen über die Wochenkarte wechselt die Woche
let sportWisch = null;
const sportKarte = document.getElementById("sport-woche");
sportKarte.addEventListener("touchstart", (e) => {
  sportWisch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}, { passive: true });
sportKarte.addEventListener("touchend", (e) => {
  if (!sportWisch) return;
  const dx = e.changedTouches[0].clientX - sportWisch.x;
  const dy = e.changedTouches[0].clientY - sportWisch.y;
  sportWisch = null;
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) sportWocheWechseln(dx < 0 ? 1 : -1);
}, { passive: true });

function sportAufHeute() {
  sportTag = Math.min(Math.max(sportHeuteIndex(), 0), SPORT_TAGE - 1);
  sportAnzeigen();
}
window.addEventListener("hashchange", () => { if (location.hash === "#sport") sportAufHeute(); });
document.addEventListener("visibilitychange", () => { if (!document.hidden) sportAufHeute(); });

sportAufHeute();
