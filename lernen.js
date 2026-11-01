// ===== Lernen: Lernkarten =====
// Stapel mit Karten (Begriff → Lösung). Gelernt wird in Runden zu je 20 Karten,
// danach gibt es eine Auswertung. Gespeichert wird:
// { stapel: [ { id, name, karten: [ { id, frage, antwort, richtig, falsch } ], runden: [ { datum, richtig, gesamt } ] } ] }

const RUNDE = 20; // Karten pro Runde

// Erster Stapel aus Nicos Datei (30.10.2026)
const START_STAPEL = {
  id: "investition-finanzierung",
  name: "Investition & Finanzierung",
  karten: [
    ["Kapitalwert – Definition", "Barwert aller mit der Investition verbundenen zusätzlichen Einzahlungen und Auszahlungen. (Kap. 6, Folie 11)"],
    ["Kapitalwert – Formel", "Kapitalwert = −A0 + Summe (EZ − AZ) / (1 + i)^t. Zwischen −A0 und dem Summenzeichen steht ein Plus. (Kap. 6, Folie 11)"],
    ["Kapitalisierungsfaktor – Formel und Werte bei 10 %", "1 / (1 + i)^t, für jedes Jahr einzeln. t0 = 1; t1 = 0,909091; t2 = 0,826446; t3 = 0,751315; t4 = 0,683013. 1,1 = 1 + Mindestverzinsung. (Musterlösung A7)"],
    ["Einzahlungsüberschuss", "Einzahlungen minus Auszahlungen (EZ − AZ) eines Jahres. Beispiel Bagger 1, t1: 15.000 − 2.000 = 13.000. (Musterlösung A7)"],
    ["Barwert", "Einzahlungsüberschuss × Kapitalisierungsfaktor. Beispiel: 13.000 × 0,909091 = 11.818. Nicht die reine Einzahlung verwenden. (Musterlösung A7)"],
    ["Entscheidungsregeln der Kapitalwertmethode", "Absolute Vorteilhaftigkeit: Eine Investition ist vorteilhaft, wenn ihr Kapitalwert positiv ist. Alternativenvergleich: Wähle die Alternative mit dem höchsten Kapitalwert. (Kap. 6, Folie 12; Ü6-2 b)"],
    ["Würdigung A7 (Musterlösung)", "Beide Bagger sind vorteilhaft, weil sie einen positiven Kapitalwert erzielen. Der Bagger zwei ist dem Bagger eins vorzuziehen, da sein Kapitalwert höher ist."],
    ["Kennzeichen der statischen Verfahren", "Einperiodige Betrachtung (im Regelfall eine Jahresbetrachtung), relativ einfache Berechnung mit vergleichsweise wenigen Daten, kalkulatorische Durchschnittswerte auf Basis durchschnittlicher Kosten und Erlöse. Beispiele: Kostenvergleichs-, Gewinnvergleichs-, Rentabilitäts-, Amortisationsrechnung. (Musterlösung A7 c; Kap. 6, Folie 9)"],
    ["Cashflow – Definition", "Zahlungsmittelüberschuss aus der Unternehmenstätigkeit (Folie: aus dem operativen Geschäft). Nicht „Einnahmeüberschuss“! (Musterlösung A5 a; Kap. 7, Folie 20)"],
    ["Direkte Methode (Cashflow)", "Alle einzahlungswirksamen Erträge minus alle auszahlungswirksamen Aufwendungen ergibt direkt den Cashflow. Nur echte Zahlungen, also keine Abschreibungen und kein Jahresüberschuss. (Musterlösung A5 b; Kap. 7, Folie 20)"],
    ["Indirekte Methode (Cashflow)", "Ausgangspunkt: Gewinn bzw. Verlust als Saldo der GuV. Korrektur: + nicht auszahlungswirksame Aufwendungen (typisch: Abschreibungen), − nicht einzahlungswirksame Erträge. (Musterlösung A5 b; Kap. 7, Folie 20)"],
    ["Unterstellung bei der indirekten Methode", "Man unterstellt, dass alle Erträge und Aufwendungen der GuV in derselben Periode zu Einzahlungen bzw. Auszahlungen geführt haben. Dann wäre der Gewinn tatsächlich liquide zugeflossen. Man weiß aber, dass bestimmte Aufwendungen und Erträge nicht zahlungswirksam wurden, deshalb wird korrigiert. (Musterlösung A5 b)"],
    ["Warum werden Abschreibungen hinzugerechnet?", "Abschreibungen haben den Gewinn gemindert, aber in derselben Periode nicht zu einer Auszahlung geführt. Daher werden sie dem Jahresüberschuss hinzugerechnet. (Musterlösung A5 b)"],
    ["Praktiker-Cashflow – Definition und Schema", "Vereinfachter operativer Zahlungsmittelüberschuss. Gewinn bzw. Verlust + Abschreibungen − Zuschreibungen +/− Zunahme bzw. Abnahme der Rückstellungen = operativer „Praktiker“-Cashflow. (Musterlösung A5 c; Kap. 7, Folie 21)"],
    ["Praktiker-Cashflow – Vor- und Nachteil", "Vorteil: vereinfachter Cashflow, leicht und schnell berechenbar und leicht verständlich. Nachteil: Ergebnis nicht richtig; zeigt nicht den exakten periodenbezogenen zahlungsorientierten Überschuss aus dem laufenden Geschäft, sondern nur einen groben ertragsnahen Indikator für die Finanzkraft. (Musterlösung A5 c)"],
    ["Warum wird eine Zunahme der Rückstellungen hinzugerechnet?", "Die Rückstellungen haben als Aufwand den Gewinn gemindert, in derselben Periode aber nicht zu einer Auszahlung geführt. Beispiel: Ertragsteuer 1.350 noch nicht bezahlt. (Abgeleitet aus der Abschreibungslogik A5 b, keine wörtliche Lösung)"],
    ["Die drei Basis-Rechenwerke", "Bilanz, Gewinn- und Verlustrechnung, Kapitalflussrechnung. Kapitalflussrechnung = Finanzlage (Liquidität), Bilanz = Vermögenslage, GuV = Ertragslage (Rentabilität). (Kap. 7, Folien 12 und 24)"],
    ["Aktiva und Passiva", "Aktiva = Mittelverwendung = Investition. Passiva = Mittelherkunft = Finanzierung. Beide Seiten sind immer gleich groß. (Kap. 7, Folie 17; Kap. 6, Folie 6)"],
    ["Anlagevermögen vs. Umlaufvermögen", "Anlagevermögen ist zum Gebrauch da (z. B. Betriebs-PKW, Computer). Umlaufvermögen ist zum Verbrauch da (Vorräte, Fertigerzeugnisse, Forderungen, Kassenbestand/Bank). (Kap. 7, Folie 17)"],
    ["Rückstellungen und Bankkredit – wo in der Bilanz?", "Beide im Fremdkapital. Rückstellungen sind Verpflichtungen gegenüber Dritten. Ins Eigenkapital gehört z. B. die Kapitalrücklage. (Lösung A6 / Ü7-2)"],
    ["Jahresüberschuss – Zuordnung", "In der GuV als Ergebnis (Erträge − Aufwendungen). Zusätzlich in der Kapitalflussrechnung als Ausgangspunkt, aber nur bei der indirekten Methode. (Lösung A6 und Ü7-2)"],
    ["Gezahlte Löhne und Zinsen – Zuordnung (direkte KFR)", "Gezahlte Löhne: Cashflow aus lfd. Geschäftstätigkeit. Gezahlte Zinsen: Cashflow aus Finanzierungstätigkeit. Beide stehen zusätzlich als Aufwand in der GuV. (Lösung Ü7-2; Kap. 7, Folie 23)"],
    ["Aufbau der Kapitalflussrechnung", "Cashflow aus lfd. Geschäftstätigkeit + aus Investitionstätigkeit + aus Finanzierungstätigkeit (Ursachenrechnung) = Veränderung des Finanzmittelfonds + Anfangsbestand = Endbestand Finanzmittelfonds (Fondsveränderungsrechnung). (Kap. 7, Folie 22)"]
  ]
};

