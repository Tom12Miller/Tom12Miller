// ===== Fokuswochen: 19.10.–01.11.2026 =====
// Ein fester Tagesplan für 14 Tage zum Abhaken.
// Abgehakt wird pro Tag eine Liste von Punkt-IDs:
// { "2026-10-19": ["aufstehen", "lern1", "sport"] }
// Nach den zwei Wochen kann diese Datei samt Kachel wieder entfernt werden.

const FOKUS_START = new Date(2026, 9, 19); // Monat 9 = Oktober (JavaScript zählt ab 0)
const FOKUS_TAGE = 14;
const LERN_MINIMUM = 4; // Stunden
const LERN_ZIEL = 5;    // Stunden

// ----- Der Tagesplan (gilt für jeden Tag) -----
// lern = Stunden, die dieser Punkt zur Lernzeit beiträgt
const TAGESPLAN = [
  { id: "aufstehen", zeit: "07:00", symbol: "🌅", titel: "Aufstehen & Frühstück", info: "Glas Wasser, ruhig in den Tag starten" },
  { id: "lern1", zeit: "08:00", symbol: "📚", titel: "Lernblock 1", info: "2 Std. Fokus – Handy weg", lern: 2, art: "lernen" },
  { id: "kurzpause", zeit: "10:00", symbol: "☕", titel: "Kurze Pause", info: "15 Min. bewegen, trinken" },
  { id: "lern2", zeit: "10:15", symbol: "📚", titel: "Lernblock 2", info: "2 Std. Fokus – danach sind die 4 Std. geschafft", lern: 2, art: "lernen" },
  { id: "mittag", zeit: "12:15", symbol: "🥗", titel: "Gesund kochen & Mittagessen", info: "Frisch kochen, gern etwas mehr für später" },
  { id: "pause", zeit: "13:15", symbol: "🌿", titel: "Pause", info: "1 Std. richtig abschalten – kein Lernen" },
  { id: "lern3", zeit: "14:15", symbol: "📚", titel: "Lernblock 3", info: "1 Std. Bonus – macht die 5 Std. voll", lern: 1, art: "lernen" },
  { id: "arbeit", zeit: "15:30", symbol: "💼", titel: "Arbeit & Puffer", info: "Arbeiten, Erledigungen oder Nachholen" },
  { id: "sport", zeit: "17:30", symbol: "🏃", titel: "Sport", info: "1 Std.", art: "sport" },
  { id: "abend", zeit: "19:00", symbol: "🍳", titel: "Gesund kochen & Abendessen", info: "Ausgewogen, viel Gemüse" },
  { id: "rueckblick", zeit: "21:30", symbol: "📝", titel: "Tagesrückblick", info: "5 Min.: Was lief gut? Morgen kurz ansehen" },
  { id: "schlafen", zeit: "23:00", symbol: "😴", titel: "Handy weg & schlafen", info: "8 Std. bis 7:00" }
];

// ----- Sport je Wochentag (Mo … So) -----
// Kraft und Bergläufe sind über die Woche verteilt, dazwischen lockere Tage.
const SPORTPLAN = [
  { symbol: "🏋️", titel: "Kettlebell-Training", info: "Kraft, ca. 45–60 Min." },          // Montag
  { symbol: "🚶", titel: "Spaziergang", info: "1 Std. zügig an der frischen Luft" },       // Dienstag
  { symbol: "⛰️", titel: "Steigerungsläufe am Berg", info: "Aufwärmen, Steigerungen bergauf, locker auslaufen" }, // Mittwoch
  { symbol: "🚶", titel: "Spaziergang", info: "1 Std. zügig an der frischen Luft" },       // Donnerstag
  { symbol: "🏋️", titel: "Kettlebell-Training", info: "Kraft, ca. 45–60 Min." },          // Freitag
  { symbol: "⛰️", titel: "Steigerungsläufe am Berg", info: "Aufwärmen, Steigerungen bergauf, locker auslaufen" }, // Samstag
  { symbol: "🧘", titel: "Dehnung & Mobility", info: "Ganz entspannt, ca. 45–60 Min." }   // Sonntag
];

