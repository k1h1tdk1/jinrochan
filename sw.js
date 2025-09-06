const CACHE = "jinro-memo-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE && caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", e=>{
  const {request} = e;
  if(request.method !== "GET") return;
  e.respondWith(
    caches.match(request).then(cached=>{
      return cached || fetch(request).then(res=>{
        const copy = res.clone();
        caches.open(CACHE).then(c=>c.put(request, copy));
        return res;
      }).catch(()=>cached);
    })
  );
});
