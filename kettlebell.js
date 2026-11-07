// ===== Kettlebell-Training: 3 Tage pro Woche =====
// Übungsauswahl aus einem Instagram-Video (36 Kettlebell Moves, @marcusfilly, Okt. 2026),
// sortiert nach zusammenhängenden Muskeln:
//   Tag A (Mo) = Zug: Rücken & Bizeps
//   Tag B (Mi) = Drücken: Brust & Plank
//   Tag C (Fr) = Hüfte: Swings & Core
// Jeder Tag hat zwei Varianten, die sich wöchentlich abwechseln – so kommen alle 36 Übungen dran.
// Die Grafiken sind eigene, vereinfachte und animierte Strichfiguren (keine Bilder aus dem Video).

const KB_SAETZE = 3;          // Sätze pro Übung (Ruhewoche: 2)
const KB_PAUSE = "60–90 Sek."; // Pause zwischen den Sätzen

// ===== Grafiken: Posen der Strichfigur =====
// Koordinaten in einem 100×100-Feld, Boden bei y = 92, Blick nach rechts.
// Jede Pose hat Bilder (frames), zwischen denen die Figur hin und her animiert wird.
// Punkte: kopf, schulter, ellbogen, hand, (ellbogen2, hand2), huefte, knie, fuss, (knie2, fuss2), kb, kb2
const P = {
  // Einarmiges Rudern im vorgebeugten Stand (Schrittstellung)
  rudern: { frames: [
    { kopf: [70, 37], schulter: [62, 43], huefte: [40, 53], knie: [43, 72], fuss: [40, 92], knie2: [57, 72], fuss2: [62, 92],
      ellbogen2: [62, 56], hand2: [58, 66], ellbogen: [64, 57], hand: [65, 70] },
    { ellbogen: [50, 45], hand: [58, 56] }
  ]},
  // Breiter, tiefer Stand, Kettlebells am Boden, abwechselnd rudern
  gorilla: { frames: [
    { kopf: [68, 47], schulter: [60, 52], huefte: [38, 55], knie: [48, 70], fuss: [42, 92], knie2: [52, 72], fuss2: [60, 92],
      ellbogen2: [61, 70], hand2: [62, 84], kb2: [62, 88], ellbogen: [62, 68], hand: [64, 82] },
    { ellbogen: [48, 50], hand: [56, 62] }
  ]},
  // Explosives Rudern: Kettlebell von unten schwungvoll zur Hüfte
  rudernBallistisch: { frames: [
    { kopf: [70, 40], schulter: [62, 45], huefte: [40, 54], knie: [44, 72], fuss: [42, 92], knie2: [56, 72], fuss2: [58, 92],
      ellbogen2: [60, 58], hand2: [56, 66], ellbogen: [64, 62], hand: [64, 78] },
    { ellbogen: [48, 46], hand: [54, 58] }
  ]},
  // Bizeps-Curl im aufrechten Kniestand
  curlKnien: { frames: [
    { kopf: [50, 22], schulter: [50, 30], huefte: [50, 58], knie: [52, 90], fuss: [30, 92], ellbogen: [52, 44], hand: [54, 58] },
    { hand: [61, 33] }
  ]},
  // Curl im Halbkniestand, Oberarm auf dem vorderen Oberschenkel abgelegt
  curlPreacher: { frames: [
    { kopf: [56, 30], schulter: [54, 38], huefte: [44, 62], knie: [44, 90], fuss: [24, 92], knie2: [64, 66], fuss2: [66, 92],
      ellbogen: [64, 62], hand: [78, 72] },
    { hand: [66, 46] }
  ]},
  // Curl in Schrittstellung
  curlStand: { frames: [
    { kopf: [50, 14], schulter: [50, 22], huefte: [50, 50], knie: [60, 70], fuss: [64, 92], knie2: [42, 72], fuss2: [34, 92],
      ellbogen: [52, 36], hand: [54, 50] },
    { hand: [61, 25] }
  ]},
  // Unterarmstütz / Liegestützposition, Kettlebell unter dem Körper durchziehen
  plankZiehen: { ohneKb: true, frames: [
    { kopf: [80, 63], schulter: [72, 69], huefte: [46, 72], knie: [32, 80], fuss: [18, 90], ellbogen: [72, 80], hand: [72, 90],
      ellbogen2: [72, 80], hand2: [72, 90], kb2: [64, 88] },
    { ellbogen2: [64, 82], hand2: [52, 88], kb2: [50, 88] }
  ]},
  // Diagonal: Arm nach vorn, gegenüberliegendes Bein nach hinten
  plankDiagonal: { ohneKb: true, frames: [
    { kopf: [80, 63], schulter: [72, 69], huefte: [46, 72], knie: [32, 80], fuss: [18, 90], knie2: [32, 80], fuss2: [18, 90],
      ellbogen: [72, 80], hand: [72, 90], ellbogen2: [72, 80], hand2: [72, 90] },
    { ellbogen2: [84, 66], hand2: [95, 62], knie2: [30, 72], fuss2: [12, 72] }
  ]},
  // Seitstütz, oberer Arm (und Bein) gehen auf
  seitstuetz: { ohneKb: true, frames: [
    { kopf: [72, 56], schulter: [66, 63], huefte: [44, 76], knie: [30, 84], fuss: [16, 90], knie2: [30, 84], fuss2: [16, 90],
      ellbogen: [68, 77], hand: [70, 90], ellbogen2: [56, 70], hand2: [46, 72] },
    { ellbogen2: [66, 48], hand2: [67, 33], knie2: [32, 72], fuss2: [20, 64] }
  ]},
  // Liegestütz mit den Händen auf den Kettlebells (tiefere Bewegung)
  liegestuetz: { frames: [
    { kopf: [80, 58], schulter: [72, 64], huefte: [46, 70], knie: [32, 80], fuss: [18, 90], ellbogen: [72, 73], hand: [72, 82], kb: [72, 87] },
    { kopf: [80, 74], schulter: [72, 78], huefte: [46, 80], knie: [32, 86], ellbogen: [62, 76] }
  ]},
  // Drücken in Rückenlage auf dem Boden
  bodenDruecken: { frames: [
    { kopf: [20, 86], schulter: [28, 86], huefte: [52, 86], knie: [64, 72], fuss: [74, 92], ellbogen: [34, 90], hand: [34, 76], kb: [34, 71] },
    { ellbogen: [30, 74], hand: [30, 62], kb: [30, 57] }
  ]},
  // Drücken in der Hüftbrücke
  brueckeDruecken: { frames: [
    { kopf: [20, 86], schulter: [28, 85], huefte: [52, 72], knie: [66, 68], fuss: [74, 92], ellbogen: [34, 88], hand: [34, 74], kb: [34, 69] },
    { ellbogen: [30, 72], hand: [30, 60], kb: [30, 55] }
  ]},
  // Drücken auf der Bank (ohne Bank: auf dem Boden)
  bankDruecken: { bank: true, frames: [
    { kopf: [20, 74], schulter: [28, 74], huefte: [50, 74], knie: [62, 74], fuss: [66, 92], ellbogen: [32, 82], hand: [32, 68], kb: [32, 63] },
    { ellbogen: [29, 62], hand: [29, 50], kb: [29, 45] }
  ]},
  // Brust-Fly im Kniestand von unten nach oben
  flyKnien: { frames: [
    { kopf: [50, 22], schulter: [50, 30], huefte: [50, 58], knie: [52, 90], fuss: [30, 92], ellbogen: [56, 44], hand: [62, 58] },
    { ellbogen: [62, 26], hand: [75, 19] }
  ]},
  // Swing: Hüfte schiebt nach vorn, Kettlebell auf Brusthöhe
  swing: { frames: [
    { kopf: [66, 40], schulter: [58, 44], huefte: [38, 54], knie: [44, 72], fuss: [46, 92], ellbogen: [50, 58], hand: [44, 68], kb: [42, 74] },
    { kopf: [46, 18], schulter: [46, 26], huefte: [44, 54], knie: [46, 72], ellbogen: [60, 30], hand: [74, 34], kb: [80, 35] }
  ]},
  // Swing in Schrittstellung
  swingSchritt: { frames: [
    { kopf: [66, 40], schulter: [58, 44], huefte: [38, 54], knie: [48, 72], fuss: [54, 92], knie2: [34, 74], fuss2: [26, 92],
      ellbogen: [50, 58], hand: [44, 68], kb: [42, 74] },
    { kopf: [46, 18], schulter: [46, 26], huefte: [44, 54], knie: [52, 72], knie2: [36, 72], ellbogen: [60, 30], hand: [74, 34], kb: [80, 35] }
  ]},
  // Swing mit Zug zur Brust (Ellbogen hoch)
  highPull: { frames: [
    { kopf: [66, 40], schulter: [58, 44], huefte: [38, 54], knie: [44, 72], fuss: [46, 92], ellbogen: [50, 58], hand: [44, 68], kb: [42, 74] },
    { kopf: [48, 18], schulter: [46, 26], huefte: [44, 54], knie: [46, 72], ellbogen: [34, 26], hand: [56, 30], kb: [60, 35] }
  ]},
  // Aufsetzen aus der Rückenlage, Kettlebell bleibt über der Schulter
  turkishSitUp: { frames: [
    { kopf: [20, 86], schulter: [28, 86], huefte: [52, 86], knie: [64, 72], fuss: [74, 92], ellbogen: [28, 72], hand: [28, 58], kb: [28, 53],
      ellbogen2: [38, 90], hand2: [44, 90] },
    { kopf: [40, 52], schulter: [44, 60], ellbogen: [44, 46], hand: [44, 32], kb: [44, 27], ellbogen2: [42, 75], hand2: [38, 90] }
  ]},
  // Deadbug: Rückenlage, Arme halten die Kettlebell, ein Bein streckt sich
  deadbug: { frames: [
    { kopf: [20, 86], schulter: [28, 86], huefte: [52, 86], knie: [52, 66], fuss: [66, 66], knie2: [52, 66], fuss2: [66, 66],
      ellbogen: [29, 72], hand: [30, 58], kb: [30, 53] },
    { knie2: [66, 82], fuss2: [82, 87] }
  ]},
  // Crunch mit gestreckten Beinen nach oben, Kettlebell Richtung Füße
  lCrunch: { frames: [
    { kopf: [20, 86], schulter: [28, 86], huefte: [52, 86], knie: [54, 68], fuss: [56, 48], ellbogen: [30, 74], hand: [34, 62], kb: [35, 57] },
    { kopf: [26, 74], schulter: [33, 78], ellbogen: [42, 66], hand: [50, 54], kb: [52, 49] }
  ]},
  // Beine gestreckt anheben (Pike) und über die Kettlebell führen
  pike: { ohneKb: true, frames: [
    { kopf: [20, 86], schulter: [28, 86], huefte: [52, 86], knie: [66, 88], fuss: [80, 90], ellbogen: [24, 92], hand: [16, 90], kb2: [72, 87] },
    { knie: [58, 70], fuss: [62, 52] }
  ]},
  // Aufrechter Kniestand: Kettlebell von der Hüfte einmal um den Kopf (Halo)
  halo: { frames: [
    { kopf: [50, 22], schulter: [50, 30], huefte: [50, 58], knie: [52, 90], fuss: [30, 92], ellbogen: [56, 44], hand: [58, 56], kb: [60, 60] },
    { ellbogen: [60, 32], hand: [62, 22], kb: [64, 18] },
    { ellbogen: [48, 20], hand: [42, 14], kb: [38, 12] },
    { ellbogen: [60, 32], hand: [62, 22], kb: [64, 18] }
  ]}
};