// ===== Hilfsfunktionen =====
function fokusLaden() {
  try {
    return JSON.parse(localStorage.getItem("fokus")) || {};
  } catch (fehler) {
    return {};
  }
}
function fokusSpeichern() {
  localStorage.setItem("fokus", JSON.stringify(fokusDaten));
}

let fokusDaten = fokusLaden();

const fokusDatum = (index) => new Date(FOKUS_START.getFullYear(), FOKUS_START.getMonth(), FOKUS_START.getDate() + index);
const wochentagIndex = (datum) => (datum.getDay() + 6) % 7; // Montag = 0

// Index des heutigen Tages (kann vor dem Start negativ oder nach dem Ende ≥ 14 sein)
function heuteIndex() {
  const heute = new Date();
  const mitternacht = new Date(heute.getFullYear(), heute.getMonth(), heute.getDate());
  return Math.round((mitternacht - FOKUS_START) / 86400000);
}

// Der Plan für einen bestimmten Tag (Sport je nach Wochentag eingesetzt)
function planFuer(index) {
  const sport = SPORTPLAN[wochentagIndex(fokusDatum(index))];
  return TAGESPLAN.map(punkt => punkt.id === "sport"
    ? { ...punkt, symbol: sport.symbol, titel: sport.titel, info: sport.info }
    : punkt);
}

const erledigtAm = (index) => fokusDaten[tagesSchluessel(fokusDatum(index))] || [];

function tagesWerte(index) {
  const erledigt = erledigtAm(index);
  const plan = planFuer(index);
  const lern = plan.filter(p => p.lern && erledigt.includes(p.id)).reduce((s, p) => s + p.lern, 0);
  return {
    anzahl: erledigt.length,
    prozent: Math.round((erledigt.length / plan.length) * 100),
    lern,
    sport: erledigt.includes("sport")
  };
}

const stundenText = (wert) => wert.toLocaleString("de-DE", { maximumFractionDigits: 1 });
const minuten = (zeit) => { const [h, m] = zeit.split(":").map(Number); return h * 60 + m; };

let fokusIndex = 0;

