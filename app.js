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
  document.getElementById("kachel-wasser-info").textContent =
    liter(anzahl) + " / " + TAGESZIEL.toFixed(1).replace(".", ",") + " L";

  hinweisPruefen(heute, ziel);
}

// ===== Balkendiagramm der letzten 7 Tage =====
function verlaufAnzeigen() {
  const diagramm = document.getElementById("diagramm");
  diagramm.innerHTML = "";

  // Werte der letzten 7 Tage sammeln, ältester Tag zuerst
  const tage = [];
  for (let i = 6; i >= 0; i--) {
    const tag = new Date();
    tag.setDate(tag.getDate() - i);
    const anzahl = (daten[tagesSchluessel(tag)] || []).length;
    tage.push({
      name: i === 0 ? "Heute" : tag.toLocaleDateString("de-DE", { weekday: "short" }),
      liter: anzahl * FLASCHE
    });
  }

  // Der höchste Wert bestimmt die Skala, mindestens aber das Tagesziel
  const maximum = Math.max(TAGESZIEL, ...tage.map(t => t.liter));
  const zielHoehe = (TAGESZIEL / maximum) * 85;

  for (const tag of tage) {
    const hoehe = (tag.liter / maximum) * 85;
    const erreicht = tag.liter >= TAGESZIEL ? " erreicht" : "";
    const text = tag.liter.toFixed(1).replace(".", ",");

    const spalte = document.createElement("div");
    spalte.className = "spalte";
    spalte.innerHTML = `
      <div class="flaeche">
        <div class="ziel" style="bottom: ${zielHoehe}%"></div>
        <span class="wert">${text}</span>
        <div class="saeule${erreicht}" style="height: ${hoehe}%"></div>
      </div>
      <span class="tag">${tag.name}</span>`;
    diagramm.appendChild(spalte);
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
  clearTimeout(hinweisTimer);
  if (text) {
    setTimeout(() => feld.classList.add("sichtbar"), 300);
    // Nach 6 Sekunden wieder nach oben gleiten lassen
    hinweisTimer = setTimeout(() => feld.classList.remove("sichtbar"), 6300);
  } else {
    feld.classList.remove("sichtbar");
  }
}

let hinweisTimer;

// Antippen schließt den Hinweis sofort
document.getElementById("hinweis").addEventListener("click", (e) => {
  e.currentTarget.classList.remove("sichtbar");
});

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

// ===== Navigation zwischen den Ansichten =====
const APP_VERSION = 19;  // wird bei jeder Änderung erhöht
document.getElementById("version").textContent = "Version " + APP_VERSION;

let aktuelleAnsicht = null;
const DAUER = 450;  // Dauer der Öffnungsanimation in Millisekunden

// Zeigt nur die gewünschte Ansicht und versteckt alle anderen
function ansichtZeigen(ziel) {
  document.querySelectorAll(".ansicht").forEach(ansicht => {
    ansicht.hidden = ansicht.id !== "ansicht-" + ziel;
  });
  window.scrollTo(0, 0);
}

// Weiches Einblenden einer Ansicht
function einblenden(ziel) {
  const neu = document.getElementById("ansicht-" + ziel);
  neu.classList.remove("einblenden");
  void neu.offsetWidth;  // zwingt den Browser, die Animation neu zu starten
  neu.classList.add("einblenden");
}

// Legt eine Kopie der Kachel als Ebene über alles,
// an genau dieselbe Stelle wie die echte Kachel
function ebeneErstellen(kachel) {
  const ebene = kachel.cloneNode(true);
  ebene.className = kachel.className + " oeffnen-ebene";
  document.body.appendChild(ebene);
  return ebene;
}

function ebeneSetzen(ebene, rahmen, rundung) {
  ebene.style.top = rahmen.top + "px";
  ebene.style.left = rahmen.left + "px";
  ebene.style.width = rahmen.width + "px";
  ebene.style.height = rahmen.height + "px";
  ebene.style.borderRadius = rundung;
}

const vollbild = () => ({ top: 0, left: 0, width: window.innerWidth, height: window.innerHeight });

function ansichtWechseln() {
  let ziel = location.hash.replace("#", "") || "start";
  if (!document.getElementById("ansicht-" + ziel)) ziel = "start";

  const vorher = aktuelleAnsicht;
  aktuelleAnsicht = ziel;

  // Beim allerersten Laden ohne Animation
  if (vorher === null || vorher === ziel) {
    ansichtZeigen(ziel);
    return;
  }

  const oeffnen = vorher === "start";
  const modul = oeffnen ? ziel : vorher;
  const kachel = document.querySelector(`a[href="#${modul}"] .kachel`);
  const ruhigeBewegung = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!kachel || ruhigeBewegung) {
    ansichtZeigen(ziel);
    if (!ruhigeBewegung) einblenden(ziel);
    return;
  }

  if (oeffnen) {
    // Kachel wächst auf Bildschirmgröße, dann erscheint die Modul-Seite
    const ebene = ebeneErstellen(kachel);
    ebeneSetzen(ebene, kachel.getBoundingClientRect(), "20px");
    void ebene.offsetWidth;
    ebeneSetzen(ebene, vollbild(), "0px");
    ebene.classList.add("inhalt-weg");

    setTimeout(() => {
      ansichtZeigen(ziel);
      einblenden(ziel);
      ebene.classList.add("ausblenden");
      setTimeout(() => ebene.remove(), 300);
    }, DAUER);
  } else {
    // Startseite erscheint, eine Ebene schrumpft vom Vollbild zurück in die Kachel
    ansichtZeigen("start");
    const ebene = ebeneErstellen(kachel);
    ebene.classList.add("inhalt-weg");
    ebeneSetzen(ebene, vollbild(), "0px");
    void ebene.offsetWidth;
    ebene.classList.remove("inhalt-weg");
    ebeneSetzen(ebene, kachel.getBoundingClientRect(), "20px");

    setTimeout(() => {
      ebene.classList.add("ausblenden");
      setTimeout(() => ebene.remove(), 300);
    }, DAUER);
  }
}