// ===== Übungen =====
// pose = Grafik, wdh = Wiederholungen (oder Sekunden bei einheit "Sek."),
// seite = pro Seite, hinweise = worauf es ankommt
const KB_UEBUNGEN = {
  // --- Rücken ---
  chainsaw:    { name: "Chainsaw Row", de: "Einarmiges Rudern, freie Hand auf dem vorderen Knie", pose: "rudern", wdh: 10, seite: true,
                 hinweise: ["Rücken gerade, Hüfte nach hinten", "Ellbogen nah am Körper Richtung Hüfte ziehen", "Oben kurz halten, langsam ablassen"] },
  gorilla:     { name: "Gorilla Top Down Row", de: "Breiter, tiefer Stand, abwechselnd vom Boden rudern", pose: "gorilla", wdh: 8, seite: true, zweiKb: true,
                 hinweise: ["Tiefer Stand wie beim Kreuzheben", "Eine Hand stützt auf der zweiten Kettlebell", "Rumpf dreht beim Ziehen nicht mit"] },
  ballistic:   { name: "Ballistic Row", de: "Explosives Rudern aus dem Schwung", pose: "rudernBallistisch", wdh: 10, seite: true,
                 hinweise: ["Kettlebell schwungvoll zur Hüfte ziehen", "Kontrolliert abbremsen", "Rücken bleibt die ganze Zeit gerade"] },
  splitAlt:    { name: "Split Stance Alternating SA Row", de: "Schrittstellung, Rudern mit abwechselndem Arm", pose: "rudern", wdh: 10, seite: true,
                 hinweise: ["Schrittstellung, Gewicht auf dem vorderen Bein", "Kettlebell unten von Hand zu Hand übergeben", "Schultern bleiben parallel zum Boden"] },
  splitRot:    { name: "Split Stance Rotational Row", de: "Rudern mit leichter Oberkörperdrehung", pose: "rudern", wdh: 8, seite: true,
                 hinweise: ["Beim Hochziehen öffnet sich der Oberkörper zur Seite", "Bewegung kommt aus der Brustwirbelsäule", "Hüfte bleibt stabil"] },
  underswitch: { name: "Underswitch", de: "Rudern, Kettlebell unter dem Körper in die andere Hand wechseln", pose: "rudern", wdh: 8, seite: true,
                 hinweise: ["Nach jeder Wiederholung die Hand wechseln", "Übergabe ruhig unter dem Körper", "Rumpf fest, kein Hohlkreuz"] },
  // --- Bizeps ---
  hornCurl:    { name: "Kneeling Horn Curl", de: "Curl im Kniestand, beide Hände an den Hörnern", pose: "curlKnien", wdh: 10,
                 hinweise: ["Ellbogen bleiben am Körper", "Kein Schwung aus dem Rücken", "Langsam ablassen (2–3 Sek.)"] },
  preacher:    { name: "Hammer Grip Preacher Curl", de: "Curl im Halbkniestand, Arm auf dem Oberschenkel", pose: "curlPreacher", wdh: 10, seite: true,
                 hinweise: ["Oberarm liegt auf dem vorderen Oberschenkel", "Daumen zeigt nach oben (Hammergriff)", "Unten Arm fast ganz strecken"] },
  crushGrip:   { name: "Kneeling Crush Grip Curl", de: "Curl im Kniestand, Kettlebell seitlich mit beiden Händen gedrückt", pose: "curlKnien", wdh: 10,
                 hinweise: ["Kettlebell mit beiden Handflächen fest zusammendrücken", "Ellbogen eng am Körper", "Oben die Spannung kurz halten"] },
  gunslinger:  { name: "Kneeling Gunslinger Curl", de: "Einarmiger Curl, Kettlebell am Griff seitlich wie ein Holster", pose: "curlKnien", wdh: 8, seite: true,
                 hinweise: ["Griff seitlich, Handgelenk gerade", "Oberkörper aufrecht, Po angespannt", "Kontrolliert, ohne Schwung"] },
  topDownCurl: { name: "Kneeling Top-Down Alt Curl", de: "Curl im Kniestand, abwechselnd links und rechts", pose: "curlKnien", wdh: 8, seite: true,
                 hinweise: ["Abwechselnd ein Arm pro Wiederholung", "Oberkörper bleibt ruhig", "Unten ganz strecken"] },
  splitCurl:   { name: "Split Stance Single Arm Curl", de: "Einarmiger Curl in Schrittstellung", pose: "curlStand", wdh: 10, seite: true,
                 hinweise: ["Stabiler Schrittstand", "Ellbogen bleibt an der Seite", "Nicht nach hinten lehnen"] },
  // --- Brust ---
  deficitPush: { name: "KB Deficit Push Up", de: "Liegestütz mit den Händen auf zwei Kettlebells", pose: "liegestuetz", wdh: 8, zweiKb: true,
                 hinweise: ["Körper bildet eine gerade Linie", "Tiefer als bei normalen Liegestützen", "Zu schwer? Knie ablegen"] },
  floorPress:  { name: "90/90 Legs Alt KB Floor Press", de: "Drücken in Rückenlage, Beine im 90-Grad-Winkel, abwechselnd", pose: "bodenDruecken", wdh: 10, seite: true,
                 hinweise: ["Oberarm unten kurz auf dem Boden ablegen", "Handgelenk gerade über dem Ellbogen", "Unterer Rücken bleibt am Boden"] },
  bridgePress: { name: "Single Arm Glute Bridge Chest Press", de: "Einarmiges Drücken in der Hüftbrücke", pose: "brueckeDruecken", wdh: 10, seite: true,
                 hinweise: ["Hüfte die ganze Zeit oben halten", "Po fest anspannen", "Arm gerade nach oben drücken"] },
  waiterBench: { name: "Waiters Press Single Arm Bench Press", de: "Einarmiges Drücken auf der Bank, Kettlebell auf der Handfläche", pose: "bankDruecken", wdh: 10, seite: true,
                 hinweise: ["Kettlebell liegt wie ein Tablett auf der Hand", "Langsam und kontrolliert drücken", "Ohne Bank: auf dem Boden ausführen"] },
  chestFly:    { name: "Kneeling Low to High Chest Fly", de: "Kniestand, gestreckter Arm von unten nach schräg oben", pose: "flyKnien", wdh: 10, seite: true,
                 hinweise: ["Arm leicht gebeugt, aber fest", "Bewegung aus der Brust, nicht aus dem Rücken", "Leichtes Gewicht wählen"] },
  straightBridge: { name: "Straight Leg Glute Bridge SA Bench Press", de: "Drücken auf der Bank mit gestreckter Hüfte", pose: "bankDruecken", wdh: 10, seite: true,
                 hinweise: ["Hüfte gestreckt, Körper in einer Linie", "Po und Bauch angespannt", "Ohne Bank: Hüftbrücke am Boden"] },
  // --- Plank ---
  plankPull:   { name: "Quadruped Plank KB Pull Through", de: "Vierfüßlerstand mit gehobenen Knien, Kettlebell unter dem Körper durchziehen", pose: "plankZiehen", wdh: 8, seite: true,
                 hinweise: ["Knie schweben knapp über dem Boden", "Hüfte bleibt ruhig, nicht kippen", "Kettlebell ziehen, nicht werfen"] },
  contralateral: { name: "Contralateral Plank", de: "Stütz, gegenüberliegenden Arm und Bein strecken", pose: "plankDiagonal", wdh: 8, seite: true,
                 hinweise: ["Rechter Arm und linkes Bein gleichzeitig", "Becken bleibt waagerecht", "Kurz halten, dann wechseln"] },
  starPlank:   { name: "Star Plank", de: "Seitstütz, oberes Bein und Arm öffnen", pose: "seitstuetz", wdh: 20, einheit: "Sek.", seite: true,
                 hinweise: ["Hüfte hoch, Körper in einer Linie", "Stützarm unter der Schulter", "Zu schwer? Oberes Bein unten lassen"] },
  sideWalk:    { name: "KB Side Plank Walk Over", de: "Seitstütz, Kettlebell mit der oberen Hand über den Boden versetzen", pose: "seitstuetz", wdh: 6, seite: true,
                 hinweise: ["Hüfte bleibt die ganze Zeit oben", "Kettlebell vor dem Körper absetzen", "Ruhig und kontrolliert"] },
  plankSnatch: { name: "Plank Pull Through Snatch", de: "Pull Through im Stütz, danach Kettlebell über Kopf reißen", pose: "plankZiehen", wdh: 6, seite: true,
                 hinweise: ["Erst den Pull Through sauber ausführen", "Snatch aus der Hüfte, nicht aus dem Arm", "Fortgeschritten: anfangs leicht bleiben"] },
  underSnatch: { name: "Under Switch KB Snatch", de: "Wechsel unter dem Körper, dann Snatch über Kopf", pose: "plankZiehen", wdh: 6, seite: true,
                 hinweise: ["Saubere Übergabe vor dem Snatch", "Arm oben ganz gestreckt", "Fortgeschritten: anfangs leicht bleiben"] },
  // --- Swing ---
  russian:     { name: "Russian Swing", de: "Beidhändiger Swing bis auf Brusthöhe", pose: "swing", wdh: 15,
                 hinweise: ["Bewegung kommt aus der Hüfte, nicht aus den Armen", "Oben Po und Bauch fest anspannen", "Rücken bleibt gerade"] },
  highPull:    { name: "Swing High Pull", de: "Swing mit Zug der Kettlebell zur Brust", pose: "highPull", wdh: 10, seite: true,
                 hinweise: ["Hüfte gibt den Schwung", "Ellbogen oben nach hinten ziehen", "Kettlebell nah am Körper"] },
  splitSwing:  { name: "Split Stance Swing", de: "Swing in Schrittstellung", pose: "swingSchritt", wdh: 10, seite: true,
                 hinweise: ["Gewicht auf dem vorderen Bein", "Hüfte schiebt nach vorn", "Hintere Ferse leicht angehoben"] },
  altSwing:    { name: "Alternating Single Arm Swing", de: "Einarmiger Swing, oben die Hand wechseln", pose: "swing", wdh: 16,
                 hinweise: ["Wechsel im höchsten Punkt", "Freie Hand bleibt nah dran", "Rumpf dreht nicht mit"] },
  sideSwing:   { name: "Single Arm Side Swing", de: "Einarmiger Swing seitlich am Körper vorbei", pose: "swing", wdh: 10, seite: true,
                 hinweise: ["Kettlebell schwingt außen am Bein vorbei", "Schultern bleiben gerade", "Leichter als beim normalen Swing"] },
  dualSwing:   { name: "Dual KB Swing", de: "Swing mit zwei Kettlebells", pose: "swing", wdh: 10, zweiKb: true,
                 hinweise: ["Etwas breiterer Stand", "Beide Kettlebells parallel", "Nur mit sauberer Swing-Technik"] },
  // --- Core ---
  turkishSit:  { name: "Turkish Sit Up", de: "Aufsetzen mit Kettlebell über der Schulter", pose: "turkishSitUp", wdh: 5, seite: true,
                 hinweise: ["Arm bleibt senkrecht, Blick zur Kettlebell", "Über den Ellbogen der freien Hand hochkommen", "Langsam wieder ablegen"] },
  straddleSit: { name: "Straddle Turkish Sit Up", de: "Turkish Sit Up mit gegrätschten Beinen", pose: "turkishSitUp", wdh: 5, seite: true,
                 hinweise: ["Beine breit gegrätscht", "Kettlebell-Arm bleibt gestreckt", "Kontrolliert ab- und aufrollen"] },
  deadbug:     { name: "KB Deadbug", de: "Rückenlage, Kettlebell über der Brust, Beine abwechselnd strecken", pose: "deadbug", wdh: 8, seite: true,
                 hinweise: ["Unterer Rücken bleibt am Boden", "Ausatmen beim Strecken", "Langsam, Kontrolle vor Tempo"] },
  pikeLift:    { name: "Pike Lift Over", de: "Gestreckte Beine anheben und über die Kettlebell führen", pose: "pike", wdh: 8,
                 hinweise: ["Beine bleiben gestreckt", "Unterer Rücken am Boden halten", "Zu schwer? Knie leicht beugen"] },
  lCrunch:     { name: "KB L Crunch", de: "Beine senkrecht, Kettlebell Richtung Füße drücken", pose: "lCrunch", wdh: 10,
                 hinweise: ["Beine senkrecht nach oben", "Schultern rollen vom Boden ab", "Nicht am Nacken ziehen"] },
  halo:        { name: "Tall Kneeling Hip to Halo", de: "Kniestand, Kettlebell von der Hüfte um den Kopf führen", pose: "halo", wdh: 6, seite: true, einheitText: "/ Richtung",
                 hinweise: ["Aufrechter Kniestand, Po angespannt", "Kettlebell eng um den Kopf führen", "Rippen unten halten, kein Hohlkreuz"] }
};