// ===== Anzeige =====
function fokusLeisteAnzeigen() {
  const leiste = document.getElementById("fokus-leiste");
  leiste.innerHTML = "";
  const heute = heuteIndex();

  for (let i = 0; i < FOKUS_TAGE; i++) {
    const knopf = document.createElement("button");
    knopf.className = "fokus-punkt";
    const prozent = tagesWerte(i).prozent;
    if (i === heute) knopf.classList.add("heute");
    if (i === fokusIndex) knopf.classList.add("gewaehlt");
    if (i > heute) knopf.classList.add("zukunft");
    if (prozent === 100) knopf.classList.add("voll");

    const fuell = document.createElement("i");
    fuell.className = "fuell";
    fuell.style.height = prozent + "%";
    const zahl = document.createElement("span");
    zahl.textContent = fokusDatum(i).getDate();

    knopf.append(fuell, zahl);
    knopf.setAttribute("aria-label", fokusDatum(i).toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" }) + `, ${prozent} % erledigt`);
    knopf.addEventListener("click", () => fokusTagWechseln(i));
    leiste.appendChild(knopf);
  }
}

function fokusTagAnzeigen() {
  const datum = fokusDatum(fokusIndex);
  const heute = heuteIndex();
  const istHeute = fokusIndex === heute;
  const abhakbar = fokusIndex <= heute; // Zukunft kann noch nicht abgehakt werden

  document.getElementById("fokus-titel").textContent =
    `Tag ${fokusIndex + 1} · ` + (istHeute ? "Heute" : datum.toLocaleDateString("de-DE", { weekday: "long" }));
  document.getElementById("fokus-datum").textContent =
    datum.toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "long" }) + ` · Woche ${fokusIndex < 7 ? 1 : 2}`;

  document.getElementById("fokus-zurueck").style.visibility = fokusIndex > 0 ? "visible" : "hidden";
  document.getElementById("fokus-vor").style.visibility = fokusIndex < FOKUS_TAGE - 1 ? "visible" : "hidden";

  // Countdown vor dem Start
  const countdown = document.getElementById("fokus-countdown");
  countdown.hidden = heute >= 0;
  if (heute < 0) {
    const tage = -heute;
    countdown.textContent = tage === 1 ? "Morgen geht's los! 💪" : `Start in ${tage} Tagen – am Montag, 19.10.`;
  }

  // Fortschritt
  const werte = tagesWerte(fokusIndex);
  document.getElementById("fokus-balken").style.width = werte.prozent + "%";
  document.getElementById("fokus-prozent").textContent = `${werte.prozent} % erledigt`;
  document.getElementById("fokus-lernzeit").textContent =
    `📚 ${stundenText(werte.lern)} / ${LERN_MINIMUM} Std.` + (werte.lern >= LERN_ZIEL ? " · Ziel 5 ✓" : werte.lern >= LERN_MINIMUM ? " ✓" : ` (Ziel ${LERN_ZIEL})`);

  // Liste
  const liste = document.getElementById("fokus-liste");
  liste.innerHTML = "";
  const erledigt = erledigtAm(fokusIndex);
  const plan = planFuer(fokusIndex);
  const jetzt = new Date().getHours() * 60 + new Date().getMinutes();

  plan.forEach((punkt, i) => {
    const zeile = document.createElement("li");
    if (punkt.art) zeile.classList.add("art-" + punkt.art);
    if (erledigt.includes(punkt.id)) zeile.classList.add("erledigt");

    // Aktueller Programmpunkt, wenn heute angezeigt wird
    const naechster = plan[i + 1];
    if (istHeute && jetzt >= minuten(punkt.zeit) && (!naechster || jetzt < minuten(naechster.zeit))) {
      zeile.classList.add("jetzt");
    }

    const zeit = document.createElement("span");
    zeit.className = "fokus-zeit";
    zeit.textContent = punkt.zeit;

    const symbol = document.createElement("span");
    symbol.className = "fokus-symbol";
    symbol.textContent = punkt.symbol;

    const text = document.createElement("span");
    text.className = "fokus-text";
    const titel = document.createElement("b");
    titel.textContent = punkt.titel;
    const info = document.createElement("small");
    info.textContent = punkt.info;
    text.append(titel, info);

    const haken = document.createElement("button");
    haken.className = "todo-haken";
    haken.textContent = erledigt.includes(punkt.id) ? "✓" : "";
    if (!abhakbar) haken.classList.add("gesperrt");
    haken.setAttribute("aria-label", punkt.titel + (erledigt.includes(punkt.id) ? " – erledigt" : " – abhaken"));
    haken.addEventListener("click", () => {
      if (abhakbar) { fokusUmschalten(punkt.id); return; }
      // Statt stumm zu bleiben, kurz erklären, warum es nicht geht
      const start = heuteIndex() < 0;
      fokusHinweis(start
        ? "Abhaken geht ab dem Start am Montag, 19.10. 💪"
        : "Diesen Tag kannst du erst abhaken, wenn er da ist.");
    });

    zeile.append(zeit, symbol, text, haken);
    liste.appendChild(zeile);
  });
}

function fokusMorgenAnzeigen() {
  const karte = document.getElementById("fokus-morgen");
  karte.innerHTML = "";
  const h2 = document.createElement("h2");
  const p = document.createElement("p");
  p.className = "klein";

  if (fokusIndex >= FOKUS_TAGE - 1) {
    h2.textContent = "🎉 Letzter Tag";
    p.textContent = "Danach sind die zwei Fokuswochen geschafft.";
  } else {
    const naechster = fokusIndex + 1;
    const datum = fokusDatum(naechster);
    const sport = SPORTPLAN[wochentagIndex(datum)];
    h2.textContent = (naechster === heuteIndex() + 1 ? "Morgen" : "Danach") + " · " +
      datum.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "numeric" });
    p.textContent = `${sport.symbol} ${sport.titel} um 17:30 · 📚 ${LERN_MINIMUM}–${LERN_ZIEL} Std. Lernen ab 8:00`;
  }
  karte.append(h2, p);
}

