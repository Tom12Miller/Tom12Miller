// ===== Finanzen: Nettolohn − Fixkosten − Budgets = Frei =====
// Gespeichert wird:
// { netto: 2400, fixkosten: [ { id, name, betrag, intervall } ], budgets: [ { id, name, betrag } ] }
// intervall = alle wie viele Monate abgebucht wird (1, 3, 6 oder 12)

function finanzenLaden() {
  try {
    const d = JSON.parse(localStorage.getItem("finanzen")) || {};
    return { netto: d.netto || 0, fixkosten: d.fixkosten || [], budgets: d.budgets || [] };
  } catch (fehler) {
    return { netto: 0, fixkosten: [], budgets: [] };
  }
}

function finanzenSpeichern() {
  localStorage.setItem("finanzen", JSON.stringify(finanzen));
}

let finanzen = finanzenLaden();

const INTERVALL_NAMEN = { 1: "monatlich", 3: "vierteljährlich", 6: "halbjährlich", 12: "jährlich" };

// "1.234,50" oder "1234.5" → 1234.5   (ungültig → NaN)
function betragLesen(text) {
  let t = String(text).trim().replace(/\s|€/g, "");
  if (t.includes(",")) t = t.replace(/\./g, "").replace(",", ".");  // deutsches Format
  const zahl = Number(t);
  return t === "" || isNaN(zahl) || zahl < 0 ? NaN : Math.round(zahl * 100) / 100;
}

// 1234.5 → "1.234,50 €"
const euro = (zahl) => zahl.toLocaleString("de-DE", { style: "currency", currency: "EUR" });

// Ein Vertrag, der z. B. jährlich 120 € kostet, schlägt mit 10 € pro Monat zu Buche
const proMonat = (fix) => fix.betrag / (fix.intervall || 1);

function summen() {
  const fix = finanzen.fixkosten.reduce((s, f) => s + proMonat(f), 0);
  const budget = finanzen.budgets.reduce((s, b) => s + b.betrag, 0);
  const verfuegbar = finanzen.netto - fix;
  return { fix, budget, verfuegbar, rest: verfuegbar - budget };
}

// ===== Anzeige =====
function bilanzAnzeigen() {
  const s = summen();
  document.getElementById("f-netto-anzeige").textContent = euro(finanzen.netto);
  document.getElementById("f-fix-summe").textContent = euro(s.fix);
  document.getElementById("f-verfuegbar").textContent = euro(s.verfuegbar);
  document.getElementById("f-budget-summe").textContent = euro(s.budget);
  document.getElementById("f-rest").textContent = euro(s.rest);
  document.querySelector(".bilanz-zeile.frei").classList.toggle("minus-betrag", s.rest < 0);

  // Balken: Anteile am Nettolohn (bei Überziehung an der Gesamtausgabe)
  const basis = Math.max(finanzen.netto, s.fix + s.budget) || 1;
  document.getElementById("f-balken-fix").style.width = (s.fix / basis) * 100 + "%";
  document.getElementById("f-balken-budget").style.width = (s.budget / basis) * 100 + "%";
  document.getElementById("f-balken-rest").style.width = (Math.max(s.rest, 0) / basis) * 100 + "%";

  // Kachel auf der Startseite
  document.getElementById("kachel-finanzen-info").textContent =
    finanzen.netto > 0 ? "Frei: " + euro(s.rest) : "Einrichten";

  // Vorschlag nur anbieten, solange noch keine Budgets da sind
  document.getElementById("f-vorschlag").hidden = !(finanzen.budgets.length === 0 && s.verfuegbar > 0);
}

// Baut eine Liste (Fixkosten oder Budgets) auf
function listeAnzeigen(art) {
  const eintraege = finanzen[art];
  const liste = document.getElementById(art === "fixkosten" ? "f-fix-liste" : "f-budget-liste");
  document.getElementById(art === "fixkosten" ? "f-fix-leer" : "f-budget-leer").hidden = eintraege.length > 0;
  liste.innerHTML = "";

  // Größte Posten zuerst
  const sortiert = [...eintraege].sort((a, b) =>
    (art === "fixkosten" ? proMonat(b) - proMonat(a) : b.betrag - a.betrag));

  for (const eintrag of sortiert) {
    const zeile = document.createElement("li");

    const name = document.createElement("span");
    name.className = "geld-name";
    name.textContent = eintrag.name;
    if (art === "fixkosten" && eintrag.intervall > 1) {
      const info = document.createElement("small");
      info.textContent = euro(eintrag.betrag) + " " + INTERVALL_NAMEN[eintrag.intervall];
      name.appendChild(info);
    }

    // Betrag pro Monat; Antippen zum Ändern
    const betrag = document.createElement("button");
    betrag.className = "geld-betrag";
    betrag.textContent = euro(art === "fixkosten" ? proMonat(eintrag) : eintrag.betrag);
    betrag.addEventListener("click", () => {
      const frage = art === "fixkosten" && eintrag.intervall > 1
        ? `Neuer Betrag für „${eintrag.name}“ (${INTERVALL_NAMEN[eintrag.intervall]}):`
        : `Neuer Betrag für „${eintrag.name}“ pro Monat:`;
      const eingabe = prompt(frage, String(eintrag.betrag).replace(".", ","));
      if (eingabe === null) return;
      const neu = betragLesen(eingabe);
      if (isNaN(neu)) { alert("Bitte einen gültigen Betrag eingeben, z. B. 49,99"); return; }
      eintrag.betrag = neu;
      finanzenSpeichern();
      finanzenAnzeigen();
    });

    const loeschen = document.createElement("button");
    loeschen.className = "todo-loeschen";
    loeschen.textContent = "✕";
    loeschen.setAttribute("aria-label", "Löschen");
    loeschen.addEventListener("click", () => {
      if (!confirm(`„${eintrag.name}“ löschen?`)) return;
      finanzen[art] = finanzen[art].filter(e => e.id !== eintrag.id);
      finanzenSpeichern();
      finanzenAnzeigen();
    });

    zeile.append(name, betrag, loeschen);
    liste.appendChild(zeile);
  }
}