const KB_TAGE = {
  A: { name: "Rücken & Bizeps", varianten: [
    ["chainsaw", "gorilla", "ballistic", "hornCurl", "crushGrip", "gunslinger"],
    ["splitAlt", "splitRot", "underswitch", "preacher", "topDownCurl", "splitCurl"]
  ]},
  B: { name: "Brust & Plank", varianten: [
    ["deficitPush", "floorPress", "bridgePress", "plankPull", "contralateral", "starPlank"],
    ["waiterBench", "chestFly", "straightBridge", "sideWalk", "plankSnatch", "underSnatch"]
  ]},
  C: { name: "Swings & Core", varianten: [
    ["russian", "highPull", "sideSwing", "turkishSit", "deadbug", "halo"],
    ["splitSwing", "altSwing", "dualSwing", "straddleSit", "pikeLift", "lCrunch"]
  ]}
};

// ===== Strichfigur zeichnen und animieren =====
// Die Figur wird per JavaScript bewegt: Bei jedem Bildschirmbild werden die Gelenkpunkte
// zwischen den Posen weich überblendet (läuft zuverlässig in Safari und allen Browsern).

const kbFrameSpeicher = {};
function kbFrames(poseName) {
  if (kbFrameSpeicher[poseName]) return kbFrameSpeicher[poseName];
  const pose = P[poseName];
  // Fehlende Punkte in späteren Bildern vom ersten Bild übernehmen
  const frames = pose.frames.map(f => ({ ...pose.frames[0], ...f }));
  // Kettlebell sitzt unter der Hand, wenn nicht anders angegeben
  frames.forEach(f => { if (!f.kb && f.hand && !pose.ohneKb) f.kb = [f.hand[0], f.hand[1] + 5]; });
  return (kbFrameSpeicher[poseName] = frames);
}

