import { createServer as createViteServer } from 'vite';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  // Start the server the same way server.ts does
  const { default: serverApp } = await import('./dist/server.cjs');

  // Wait a bit for server to be ready
  await new Promise(r => setTimeout(r, 2000));

  // Test POST /api/orders
  const data = JSON.stringify({
    customer_name: 'Test User',
    customer_phone: '+212600000000',
    customer_city: 'Agadir',
    customer_street: 'Test Street',
    items: [{ id: 't1', product_id: 'p1', name: 'Test', price: 10, quantity: 1, selected_size: 'M', image: '/t.jpg', max_stock: 10 }],
    total: 10
  });

  const opts = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/orders',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
  };

  const req = http.request(opts, (res) => {
    let body = '';
    res.on('data', c => body += c);
    res.on('end', () => {
      console.log('POST status:', res.statusCode);
      console.log('Content-Type:', res.headers['content-type']);
      
      const order = JSON.parse(body);
      console.log('Response keys:', Object.keys(order).join(', '));
      console.log('order.id:', JSON.stringify(order.id));
      console.log('order.id type:', typeof order.id);
      
      // Test GET
      http.get(`http://localhost:3000/api/orders/${order.id}`, (r2) => {
        let b2 = '';
        r2.on('data', c => b2 += c);
        r2.on('end', () => {
          const o2 = JSON.parse(b2);
          console.log('GET status:', r2.statusCode);
          console.log('GET order.id:', o2.id);
          console.log('');
          console.log('=== FULL API FLOW WORKS ===');
          console.log('Redirect URL would be:', `/order-confirmation?orderId=${order.id}`);
          process.exit(0);
        });
      });
    });
  });

  req.on('error', (e) => {
    console.log('Error:', e.message);
    process.exit(1);
  });

  req.write(data);
  req.end();
}

main().catch(e => {
  console.error('Failed:', e.message);
  process.exit(1);
});
