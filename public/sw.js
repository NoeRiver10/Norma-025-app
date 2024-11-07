// Nombre de la caché para identificar los recursos que almacenamos
const CACHE_NAME = 'nom025-app-cache-v5';  // Versión incrementada para forzar la actualización

// Lista de recursos que queremos cachear para hacer disponible offline
const urlsToCache = [
    '/',  // Página principal
    '/manifest.json',  // Manifesto de la aplicación
    '/favicon.ico',  // Ícono de la aplicación
    '/icons/lictus-logo-1-192x192.png',  // Íconos
    '/icons/lictus-logo-1-512x512.png',
    '/offline.html',  // Página de respaldo para mostrar cuando no hay conexión
    '/Reconocimiento',  // Página de reconocimiento
    '/Mediciones',  // Página de mediciones
    '/page',  // Página principal renderizada (si aplica)
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    console.log('Service Worker: Instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caché abierta, añadiendo archivos...');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('Service Worker: Todos los archivos se han cacheado correctamente.');
            })
            .catch((error) => {
                console.error('Service Worker: Error al abrir la caché durante la instalación:', error);
            })
    );
    self.skipWaiting();  // Hace que el SW se active inmediatamente después de instalarse.
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activando...');
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log('Service Worker: Eliminando caché antigua:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => {
            console.log('Service Worker: Activación completada.');
            return self.clients.claim(); // Reclama inmediatamente los clientes
        })
        .catch((error) => {
            console.error('Service Worker: Error durante la activación:', error);
        })
    );
});

// Manejo del fetch para responder con la caché cuando sea posible y cachear nuevos recursos
self.addEventListener('fetch', (event) => {
    console.log('Service Worker: Fetch para:', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    console.log('Service Worker: Retornando desde caché:', event.request.url);
                    return response;
                }

                console.log('Service Worker: Recurso no encontrado en caché, intentando obtener de la red:', event.request.url);
                return fetch(event.request)
                    .then((networkResponse) => {
                        // Clonamos la respuesta para poder cachearla
                        if (event.request.method === 'GET' && networkResponse && networkResponse.status === 200) {
                            return caches.open(CACHE_NAME)
                                .then((cache) => {
                                    console.log('Service Worker: Cacheando nuevo recurso:', event.request.url);
                                    cache.put(event.request, networkResponse.clone()).catch((error) => {
                                        console.error('Service Worker: Error al cachear el recurso:', error);
                                    });
                                    return networkResponse;
                                });
                        }
                        return networkResponse;
                    })
                    .catch((error) => {
                        console.error('Service Worker: Error en fetch, mostrando offline.html:', error);
                        // Si ocurre un error (como falta de conexión), mostramos la página offline
                        if (event.request.mode === 'navigate') {
                            return caches.match('/offline.html');
                        }
                    });
            })
            .catch((error) => {
                console.error('Service Worker: Error al intentar obtener el recurso desde la caché:', error);
                // En caso de error general, mostrar la página offline
                if (event.request.mode === 'navigate') {
                    return caches.match('/offline.html');
                }
            })
    );
});
