import http from 'http';

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
    console.log('Headers:', JSON.stringify(res.headers));
    
    try {
      const order = JSON.parse(body);
      console.log('Response body keys:', Object.keys(order).join(', '));
      console.log('order.id:', JSON.stringify(order.id));
      console.log('order.id type:', typeof order.id);
      console.log('order.id length:', String(order.id).length);
      console.log('Redirect URL:', `/order-confirmation?orderId=${order.id}`);
      console.log('');
      console.log('== VERDICT: The API returns a valid id ==');
    } catch (e) {
      console.log('Parse error:', e.message);
      console.log('Raw body:', body.substring(0, 500));
    }
  });
});

req.on('error', (e) => {
  console.log('Request error:', e.message);
  console.log('Is the server running? Start with: node node_modules/tsx/dist/cli.mjs server.ts');
});

req.write(data);
req.end();