window.addEventListener("hashchange", ansichtWechseln);
ansichtWechseln();

// ===== Backup =====
// Gesichert werden ALLE Daten der App (auch von künftigen Modulen),
// nicht nur das Wasser. Format: eine JSON-Datei.
const BACKUP_ZEIT = "letztesBackup";

function backupInfoAnzeigen() {
  const info = document.getElementById("backup-info");
  const zeit = Number(localStorage.getItem(BACKUP_ZEIT));
  if (!zeit) {
    info.textContent = "Noch kein Backup erstellt";
    info.classList.add("backup-alt");
    return;
  }
  const tage = Math.floor((Date.now() - zeit) / 86400000);
  const datum = new Date(zeit).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  info.textContent = "Letztes Backup: " + datum +
    (tage === 0 ? " (heute)" : tage === 1 ? " (gestern)" : ` (vor ${tage} Tagen)`);
  // Nach mehr als 14 Tagen wird der Text orange als Erinnerung
  info.classList.toggle("backup-alt", tage > 14);
}

document.getElementById("backup-sichern").addEventListener("click", async () => {
  const daten = {};
  for (let i = 0; i < localStorage.length; i++) {
    const schluessel = localStorage.key(i);
    if (schluessel !== BACKUP_ZEIT) daten[schluessel] = localStorage.getItem(schluessel);
  }
  const backup = { app: "nicos-leben", format: 1, erstellt: new Date().toISOString(), daten };

  const name = "leben-backup-" + tagesSchluessel(new Date()) + ".json";
  const datei = new File([JSON.stringify(backup, null, 2)], name, { type: "application/json" });

  try {
    // iPhone: Teilen-Menü öffnen ("In Dateien sichern", iCloud, Mail …)
    if (navigator.canShare && navigator.canShare({ files: [datei] })) {
      await navigator.share({ files: [datei], title: "Backup Nicos Leben" });
    } else {
      // PC: Datei herunterladen
      const link = document.createElement("a");
      link.href = URL.createObjectURL(datei);
      link.download = name;
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    }
    localStorage.setItem(BACKUP_ZEIT, Date.now());
    backupInfoAnzeigen();
  } catch (fehler) {
    // Abbrechen im Teilen-Menü ist kein Fehler, dann passiert einfach nichts
    if (fehler.name !== "AbortError") alert("Backup konnte nicht erstellt werden: " + fehler.message);
  }
});

document.getElementById("backup-laden").addEventListener("click", () => {
  document.getElementById("backup-datei").click();
});

document.getElementById("backup-datei").addEventListener("change", async (e) => {
  const datei = e.target.files[0];
  e.target.value = "";  // damit dieselbe Datei erneut gewählt werden kann
  if (!datei) return;

  let backup;
  try {
    backup = JSON.parse(await datei.text());
  } catch {
    alert("Diese Datei ist kein gültiges Backup.");
    return;
  }
  if (!backup || backup.app !== "nicos-leben" || typeof backup.daten !== "object") {
    alert("Diese Datei ist kein Backup von Nicos Leben.");
    return;
  }

  const datum = new Date(backup.erstellt).toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "short" });
  const ok = confirm(`Backup vom ${datum} wiederherstellen?\n\nDie aktuellen Daten in der App werden dabei ersetzt.`);
  if (!ok) return;

  for (const [schluessel, wert] of Object.entries(backup.daten)) {
    if (typeof wert === "string") localStorage.setItem(schluessel, wert);
  }
  alert("Backup wiederhergestellt.");
  location.reload();
});

backupInfoAnzeigen();

// Doppeltippen soll nie zoomen, auch nicht bei schnellen Tipps auf Knöpfe
document.addEventListener("dblclick", (e) => e.preventDefault(), { passive: false });

// ===== Service Worker anmelden =====
// Sorgt dafür, dass die App immer die neueste Version lädt.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js", { updateViaCache: "none" })
    .catch((fehler) => console.log("Service Worker nicht angemeldet:", fehler));
}
