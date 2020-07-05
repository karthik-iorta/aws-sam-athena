'use strict'
const awsServerlessExpress = require('aws-serverless-express')
const bodyParser = require("body-parser");
const app = require("express")();
const userCtrl = require('./user.controller');

app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.get('/', userCtrl.findAll);
app.get('/:id', userCtrl.findOne);
app.post('/', userCtrl.create);
app.put('/:id', userCtrl.update);
app.delete('/:id', userCtrl.delete);


// # Uncomment for local testing and debugging.
// app.listen(5000, () => {
//     console.log("Server listening at port: 5000");
// });

const server = awsServerlessExpress.createServer(app)
exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context)