// Position aller Punkte zu einem Zeitpunkt: Pose 1 → Pose 2 (→ …) → zurück zu Pose 1,
// mit kurzem Halten an jeder Pose und weichem Anfahren/Abbremsen
function kbPunkte(frames, zeit) {
  const dauer = frames.length > 2 ? 4400 : 2600;      // Millisekunden pro Durchgang
  const folge = [...frames, frames[0]];
  const t = ((zeit % dauer) / dauer) * frames.length;
  const i = Math.floor(t);
  const roh = Math.min(Math.max((t - i - 0.12) / 0.76, 0), 1); // 12 % halten, dann bewegen
  const u = 0.5 - Math.cos(Math.PI * roh) / 2;
  const a = folge[i], b = folge[i + 1], punkte = {};
  for (const k in a) {
    punkte[k] = b[k] ? [a[k][0] + (b[k][0] - a[k][0]) * u, a[k][1] + (b[k][1] - a[k][1]) * u] : a[k];
  }
  return punkte;
}

function kbGrafik(poseName) {
  const pose = P[poseName];
  const f0 = kbFrames(poseName)[0];
  const linie = (a, b, klasse = "") => f0[a] && f0[b]
    ? `<line class="${klasse}" data-a="${a}" data-b="${b}" x1="${f0[a][0]}" y1="${f0[a][1]}" x2="${f0[b][0]}" y2="${f0[b][1]}"/>` : "";
  const kreis = (p, r, klasse) => f0[p]
    ? `<circle class="${klasse}" data-p="${p}" cx="${f0[p][0]}" cy="${f0[p][1]}" r="${r}"/>` : "";

  return `<svg class="kb-grafik" data-pose="${poseName}" viewBox="0 0 100 100" aria-hidden="true">
    <line class="kb-boden" x1="4" y1="92" x2="96" y2="92"/>
    ${pose.bank ? '<rect class="kb-bank" x="14" y="78" width="44" height="5" rx="2"/><line class="kb-boden" x1="20" y1="83" x2="20" y2="92"/><line class="kb-boden" x1="52" y1="83" x2="52" y2="92"/>' : ""}
    ${linie("huefte", "knie2", "hinten")}${linie("knie2", "fuss2", "hinten")}
    ${linie("schulter", "ellbogen2", "hinten")}${linie("ellbogen2", "hand2", "hinten")}
    ${linie("schulter", "huefte")}${linie("huefte", "knie")}${linie("knie", "fuss")}
    ${linie("kopf", "schulter")}
    ${kreis("kb2", 4.5, "kb-gewicht")}${kreis("kb", 4.5, "kb-gewicht")}
    ${linie("schulter", "ellbogen")}${linie("ellbogen", "hand")}
    ${kreis("kopf", 5.5, "kb-kopf")}
  </svg>`;
}

