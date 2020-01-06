var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db = require('./database')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function (req, res) {
    return res.send({ error: true, message: 'Animawka API' })
});

// Retrieve all users 
//app.get('/users', function (req, res) {
//    dbConn.query('SELECT * FROM users', function (error, results, fields) {
//        if (error) throw error;
//        return res.json({ error: false, data: results, message: 'users list.' });
//    });
//});

app.get('/anime', function (req, res) {
    db.getAnimeList().then(results => {
    console.log(results);
    return res.json({ error: false, data: results[0], message: 'anime list.' });
    });
});

app.post('/login', function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    db.userLogin(email, password).then(out => {
        if (out === false) {
            return res.json({error:true, token:false, message: 'Incorrect data'});
        } else {
            console.log(out);
            return res.json({error:false, user:out, message: 'coming soon'});
        }
    });
});

app.listen(3000, function () {
    console.log('Aplication started on port 3000');
});


db.connect();

module.exports = app;