const express = require('express');
const path = require('path');
const mysql = require("mysql");
const app = express(),
      bodyParser = require("body-parser");
      port = 8080;


const db = mysql.createConnection({
  host: "xxxxxxxxx",
  port: 3306,
  user: "xxxxx",
  password: "xxxxxxx",
  database: "list",

});

db.connect(function (err) {
  if (err) {
      console.log("error occurred while connecting", err);
  } else{
      console.log("connection created with Mysql successfully");
  }
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../my-app/build')));

app.get('/api/users', (req, res) => {
  console.log('api/users called!');
  db.query('SELECT * FROM users', function(err, rows)     {
    
    if (err) {
        console.log('error:', err)
        // render to views/users/index.ejs
        res.render('/api/users', {});   
    } else {
        // render to views/users/index.ejs
        res.send(rows);
    }
});
});

app.post('/api/user', (req, res) => {

  let firstName = req.body.user.firstName;
  let email = req.body.user.email;
  let lastName = req.body.user.lastName;
  let errors = false;

    if(firstName.length === 0 || email.length === 0 || lastName === 0) {
        errors = true;

        // set flash message
        console.log("Please enter firstName and email and lastName");
        // render to add.ejs with flash message
        res.render('/api/add', {
            firstName: firstName,
            email: email,
            lastName: lastName
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            lastName: lastName,
            email: email,
            firstName: firstName
        }
        
        // insert query
        db.query('INSERT INTO users SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                 
                // render to add.ejs
                res.render('/api/add', {
                    firstName: form_data.firstName,
                    email: form_data.email,
                    lastName: form_data.lastName
                })
            } else {   
                res.redirect('/api/users');
            }
        })

  };
});

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, '../my-app/build/index.html'));
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});
