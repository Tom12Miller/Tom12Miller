// ===== Todos mit Tages- und Monatsansicht =====
// Gespeichert wird pro Tag eine Liste von Aufgaben, z. B.
// { "2026-10-13": [ { id: 1791..., text: "Einkaufen", erledigt: false, prio: 1 } ] }
// prio: 1 = hoch (rot), 2 = mittel (gelb), 3 = gering (grün)

const PRIO_NAMEN = { 1: "Hoch", 2: "Mittel", 3: "Gering" };
// Ältere Aufgaben ohne Priorität gelten als "mittel"
const prioVon = (todo) => todo.prio || 2;
let gewaehltePrio = 2;

function todosLaden() {
  try {
    return JSON.parse(localStorage.getItem("todos")) || {};
  } catch (fehler) {
    return {};
  }
}

function todosSpeichern() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

let todos = todosLaden();
let gewaehlterTag = new Date();   // Tag in der Tagesansicht
let monatsansicht = false;

// Vergleicht zwei Daten nur nach Tag, ohne Uhrzeit
const gleicherTag = (a, b) => tagesSchluessel(a) === tagesSchluessel(b);

// ===== Tagesansicht =====
function tagAnzeigen() {
  const heute = new Date();
  const gestern = new Date(); gestern.setDate(heute.getDate() - 1);
  const morgen = new Date(); morgen.setDate(heute.getDate() + 1);

  let titel = gewaehlterTag.toLocaleDateString("de-DE", { weekday: "long" });
  if (gleicherTag(gewaehlterTag, heute)) titel = "Heute";
  else if (gleicherTag(gewaehlterTag, gestern)) titel = "Gestern";
  else if (gleicherTag(gewaehlterTag, morgen)) titel = "Morgen";

  document.getElementById("tag-titel").textContent = titel;
  // Steht der Wochentag schon im Titel, nicht noch einmal darunter wiederholen
  const mitWochentag = ["Heute", "Gestern", "Morgen"].includes(titel);
  document.getElementById("tag-datum").textContent = gewaehlterTag.toLocaleDateString("de-DE",
    mitWochentag ? { weekday: "long", day: "numeric", month: "long", year: "numeric" }
                 : { day: "numeric", month: "long", year: "numeric" });
  document.getElementById("zu-heute").hidden = gleicherTag(gewaehlterTag, heute);

  const liste = document.getElementById("todo-liste");
  liste.innerHTML = "";
  const eintraege = todos[tagesSchluessel(gewaehlterTag)] || [];

  // Sortierung: offene vor erledigten, dann rot → gelb → grün,
  // bei gleicher Priorität in der Reihenfolge des Anlegens
  const sortiert = [...eintraege].sort((a, b) =>
    (a.erledigt - b.erledigt) || (prioVon(a) - prioVon(b)) || (a.id - b.id));

  for (const todo of sortiert) {
    const zeile = document.createElement("li");
    if (todo.erledigt) zeile.classList.add("erledigt");

    const haken = document.createElement("button");
    haken.className = "todo-haken";
    haken.textContent = todo.erledigt ? "✓" : "";
    haken.setAttribute("aria-label", todo.erledigt ? "Als offen markieren" : "Als erledigt markieren");
    haken.addEventListener("click", () => {
      todo.erledigt = !todo.erledigt;
      todosSpeichern();
      todosAktualisieren();
    });

    // Farbiger Punkt links; Antippen wechselt die Priorität
    const prio = document.createElement("button");
    prio.className = "todo-prio prio-punkt prio-" + prioVon(todo);
    prio.setAttribute("aria-label", "Priorität: " + PRIO_NAMEN[prioVon(todo)] + " (antippen zum Ändern)");
    prio.addEventListener("click", () => {
      todo.prio = prioVon(todo) % 3 + 1;  // hoch → mittel → gering → hoch
      todosSpeichern();
      todosAktualisieren();
    });

    // textContent statt innerHTML: so wird eingegebener Text nie als Code ausgeführt
    const text = document.createElement("span");
    text.className = "todo-inhalt";
    text.textContent = todo.text;

    const loeschen = document.createElement("button");
    loeschen.className = "todo-loeschen";
    loeschen.textContent = "✕";
    loeschen.setAttribute("aria-label", "Löschen");
    loeschen.addEventListener("click", () => {
      const schluessel = tagesSchluessel(gewaehlterTag);
      todos[schluessel] = todos[schluessel].filter(t => t.id !== todo.id);
      if (todos[schluessel].length === 0) delete todos[schluessel];
      todosSpeichern();
      todosAktualisieren();
    });

    zeile.append(prio, haken, text, loeschen);
    liste.appendChild(zeile);
  }

  document.getElementById("todo-leer").hidden = eintraege.length > 0;
}