// ===== Kartenpakete =====
// Neue Karten, die nachträglich per Code dazukommen. Jedes Paket wird genau einmal
// in den Zielstapel übernommen (gemerkt in lernen.pakete). Bestehende Karten und
// Ergebnisse bleiben unverändert; gelöschte Paketkarten kommen nicht zurück.
const KARTEN_PAKETE = [
  {
    id: "notizen-2026-11-01",
    stapel: START_STAPEL.id,
    stapelName: START_STAPEL.name,
    prefix: "nb-",
    karten: [
      ["Rückstellungen – wo in der Bilanz und warum?", "Fremdkapital (Passiva). Rückstellungen sind Verpflichtungen gegenüber Dritten, z. B. eine noch nicht bezahlte Steuer. Ins Eigenkapital gehört nur, was den Eigentümern zusteht (Stammkapital, Kapitalrücklage, Gewinn). (Lösung A6/Ü7-2; Kap. 7, Folie 17; Kap. 6, Folie 14)"],
      ["Forderungen – wo in der Bilanz und warum?", "Umlaufvermögen (Aktiva). Bei einer Forderung schuldet der Kunde uns Geld; sie ist ein Anspruch, also Vermögen. Gegenstück: Verbindlichkeiten = wir schulden Geld = Fremdkapital. (Lösung Ü7-2)"],
      ["Umsatzerlöse – wo zuordnen?", "Nur in die GuV, denn sie sind ein Ertrag. In der direkten Kapitalflussrechnung stehen stattdessen die „Einzahlungen von Kunden“. Beispiel: Umsatzerlöse 90.000, Einzahlungen von Kunden aber nur 45.000 wegen Verkauf auf Ziel. (Lösung Ü7-2; Kap. 7, Folien 18 und 23)"],
      ["Gezahlte Zinsen – Zuordnung in der direkten KFR", "Cashflow aus Finanzierungstätigkeit, weil Zinsen der Preis für den Kredit sind. Zusätzlich als Zinsaufwand in der GuV. Investitionstätigkeit = Kauf von Anlagen. (Lösung Ü7-2; Kap. 7, Folie 23)"],
      ["Was gehört in die GuV? (Ü7-2)", "Alle Aufwendungen und Erträge plus das Ergebnis: Abschreibungen, Umsatzerlöse, gezahlte Zinsen, gezahlte Löhne, Jahresüberschuss. (Lösung Ü7-2)"],
      ["Drei Ebenen der Grundbegriffe", "1. Zahlung: Auszahlung/Einzahlung = Abfluss/Zufluss liquider Mittel. 2. Erfolg: Aufwand/Ertrag = jede unternehmensbedingte Wertminderung / jeder unternehmensbezogene Wertzuwachs. 3. Betrieb: Kosten/Leistung = betriebsbedingte Wertminderung / betriebsbezogener Wertzuwachs. (Kap. 7, Folie 9)"],
      ["Verkauf auf Ziel – Zuordnung", "Ertrag und Leistung, keine Einzahlung. „Auf Ziel“ heißt, der Kunde zahlt später; es entsteht eine Forderung. (Lösung Ü7-1 a)"],
      ["Barverkauf – Zuordnung", "Einzahlung, Ertrag und Leistung. Das Geld fließt sofort. (Lösung Ü7-1 c)"],
      ["Handelsrechtliche Abschreibung – Zuordnung", "Nur Aufwand. Keine Zahlung; in der Kostenrechnung wird stattdessen die kalkulatorische Abschreibung angesetzt. (Lösung Ü7-1 b; Kap. 7, Folie 26)"],
      ["Tilgung eines Kredits – Zuordnung", "Nur Auszahlung, kein Aufwand und keine Kosten. Bankguthaben und Schulden sinken um denselben Betrag; der Gewinn ändert sich nicht. Nur die Zinsen sind Aufwand. (Lösung Ü7-1 d; Kap. 7, Folien 16–18)"],
      ["Lohnzahlung per Überweisung – Zuordnung", "Auszahlung, Aufwand und Kosten. Alle drei Ebenen sind betroffen. (Lösung Ü7-1 e)"],
      ["Kalkulatorische Abschreibung – Zuordnung", "Nur Kosten. „Kalkulatorisch“ gibt es nur in der Kosten- und Leistungsrechnung, deshalb kein Aufwand und keine Zahlung. Beispiel für Anderskosten. (Lösung Ü7-1 f; Kap. 7, Folie 26)"],
      ["Spendenzahlung – Zuordnung", "Auszahlung und Aufwand, keine Kosten. Die Spende ist neutraler Aufwand: unternehmens-, aber nicht betriebsbedingt. (Lösung Ü7-1 g; Kap. 7, Folie 26)"],
      ["Neutraler Aufwand", "Aufwand, der nicht betriebsbedingt ist und deshalb keine Kosten darstellt, z. B. eine Spende. (Kap. 7, Folie 26)"],
      ["Anderskosten und Zusatzkosten", "Kalkulatorische Kosten, die vom Aufwand abweichen (Anderskosten, z. B. kalkulatorische Abschreibung) oder denen gar kein Aufwand gegenübersteht (Zusatzkosten). Sie sind keine pagatorischen Kosten. (Kap. 7, Folien 26 und 27)"],
      ["Kostenvergleichsrechnung – Formeln", "Abschreibungen/Jahr = Anschaffungskosten / Nutzungsdauer. Zinsen = Anschaffungskosten / 2 × Zinssatz. Fixkosten = Abschreibungen + Zinsen. Variable Kosten = Löhne + Energie + Wartung. Gesamtkosten = Fixkosten + variable Kosten. (Lösung Ü6-1; Kap. 6, Folie 10)"],
      ["Warum Zinsen = Anschaffungskosten / 2 × Zinssatz?", "Statisches Verfahren, also Betrachtung eines durchschnittlichen Jahres. Durch die Abschreibung sinkt das gebundene Kapital von den vollen Anschaffungskosten auf null; im Durchschnitt ist die Hälfte gebunden. (Formel: Kap. 6, Folie 10; Begründung: übliche Erklärung, nicht in den Unterlagen)"],
      ["Ü6-1 Ergebnis", "Roboter 1: Fixkosten 15.429, variable Kosten 21.000, Gesamtkosten 36.429. Roboter 2: Fixkosten 15.000, variable Kosten 26.000, Gesamtkosten 41.000. (Lösung Ü6-1)"],
      ["Kostenvergleichsrechnung – Entscheidungsregel und Würdigung", "„Wähle die Alternative mit den geringsten Kosten.“ Die Rechnung basiert auf Durchschnittskosten. Ergebnis Ü6-1: Roboter 1 ist mit 36.429 € gegenüber 41.000 € vorzuziehen. (Lösung Ü6-1 b)"],
      ["Beschreibungsfunktion der BWL", "Auch Deskription. Betriebliche Strukturen, Tatbestände oder Prozesse werden systematisch beschrieben, und zwar durch Strukturierung, Begriffsbildung, Klassifikation oder Typenbildung. Frage: Wie ist etwas tatsächlich? Erster notwendiger Schritt der wissenschaftlichen Erkenntnisgewinnung; klare Begriffe und Definitionen sind notwendig, schaffen für sich allein aber noch keinen Erkenntnisgewinn. (Musterlösung A3)"],
      ["Erklärungsfunktion der BWL", "Betriebliche Phänomene werden durch das Aufzeigen von Ursache-Wirkungs-Beziehungen erklärt. Frage: Warum ist etwas, wie es ist? Beispiel: Wenn die Mitarbeiter zufrieden sind (Ursache), ist die Arbeitsproduktivität höher (Wirkung). Voraussetzung ist die Beschreibung, also was unter Zufriedenheit zu verstehen ist und wie Arbeitsproduktivität definiert wird. (Musterlösung A3)"],
      ["Gestaltungsfunktion der BWL", "Auch Präskription. Es werden Handlungsempfehlungen für die Entscheider in Unternehmen formuliert. Frage: Wie sollte etwas sein? Beispiel: Wie hoch soll der gewinnmaximale Absatzpreis in einer bestimmten Marktsituation sein? (Musterlösung A3)"],
      ["Deskription vs. Präskription – Eselsbrücke", "Deskription = Beschreibung = wie etwas ist. Präskription = Gestaltung = wie etwas sein sollte. „De-“ definiert, was ist; „Prä-“ präsentiert eine Empfehlung."]
    ]
  }
];