// Eine gemeinsame Schleife bewegt alle sichtbaren Figuren und stoppt von selbst,
// sobald keine mehr zu sehen ist (spart Akku)
let kbSchleifeLaeuft = false;
function kbAnimieren() {
  if (kbSchleifeLaeuft) return;
  kbSchleifeLaeuft = true;
  const schritt = (jetzt) => {
    const figuren = [...document.querySelectorAll(".kb-grafik[data-pose]")].filter(g => !g.closest("[hidden]"));
    if (!figuren.length) { kbSchleifeLaeuft = false; return; }
    figuren.forEach(g => {
      const p = kbPunkte(kbFrames(g.dataset.pose), jetzt);
      g.querySelectorAll("line[data-a]").forEach(l => {
        const a = p[l.dataset.a], b = p[l.dataset.b];
        l.setAttribute("x1", a[0].toFixed(2)); l.setAttribute("y1", a[1].toFixed(2));
        l.setAttribute("x2", b[0].toFixed(2)); l.setAttribute("y2", b[1].toFixed(2));
      });
      g.querySelectorAll("circle[data-p]").forEach(c => {
        const q = p[c.dataset.p];
        c.setAttribute("cx", q[0].toFixed(2)); c.setAttribute("cy", q[1].toFixed(2));
      });
    });
    requestAnimationFrame(schritt);
  };
  requestAnimationFrame(schritt);
}

