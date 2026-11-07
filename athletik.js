// ===== Athletik, Mobility und Lauf: Übungen zum Aufklappen =====
// Eigene Übungsauswahl für Läufer (ohne Gewicht), angezeigt wie beim Kettlebell-Training.
// Nutzt die Strichfiguren-Engine aus kettlebell.js (P, kbGrafik, kbAnimieren).

// ===== Zusätzliche Posen =====
// Laufschritt in vier Bildern: rechtes Bein vorn → Mitte → linkes Bein vorn → Mitte
function laufZyklus(basis, vorn, hinten, mitteStand, mitteSchwung, armVorn, armHinten, armMitte) {
  return [
    { ...basis, knie: vorn[0], fuss: vorn[1], knie2: hinten[0], fuss2: hinten[1],
      ellbogen: armHinten[0], hand: armHinten[1], ellbogen2: armVorn[0], hand2: armVorn[1] },
    { knie: mitteStand[0], fuss: mitteStand[1], knie2: mitteSchwung[0], fuss2: mitteSchwung[1],
      ellbogen: armMitte[0], hand: armMitte[1], ellbogen2: armMitte[0], hand2: armMitte[1] },
    { knie: hinten[0], fuss: hinten[1], knie2: vorn[0], fuss2: vorn[1],
      ellbogen: armVorn[0], hand: armVorn[1], ellbogen2: armHinten[0], hand2: armHinten[1] },
    { knie: mitteSchwung[0], fuss: mitteSchwung[1], knie2: mitteStand[0], fuss2: mitteStand[1],
      ellbogen: armMitte[0], hand: armMitte[1], ellbogen2: armMitte[0], hand2: armMitte[1] }
  ];
}

const JOGGEN = laufZyklus({ kopf: [55, 15], schulter: [53, 23], huefte: [49, 50] },
  [[57, 68], [62, 90]], [[42, 69], [33, 84]], [[51, 70], [49, 91]], [[56, 62], [47, 75]],
  [[58, 33], [63, 26]], [[46, 33], [50, 41]], [[52, 36], [58, 40]]);

const SPRINTEN = laufZyklus({ kopf: [59, 16], schulter: [56, 24], huefte: [49, 50] },
  [[62, 62], [66, 82]], [[40, 70], [28, 80]], [[52, 70], [50, 91]], [[58, 58], [46, 70]],
  [[62, 30], [66, 22]], [[46, 32], [48, 42]], [[55, 36], [61, 39]]);

const GEHEN = laufZyklus({ kopf: [50, 14], schulter: [50, 22], huefte: [50, 50] },
  [[54, 70], [58, 91]], [[46, 70], [42, 91]], [[50, 70], [50, 92]], [[52, 68], [48, 86]],
  [[52, 36], [55, 47]], [[48, 36], [47, 48]], [[50, 36], [50, 48]]);

// Bergauf: Boden geneigt, Füße folgen der Steigung, Oberkörper weiter nach vorn
const steigung = (x) => 98 - (18 / 92) * (x - 4);
function bergauf(frames) {
  const voll = frames.map(f => ({ ...frames[0], ...f }));
  return voll.map(f => {
    const neu = {};
    for (const k in f) {
      const [x, y] = f[k];
      if (k === "fuss" || k === "fuss2") neu[k] = [x, steigung(x) - (92 - y)];
      else if (["kopf", "schulter", "ellbogen", "hand", "ellbogen2", "hand2"].includes(k)) neu[k] = [x + 3, y - 3];
      else neu[k] = [x, y - 3];
    }
    return neu;
  });
}

const STEHEN = { kopf: [50, 14], schulter: [50, 22], huefte: [50, 50], knie: [50, 70], fuss: [50, 92], knie2: [50, 70], fuss2: [50, 92],
  ellbogen: [50, 36], hand: [50, 48], ellbogen2: [50, 36], hand2: [50, 48] };
const VIERFUSS = { kopf: [78, 64], schulter: [70, 70], huefte: [44, 70], knie: [44, 90], fuss: [26, 90], knie2: [44, 90], fuss2: [26, 90],
  ellbogen: [70, 80], hand: [70, 90], ellbogen2: [70, 80], hand2: [70, 90] };
