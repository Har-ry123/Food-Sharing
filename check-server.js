import http from 'http';

const opts = {
  hostname: '127.0.0.1',
  port: 3001,
  path: '/api/food-items',
  method: 'GET'
};

const req = http.request(opts, res => {
  console.log('STATUS', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('BODY', data);
  });
});

req.on('error', err => {
  console.error('ERR', err.message);
});

req.end();