function paketeEinspielen(daten) {
  daten.pakete = daten.pakete || [];
  let neu = 0;
  KARTEN_PAKETE.forEach(paket => {
    if (daten.pakete.includes(paket.id)) return;
    let stapel = daten.stapel.find(s => s.id === paket.stapel);
    if (!stapel) {
      stapel = { id: paket.stapel, name: paket.stapelName, karten: [], runden: [] };
      daten.stapel.push(stapel);
    }
    paket.karten.forEach(([frage, antwort], i) => {
      const id = paket.prefix + (i + 1);
      if (stapel.karten.some(k => k.id === id)) return;
      stapel.karten.push({ id, frage, antwort, richtig: 0, falsch: 0 });
      neu++;
    });
    daten.pakete.push(paket.id);
  });
  return neu;
}

function lernenLaden() {
  try {
    const gespeichert = JSON.parse(localStorage.getItem("lernen"));
    if (gespeichert) return gespeichert;
  } catch (fehler) { /* unten neu anlegen */ }
  // Beim allerersten Öffnen den Startstapel anlegen
  return {
    stapel: [{
      id: START_STAPEL.id,
      name: START_STAPEL.name,
      karten: START_STAPEL.karten.map(([frage, antwort], i) => ({ id: "if-" + (i + 1), frage, antwort, richtig: 0, falsch: 0 })),
      runden: []
    }]
  };
}
function lernenSpeichern() { localStorage.setItem("lernen", JSON.stringify(lernen)); }

