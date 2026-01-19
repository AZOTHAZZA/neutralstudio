// PURE: Service Worker (The Gate of Logos)
// 役割: PWA機能の維持、オフラインキャッシング、および旧世界のパージ

// 🚨 バージョンを更新することで、ブラウザに強制的に新しいSWをインストールさせます
const CACHE_NAME = 'pure-v1'; 

// キャッシュ対象を PURE の構成ファイルに最適化
const CACHE_ASSETS = [
    './',           // PURE 起動ルート
    './index.html',
    './style.css',  // 洗練された肉体（CSS）をキャッシュ
    './manifest.json' // 港の定義をキャッシュ
];

/**
 * インストールイベント: 最小限の必須アセットをキャッシュする。
 */
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('PURE: Opening the harbor... caching assets.');
                return cache.addAll(CACHE_ASSETS);
            })
            .then(() => {
                console.log('PURE: Installation Success. Assets secured.');
                // 待機状態をスキップして即座にアクティブにする
                return self.skipWaiting();
            })
            .catch((e) => {
                console.error('PURE: Installation Failed:', e);
            })
    );
});

/**
 * アクティベートイベント: 古い MSGAI のキャッシュを完全に削除（パージ）する。
 */
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // 現在の CACHE_NAME 以外（旧 msga-* 等）をすべて削除
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log('PURE: Purging old world cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // クライアントの制御を即座に開始
    return self.clients.claim();
});

/**
 * フェッチイベント: ネットワークリクエストを傍受し、キャッシュを優先。
 * オフラインでも「港」を閉じさせない。
 */
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // キャッシュがあればそれを返し、なければネットワークへ
                return response || fetch(event.request);
            })
            .catch((error) => {
                console.error('PURE: Fetch error (Offline?):', error);
            })
    );
});
