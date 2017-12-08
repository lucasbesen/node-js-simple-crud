const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const app = express();

MongoClient.connect('mongodb://localhost:27017/local', function (err, database) {
    if(err) return console.log(err);

    db = database.db('local');

    app.listen(3000, function () {
        app.set('view engine', 'ejs');
        app.use(bodyParser.urlencoded({extended: true}));

        app.post('/quotes', function (req, res) {
            db.collection('quotes').insertOne(req.body, function (err, result) {
                if(err) console.log(err);

                res.redirect('/');
            })
        });

        app.get('/', function(req, res) {
            db.collection('quotes').find().toArray(function(err, result) {
                if(err) console.log(err);

                res.render('index.ejs', {quotes: result})
            });
        });


        app.get('/edit/:id', function(req, res) {
           var id =  req.params.id;
           db.collection('quotes').find({_id: ObjectID(id)}).toArray(function(err, result){
               if(err) console.log(err);

               res.render('edit.ejs', {name: result[0].name, quote: result[0].quote, action: '/edit/' + result[0]._id});
           })
        });

        app.post('/edit/:id', function(req, res) {
            var id = req.params.id;
            var name = req.body.name;
            var quote = req.body.quote;

            db.collection('quotes').updateOne({_id: ObjectID(id)}, {$set: {name: name, quote: quote}});
            res.redirect('/');
        });

        app.get('/delete/:id', function(req, res) {
            var id = req.params.id;

            db.collection('quotes').deleteOne({_id: ObjectID(id)});

            res.redirect('/');
        });
    });
});