let lernen = lernenLaden();
const neuEingespielt = paketeEinspielen(lernen);
lernenSpeichern();

let aktStapel = null;   // geöffneter Stapel
let runde = null;       // { karten: [...], pos, ergebnisse: [true/false], nurFalsche }
let bearbeiteId = null; // Karte, die gerade bearbeitet wird

const neueId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const stapelVon = (id) => lernen.stapel.find(s => s.id === id);

// Quellenangabe in Klammern am Ende abtrennen: "… (Kap. 6, Folie 11)"
function antwortTeilen(text) {
  const treffer = text.match(/^(.*?)\s*\(([^()]*)\)\s*$/s);
  return treffer && treffer[1] ? { text: treffer[1], quelle: treffer[2] } : { text, quelle: "" };
}

// ===== Bereiche umschalten =====
function lernBereich(name) {
  ["lern-uebersicht", "lern-stapel", "lern-runde", "lern-auswertung"].forEach(id => {
    document.getElementById(id).hidden = id !== "lern-" + name;
  });
  window.scrollTo(0, 0);
}

// ===== Übersicht aller Stapel =====
function uebersichtAnzeigen() {
  const liste = document.getElementById("lern-stapel-liste");
  liste.innerHTML = "";
  lernen.stapel.forEach(stapel => {
    const knopf = document.createElement("button");
    knopf.className = "stapel-karte";
    const name = document.createElement("b");
    name.textContent = stapel.name;
    const info = document.createElement("small");
    const letzte = stapel.runden[stapel.runden.length - 1];
    info.textContent = `${stapel.karten.length} Karten` +
      (letzte ? ` · letzte Runde ${letzte.richtig}/${letzte.gesamt}` : " · noch nicht gelernt");
    knopf.append(name, info);
    knopf.addEventListener("click", () => stapelOeffnen(stapel.id));
    liste.appendChild(knopf);
  });
  lernKachel();
  lernBereich("uebersicht");
}