const RUECKENLAGE = { kopf: [20, 86], schulter: [28, 86], huefte: [52, 86], knie: [64, 72], fuss: [72, 92], ellbogen: [36, 90], hand: [44, 90] };

Object.assign(P, {
  joggen:   { ohneKb: true, dauer: 1000, halten: 0, frames: JOGGEN },
  sprinten: { ohneKb: true, dauer: 720, halten: 0, frames: SPRINTEN },
  gehen:    { ohneKb: true, dauer: 1500, halten: 0, frames: GEHEN },
  bergauf:  { ohneKb: true, dauer: 820, halten: 0, boden: [4, 98, 96, 80], frames: bergauf(SPRINTEN) },
  // Lauf-ABC
  skipping: { ohneKb: true, dauer: 700, halten: 0.05, frames: [
    { ...STEHEN, knie: [60, 52], fuss: [58, 72], fuss2: [50, 91], ellbogen: [44, 34], hand: [46, 42], ellbogen2: [57, 32], hand2: [60, 24] },
    { knie: [50, 70], fuss: [50, 91], knie2: [60, 52], fuss2: [58, 72], ellbogen: [57, 32], hand: [60, 24], ellbogen2: [44, 34], hand2: [46, 42] }
  ]},
  anfersen: { ohneKb: true, dauer: 700, halten: 0.05, frames: [
    { ...STEHEN, knie: [51, 70], fuss: [40, 56], fuss2: [50, 91], ellbogen: [44, 34], hand: [46, 42], ellbogen2: [57, 33], hand2: [60, 26] },
    { knie: [50, 70], fuss: [50, 91], knie2: [51, 70], fuss2: [40, 56], ellbogen: [57, 33], hand: [60, 26], ellbogen2: [44, 34], hand2: [46, 42] }
  ]},
  hopser: { ohneKb: true, dauer: 1000, halten: 0.05, frames: [
    { kopf: [52, 8], schulter: [52, 16], huefte: [50, 44], knie: [60, 46], fuss: [58, 66], knie2: [48, 66], fuss2: [46, 87],
      ellbogen: [44, 28], hand: [46, 36], ellbogen2: [58, 24], hand2: [62, 12] },
    { kopf: [52, 14], schulter: [52, 22], huefte: [50, 50], knie: [50, 70], fuss: [50, 91], knie2: [60, 52], fuss2: [58, 72],
      ellbogen: [58, 30], hand: [62, 18], ellbogen2: [44, 34], hand2: [46, 42] }
  ]},
  // Athletik
  kniebeuge: { ohneKb: true, frames: [
    { kopf: [50, 14], schulter: [50, 22], huefte: [50, 50], knie: [52, 70], fuss: [50, 92], ellbogen: [57, 32], hand: [65, 33] },
    { kopf: [56, 34], schulter: [52, 42], huefte: [36, 66], knie: [56, 70], ellbogen: [62, 46], hand: [71, 44] }
  ]},
  ausfallschritt: { ohneKb: true, frames: [
    { kopf: [48, 14], schulter: [48, 22], huefte: [48, 50], knie: [58, 70], fuss: [64, 92], knie2: [42, 71], fuss2: [32, 90], ellbogen: [48, 36], hand: [48, 48] },
    { kopf: [48, 28], schulter: [48, 36], huefte: [48, 64], knie: [64, 70], knie2: [44, 87], fuss2: [30, 90], ellbogen: [48, 50], hand: [48, 62] }
  ]},
  wadenheben: { ohneKb: true, frames: [
    { ...STEHEN },
    { kopf: [50, 8], schulter: [50, 16], huefte: [50, 44], knie: [50, 64], fuss: [51, 90], knie2: [50, 64], fuss2: [51, 90],
      ellbogen: [50, 30], hand: [50, 42], ellbogen2: [50, 30], hand2: [50, 42] }
  ]},
  brueckeEinbeinig: { ohneKb: true, frames: [
    { ...RUECKENLAGE, knie2: [70, 66], fuss2: [86, 58] },
    { huefte: [52, 72], knie: [66, 68], knie2: [68, 58], fuss2: [84, 46] }
  ]},
  kreuzhebenEinbeinig: { ohneKb: true, dauer: 3200, frames: [
    { kopf: [50, 14], schulter: [50, 22], huefte: [50, 50], knie: [50, 70], fuss: [50, 92], knie2: [48, 70], fuss2: [46, 90], ellbogen: [51, 36], hand: [52, 48] },
    { kopf: [74, 40], schulter: [66, 44], huefte: [48, 52], knie2: [32, 53], fuss2: [13, 53], ellbogen: [67, 56], hand: [68, 68] }
  ]},
  stepUp: { ohneKb: true, stufe: true, frames: [
    { kopf: [44, 18], schulter: [44, 26], huefte: [44, 54], knie: [58, 62], fuss: [62, 78], knie2: [44, 74], fuss2: [42, 92],
      ellbogen: [42, 40], hand: [44, 52], ellbogen2: [48, 40], hand2: [52, 50] },
    { kopf: [60, 4], schulter: [60, 12], huefte: [60, 40], knie: [61, 60], knie2: [70, 44], fuss2: [66, 62],
      ellbogen: [56, 26], hand: [58, 36], ellbogen2: [66, 24], hand2: [70, 16] }
  ]},
  beinSeitlich: { ohneKb: true, frames: [
    { kopf: [14, 80], schulter: [22, 84], huefte: [50, 86], knie: [66, 88], fuss: [82, 89], knie2: [66, 88], fuss2: [82, 89],
      ellbogen: [20, 91], hand: [12, 84], ellbogen2: [36, 82], hand2: [48, 82] },
    { knie2: [66, 80], fuss2: [81, 70] }
  ]},
  // Mobility
  katzeKuh: { ohneKb: true, dauer: 4400, halten: 0.2, frames: [
    { ...VIERFUSS, mitte: [57, 60], kopf: [75, 76] },
    { mitte: [57, 78], kopf: [80, 60] }
  ]},
  hueftbeuger: { ohneKb: true, dauer: 4400, halten: 0.3, frames: [
    { kopf: [46, 32], schulter: [46, 40], huefte: [44, 66], knie: [64, 72], fuss: [66, 92], knie2: [40, 90], fuss2: [22, 90],
      ellbogen: [40, 52], hand: [45, 62] },
    { kopf: [52, 33], schulter: [51, 41], huefte: [51, 68], knie: [67, 71], ellbogen: [45, 54], hand: [52, 64] }
  ]},
  wade: { ohneKb: true, wand: true, dauer: 4400, halten: 0.3, frames: [
    { kopf: [70, 24], schulter: [64, 30], huefte: [52, 52], knie: [62, 72], fuss: [64, 92], knie2: [41, 72], fuss2: [30, 92],
      ellbogen: [75, 33], hand: [86, 30] },
    { kopf: [73, 25], schulter: [67, 31], huefte: [55, 53], knie: [65, 72], knie2: [43, 72], ellbogen: [77, 34] }
  ]},
  oberschenkel: { ohneKb: true, dauer: 4400, halten: 0.3, frames: [
    { ...STEHEN, knie2: [50, 70], fuss2: [40, 56], ellbogen2: [45, 40], hand2: [41, 55], ellbogen: [56, 34], hand: [62, 42] },
    { knie2: [48, 71], fuss2: [38, 54], hand2: [39, 53] }
  ]},
  kindhaltung: { ohneKb: true, dauer: 5000, halten: 0.3, frames: [
    { ...VIERFUSS, hand: [78, 90], ellbogen: [74, 80], hand2: [78, 90], ellbogen2: [74, 80] },
    { kopf: [64, 84], schulter: [56, 80], huefte: [32, 80], ellbogen: [68, 87], hand: [82, 90], ellbogen2: [68, 87], hand2: [82, 90] }
  ]},
  worldsGreatest: { ohneKb: true, dauer: 3600, halten: 0.2, frames: [
    { kopf: [74, 58], schulter: [66, 60], huefte: [48, 72], knie: [64, 72], fuss: [66, 92], knie2: [36, 82], fuss2: [18, 90],
      ellbogen2: [70, 75], hand2: [72, 90], ellbogen: [64, 74], hand: [61, 88] },
    { ellbogen: [66, 44], hand: [67, 29] }
  ]},
  brustRotation: { ohneKb: true, dauer: 3600, halten: 0.2, frames: [
    { ...VIERFUSS },
    { ellbogen2: [72, 54], hand2: [73, 38] }
  ]},
  beinrueckseite: { ohneKb: true, dauer: 4400, halten: 0.3, frames: [
    { ...STEHEN, knie2: [52, 70], fuss2: [56, 92] },
    { kopf: [70, 58], schulter: [64, 54], huefte: [50, 50], ellbogen: [66, 66], hand: [64, 78], ellbogen2: [66, 66], hand2: [64, 78] }
  ]}
});