function finanzenAnzeigen() {
  listeAnzeigen("fixkosten");
  listeAnzeigen("budgets");
  bilanzAnzeigen();
}

// ===== Eingaben =====
const nettoFeld = document.getElementById("f-netto");
// Gespeicherten Wert schön formatiert anzeigen, z. B. "2.400,50"
if (finanzen.netto > 0) {
  nettoFeld.value = finanzen.netto.toLocaleString("de-DE",
    { minimumFractionDigits: finanzen.netto % 1 ? 2 : 0, maximumFractionDigits: 2 });
}

nettoFeld.addEventListener("input", () => {
  const wert = betragLesen(nettoFeld.value);
  finanzen.netto = isNaN(wert) ? 0 : wert;
  finanzenSpeichern();
  bilanzAnzeigen();
});

document.getElementById("f-fix-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("f-fix-name");
  const betrag = document.getElementById("f-fix-betrag");
  const intervall = document.getElementById("f-fix-intervall");
  const wert = betragLesen(betrag.value);
  if (!name.value.trim()) { name.focus(); return; }
  if (isNaN(wert)) { alert("Bitte einen gültigen Betrag eingeben, z. B. 49,99"); betrag.focus(); return; }

  finanzen.fixkosten.push({ id: Date.now(), name: name.value.trim(), betrag: wert, intervall: Number(intervall.value) });
  finanzenSpeichern();
  name.value = ""; betrag.value = ""; intervall.value = "1";
  finanzenAnzeigen();
});

document.getElementById("f-budget-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("f-budget-name");
  const betrag = document.getElementById("f-budget-betrag");
  const wert = betragLesen(betrag.value);
  if (!name.value.trim()) { name.focus(); return; }
  if (isNaN(wert)) { alert("Bitte einen gültigen Betrag eingeben, z. B. 300"); betrag.focus(); return; }

  finanzen.budgets.push({ id: Date.now(), name: name.value.trim(), betrag: wert });
  finanzenSpeichern();
  name.value = ""; betrag.value = "";
  finanzenAnzeigen();
});

// ===== Budget-Vorschlag nach der 50-30-20-Faustregel =====
// 50 % des Nettos für Bedarf (darin stecken schon die Fixkosten),
// 30 % für Wünsche und Freizeit, 20 % zum Sparen.
// Reicht das Verfügbare nicht, wird alles anteilig gekürzt.
document.getElementById("f-vorschlag").addEventListener("click", () => {
  const { fix, verfuegbar } = summen();
  const netto = finanzen.netto;
  let teile = [
    { name: "Lebensmittel & Alltag", betrag: Math.max(0, netto * 0.5 - fix) },
    { name: "Freizeit & Wünsche", betrag: netto * 0.3 },
    { name: "Sparen", betrag: netto * 0.2 }
  ];
  const gesamt = teile.reduce((s, t) => s + t.betrag, 0);
  const faktor = gesamt > verfuegbar ? verfuegbar / gesamt : 1;
  // Auf 10 € abrunden, damit die Zahlen handlich sind
  teile = teile
    .map(t => ({ ...t, betrag: Math.floor((t.betrag * faktor) / 10) * 10 }))
    .filter(t => t.betrag > 0);

  const text = teile.map(t => `• ${t.name}: ${euro(t.betrag)}`).join("\n");
  if (!confirm("Vorschlag nach der 50-30-20-Faustregel:\n\n" + text +
    "\n\nEinfügen? Du kannst alles danach ändern oder löschen.")) return;

  teile.forEach((t, i) => finanzen.budgets.push({ id: Date.now() + i, name: t.name, betrag: t.betrag }));
  finanzenSpeichern();
  finanzenAnzeigen();
});

finanzenAnzeigen();
