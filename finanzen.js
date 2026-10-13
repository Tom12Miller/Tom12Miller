// ===== Finanzen: Nettolohn − Fixkosten − Budgets = Frei =====
// Gespeichert wird:
// { netto: 2400, fixkosten: [ { id, name, betrag, intervall } ], budgets: [ { id, name, betrag } ] }
// intervall = alle wie viele Monate abgebucht wird (1, 3, 6 oder 12)

function finanzenLaden() {
  try {
    const d = JSON.parse(localStorage.getItem("finanzen")) || {};
    return { netto: d.netto || 0, fixkosten: d.fixkosten || [], budgets: d.budgets || [],
             brutto: d.brutto || 0, sonder: d.sonder || 0 };
  } catch (fehler) {
    return { netto: 0, fixkosten: [], budgets: [], brutto: 0, sonder: 0 };
  }
}

function finanzenSpeichern() {
  localStorage.setItem("finanzen", JSON.stringify(finanzen));
}

let finanzen = finanzenLaden();

const INTERVALL_NAMEN = { 1: "monatlich", 3: "vierteljährlich", 6: "halbjährlich", 12: "jährlich" };

// "1.234,50", "4.000", "1234,5" oder "49.99" → Zahl   (ungültig → NaN)
function betragLesen(text) {
  let t = String(text).trim().replace(/\s|€/g, "");
  if (t.includes(",")) {
    t = t.replace(/\./g, "").replace(",", ".");   // deutsch: Punkt = Tausender, Komma = Dezimal
  } else if (/^\d{1,3}(\.\d{3})+$/.test(t)) {
    t = t.replace(/\./g, "");                      // "4.000" oder "1.250.000" = Tausenderpunkte
  }
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
  vergleichAnzeigen();  // Netto-Anteil im Gehaltsvergleich mitziehen
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

// ===== Gehaltsvergleich mit Deutschland =====
// Quelle: Statistisches Bundesamt (Destatis), Pressemitteilung Nr. 113 vom 1. April 2026.
// Bruttojahresverdienste 2025 von Vollzeitbeschäftigten, einschließlich Sonderzahlungen.
// Destatis veröffentlicht neue Zahlen ungefähr jedes Frühjahr; dann hier aktualisieren.
const VERGLEICH = {
  jahr: 2025,
  quelle: "Statistisches Bundesamt, Pressemitteilung Nr. 113 vom 1. April 2026",
  median: 54066,
  durchschnitt: 64441,
  // [Prozent der Vollzeitbeschäftigten, die höchstens so viel verdienen, Jahresbrutto]
  perzentile: [[10, 33828], [30, 44215], [50, 54066], [80, 80000], [90, 100719], [99, 219110]]
};

// Schätzt, wie viel Prozent weniger verdienen, indem zwischen den
// bekannten Grenzen geradlinig verbunden wird (Näherung, daher "ca.")
function perzentilSchaetzen(jahresbrutto) {
  const p = VERGLEICH.perzentile;
  if (jahresbrutto < p[0][1]) return { unter: true };
  if (jahresbrutto >= p[p.length - 1][1]) return { ueber: true };
  for (let i = 0; i < p.length - 1; i++) {
    const [p1, w1] = p[i], [p2, w2] = p[i + 1];
    if (jahresbrutto < w2) return { wert: Math.round(p1 + (p2 - p1) * (jahresbrutto - w1) / (w2 - w1)) };
  }
}

const euroRund = (zahl) => zahl.toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

function vergleichAnzeigen() {
  document.getElementById("f-vgl-quelle").textContent =
    `Quelle: ${VERGLEICH.quelle}. Werte für ${VERGLEICH.jahr}, nur Vollzeit, inklusive Sonderzahlungen. ` +
    "Die Einordnung in Prozent ist eine Schätzung.";

  const bereich = document.getElementById("f-vergleich");
  if (!(finanzen.brutto > 0)) { bereich.hidden = true; return; }
  bereich.hidden = false;

  const jahr = finanzen.brutto * 12 + (finanzen.sonder || 0);
  const rang = perzentilSchaetzen(jahr);
  const abstand = (jahr / VERGLEICH.median - 1) * 100;

  let rangText;
  if (rang.unter) rangText = "Du gehörst zu den unteren 10 % der Vollzeitbeschäftigten.";
  else if (rang.ueber) rangText = "Du gehörst zum obersten 1 % der Vollzeitbeschäftigten. 🚀";
  else rangText = `Du verdienst mehr als ca. ${rang.wert} % der Vollzeitbeschäftigten.`;
  document.getElementById("f-vgl-rang").textContent = rangText;

  const prozent = Math.abs(abstand).toLocaleString("de-DE", { maximumFractionDigits: 0 });
  document.getElementById("f-vgl-median").textContent = Math.abs(abstand) < 1
    ? "Damit liegst du genau beim mittleren Gehalt."
    : `Das sind ${prozent} % ${abstand > 0 ? "mehr" : "weniger"} als das mittlere Gehalt.`;

  document.getElementById("f-vgl-jahr").textContent = euroRund(jahr);
  document.getElementById("f-vgl-med-wert").textContent = euroRund(VERGLEICH.median);
  document.getElementById("f-vgl-avg-wert").textContent = euroRund(VERGLEICH.durchschnitt);

  // Netto-Anteil, falls auch der Nettolohn eingetragen ist
  const quoteZeile = document.getElementById("f-vgl-quote-zeile");
  quoteZeile.hidden = !(finanzen.netto > 0);
  if (finanzen.netto > 0) {
    document.getElementById("f-vgl-quote").textContent =
      Math.round((finanzen.netto / finanzen.brutto) * 100) + " %";
  }

  // Skala von 0 bis 120.000 € mit Markierungen
  const MAX = 120000;
  const pos = (wert) => Math.min(wert / MAX, 1) * 100 + "%";
  const marken = document.getElementById("f-skala-marken");
  marken.innerHTML = "";
  [["10 %", 33828], ["Median", VERGLEICH.median], ["Ø", VERGLEICH.durchschnitt], ["Top 10 %", 100719]]
    .forEach(([name, wert]) => {
      const marke = document.createElement("div");
      marke.className = "skala-marke";
      marke.style.left = pos(wert);
      const text = document.createElement("span");
      text.textContent = name;
      marke.appendChild(text);
      marken.appendChild(marke);
    });
  document.getElementById("f-skala-du").style.left = pos(jahr);
}

// Eingabefelder für Brutto und Sonderzahlungen
[["f-brutto", "brutto"], ["f-sonder", "sonder"]].forEach(([id, feldname]) => {
  const feld = document.getElementById(id);
  if (finanzen[feldname] > 0) {
    feld.value = finanzen[feldname].toLocaleString("de-DE",
      { minimumFractionDigits: finanzen[feldname] % 1 ? 2 : 0, maximumFractionDigits: 2 });
  }
  feld.addEventListener("input", () => {
    const wert = betragLesen(feld.value);
    finanzen[feldname] = isNaN(wert) ? 0 : wert;
    finanzenSpeichern();
    vergleichAnzeigen();
  });
});

finanzenAnzeigen();
vergleichAnzeigen();