// ===== Monatsansicht =====
// Die Monate stehen untereinander. Beim Scrollen werden oben und unten
// weitere Monate angehängt, und der Titel oben zeigt den aktuellen Monat.

let ersterMonat = null;  // ältester angezeigter Monat
let letzterMonat = null; // neuester angezeigter Monat
const NACHLADEN = 6;     // so viele Monate werden auf einmal angehängt

// Baut einen einzelnen Monat als Block mit Überschrift und Tagesraster
function monatsBlock(erster) {
  const jahr = erster.getFullYear();
  const monat = erster.getMonth();

  const block = document.createElement("section");
  block.className = "monat-block";
  block.dataset.titel = erster.toLocaleDateString("de-DE", { month: "long", year: "numeric" });

  const ueberschrift = document.createElement("h3");
  ueberschrift.textContent = block.dataset.titel;

  const raster = document.createElement("div");
  raster.className = "monat-raster";

  // An welchem Wochentag beginnt der Monat? (Montag = 0 … Sonntag = 6)
  const ersterWochentag = (new Date(jahr, monat, 1).getDay() + 6) % 7;
  // Tag 0 des Folgemonats = letzter Tag dieses Monats (klappt auch bei Schaltjahren)
  const tageImMonat = new Date(jahr, monat + 1, 0).getDate();

  for (let i = 0; i < ersterWochentag; i++) {
    raster.appendChild(document.createElement("span"));
  }

  for (let tag = 1; tag <= tageImMonat; tag++) {
    const datum = new Date(jahr, monat, tag);
    const feld = document.createElement("button");
    feld.className = "monat-tag";
    feld.textContent = tag;
    feld.dataset.schluessel = tagesSchluessel(datum);
    if ((datum.getDay() + 6) % 7 >= 5) feld.classList.add("wochenende");

    feld.addEventListener("click", () => {
      gewaehlterTag = datum;
      monatsansichtSetzen(false);
      window.scrollTo(0, 0);
    });
    raster.appendChild(feld);
  }

  block.append(ueberschrift, raster);
  punkteSetzen(block);
  return block;
}

// Markiert heute, den gewählten Tag und Tage mit Aufgaben
function punkteSetzen(bereich) {
  const heute = tagesSchluessel(new Date());
  const gewaehlt = tagesSchluessel(gewaehlterTag);

  bereich.querySelectorAll(".monat-tag").forEach(feld => {
    const schluessel = feld.dataset.schluessel;
    const eintraege = todos[schluessel] || [];
    feld.classList.toggle("heute", schluessel === heute);
    feld.classList.toggle("gewaehlt", schluessel === gewaehlt);
    feld.classList.toggle("alles-erledigt", eintraege.length > 0 && eintraege.every(t => t.erledigt));
    // Der Punkt bekommt die Farbe der wichtigsten offenen Aufgabe
    const offen = eintraege.filter(t => !t.erledigt);
    const hoechste = offen.length ? Math.min(...offen.map(prioVon)) : 0;
    [1, 2, 3].forEach(p => feld.classList.toggle("p" + p, hoechste === p));

    let punkt = feld.querySelector(".punkt");
    if (eintraege.length > 0 && !punkt) {
      punkt = document.createElement("span");
      punkt.className = "punkt";
      feld.appendChild(punkt);
    } else if (eintraege.length === 0 && punkt) {
      punkt.remove();
    }
  });
}

const monatPlus = (datum, anzahl) => new Date(datum.getFullYear(), datum.getMonth() + anzahl, 1);

// Baut die Liste rund um den gewählten Monat neu auf und scrollt zu ihm
function monatAnzeigen() {
  const liste = document.getElementById("monate-liste");
  liste.innerHTML = "";

  const start = monatPlus(gewaehlterTag, 0);
  ersterMonat = monatPlus(start, -NACHLADEN);
  letzterMonat = monatPlus(start, 12);

  let ziel = null;
  for (let m = ersterMonat; m <= letzterMonat; m = monatPlus(m, 1)) {
    const block = monatsBlock(m);
    if (m.getTime() === start.getTime()) ziel = block;
    liste.appendChild(block);
  }

  const kopfHoehe = document.getElementById("todo-kopf").offsetHeight;
  window.scrollTo(0, ziel.offsetTop - kopfHoehe - 8);
  monatsTitelAktualisieren();
}

// Welcher Monat ist gerade oben? Dessen Namen in die Kopfleiste schreiben
function monatsTitelAktualisieren() {
  const kopfUnten = document.getElementById("todo-kopf").getBoundingClientRect().bottom;
  let aktuell = null;
  for (const block of document.querySelectorAll(".monat-block")) {
    if (block.getBoundingClientRect().top <= kopfUnten + 60) aktuell = block;
    else break;
  }
  if (aktuell) document.getElementById("monat-titel").textContent = aktuell.dataset.titel;
}

