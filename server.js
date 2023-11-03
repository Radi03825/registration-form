const http = require('http');
const url = require('url');
const fs = require('fs');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const port = 3003;

const salt = 7;

const dbConfig = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '1234',
  database: 'usersdata',
});

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'myGmail@gmail.com', 
    pass: 'myPass'
  }
});

dbConfig.connect(err => {
  if (err) {
    console.error(err);
  } else {
    console.log('Connected');
  }
});

function getUserId(email) {
  const sql = 'SELECT * FROM users WHERE email = ?';

  db.query(sql, [email], (err, result) => {
    if (result.length == 1) {
      return result[0].id;
    } else {
      throw new Error('User not found');
    }
  });
}

function parseFormData(rawData) {
  const formData = {};
  const pairs = rawData.split('&');

  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    formData[decodeURIComponent(key)] = decodeURIComponent(value);
  }

  return formData;
}

const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url);

  if (req.method == 'GET' && pathname == '/register') {
    fs.readFile(__dirname + '/index.html', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else if (req.method == 'GET' && pathname == '/login') {
    fs.readFile(__dirname + '/login.html', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else if (req.method == 'POST' && pathname == '/register') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      //const userData = JSON.parse(body);

      const userData = parseFormData(body);

      console.log(userData);

      try {
        getUserId(userData.email);

        alert('Email is already registered.');
      } catch (errror) {

        const sql = 'INSERT INTO users (email, names, password) VALUES (?, ?, ?)';

        dbConfig.query(sql, [userData.email, userData.names, bcrypt.hashSync(userData.password, bcrypt.genSaltSync(salt))], (error, result) => {

          if (error) {
            console.error(error);
            res.writeHead(500, {'Content-Type' : 'text/plain'});
            res.end('Registration failed');
          } else {
            res.writeHead(302, {'Location' : '/login'});
            res.end();

            let mail = {
              from: 'myGmail@gmail.com', 
              to: email, 
              subject: 'Successful registration', 
              text: 'Successful registration'
            };
    
            transporter.sendMail(mail, (error, info) => {
              if (error) {
                alert('Something went wrong');
              } else {
                alert('Successful registration. Go to your email.');
              }
            });
          }
        });
      } 

      
    });

  } else if (req.method == 'POST' && pathname == '/login') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const userData = JSON.parse(body);

      try {
        let id = getUserId(userData.email);

        const sql = 'SELECT * FROM users WHERE id = ?';

        db.query(sql, [userId], (err, results) => {
          if (err) {
            console.error(err);
          }
        });
  
        if (results.length == 1) {
          const user = results[0];
          const hashedPassword = user.password;
  
          if (bcrypt.compareSync(password, hashedPassword)) {

            res.status(200);
            alert('Hello ' + user.names);

          } else {
            alert('Invalid email or password.');
          }
        }

      } catch (errror) {
        alert('Invalid email or password')
      }
    });
  }
});

server.listen(port, () => {
  console.log(port);
});