document.getElementById("lern-neuer-stapel").addEventListener("click", () => {
  const name = prompt("Name des neuen Stapels, z. B. ein Modul:");
  if (!name || !name.trim()) return;
  const stapel = { id: neueId(), name: name.trim(), karten: [], runden: [] };
  lernen.stapel.push(stapel);
  lernenSpeichern();
  stapelOeffnen(stapel.id);
});

// ===== Ein Stapel =====
function stapelOeffnen(id) {
  aktStapel = stapelVon(id);
  bearbeitenAbbrechen();
  stapelAnzeigen();
  lernBereich("stapel");
}

function stapelAnzeigen() {
  const s = aktStapel;
  document.getElementById("lern-stapel-name").textContent = s.name;
  document.getElementById("lern-starten").disabled = s.karten.length === 0;
  document.getElementById("lern-starten").textContent =
    s.karten.length ? `▶ Lernen (${RUNDE} Karten)` : "Erst Karten anlegen";

  // Bisherige Runden
  const runden = document.getElementById("lern-runden");
  runden.innerHTML = "";
  s.runden.slice(-5).reverse().forEach(r => {
    const zeile = document.createElement("div");
    zeile.className = "bilanz-zeile minus";
    const datum = document.createElement("span");
    datum.textContent = new Date(r.datum).toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "numeric" }) +
      ", " + new Date(r.datum).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
    const wert = document.createElement("span");
    wert.textContent = `${r.richtig}/${r.gesamt} (${Math.round(r.richtig / r.gesamt * 100)} %)`;
    zeile.append(datum, wert);
    runden.appendChild(zeile);
  });
  document.getElementById("lern-runden-karte").hidden = s.runden.length === 0;

  // Kartenliste
  const liste = document.getElementById("lern-karten-liste");
  liste.innerHTML = "";
  document.getElementById("lern-anzahl").textContent = `${s.karten.length} Karten`;
  s.karten.forEach(k => {
    const zeile = document.createElement("li");
    const text = document.createElement("button");
    text.className = "lern-eintrag";
    const frage = document.createElement("b");
    frage.textContent = k.frage;
    const stand = document.createElement("small");
    stand.textContent = (k.richtig || k.falsch) ? `✓ ${k.richtig}  ✗ ${k.falsch}` : "noch nicht gelernt";
    text.append(frage, stand);
    text.addEventListener("click", () => bearbeiten(k));

    const loeschen = document.createElement("button");
    loeschen.className = "todo-loeschen";
    loeschen.textContent = "✕";
    loeschen.setAttribute("aria-label", "Karte löschen");
    loeschen.addEventListener("click", () => {
      if (!confirm(`Karte „${k.frage}“ löschen?`)) return;
      s.karten = s.karten.filter(x => x.id !== k.id);
      lernenSpeichern();
      stapelAnzeigen();
    });
    zeile.append(text, loeschen);
    liste.appendChild(zeile);
  });
}

