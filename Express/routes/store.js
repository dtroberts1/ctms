var express = require('express');
const bodyParser = require('body-parser');
const { route } = require('./menuItem');

var router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.text());

router.use(bodyParser.urlencoded({
  extended: true
}));

router.post('/addStore/', ((req, res, next) => {

  if (!Object.keys(req.body).length){
    throw new BadRequestError('Missing Fields')
  }
  let queryData = JSON.parse(JSON.stringify(req.body));

  

  let queryStr = `INSERT INTO store(storeName, launchDate, streetAddr1, streetAddr2, city, state, zipcode)
  VALUES(?,?,?,?,?,?,?)`;
  new Promise((resolve, reject) => {
    req.service.database().query(queryStr, [queryData.storeName, queryData.launchDate,
      queryData.streetAddr1, queryData.streetAddr2, queryData.city, queryData.state, queryData.zipcode], ((err, result) => {
      if (err){
        reject(err);
      }
      resolve(result);
    }));
  })
  .then((result) => {
    res.send(result)
  })
  .catch ((err) =>{
    next(err)
  });  
}));

router.delete('/deleteStore/:storeId?', ((req, res, next) => {
  if (!req.params.storeId){
    throw new BadRequestError('Missing storeId');
  }
  let queryStr = 'DELETE FROM store WHERE storeId = ?';

  let deleteRelatedSalesQuery = 'DELETE FROM sale where storeId = ?';
  let deleteRelatedIngredientsQuery = 'DELETE FROM store_ingredient WHERE storeId = ?';

  new Promise((resolve, reject) => {
    req.service.database().query(deleteRelatedSalesQuery, [req.params.storeId], ((err, results) => {
      if (err){
        reject(err);
      }
      req.service.database().query(deleteRelatedIngredientsQuery, [req.params.storeId], ((err, results) => {
        if (err){
          reject(err);
        }
        req.service.database().query(queryStr, [req.params.storeId], ((err, results) => {
          if (err) {
            reject(err);
          }
          resolve(results);
        }));

      }));

    }));
  })
  .then((result) => {
    res.send(result)
  })
  .catch ((err) =>{
    next(err)
  });  

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