// Wand für die Wadendehnung nachrüsten (in kbGrafik nicht vorgesehen)
const kbGrafikOriginal = kbGrafik;
kbGrafik = function (poseName) {
  const svg = kbGrafikOriginal(poseName);
  return P[poseName].wand ? svg.replace("</svg>", '<rect class="kb-bank" x="88" y="8" width="5" height="84" rx="1"/></svg>') : svg;
};

// ===== Übungen =====
const ATHLETIK = {
  kniebeuge:    { name: "Kniebeuge", pose: "kniebeuge", wdh: 12, hinweise: ["Füße hüftbreit, Fersen bleiben am Boden", "Po nach hinten, Knie zeigen nach außen", "Oberkörper aufrecht, Rücken gerade"] },
  ausfall:      { name: "Ausfallschritt", pose: "ausfallschritt", wdh: 8, seite: true, hinweise: ["Großer Schritt nach vorn", "Hinteres Knie fast bis zum Boden", "Vorderes Knie bleibt über dem Fuß"] },
  bruecke:      { name: "Einbeinige Hüftbrücke", pose: "brueckeEinbeinig", wdh: 10, seite: true, hinweise: ["Ein Bein gestreckt in der Luft", "Hüfte hochdrücken, Po anspannen", "Becken bleibt waagerecht"] },
  waden:        { name: "Wadenheben", pose: "wadenheben", wdh: 15, hinweise: ["Langsam ganz auf die Zehenspitzen", "Oben kurz halten", "Kontrolliert ablassen – wichtig gegen Wadenprobleme"] },
  wadenEin:     { name: "Einbeiniges Wadenheben", pose: "wadenheben", wdh: 10, seite: true, hinweise: ["Auf einem Bein, zur Not an der Wand festhalten", "Volle Bewegung, oben halten", "Langsam ablassen"] },
  seitstuetz:   { name: "Seitstütz", pose: "seitstuetz", wdh: 25, einheit: "Sek.", seite: true, hinweise: ["Ellbogen oder Hand unter der Schulter", "Hüfte hoch, Körper in einer Linie", "Ruhig weiteratmen"] },
  diagonal:     { name: "Stütz mit Arm- und Beinheben", pose: "plankDiagonal", wdh: 8, seite: true, hinweise: ["Gegenüberliegenden Arm und Bein strecken", "Becken bleibt ruhig", "Kurz halten, dann wechseln"] },
  stepUp:       { name: "Step-up", pose: "stepUp", wdh: 10, seite: true, hinweise: ["Stufe oder stabile Bank, ca. kniehoch", "Ganzer Fuß auf die Stufe, über die Ferse hochdrücken", "Oben das andere Knie hochziehen"] },
  kreuzheben:   { name: "Einbeiniges Kreuzheben", pose: "kreuzhebenEinbeinig", wdh: 8, seite: true, hinweise: ["Standbein leicht gebeugt", "Oberkörper und hinteres Bein bilden eine Linie", "Hüfte bleibt gerade, nicht aufdrehen"] },
  beinSeitlich: { name: "Seitliches Beinheben", pose: "beinSeitlich", wdh: 12, seite: true, hinweise: ["Seitlich liegen, Körper gerade", "Oberes Bein gestreckt anheben, Zehen zeigen nach vorn", "Stärkt die Hüfte – schützt die Knie"] },
  skipping:     { name: "Skippings auf der Stelle", pose: "skipping", wdh: 20, einheit: "Sek.", hinweise: ["Knie zügig auf Hüfthöhe", "Auf dem Vorfuß bleiben", "Arme schwingen gegengleich mit"] }
};

