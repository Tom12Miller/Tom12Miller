// ===== Einstellungen =====
const TAGESZIEL = 3.0;      // Liter pro Tag
const FLASCHE = 0.5;        // Liter pro Flasche
const ABSTAND_STUNDEN = 3;  // Abstand zwischen zwei Flaschen

// ===== Speichern und Laden =====
// Gespeichert wird pro Tag eine Liste mit den Uhrzeiten jeder Flasche.
function laden() {
  try {
    return JSON.parse(localStorage.getItem("wasser")) || {};
  } catch (fehler) {
    return {};
  }
}

function speichern(daten) {
  localStorage.setItem("wasser", JSON.stringify(daten));
}

let daten = laden();

// Macht aus einem Datum einen Namen wie "2026-10-12"
function tagesSchluessel(datum) {
  const jahr = datum.getFullYear();
  const monat = String(datum.getMonth() + 1).padStart(2, "0");
  const tag = String(datum.getDate()).padStart(2, "0");
  return `${jahr}-${monat}-${tag}`;
}

// Macht aus einer Flaschenanzahl einen Text wie "1,5"
function liter(anzahl) {
  return (anzahl * FLASCHE).toFixed(1).replace(".", ",");
}

// ===== Anzeige aktualisieren =====
function anzeigen() {
  const heute = daten[tagesSchluessel(new Date())] || [];
  const anzahl = heute.length;
  const ziel = TAGESZIEL / FLASCHE;

  document.getElementById("heute").textContent = liter(anzahl);
  document.getElementById("flaschen").textContent = `${anzahl} von ${ziel} Flaschen`;
  document.getElementById("fortschritt").style.width =
    Math.min(anzahl / ziel, 1) * 100 + "%";

  const letzte = document.getElementById("letzte");
  if (anzahl > 0) {
    const zeit = new Date(heute[anzahl - 1]);
    letzte.textContent = "Letzte Flasche um " +
      zeit.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }) + " Uhr";
  } else {
    letzte.textContent = "Heute noch nichts getrunken";
  }

  verlaufAnzeigen();
  hinweisPruefen(heute, ziel);
}

function verlaufAnzeigen() {
  const liste = document.getElementById("verlauf");
  liste.innerHTML = "";

  for (let i = 0; i < 7; i++) {
    const tag = new Date();
    tag.setDate(tag.getDate() - i);
    const anzahl = (daten[tagesSchluessel(tag)] || []).length;

    const name = i === 0 ? "Heute" :
      tag.toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit" });
    const haken = anzahl * FLASCHE >= TAGESZIEL ? " ✓" : "";

    const eintrag = document.createElement("li");
    eintrag.innerHTML = `<span>${name}</span><span>${liter(anzahl)} L${haken}</span>`;
    liste.appendChild(eintrag);
  }
}

// ===== Hinweis-Feld =====
function hinweisPruefen(heute, ziel) {
  const feld = document.getElementById("hinweis");
  let text = "";

  if (heute.length === 0) {
    text = "Zeit für deine erste Flasche heute 💧";
  } else if (heute.length < ziel) {
    const stunden = (Date.now() - heute[heute.length - 1]) / 3600000;
    if (stunden >= ABSTAND_STUNDEN) {
      text = `Seit ${Math.floor(stunden)} Stunden keine Flasche – Zeit zu trinken! 💧`;
    }
  }

  feld.textContent = text;
  if (text) {
    setTimeout(() => feld.classList.add("sichtbar"), 300);
  } else {
    feld.classList.remove("sichtbar");
  }
}

// ===== Knöpfe =====
document.getElementById("trinken").addEventListener("click", () => {
  const schluessel = tagesSchluessel(new Date());
  if (!daten[schluessel]) daten[schluessel] = [];
  daten[schluessel].push(Date.now());
  speichern(daten);
  anzeigen();
});

document.getElementById("rueckgaengig").addEventListener("click", () => {
  const heute = daten[tagesSchluessel(new Date())];
  if (heute && heute.length > 0) {
    heute.pop();
    speichern(daten);
    anzeigen();
  }
});

// Wenn du die App wieder öffnest, neu prüfen
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) anzeigen();
});

anzeigen();
