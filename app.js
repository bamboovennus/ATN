const express = require('express');
const engines = require('consolidate');
const app = express();

var session = require('express-session');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

//npm i handlebars consolidate --save
app.engine('hbs',engines.handlebars);
app.set('views','./views');
app.set('view engine','hbs');

app.use(session
    ({
    secret: "alo",
    saveUninitialized:false, 
    resave: true,
    cookie: {maxAge: 600000}
    }));

var indexController = require("./index.js");
var homepageController = require("./staff.js");
var adminController = require("./adminpage.js");

app.use('/',indexController);
app.use('/staffProduct', homepageController);
app.use ('/adminpage',adminController);

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://bamboo:123binh789@cluster0.f1nem.mongodb.net/StudentDB?retryWrites=true&w=majority";
const client = new MongoClient(url, { useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("ATN").collection("Account");
  // perform actions on the collection object
  client.close();
});

const PORT = process.env.PORT || 5000;
var server=app.listen(PORT);

