import http from 'http';

const data = JSON.stringify({
  name: 'Priyanshu Pathak',
  email: 'priyanshu@localkart.com',
  password: 'LocalKart@123',
  phone: '+919876543210',
  role: 'SHOPKEEPER',
  shopName: "Priyanshu's General Store",
  shopAddress: '123 Main Street, New Delhi'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    const result = JSON.parse(body);
    console.log('\n=== REGISTRATION RESULT ===');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('\n=== YOUR ACCOUNT CREDENTIALS ===');
      console.log('Email:    priyanshu@localkart.com');
      console.log('Password: LocalKart@123');
      console.log('Role:     SHOPKEEPER');
      console.log('Token:   ', result.data.token);
    }
  });
});

req.on('error', (err) => {
  console.error('Request failed:', err.message);
});

req.write(data);
req.end();