const MOBILITY = {
  katzeKuh:      { name: "Katze-Kuh", pose: "katzeKuh", wdh: 8, hinweise: ["Vierfüßlerstand, Hände unter den Schultern", "Ausatmen: Rücken rund machen", "Einatmen: Rücken sanft durchhängen lassen"] },
  hueftbeuger:   { name: "Hüftbeuger-Dehnung", pose: "hueftbeuger", wdh: 30, einheit: "Sek.", seite: true, hinweise: ["Halbkniestand, hinteres Knie auf weicher Unterlage", "Becken nach vorn schieben, Po anspannen", "Dehnung vorn an der Hüfte des hinteren Beins"] },
  wade:          { name: "Wadendehnung an der Wand", pose: "wade", wdh: 30, einheit: "Sek.", seite: true, hinweise: ["Hinteres Bein gestreckt, Ferse am Boden", "Hüfte langsam Richtung Wand schieben", "Kein Wippen"] },
  oberschenkel:  { name: "Oberschenkel vorn dehnen", pose: "oberschenkel", wdh: 30, einheit: "Sek.", seite: true, hinweise: ["Ferse zum Po ziehen", "Knie zeigen nach unten, nebeneinander", "Zum Gleichgewicht an der Wand festhalten"] },
  kindhaltung:   { name: "Kindhaltung", pose: "kindhaltung", wdh: 45, einheit: "Sek.", hinweise: ["Aus dem Vierfüßlerstand Po zu den Fersen", "Arme lang nach vorn", "Ruhig in den Rücken atmen"] },
  worldsGreatest:{ name: "World's Greatest Stretch", pose: "worldsGreatest", wdh: 5, seite: true, hinweise: ["Tiefer Ausfallschritt, Hände innen am Fuß", "Ellbogen Richtung Boden, dann Arm nach oben aufdrehen", "Blick folgt der Hand"] },
  brustRotation: { name: "Brustwirbel-Rotation", pose: "brustRotation", wdh: 8, seite: true, hinweise: ["Vierfüßlerstand, Hüfte bleibt über den Knien", "Arm nach oben aufdrehen", "Bewegung aus dem oberen Rücken"] },
  beinrueckseite:{ name: "Beinrückseite dehnen", pose: "beinrueckseite", wdh: 30, einheit: "Sek.", hinweise: ["Beine fast gestreckt", "Mit geradem Rücken nach vorn beugen", "Nur so weit, wie es angenehm zieht"] }
};

