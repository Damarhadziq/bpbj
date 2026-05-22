const url = 'http://localhost:4000/api/auth/sign-up/email';
const data = {
  name: "Superadmin BPBJ",
  email: "superadmin@semarangkota.go.id",
  password: "adminpassword123",
  role: "superadmin" // Our custom role
};

fetch(url, {
  method: 'POST',
  headers: {
    'Origin': 'http://localhost:5173',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
.then(res => res.text().then(text => console.log('Status:', res.status, 'Response:', text)))
.catch(err => console.error('Error:', err));
