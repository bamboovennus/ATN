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

const PORT = process.env.PORT || 5000;
var server=app.listen(PORT);