const ATHLETIK_VARIANTEN = [
  ["kniebeuge", "ausfall", "bruecke", "waden", "seitstuetz", "diagonal"],
  ["stepUp", "kreuzheben", "beinSeitlich", "wadenEin", "skipping", "seitstuetz"]
];
const MOBILITY_VARIANTEN = [
  ["katzeKuh", "hueftbeuger", "wade", "oberschenkel", "kindhaltung"],
  ["worldsGreatest", "brustRotation", "beinrueckseite", "hueftbeuger", "kindhaltung"]
];

// ===== Darstellung =====
// karte = { pose, name, de?, menge, hinweise }
function uebungKarteElement(k) {
  const karte = document.createElement("div");
  karte.className = "kb-uebung";
  karte.innerHTML = kbGrafik(k.pose); // Grafik ist fester, eigener Inhalt
  const text = document.createElement("div");
  text.className = "kb-text";
  const name = document.createElement("b");
  name.textContent = k.name;
  text.appendChild(name);
  if (k.de) {
    const de = document.createElement("small");
    de.textContent = k.de;
    text.appendChild(de);
  }
  const menge = document.createElement("span");
  menge.className = "kb-menge";
  menge.textContent = k.menge;
  const liste = document.createElement("ul");
  (k.hinweise || []).forEach(h => {
    const li = document.createElement("li");
    li.textContent = h;
    liste.appendChild(li);
  });
  text.append(menge, liste);
  karte.appendChild(text);
  return karte;
}