// Beim Scrollen: Titel anpassen und bei Bedarf Monate nachladen
let scrollGeplant = false;
window.addEventListener("scroll", () => {
  if (!monatsansicht || location.hash !== "#todos" || scrollGeplant) return;
  scrollGeplant = true;

  requestAnimationFrame(() => {
    scrollGeplant = false;
    const liste = document.getElementById("monate-liste");

    // Fast unten angekommen: weitere Monate unten anhängen
    if (document.documentElement.scrollHeight - (window.scrollY + window.innerHeight) < 1200) {
      for (let i = 0; i < NACHLADEN; i++) {
        letzterMonat = monatPlus(letzterMonat, 1);
        liste.appendChild(monatsBlock(letzterMonat));
      }
    }

    // Fast oben angekommen: weitere Monate oben einfügen,
    // ohne dass die Ansicht dabei springt
    if (window.scrollY < 600) {
      const hoeheVorher = liste.offsetHeight;
      for (let i = 0; i < NACHLADEN; i++) {
        ersterMonat = monatPlus(ersterMonat, -1);
        liste.prepend(monatsBlock(ersterMonat));
      }
      window.scrollBy(0, liste.offsetHeight - hoeheVorher);
    }

    monatsTitelAktualisieren();
  });
}, { passive: true });

// ===== Umschalten zwischen Tag und Monat =====
function monatsansichtSetzen(an) {
  monatsansicht = an;
  document.getElementById("todo-tag").hidden = an;
  document.getElementById("todo-monat").hidden = !an;
  document.getElementById("monat-kopf").hidden = !an;
  document.getElementById("todo-umschalten").textContent = an ? "📋 Tag" : "📅 Monat";
  if (an) monatAnzeigen(); else tagAnzeigen();
  todoKachelAnzeigen();
}

// Kachel auf der Startseite: offene Aufgaben von heute
function todoKachelAnzeigen() {
  const heute = todos[tagesSchluessel(new Date())] || [];
  const offen = heute.filter(t => !t.erledigt).length;
  let text = "Nichts für heute";
  if (heute.length > 0) text = offen === 0 ? "Alles erledigt ✓" : `${offen} offen heute`;
  document.getElementById("kachel-todos-info").textContent = text;
}

function todosAktualisieren() {
  // In der Monatsansicht nur die Markierungen erneuern, damit die Scrollposition bleibt
  if (monatsansicht) punkteSetzen(document.getElementById("monate-liste")); else tagAnzeigen();
  todoKachelAnzeigen();
}

// ===== Knöpfe =====
document.getElementById("todo-umschalten").addEventListener("click", () => {
  monatsansichtSetzen(!monatsansicht);
});

document.getElementById("tag-zurueck").addEventListener("click", () => {
  gewaehlterTag = new Date(gewaehlterTag.getFullYear(), gewaehlterTag.getMonth(), gewaehlterTag.getDate() - 1);
  tagAnzeigen();
});
document.getElementById("tag-vor").addEventListener("click", () => {
  gewaehlterTag = new Date(gewaehlterTag.getFullYear(), gewaehlterTag.getMonth(), gewaehlterTag.getDate() + 1);
  tagAnzeigen();
});
document.getElementById("zu-heute").addEventListener("click", () => {
  gewaehlterTag = new Date();
  tagAnzeigen();
});

document.getElementById("todo-formular").addEventListener("submit", (e) => {
  e.preventDefault();  // verhindert, dass die Seite neu lädt
  const feld = document.getElementById("todo-text");
  const text = feld.value.trim();
  if (!text) return;

  const schluessel = tagesSchluessel(gewaehlterTag);
  if (!todos[schluessel]) todos[schluessel] = [];
  todos[schluessel].push({ id: Date.now(), text, erledigt: false, prio: gewaehltePrio });
  prioWaehlen(2);  // für die nächste Aufgabe wieder "mittel" vorauswählen
  todosSpeichern();
  feld.value = "";
  tagAnzeigen();
  todoKachelAnzeigen();
});

// ===== Priorität beim Anlegen wählen =====
function prioWaehlen(prio) {
  gewaehltePrio = prio;
  document.querySelectorAll(".prio-knopf").forEach(knopf => {
    const aktiv = Number(knopf.dataset.prio) === prio;
    knopf.classList.toggle("aktiv", aktiv);
    knopf.setAttribute("aria-checked", aktiv);
  });
}

document.querySelectorAll(".prio-knopf").forEach(knopf => {
  knopf.addEventListener("click", () => prioWaehlen(Number(knopf.dataset.prio)));
});

// Beim Öffnen der Todos immer mit dem heutigen Tag starten
window.addEventListener("hashchange", () => {
  if (location.hash === "#todos") {
    gewaehlterTag = new Date();
    monatsansichtSetzen(false);
  }
});

// Nach Mitternacht oder beim Zurückkehren in die App aktualisieren
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) todosAktualisieren();
});

todosAktualisieren();
