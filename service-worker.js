// Define o nome do cache para a versão atual do seu aplicativo
const CACHE_NAME = 'ficha-beleza-v1';

// Lista de URLs para pré-cachear quando o Service Worker for instalado
const urlsToCache = [
    '/', // A raiz do seu aplicativo
    '/index.html', // O arquivo HTML principal
    '/style.css', // O arquivo CSS
    '/script.js', // O arquivo JavaScript
    '/manifest.json', // O arquivo de manifesto do PWA
    'https://cdn.tailwindcss.com', // CDN do Tailwind CSS
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap', // Fonte Inter do Google Fonts
    // Adicione outras URLs de assets que você deseja cachear (imagens, ícones, etc.)
];

// Evento 'install': Disparado quando o Service Worker é instalado
self.addEventListener('install', event => {
    // Espera até que o cache seja aberto e todos os arquivos sejam adicionados
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Cache aberto');
                return cache.addAll(urlsToCache); // Adiciona todos os URLs à lista de cache
            })
            .catch(error => {
                console.error('Service Worker: Falha ao abrir o cache ou adicionar URLs:', error);
            })
    );
});

// Evento 'fetch': Disparado sempre que o navegador tenta buscar um recurso
self.addEventListener('fetch', event => {
    // Intercepta a requisição e responde com o recurso do cache, se disponível
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Se o recurso estiver no cache, retorna-o
                if (response) {
                    return response;
                }
                // Se não estiver no cache, busca na rede
                return fetch(event.request)
                    .then(networkResponse => {
                        // Opcional: Cachear novas requisições dinamicamente
                        // Se a requisição for válida e não for um método POST
                        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                            const responseToCache = networkResponse.clone(); // Clona a resposta para o cache
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, responseToCache); // Adiciona a resposta ao cache
                                });
                        }
                        return networkResponse;
                    })
                    .catch(error => {
                        console.error('Service Worker: Falha na busca de rede:', error);
                        // Você pode retornar uma página offline aqui, se desejar
                        // return caches.match('/offline.html'); // Exemplo
                    });
            })
    );
});

// Evento 'activate': Disparado quando o Service Worker é ativado
self.addEventListener('activate', event => {
    // Limpa caches antigos para garantir que apenas a versão mais recente esteja ativa
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deletando cache antigo:', cacheName);
                        return caches.delete(cacheName); // Deleta caches que não correspondem ao CACHE_NAME atual
                    }
                })
            );
        })
    );
});
