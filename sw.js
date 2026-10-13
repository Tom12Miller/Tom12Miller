// ===== Service Worker =====
// Strategie "Netz zuerst": Bei jedem Öffnen wird die neueste Version
// aus dem Internet geholt. Nur ohne Internet wird die gespeicherte
// Kopie verwendet, damit die App auch offline startet.

const CACHE = "leben-cache";

self.addEventListener("install", () => {
  // Neue Version sofort aktivieren, nicht auf das Schließen der App warten
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const anfrage = event.request;

  // Nur eigene Dateien behandeln, alles andere normal laden
  if (anfrage.method !== "GET" || new URL(anfrage.url).origin !== location.origin) return;

  event.respondWith(
    fetch(anfrage, { cache: "no-store" })
      .then((antwort) => {
        // Frische Kopie für den Offline-Fall speichern
        if (antwort.ok) {
          const kopie = antwort.clone();
          caches.open(CACHE).then((cache) => cache.put(anfrage, kopie));
        }
        return antwort;
      })
      .catch(() =>
        // Kein Internet: gespeicherte Kopie verwenden
        caches.match(anfrage, { ignoreSearch: true })
          .then((gespeichert) => gespeichert || caches.match("./"))
      )
  );
});