// bloecke = [ { titel, karten: [...] } ], info = Zeile oben
function uebungBloeckeElement(info, bloecke) {
  const box = document.createElement("div");
  box.className = "kb-uebungen";
  if (info) {
    const p = document.createElement("p");
    p.className = "kb-info";
    p.textContent = info;
    box.appendChild(p);
  }
  bloecke.forEach(block => {
    if (block.titel) {
      const h = document.createElement("h3");
      h.className = "kb-block-titel";
      h.textContent = block.titel;
      box.appendChild(h);
    }
    block.karten.forEach(k => box.appendChild(uebungKarteElement(k)));
  });
  kbAnimieren();
  return box;
}

const mengeText = (u, saetze, plus = 0) => {
  const wdh = Math.round(u.wdh * (1 + plus));
  return `${saetze} × ${wdh} ${u.einheit || "Wdh."}${u.seite ? " / Seite" : ""}`;
};

// Index, ab dem der eigene Plan gilt (Do 26.11.); davor stammen Athletik und Mobility aus der Lauf-App
const EIGENER_PLAN_AB = 31;

function athletikInhalt(e, tagIndex, woche, ruhe) {
  const variante = woche % 2;
  const saetze = ruhe ? 2 : 3;
  const karten = ATHLETIK_VARIANTEN[variante].map(id => ({ ...ATHLETIK[id], menge: mengeText(ATHLETIK[id], saetze) }));
  const info = (tagIndex < EIGENER_PLAN_AB ? "Die Lauf-App hat dafür ein eigenes Video – dies ist die Alternative ohne App. " : "") +
    `Variante ${variante + 1} · ${saetze} Sätze · Pause 45–60 Sek.`;
  return uebungBloeckeElement(info, [{ karten }]);
}

function mobilityInhalt(e, tagIndex, woche) {
  const variante = woche % 2;
  const karten = MOBILITY_VARIANTEN[variante].map(id => ({ ...MOBILITY[id], menge: mengeText(MOBILITY[id], 2) }));
  const info = (tagIndex < EIGENER_PLAN_AB ? "Die Lauf-App hat dafür ein eigenes Video – dies ist die Alternative ohne App. " : "") +
    `Variante ${variante + 1} · 2 Durchgänge · ruhig atmen, nicht wippen`;
  return uebungBloeckeElement(info, [{ karten }]);
}

