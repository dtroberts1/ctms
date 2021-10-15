var express = require('express');
const bodyParser = require('body-parser')

var router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.text());

router.use(bodyParser.urlencoded({
  extended: true
}));

router.get('/getStores', ((req, res, next) => {
  
    let queryStr = 'SELECT * FROM store';
    new Promise((resolve, reject) => {
      req.service.database().query(queryStr, ((err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      }))
    })
    .then((result) => {
      res.send(result)
    })
    .catch ((err) =>{
      next(err)
    });  
  }));
  
  module.exports = router;