// Karte anlegen oder bearbeiten
function bearbeiten(karte) {
  bearbeiteId = karte.id;
  document.getElementById("lern-frage").value = karte.frage;
  document.getElementById("lern-antwort").value = karte.antwort;
  document.getElementById("lern-speichern").textContent = "Änderung speichern";
  document.getElementById("lern-abbrechen").hidden = false;
  document.getElementById("lern-formular").scrollIntoView({ behavior: "smooth", block: "center" });
}
function bearbeitenAbbrechen() {
  bearbeiteId = null;
  document.getElementById("lern-frage").value = "";
  document.getElementById("lern-antwort").value = "";
  document.getElementById("lern-speichern").textContent = "+ Karte hinzufügen";
  document.getElementById("lern-abbrechen").hidden = true;
}
document.getElementById("lern-abbrechen").addEventListener("click", bearbeitenAbbrechen);

document.getElementById("lern-formular").addEventListener("submit", (e) => {
  e.preventDefault();
  const frage = document.getElementById("lern-frage").value.trim();
  const antwort = document.getElementById("lern-antwort").value.trim();
  if (!frage || !antwort) { alert("Bitte Begriff und Lösung ausfüllen."); return; }
  if (bearbeiteId) {
    const k = aktStapel.karten.find(x => x.id === bearbeiteId);
    if (k) { k.frage = frage; k.antwort = antwort; }
  } else {
    aktStapel.karten.push({ id: neueId(), frage, antwort, richtig: 0, falsch: 0 });
  }
  lernenSpeichern();
  bearbeitenAbbrechen();
  stapelAnzeigen();
});

// Mehrere Karten auf einmal: eine pro Zeile, "Begriff | Lösung" (auch ";" oder Tab)
document.getElementById("lern-import").addEventListener("click", () => {
  const feld = document.getElementById("lern-import-text");
  let neu = 0, uebersprungen = 0;
  feld.value.split("\n").forEach(zeile => {
    // Nur am ERSTEN Trennzeichen teilen, damit Semikolons in der Lösung erhalten bleiben.
    // Vorrang: "|", dann Tab, dann ";"
    const trenner = ["|", "\t", ";"].find(t => zeile.includes(t));
    const stelle = trenner ? zeile.indexOf(trenner) : -1;
    const frage = stelle > 0 ? zeile.slice(0, stelle).trim() : "";
    const antwort = stelle > 0 ? zeile.slice(stelle + 1).trim() : "";
    if (!frage || !antwort) { if (zeile.trim()) uebersprungen++; return; }
    aktStapel.karten.push({ id: neueId(), frage, antwort, richtig: 0, falsch: 0 });
    neu++;
  });
  lernenSpeichern();
  feld.value = "";
  stapelAnzeigen();
  alert(`${neu} Karten hinzugefügt.` + (uebersprungen ? ` ${uebersprungen} Zeilen ohne „|“ übersprungen.` : ""));
});

