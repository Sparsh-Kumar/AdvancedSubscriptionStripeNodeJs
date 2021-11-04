
require ('dotenv').config ();
const express = require ('express');
const bodyParser = require ('body-parser');
const mongoose = require ('mongoose');
const morgan = require ('morgan');
const path = require ('path');
const fs = require ('fs');
const hbs = require ('hbs');
const port = process.env.PORT || 80;
const serverLogStream = fs.createWriteStream (path.resolve (__dirname, 'logs', 'server.log'), { flags: 'a' });
const { RouteHandler } = require (path.resolve (__dirname, 'RouteHandler', 'RouteHandler'));
const { auth } = require ('express-openid-connect');


mongoose.Promise = global.Promise;
mongoose.connect (process.env.MONGODB_DATABASE_URL).then (() => { console.log (`Connected ${process.env.MONGODB_DATABASE_URL}`); }).catch ((error) => { console.log (`Error: ${error.message}` ); })

const app = express ();

app.use ('/webhook', bodyParser.raw ({ type: 'application/json' }));
app.use (bodyParser.json ({ limit: '10kb' }));
app.use (express.static (path.resolve (__dirname, 'public')));
app.set ('view engine', 'hbs');

hbs.registerPartials (path.resolve (__dirname, 'views', 'partials'));

app.use (morgan ('combined', {
    stream: serverLogStream
}));

app.use (
    auth ({
        authRequired: false,
        auth0Logout: true,
        issuerBaseURL: process.env.ISSUER_BASE_URL,
        baseURL: process.env.BASE_URL,
        clientID: process.env.CLIENT_ID,
        secret: process.env.SECRET
    })
);


app.use ('/', RouteHandler);
app.listen (port, () => {
    console.log (`http://localhost:${port}`);
})
