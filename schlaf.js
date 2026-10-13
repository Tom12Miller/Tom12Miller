// ===== Schlaf =====
// Gespeichert werden die Stunden pro Nacht. Als Datum zählt der Morgen,
// an dem du aufwachst: { "2026-10-13": 7.5 } = Nacht von Montag auf Dienstag.

const SCHLAF_ZIEL = 8;      // Zielwert in Stunden
const SCHLAF_SCHRITT = 0.5; // − und + ändern um 30 Minuten

function schlafLaden() {
  try {
    return JSON.parse(localStorage.getItem("schlaf")) || {};
  } catch (fehler) {
    return {};
  }
}

function schlafSpeichern() {
  localStorage.setItem("schlaf", JSON.stringify(schlaf));
}

let schlaf = schlafLaden();
let gewaehlteNacht = new Date();

// 7.5 → "7,5"
const stunden = (wert) => wert.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
// 0.5 → "+0,5", -1 → "−1,0"
const mitVorzeichen = (wert) => (wert > 0 ? "+" : wert < 0 ? "−" : "±") + stunden(Math.abs(wert));

function nachtVerschieben(datum, tage) {
  return new Date(datum.getFullYear(), datum.getMonth(), datum.getDate() + tage);
}

// Wert, der angezeigt wird, solange noch nichts eingetragen ist:
// die zuletzt eingetragene Nacht davor, sonst das Ziel
function vorschlagFuer(datum) {
  for (let i = 1; i <= 14; i++) {
    const wert = schlaf[tagesSchluessel(nachtVerschieben(datum, -i))];
    if (wert !== undefined) return wert;
  }
  return SCHLAF_ZIEL;
}

// ===== Eintragen =====
function nachtAnzeigen() {
  const heute = new Date();
  const schluessel = tagesSchluessel(gewaehlteNacht);
  const wert = schlaf[schluessel];
  const eingetragen = wert !== undefined;

  let titel;
  if (gleicherTag(gewaehlteNacht, heute)) titel = "Letzte Nacht";
  else if (gleicherTag(gewaehlteNacht, nachtVerschieben(heute, -1))) titel = "Vorletzte Nacht";
  else titel = "Nacht zum " + gewaehlteNacht.toLocaleDateString("de-DE", { weekday: "long" });

  document.getElementById("nacht-titel").textContent = titel;
  const vortag = nachtVerschieben(gewaehlteNacht, -1);
  document.getElementById("nacht-datum").textContent =
    vortag.toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "short" }) + " → " +
    gewaehlteNacht.toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "short" });

  // In die Zukunft kann man nicht eintragen
  document.getElementById("nacht-vor").style.visibility = gleicherTag(gewaehlteNacht, heute) ? "hidden" : "visible";

  const anzeige = eingetragen ? wert : vorschlagFuer(gewaehlteNacht);
  document.getElementById("schlaf-stunden").textContent = stunden(anzeige);
  document.getElementById("schlaf-wert").classList.toggle("leer", !eingetragen);
  document.getElementById("schlaf-loeschen").hidden = !eingetragen;

  const status = document.getElementById("schlaf-status");
  if (!eingetragen) {
    status.textContent = "Noch nicht eingetragen – Zahl antippen zum Übernehmen oder mit − / + anpassen";
  } else {
    const diff = wert - SCHLAF_ZIEL;
    status.textContent = diff === 0 ? "Genau dein Ziel von 8 Stunden ✓"
      : `${mitVorzeichen(diff)} Std. ${diff > 0 ? "über" : "unter"} deinem Ziel`;
  }
}

function schlafSetzen(wert) {
  schlaf[tagesSchluessel(gewaehlteNacht)] = Math.min(16, Math.max(0, wert));
  schlafSpeichern();
  schlafAktualisieren();
}

function aktuellerWert() {
  const wert = schlaf[tagesSchluessel(gewaehlteNacht)];
  return wert !== undefined ? wert : vorschlagFuer(gewaehlteNacht);
}

document.getElementById("schlaf-minus").addEventListener("click", () => schlafSetzen(aktuellerWert() - SCHLAF_SCHRITT));
document.getElementById("schlaf-plus").addEventListener("click", () => schlafSetzen(aktuellerWert() + SCHLAF_SCHRITT));
document.getElementById("schlaf-wert").addEventListener("click", () => schlafSetzen(aktuellerWert()));

