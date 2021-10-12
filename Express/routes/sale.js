var express = require('express');
const bodyParser = require('body-parser')

var router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.text());

router.use(bodyParser.urlencoded({
  extended: true
}));

  
  router.get('/getHighLvlSalesData', ((req, res, next) => {

    let highLvlSales = {
      salesForCurrMonth: null,
      salesForCurrYear: null,
    }

    let salesThisMonthQueryStr = `select COUNT(*) As salesForCurrMonth from sale
      WHERE MONTH(saleDate) = MONTH(CURRENT_DATE())
      AND YEAR(saleDate) = YEAR(CURRENT_DATE())`;

    let salesThisYearQueryStr = `select COUNT(*) As salesForCurrYear from sale
      WHERE YEAR(saleDate) = YEAR(CURRENT_DATE())`;
  
    new Promise((resolve, reject) => {
      req.service.database().query(salesThisMonthQueryStr, ((err, results) => {
        if (err){
          reject(err);
        }
        if (Array.isArray(results) && results.length){
          highLvlSales.salesForCurrMonth = results[0].salesForCurrMonth;
        }
        req.service.database().query(salesThisYearQueryStr, ((err, results) => {
          if (err){
            reject(err);
          }
          if (Array.isArray(results) && results.length){
            highLvlSales.salesForCurrYear = results[0].salesForCurrYear;
          }
          resolve(JSON.stringify(highLvlSales));
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

  router.get('/getSales', ((req, res, next) => {
    let queryStr = `SELECT saleId, saleDate, menuItemId, menu_item.name AS itemSold, storeId, salePrice, saleCost
    FROM ctms.sale
    INNER JOIN menu_item
    ON menu_item.id = sale.menuItemId ORDER BY saleDate`;
  
    new Promise((resolve, reject) => {
      req.service.database().query(queryStr, ((err, results) => {
        if (err){
          reject(err);
        }
        resolve(JSON.stringify(results));
      }));
    })
    .then((result) => {
      res.send(result)
    })
    .catch ((err) =>{
      next(err)
    });
  }));

  router.post('/addSale/', ((req, res, next) => {

    if (!Object.keys(req.body).length){
      throw new BadRequestError('Missing Fields')
    }
    let queryStr = 'insert into ctms.sale SET ?';
      
    new Promise((resolve, reject) => {
      req.service.database().query(queryStr, req.body, ((err, result) => {
        if (err){
          reject(err);
        }
        resolve();
      }));
    })
    .then(()=>{
      res.send(JSON.stringify("{result: 'Ok'}"))
    })
     .catch ((err) =>{
      next(err)
    });
  }));

  router.put('/updateSale', ((req, res, next) => {
  
    if (!Object.keys(req.body).length){
      throw new BadRequestError('Missing Fields')
    }
    
    new Promise((resolve, reject) => {
      req.service.database().query('select * from sale where saleId = ?', [req.body.saleId], ((err, result) => {
        if (err){
          reject(err);
        }
        let command = 'update ctms.sale SET saleDate = ?, menuItemId = ?, storeId = ?, salePrice = ?, saleCost = ? where saleId = ?';
        req.service.database().query(command, [req.body.saleDate, req.body.menuItemId, req.body.storeId, req.body.salePrice, req.body.saleCost, req.body.saleId], ((err, result) => {
          if (err){
            reject(err);
          }
          resolve(true);
        }))
      }))
    })
    .then((result) => {
      res.send(JSON.stringify({}));
    })
    .catch ((err) =>{
      next(err)
    });
  }));
  
  module.exports = router;