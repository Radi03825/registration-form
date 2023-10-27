const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const app = express();
const port = 3003;



const salt = 7;

app.listen(port, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Port: ' + port);
  }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html')
});

app.use(bodyParser.json());

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

app.post('/register', (req, res) => {
  const { email, names, password } = req.body;

  try {
    getUserId(email);

    alert('Email is already registered.');
  } catch (errorr) {

    const sql = 'INSERT INTO users (email, names, password) VALUES (?, ?, ?)';
    dbConfig.query(sql, [email, names, bcrypt.hashSync(password, bcrypt.genSaltSync(salt))], (error, results) => {
      if (error) {
          console.error(error);
          res.status(500).send('Error registering user.');
      } else {
          res.status(200).redirect('/login');
  
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
          })
      }
    });
  }
 
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  try {
    let userId = getUserId(email);

    const sql = 'SELECT * FROM users WHERE id = ?';

    db.query(sql, [userId], (err, results) => {
      if (err) {
        console.error(err);
      }
  
      if (results.length == 1) {
        const user = results[0];
        const hashedPassword = user.password;
  
        if (bcrypt.compareSync(password, hashedPassword)) {
          //TODO: Add session authentication process

          res.status(200);
          alert('Hello ' + user.names);

        } else {
          alert('Invalid email or password.');
        }
      } else {
        alert('Invalid email or password.');
      }
    });

  } catch (error) {
    alert('Invalid email or password.');
  }
});

//TODO: Add logout