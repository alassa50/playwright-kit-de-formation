import http from 'http';

type Product = { id: number; name: string; price: number };

let products: Product[] = [
  { id: 1, name: 'Clavier', price: 49 },
  { id: 2, name: 'Souris', price: 29 },
];
let nextId = 3;

function resetProducts(): void {
  products = [
    { id: 1, name: 'Clavier', price: 49 },
    { id: 2, name: 'Souris', price: 29 },
  ];
  nextId = 3;
}

function createServer(): http.Server {
  return http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'GET' && req.url === '/api/products') {
      res.writeHead(200);
      res.end(JSON.stringify(products));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/products') {
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', () => {
        const data = JSON.parse(body || '{}');
        if (!data.name || typeof data.name !== 'string') {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Le champ name est requis.' }));
          return;
        }
        const product: Product = { id: nextId++, name: data.name, price: data.price ?? 0 };
        products.push(product);
        res.writeHead(201);
        res.end(JSON.stringify(product));
      });
      return;
    }

    const deleteMatch = req.url?.match(/^\/api\/products\/(\d+)$/);
    if (req.method === 'DELETE' && deleteMatch) {
      const id = parseInt(deleteMatch[1], 10);
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Produit introuvable.' }));
        return;
      }
      products.splice(index, 1);
      res.writeHead(204);
      res.end();
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Route introuvable.' }));
  });
}

export { createServer, resetProducts };