document.getElementById("schlaf-loeschen").addEventListener("click", () => {
  delete schlaf[tagesSchluessel(gewaehlteNacht)];
  schlafSpeichern();
  schlafAktualisieren();
});

document.getElementById("nacht-zurueck").addEventListener("click", () => {
  gewaehlteNacht = nachtVerschieben(gewaehlteNacht, -1);
  nachtAnzeigen();
});
document.getElementById("nacht-vor").addEventListener("click", () => {
  gewaehlteNacht = nachtVerschieben(gewaehlteNacht, 1);
  nachtAnzeigen();
});

// ===== Statistik der letzten 7 Nächte =====
function schlafStatistik() {
  const diagramm = document.getElementById("schlaf-diagramm");
  diagramm.innerHTML = "";

  const naechte = [];
  for (let i = 6; i >= 0; i--) {
    const datum = nachtVerschieben(new Date(), -i);
    naechte.push({
      name: i === 0 ? "Heute" : datum.toLocaleDateString("de-DE", { weekday: "short" }),
      wert: schlaf[tagesSchluessel(datum)]
    });
  }

  // Skala: mindestens 10 Stunden, damit die 8-Stunden-Linie nicht ganz oben klebt
  const maximum = Math.max(10, ...naechte.map(n => n.wert || 0));
  const zielHoehe = (SCHLAF_ZIEL / maximum) * 80;

  for (const nacht of naechte) {
    const spalte = document.createElement("div");
    spalte.className = "spalte";

    const flaeche = document.createElement("div");
    flaeche.className = "flaeche";

    const ziel = document.createElement("div");
    ziel.className = "ziel";
    ziel.style.bottom = zielHoehe + "%";

    const wertText = document.createElement("span");
    wertText.className = "wert";
    const saeule = document.createElement("div");
    saeule.className = "saeule";
    const abw = document.createElement("span");
    abw.className = "abw";

    if (nacht.wert !== undefined) {
      wertText.textContent = stunden(nacht.wert);
      saeule.style.height = (nacht.wert / maximum) * 80 + "%";
      saeule.classList.add(nacht.wert >= SCHLAF_ZIEL ? "schlaf-gut" : nacht.wert >= 7 ? "schlaf-knapp" : "schlaf-wenig");
      const diff = nacht.wert - SCHLAF_ZIEL;
      abw.textContent = mitVorzeichen(diff);
      abw.classList.add(diff >= 0 ? "plus" : "minus");
    } else {
      wertText.textContent = "–";
      saeule.style.height = "0";
    }

    flaeche.append(ziel, wertText, saeule);
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = nacht.name;
    spalte.append(flaeche, tag, abw);
    diagramm.appendChild(spalte);
  }

  // Zusammenfassung nur über Nächte, die auch eingetragen sind
  const werte = naechte.map(n => n.wert).filter(w => w !== undefined);
  if (werte.length === 0) {
    ["schlaf-schnitt", "schlaf-abweichung", "schlaf-summe"].forEach(id => document.getElementById(id).textContent = "–");
    return;
  }
  const schnitt = werte.reduce((s, w) => s + w, 0) / werte.length;
  const summe = werte.reduce((s, w) => s + (w - SCHLAF_ZIEL), 0);
  document.getElementById("schlaf-schnitt").textContent =
    stunden(schnitt) + " Std." + (werte.length < 7 ? ` (${werte.length} Nächte)` : "");
  document.getElementById("schlaf-abweichung").textContent = mitVorzeichen(schnitt - SCHLAF_ZIEL) + " Std.";
  document.getElementById("schlaf-summe").textContent = mitVorzeichen(summe) + " Std.";
}

// Kachel auf der Startseite
function schlafKachel() {
  const wert = schlaf[tagesSchluessel(new Date())];
  document.getElementById("kachel-schlaf-info").textContent =
    wert !== undefined ? `Letzte Nacht: ${stunden(wert)} Std.` : "Letzte Nacht eintragen";
}

function schlafAktualisieren() {
  nachtAnzeigen();
  schlafStatistik();
  schlafKachel();
}

// Beim Öffnen immer mit der letzten Nacht starten
window.addEventListener("hashchange", () => {
  if (location.hash === "#schlaf") {
    gewaehlteNacht = new Date();
    schlafAktualisieren();
  }
});
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) schlafAktualisieren();
});

schlafAktualisieren();