// ===== Eine Einheit für den Trainingsplan =====
// tag = "A" | "B" | "C", variante = 0 | 1, plus = Steigerung (0,1 = +10 %), ruhe = Ruhewoche
function kbEinheit(tag, variante, plus, ruhe) {
  return {
    art: "kettlebell",
    titel: `Kettlebell ${tag} · ${KB_TAGE[tag].name}`,
    sek: Math.round((ruhe ? 25 : 35) * 60 / 15) * 15,
    kb: { tag, variante, plus, ruhe },
    plus
  };
}

// Liste der Übungen mit Grafik, Sätzen und Wiederholungen
function kbUebungenElement(kb) {
  const box = document.createElement("div");
  box.className = "kb-uebungen";
  const saetze = kb.ruhe ? KB_SAETZE - 1 : KB_SAETZE;

  const info = document.createElement("p");
  info.className = "kb-info";
  info.textContent = `Variante ${kb.variante + 1} · ${saetze} Sätze je Übung · Pause ${KB_PAUSE}` +
    (kb.ruhe ? " · Ruhewoche: ein Satz weniger" : "") +
    (kb.plus ? ` · Steigerung +${Math.round(kb.plus * 100)} %` : "");
  box.appendChild(info);

  KB_TAGE[kb.tag].varianten[kb.variante].forEach(id => {
    const u = KB_UEBUNGEN[id];
    const wdh = Math.round(u.wdh * (1 + (kb.plus || 0)));

    const karte = document.createElement("div");
    karte.className = "kb-uebung";
    karte.innerHTML = kbGrafik(u.pose); // Grafik ist fester, eigener Inhalt

    const text = document.createElement("div");
    text.className = "kb-text";
    const name = document.createElement("b");
    name.textContent = u.name;
    const de = document.createElement("small");
    de.textContent = u.de + (u.zweiKb ? " (2 Kettlebells)" : "");
    const menge = document.createElement("span");
    menge.className = "kb-menge";
    menge.textContent = `${saetze} × ${wdh} ${u.einheit || "Wdh."}` + (u.einheitText ? " " + u.einheitText : u.seite ? " / Seite" : "");
    const liste = document.createElement("ul");
    u.hinweise.forEach(h => {
      const li = document.createElement("li");
      li.textContent = h;
      liste.appendChild(li);
    });
    text.append(name, de, menge, liste);
    karte.appendChild(text);
    box.appendChild(karte);
  });
  kbAnimieren();
  return box;
}