// Lauf: Aufwärmen – Hauptteil – Danach
function laufInhalt(e) {
  const intensiv = e.struktur || (e.stufe || 1) >= 2;
  const berg = /Berg|Hügel/.test(e.titel);

  const aufwaermen = [{ pose: "gehen", name: "Zügig gehen", menge: "5 Min.", hinweise: ["Locker in Bewegung kommen", "Arme mitschwingen"] }];
  if (intensiv) {
    aufwaermen.push(
      { pose: "skipping", name: "Lauf-ABC: Skippings", menge: "2 × 20 m", hinweise: ["Kurze, schnelle Schritte, Knie hoch", "Auf dem Vorfuß"] },
      { pose: "anfersen", name: "Lauf-ABC: Anfersen", menge: "2 × 20 m", hinweise: ["Fersen zügig Richtung Po", "Oberkörper aufrecht"] },
      { pose: "hopser", name: "Lauf-ABC: Hopserlauf", menge: "2 × 20 m", hinweise: ["Kraftvoll abdrücken, Knie hoch", "Gegenarm schwingt mit"] }
    );
  }

  const haupt = [];
  if (e.teile) {
    const st = e.struktur;
    haupt.push({ pose: "joggen", name: "Einlaufen", menge: kurz(st.ein), hinweise: ["Locker, du kannst dich unterhalten"] });
    const belastung = e.teile.length === 1
      ? `${e.teile[0][2]} × ${kurz(e.teile[0][0])}`
      : e.teile.map(([an]) => an % 60 ? `${Math.floor(an / 60)}:${String(an % 60).padStart(2, "0")}` : an / 60).join("–") + " Min.";
    haupt.push({ pose: berg ? "bergauf" : "sprinten", name: berg ? "Bergauf zügig" : "Zügige Abschnitte", menge: belastung,
      hinweise: berg ? ["Kurze Schritte, aufrecht, Arme arbeiten mit", "Anstrengend, aber kein Sprint", "Lieber eine Wiederholung weniger als unsauber"]
                     : ["Anstrengend, aber kontrolliert – kein Sprint", "Alle Abschnitte etwa gleich schnell", "Die letzte Wiederholung muss noch gehen"] });
    haupt.push({ pose: berg ? "gehen" : "joggen", name: berg ? "Locker zurück" : "Trabpause", menge: `je ${kurz(e.teile[0][1])}`,
      hinweise: [berg ? "Bergab gehen oder ganz locker traben" : "Sehr locker traben, nicht stehen bleiben"] });
    haupt.push({ pose: "joggen", name: "Auslaufen", menge: kurz(st.aus), hinweise: ["Ganz locker ausklingen lassen"] });
  } else if (/Lauf-Geh/.test(e.titel)) {
    haupt.push({ pose: "joggen", name: "Laufen", menge: "im Wechsel", hinweise: ["Abschnitte laut Lauf-App", "Ohne App: 2 Min. laufen", "Ruhiges Tempo"] });
    haupt.push({ pose: "gehen", name: "Gehen", menge: "im Wechsel", hinweise: ["Ohne App: 1 Min. zügig gehen", `Gesamt: ${dauerText(e.sek)}`] });
  } else if (/Hügel/.test(e.titel)) {
    haupt.push({ pose: "joggen", name: "Locker laufen", menge: dauerText(e.sek), hinweise: ["Wellige Strecke wählen", "Grundtempo locker"] });
    haupt.push({ pose: "bergauf", name: "Anstiege", menge: "unterwegs", hinweise: ["Bergauf kürzere Schritte", "Locker hoch, oben kurz durchatmen"] });
  } else if (/Tempo/.test(e.titel)) {
    haupt.push({ pose: "joggen", name: "Locker laufen", menge: dauerText(e.sek), hinweise: ["Grundtempo locker"] });
    haupt.push({ pose: "sprinten", name: "Zügige Abschnitte", menge: "laut Lauf-App", hinweise: ["Tempowechsel nach Vorgabe der Lauf-App", "Zügig, aber kontrolliert"] });
  } else {
    haupt.push({ pose: "joggen", name: e.titel, menge: dauerText(e.sek), hinweise: ["Locker – du kannst dich dabei unterhalten", "Gleichmäßiges Tempo", "Lieber zu langsam als zu schnell"] });
  }

  const danach = ["wade", "hueftbeuger", "oberschenkel"].map(id => ({ ...MOBILITY[id], menge: "30 Sek. / Seite" }));

  return uebungBloeckeElement(null, [
    { titel: "Aufwärmen", karten: aufwaermen },
    { titel: "Hauptteil", karten: haupt },
    { titel: "Danach", karten: danach }
  ]);
}

// Gibt für eine Einheit eine Funktion zurück, die den Inhalt baut (oder null)
function uebungenFuer(e, tagIndex) {
  const woche = Math.floor(tagIndex / 7);
  const ruhe = SPORT_WOCHEN[woche].name === "Ruhewoche";
  if (e.kb) return () => kbUebungenElement(e.kb);
  if (e.art === "athletik") return () => athletikInhalt(e, tagIndex, woche, ruhe);
  if (e.art === "mobility") return () => mobilityInhalt(e, tagIndex, woche);
  if (e.art === "lauf") return () => laufInhalt(e);
  return null;
}
