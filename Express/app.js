

var createError = require('http-errors');
const BadRequestError = require('bad-request-error');
const express = require('express');
const cors = require('cors');

var menuItemRouter = require('./routes/menuItem');
var saleRouter = require('./routes/sale');
var ingredientRouter = require('./routes/ingredient');
var storeRouter = require('./routes/store');

let mysql = require('mysql');

const db = mysql.createConnection({
  host     : process.env.RDS_HOSTNAME || 'localhost',
  user     : process.env.RDS_USERNAME || 'root',
  password : process.env.RDS_PASSWORD || 'sky551er',
  database : process.env.RDS_PORT || 'ctms'
});

db.connect((err) => {
  if (err){
    throw err;
  }
})

function database(){
  return db;
}

const service = () => {
  return Object.freeze({
    database, 
});};
const exposeService = async (req, res, next) => {
  req.service = service();
  next();
};

const app = express()
app.use(cors());

const port = process.env.PORT || 3000;
// login page
app.use('/api/menuItems/', exposeService, menuItemRouter);
app.use('/api/sales/', exposeService, saleRouter);
app.use('/api/ingredients/', exposeService, ingredientRouter);
app.use('/api/stores/', exposeService, storeRouter);

app.use(function (err, req, res, next) {
  if (err instanceof BadRequestError) {
    res.status(400)
    return res.send(err.message)
  }
})


app.get('/', (req, res, next) => {
  res.send('Hello World!')
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.status(500);
  res.send(err)

});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
})
module.exports = app;
