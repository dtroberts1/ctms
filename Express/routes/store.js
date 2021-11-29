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

router.get('/getStoreMetrics/:storeId', ((req, res, next) => {

  if (!req.params.storeId){
    throw new BadRequestError('Missing storeId')
  }

  let metrics = {
    averageServiceRating: null,
    averageEmployeeRating: null,
    likelyHoodToRecommendStore: null,
    mostLeastPopularStoreMenuItem: null,
    productsSoldWithRevenueStoreYtd: null,
  }

  /* Average Service Rating for Store */
  let averageServiceRatingQuery = `
    SELECT AVG(rating) AS averageRating FROM service_survey WHERE storeId = ?`;
  
  /* Average Rating for Specific Employees who work at the store */
  let averageEmployeeRatingQuery = `
    SELECT storeId, AVG(rating) as averageRating, CONCAT(CONCAT(employee.firstName, ' '), employee.lastName) AS employeeName, service_survey.employeeId
      FROM service_survey 
      INNER JOIN employee ON
      employee.employeeId = service_survey.employeeId
      WHERE storeId = ? 
      GROUP BY employeeId ORDER BY averageRating DESC`;

    /* Liklihood to Recommend to store */
  let likelyHoodToRecommendStoreQuery = `
    SELECT AVG(likelyToRecommend) AS likelyToRecommend FROM service_survey WHERE storeId = ?
    `;
  
  /* Most/Least popular sold at Store YTD */
  let mostLeastPopularStoreMenuItemQuery = `
    SELECT menu_item.id, menu_item.name, COUNT(*) AS qtySold FROM sale
      INNER JOIN menu_item ON
      menu_item.id = sale.menuItemId
      WHERE storeId = ? AND saleDate BETWEEN 
          CONCAT(YEAR(CURRENT_DATE()),'-01-01') AND LAST_DAY(DATE_ADD(NOW(), INTERVAL 12-MONTH(NOW()) MONTH))
          GROUP BY menu_item.id
          ORDER BY qtySold DESC`;

  let productsSoldWithRevenueStoreYtdQuery = `
    SELECT COUNT(*) AS qtySoldYTD, SUM(salePrice) revenueYTD FROM sale
      WHERE storeId = ? AND saleDate BETWEEN 
        CONCAT(YEAR(CURRENT_DATE()),'-01-01') AND LAST_DAY(DATE_ADD(NOW(), INTERVAL 12-MONTH(NOW()) MONTH))`;

  new Promise((resolve, reject) => {
    req.service.database().query(averageServiceRatingQuery, req.params.storeId, ((err, results) => {
      if (err) {
        reject(err);
      }
      if(results){
        metrics.averageServiceRating = results;
      }

      req.service.database().query(averageEmployeeRatingQuery, req.params.storeId, ((err, results) => {
        if (err) {
          reject(err);
        }

        // Returns multiple
        if (Array.isArray(results)){
          metrics.averageEmployeeRating = results;
        }

        req.service.database().query(likelyHoodToRecommendStoreQuery, req.params.storeId, ((err, results) => {
          if (err) {
            reject(err);
          }

          if (results){
            metrics.likelyHoodToRecommendStore = results;
          }

          req.service.database().query(mostLeastPopularStoreMenuItemQuery, req.params.storeId, ((err, results) => {
            if (err) {
              reject(err);
            }

            if (Array.isArray(results)){
              metrics.mostLeastPopularStoreMenuItem = results;
            }
            // Returns multiple
            req.service.database().query(productsSoldWithRevenueStoreYtdQuery, req.params.storeId, ((err, results) => {
              if (err) {
                reject(err);
              }

              if (results){
                metrics.productsSoldWithRevenueStoreYtd = results;
              }
              resolve(metrics);

            }));
          }));
        }));

      }));
    }))
  })
  .then((result) => {
    res.send(result)
  })
  .catch ((err) =>{
    next(err)
  }); 

}));

router.put('/putStoreDetails', ((req, res, next) => {

  if (!Object.keys(req.body).length){
    throw new BadRequestError('Missing Fields')
  }

  let queryData = JSON.parse(JSON.stringify(req.body));

  let queryStr = `UPDATE store SET storeName = ?, launchDate = ?, streetAddr1 = ?, streetAddr2 = ?, city = ?, state = ?, zipcode = ? WHERE storeId = ?`;
  new Promise((resolve, reject) => {
    req.service.database().query(queryStr, [queryData.storeName, queryData.launchDate,
      queryData.streetAddr1, queryData.streetAddr2, queryData.city, queryData.state, queryData.zipcode, queryData.storeId], ((err, results) => {
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