function fokusGesamtAnzeigen() {
  let punkte = 0, lern = 0, sport = 0, lerntage = 0;
  for (let i = 0; i < FOKUS_TAGE; i++) {
    const w = tagesWerte(i);
    punkte += w.anzahl;
    lern += w.lern;
    if (w.sport) sport++;
    if (w.lern >= LERN_MINIMUM) lerntage++;
  }
  const gesamt = TAGESPLAN.length * FOKUS_TAGE;
  document.getElementById("fokus-gesamt").textContent = `${punkte} / ${gesamt} (${Math.round((punkte / gesamt) * 100)} %)`;
  document.getElementById("fokus-lern-gesamt").textContent = `${stundenText(lern)} Std.`;
  document.getElementById("fokus-sport-gesamt").textContent = `${sport} / ${FOKUS_TAGE}`;
  document.getElementById("fokus-lerntage").textContent = `${lerntage} / ${FOKUS_TAGE}`;

  // Kachel auf der Startseite
  const heute = heuteIndex();
  let info;
  if (heute < 0) info = -heute === 1 ? "Start morgen!" : `Start in ${-heute} Tagen`;
  else if (heute < FOKUS_TAGE) info = `Tag ${heute + 1} von ${FOKUS_TAGE} · heute ${tagesWerte(heute).prozent} %`;
  else info = `Geschafft: ${Math.round((punkte / gesamt) * 100)} % erledigt`;
  document.getElementById("kachel-fokus-info").textContent = info;
}

function fokusAktualisieren() {
  fokusLeisteAnzeigen();
  fokusTagAnzeigen();
  fokusMorgenAnzeigen();
  fokusGesamtAnzeigen();
}

// Kurzer Hinweis oben (nutzt das gleiche Feld wie die Wasser-Erinnerung)
function fokusHinweis(text) {
  const feld = document.getElementById("hinweis");
  feld.textContent = text;
  feld.classList.add("sichtbar");
  clearTimeout(hinweisTimer);
  hinweisTimer = setTimeout(() => feld.classList.remove("sichtbar"), 3000);
}

// ===== Aktionen =====
function fokusUmschalten(id) {
  const schluessel = tagesSchluessel(fokusDatum(fokusIndex));
  const liste = fokusDaten[schluessel] || [];
  fokusDaten[schluessel] = liste.includes(id) ? liste.filter(x => x !== id) : [...liste, id];
  if (fokusDaten[schluessel].length === 0) delete fokusDaten[schluessel];
  fokusSpeichern();
  fokusAktualisieren();
}

function fokusTagWechseln(neu) {
  if (neu < 0 || neu >= FOKUS_TAGE || neu === fokusIndex) return;
  const karte = document.getElementById("fokus-tag");
  const richtung = neu > fokusIndex ? "rein-links" : "rein-rechts";
  fokusIndex = neu;
  fokusAktualisieren();
  karte.classList.remove("rein-links", "rein-rechts");
  void karte.offsetWidth; // Animation neu starten
  karte.classList.add(richtung);
}

document.getElementById("fokus-zurueck").addEventListener("click", () => fokusTagWechseln(fokusIndex - 1));
document.getElementById("fokus-vor").addEventListener("click", () => fokusTagWechseln(fokusIndex + 1));

// Wischen: nach links = nächster Tag, nach rechts = vorheriger Tag
let wischStart = null;
const tagKarte = document.getElementById("fokus-tag");
tagKarte.addEventListener("touchstart", (e) => {
  wischStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}, { passive: true });
tagKarte.addEventListener("touchend", (e) => {
  if (!wischStart) return;
  const dx = e.changedTouches[0].clientX - wischStart.x;
  const dy = e.changedTouches[0].clientY - wischStart.y;
  wischStart = null;
  // Nur deutlich waagerechte Bewegungen zählen, damit Scrollen nicht blättert
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
    fokusTagWechseln(fokusIndex + (dx < 0 ? 1 : -1));
  }
}, { passive: true });

// Beim Öffnen immer auf heute springen (vor dem Start: Tag 1, danach: letzter Tag)
function fokusAufHeute() {
  fokusIndex = Math.min(Math.max(heuteIndex(), 0), FOKUS_TAGE - 1);
  fokusAktualisieren();
}

window.addEventListener("hashchange", () => {
  if (location.hash === "#fokus") fokusAufHeute();
});
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) fokusAufHeute();
});

fokusAufHeute();
