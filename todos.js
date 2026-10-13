// ===== Todos mit Tages- und Monatsansicht =====
// Gespeichert wird pro Tag eine Liste von Aufgaben, z. B.
// { "2026-10-13": [ { id: 1791..., text: "Einkaufen", erledigt: false } ] }

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
let gezeigterMonat = new Date();  // Monat in der Monatsansicht
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
  document.getElementById("tag-datum").textContent = gewaehlterTag.toLocaleDateString("de-DE",
    { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  document.getElementById("zu-heute").hidden = gleicherTag(gewaehlterTag, heute);

  const liste = document.getElementById("todo-liste");
  liste.innerHTML = "";
  const eintraege = todos[tagesSchluessel(gewaehlterTag)] || [];

  // Offene Aufgaben zuerst, erledigte unten
  const sortiert = [...eintraege].sort((a, b) => a.erledigt - b.erledigt);

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

    zeile.append(haken, text, loeschen);
    liste.appendChild(zeile);
  }

  document.getElementById("todo-leer").hidden = eintraege.length > 0;
}

// ===== Monatsansicht =====
function monatAnzeigen() {
  const jahr = gezeigterMonat.getFullYear();
  const monat = gezeigterMonat.getMonth();

  document.getElementById("monat-titel").textContent =
    gezeigterMonat.toLocaleDateString("de-DE", { month: "long", year: "numeric" });

  const raster = document.getElementById("monat-raster");
  raster.innerHTML = "";

  // An welchem Wochentag beginnt der Monat? (Montag = 0 … Sonntag = 6)
  const ersterWochentag = (new Date(jahr, monat, 1).getDay() + 6) % 7;
  // Tag 0 des Folgemonats = letzter Tag dieses Monats (klappt auch bei Schaltjahren)
  const tageImMonat = new Date(jahr, monat + 1, 0).getDate();

  for (let i = 0; i < ersterWochentag; i++) {
    raster.appendChild(document.createElement("span"));
  }

  for (let tag = 1; tag <= tageImMonat; tag++) {
    const datum = new Date(jahr, monat, tag);
    const eintraege = todos[tagesSchluessel(datum)] || [];
    const offen = eintraege.filter(t => !t.erledigt).length;

    const feld = document.createElement("button");
    feld.className = "monat-tag";
    feld.textContent = tag;
    const wochentag = (datum.getDay() + 6) % 7;
    if (wochentag >= 5) feld.classList.add("wochenende");
    if (gleicherTag(datum, new Date())) feld.classList.add("heute");
    if (gleicherTag(datum, gewaehlterTag)) feld.classList.add("gewaehlt");

    if (eintraege.length > 0) {
      const punkt = document.createElement("span");
      punkt.className = "punkt";
      feld.appendChild(punkt);
      if (offen === 0) feld.classList.add("alles-erledigt");
    }

    feld.addEventListener("click", () => {
      gewaehlterTag = datum;
      monatsansichtSetzen(false);
    });
    raster.appendChild(feld);
  }
}

// ===== Umschalten zwischen Tag und Monat =====
function monatsansichtSetzen(an) {
  monatsansicht = an;
  if (an) gezeigterMonat = new Date(gewaehlterTag.getFullYear(), gewaehlterTag.getMonth(), 1);
  document.getElementById("todo-tag").hidden = an;
  document.getElementById("todo-monat").hidden = !an;
  document.getElementById("todo-umschalten").textContent = an ? "📋 Tag" : "📅 Monat";
  todosAktualisieren();
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
  if (monatsansicht) monatAnzeigen(); else tagAnzeigen();
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

document.getElementById("monat-zurueck").addEventListener("click", () => {
  gezeigterMonat = new Date(gezeigterMonat.getFullYear(), gezeigterMonat.getMonth() - 1, 1);
  monatAnzeigen();
});
document.getElementById("monat-vor").addEventListener("click", () => {
  gezeigterMonat = new Date(gezeigterMonat.getFullYear(), gezeigterMonat.getMonth() + 1, 1);
  monatAnzeigen();
});

document.getElementById("todo-formular").addEventListener("submit", (e) => {
  e.preventDefault();  // verhindert, dass die Seite neu lädt
  const feld = document.getElementById("todo-text");
  const text = feld.value.trim();
  if (!text) return;

  const schluessel = tagesSchluessel(gewaehlterTag);
  if (!todos[schluessel]) todos[schluessel] = [];
  todos[schluessel].push({ id: Date.now(), text, erledigt: false });
  todosSpeichern();
  feld.value = "";
  tagAnzeigen();
  todoKachelAnzeigen();
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
