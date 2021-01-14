const dotenv = require('dotenv').config();
const dotenvExpand = require('dotenv-expand');
dotenvExpand(dotenv);

const API_URL = process.env.REACT_APP_API_HOST_URI;

const fs = require('fs');
const privateKey  = fs.readFileSync('server/key.pem', 'utf8');
const certificate = fs.readFileSync('server/cert.pem', 'utf8');
const credentials = {key: privateKey, cert: certificate};

const request = require('request');
const express = require('express');
const app = express();

app.use('/', (req, res) => {
    req.pipe(
        request(
            API_URL + req.url,
            (error) => {
                if (error && error.code === 'ECONNREFUSED')
                    console.error('Connexion refused');
            }
        )
    ).pipe(res);
});

const https = require('https');
const httpsServer = https.createServer(credentials, app);

httpsServer.listen('7069');