document.getElementById("lern-umbenennen").addEventListener("click", () => {
  const name = prompt("Neuer Name für den Stapel:", aktStapel.name);
  if (!name || !name.trim()) return;
  aktStapel.name = name.trim();
  lernenSpeichern();
  stapelAnzeigen();
});
document.getElementById("lern-stapel-loeschen").addEventListener("click", () => {
  if (!confirm(`Stapel „${aktStapel.name}“ mit allen ${aktStapel.karten.length} Karten löschen?`)) return;
  lernen.stapel = lernen.stapel.filter(s => s !== aktStapel);
  lernenSpeichern();
  uebersichtAnzeigen();
});
document.getElementById("lern-zu-uebersicht").addEventListener("click", uebersichtAnzeigen);

// ===== Eine Runde lernen =====
// Schwache und selten gelernte Karten kommen bevorzugt dran.
function rundeZusammenstellen(karten) {
  const gemischt = (liste) => liste.map(k => [Math.random(), k]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
  const wertung = (k) => (k.richtig - k.falsch * 2) + (k.richtig + k.falsch) * 0.3 + Math.random() * 1.5;
  let auswahl = [...karten].sort((a, b) => wertung(a) - wertung(b)).slice(0, RUNDE);
  // Weniger als 20 Karten im Stapel: Karten kommen mehrfach dran
  while (auswahl.length < RUNDE && karten.length) auswahl = auswahl.concat(gemischt(karten)).slice(0, RUNDE);
  return gemischt(auswahl);
}

function rundeStarten(karten, nurFalsche = false) {
  runde = { karten, pos: 0, ergebnisse: [], nurFalsche };
  karteAnzeigen();
  lernBereich("runde");
}

document.getElementById("lern-starten").addEventListener("click", () => {
  rundeStarten(rundeZusammenstellen(aktStapel.karten));
});

function karteAnzeigen() {
  const karte = runde.karten[runde.pos];
  const gesamt = runde.karten.length;
  document.getElementById("lern-fortschritt-text").textContent = `Karte ${runde.pos + 1} von ${gesamt}`;
  document.getElementById("lern-fortschritt").style.width = (runde.pos / gesamt) * 100 + "%";
  document.getElementById("lern-richtig-bisher").textContent =
    `✓ ${runde.ergebnisse.filter(Boolean).length}  ✗ ${runde.ergebnisse.filter(x => !x).length}`;

  document.getElementById("lern-vorne").textContent = karte.frage;
  const { text, quelle } = antwortTeilen(karte.antwort);
  document.getElementById("lern-hinten-text").textContent = text;
  document.getElementById("lern-hinten-quelle").textContent = quelle;
  document.getElementById("lern-hinten-frage").textContent = karte.frage;

  const flip = document.getElementById("lern-flip");
  flip.classList.add("ohne-animation");
  flip.classList.remove("gedreht");
  void flip.offsetWidth;
  flip.classList.remove("ohne-animation");
  document.getElementById("lern-bewerten").hidden = true;
  document.getElementById("lern-tipp").hidden = false;
}

// Karte umdrehen
document.getElementById("lern-flip").addEventListener("click", () => {
  const flip = document.getElementById("lern-flip");
  flip.classList.toggle("gedreht");
  const umgedreht = flip.classList.contains("gedreht");
  document.getElementById("lern-bewerten").hidden = !umgedreht;
  document.getElementById("lern-tipp").hidden = umgedreht;
});

function bewerten(gewusst) {
  const karte = runde.karten[runde.pos];
  runde.ergebnisse.push(gewusst);
  // Statistik der echten Karte im Stapel (auch wenn sie mehrfach drankommt)
  const original = aktStapel.karten.find(k => k.id === karte.id);
  if (original) { gewusst ? original.richtig++ : original.falsch++; }
  lernenSpeichern();

  runde.pos++;
  if (runde.pos < runde.karten.length) karteAnzeigen();
  else auswertungAnzeigen();
}
document.getElementById("lern-gewusst").addEventListener("click", () => bewerten(true));
document.getElementById("lern-nicht-gewusst").addEventListener("click", () => bewerten(false));
document.getElementById("lern-abbrechen-runde").addEventListener("click", () => {
  if (runde.ergebnisse.length && !confirm("Runde abbrechen? Die bisherigen Antworten zählen trotzdem für die Karten.")) return;
  runde = null;
  stapelAnzeigen();
  lernBereich("stapel");
});

// ===== Auswertung =====
function auswertungAnzeigen() {
  const richtig = runde.ergebnisse.filter(Boolean).length;
  const gesamt = runde.ergebnisse.length;
  const prozent = Math.round(richtig / gesamt * 100);

  if (!runde.nurFalsche) {
    aktStapel.runden.push({ datum: Date.now(), richtig, gesamt });
    lernenSpeichern();
  }

  document.getElementById("lern-ergebnis").textContent = `${richtig} / ${gesamt}`;
  document.getElementById("lern-prozent").textContent = `${prozent} % richtig` + (runde.nurFalsche ? " · Wiederholung" : "");
  document.getElementById("lern-ergebnis-balken").style.width = prozent + "%";
  document.getElementById("lern-lob").textContent =
    prozent === 100 ? "Perfekt! Alles gewusst. 🏆" :
    prozent >= 80 ? "Sehr gut, das sitzt schon richtig! 💪" :
    prozent >= 60 ? "Gut! Die falschen nochmal wiederholen, dann wird's." :
    "Dranbleiben – Wiederholung macht den Unterschied. 📚";

  // Falsch beantwortete Karten (ohne Doppelte)
  const falsch = [];
  runde.karten.forEach((k, i) => { if (!runde.ergebnisse[i] && !falsch.includes(k)) falsch.push(k); });
  const liste = document.getElementById("lern-falsch-liste");
  liste.innerHTML = "";
  falsch.forEach(k => {
    const li = document.createElement("li");
    const b = document.createElement("b");
    b.textContent = k.frage;
    const s = document.createElement("small");
    s.textContent = antwortTeilen(k.antwort).text;
    li.append(b, s);
    liste.appendChild(li);
  });
  document.getElementById("lern-falsch-karte").hidden = falsch.length === 0;
  const wiederholen = document.getElementById("lern-wiederholen");
  wiederholen.hidden = falsch.length === 0;
  wiederholen.textContent = `↻ Falsche wiederholen (${falsch.length})`;
  wiederholen.onclick = () => rundeStarten([...falsch].sort(() => Math.random() - 0.5), true);

  lernBereich("auswertung");
}
document.getElementById("lern-neue-runde").addEventListener("click", () => rundeStarten(rundeZusammenstellen(aktStapel.karten)));
document.getElementById("lern-zum-stapel").addEventListener("click", () => { runde = null; stapelAnzeigen(); lernBereich("stapel"); });

// ===== Kachel auf der Startseite =====
function lernKachel() {
  const karten = lernen.stapel.reduce((s, x) => s + x.karten.length, 0);
  const alle = lernen.stapel.flatMap(s => s.runden.map(r => ({ ...r, name: s.name })));
  const letzte = alle.sort((a, b) => a.datum - b.datum).pop();
  document.getElementById("kachel-lernen-info").textContent =
    `${karten} Karten` + (letzte ? ` · zuletzt ${letzte.richtig}/${letzte.gesamt}` : "");
}

// Beim Öffnen der Kachel: laufende Runde fortsetzen, sonst Übersicht
window.addEventListener("hashchange", () => {
  if (location.hash === "#lernen" && !runde) uebersichtAnzeigen();
});

uebersichtAnzeigen();

// Einmaliger Hinweis, wenn neue Karten dazugekommen sind
if (neuEingespielt > 0) {
  setTimeout(() => {
    const feld = document.getElementById("hinweis");
    feld.textContent = `📚 ${neuEingespielt} neue Lernkarten hinzugefügt`;
    feld.classList.add("sichtbar");
    clearTimeout(hinweisTimer);
    hinweisTimer = setTimeout(() => feld.classList.remove("sichtbar"), 4000);
  }, 800);
}
