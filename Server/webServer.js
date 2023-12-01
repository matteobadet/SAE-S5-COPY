const express = require('express');
const { createServer } = require('node:http');

//Création du serveur express
const app = express();

const expressHbs = require('express-handlebars');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false})); // parse response
app.use(bodyParser.json());

//Import route
const route = require('../App/Routes/route');

// Static files middlware. Serve public folder (static files etc)
app.use(express.static('public'));


// template engine
app.engine('hbs', expressHbs.engine(
    {   extname: "hbs",
        defaultLayout: "",
        layoutsDir: "",
    }
));
app.set('view engine', 'hbs');
app.set('views', 'views');


// Routes middleware
app.use(route);

const server = createServer(app);

module.exports = server;