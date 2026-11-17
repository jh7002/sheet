// 컴퓨터용 앱(설치형 웹앱)에서 화면 파일을 보관해 두었다가, 인터넷이 잠깐 끊겨도 화면은 뜨게 한다.
// 대화 내용(Firestore)은 여기서 보관하지 않는다.
const CACHE = "sheet-v1";
self.addEventListener("install", (e) => { self.skipWaiting(); });
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  // 늘 새 버전을 먼저 받고, 안 되면 보관해 둔 것
  e.respondWith(
    fetch(e.request).then((r) => {
      if (r.ok) { const c = r.clone(); caches.open(CACHE).then((cc) => cc.put(e.request, c)); }
      return r;
    }).catch(() => caches.match(e.request).then((r) => r || caches.match("./index.html")))
  );
});
