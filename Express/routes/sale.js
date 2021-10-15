var express = require('express');
const bodyParser = require('body-parser')

var router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.text());

router.use(bodyParser.urlencoded({
  extended: true
}));
  
router.get('/getHighLvlSalesData/:fromDate?/:toDate?', ((req, res, next) => {

  let highLvlSales = {
    salesForCurrMonth: null,
    salesForCurrYear: null,
    menuPopularitySales: [],
    storePopularitySales: [],
    revenuePeriodSales: {
      periodRevenue: null,
      periodCosts: null,
    },
  }

  let fromDate =  req.params.fromDate;
  let toDate = req.params.toDate;

  let salesThisMonthQueryStr = `select COUNT(*) As salesForCurrMonth from sale
    WHERE MONTH(saleDate) = MONTH(CURRENT_DATE())
    AND YEAR(saleDate) = YEAR(CURRENT_DATE())`;

  let salesThisYearQueryStr = `select COUNT(*) As salesForCurrYear from sale
    WHERE YEAR(saleDate) = YEAR(CURRENT_DATE())`;

  let menuPopularity = `select COUNT(*) AS nbrItemsSoldMenuItem, SUM(salePrice) 
    AS salesForItem, menuItemId 
    from sale where saleDate >= ? AND saleDate < ?
    GROUP BY menuItemId
    ORDER BY COUNT(*) DESC`;

  let storePopularity = `select COUNT(*) AS nbrItemsSoldStore, SUM(salePrice) 
    AS salesForStore, storeId 
    from sale where saleDate >= ? AND saleDate < ?
    GROUP BY storeId
    ORDER BY COUNT(*) DESC`;

  let revenuePeriod = `select SUM(salePrice) AS periodRevenue, SUM(saleCost) AS periodCosts
    from sale where saleDate >= ? AND saleDate < ?`;


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
        req.service.database().query(menuPopularity, fromDate && toDate ? [fromDate, toDate] : null, ((err, results) => {
          if (err){
            reject(err);
          }
          if (Array.isArray(results) && results.length){
            highLvlSales.menuPopularitySales = results;
          }
          req.service.database().query(storePopularity, fromDate && toDate ? [fromDate, toDate] : null, ((err, results) => {
            if (err){
              reject(err);
            }
            if (Array.isArray(results) && results.length){
              highLvlSales.storePopularitySales = results;
            }
            req.service.database().query(revenuePeriod, fromDate && toDate ? [fromDate, toDate] : null, ((err, results) => {
              if (err){
                reject(err);
              }
              if (Array.isArray(results) && results.length){  
                highLvlSales.revenuePeriodSales.periodRevenue = results[0].periodRevenue;
                highLvlSales.revenuePeriodSales.periodCosts = results[0].periodCosts;
              }
              resolve(JSON.stringify({highLvlSales}));

            
            }));
          }));
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

router.get('/getSales/:fromDate?/:toDate?', ((req, res, next) => {

  let fromDate = req.params.fromDate;
  let toDate = req.params.toDate;  

  let queryWithoutParamsStr = `SELECT saleId, saleDate, transactionId, menuItemId, menu_item.name AS itemSold, storeId, salePrice, saleCost
  FROM ctms.sale
  INNER JOIN menu_item
  ON menu_item.id = sale.menuItemId ORDER BY saleDate
  `;

  let queryWithParamsStr = `SELECT saleId, saleDate, transactionId, menuItemId, menu_item.name AS itemSold, storeId, salePrice, saleCost
  FROM ctms.sale
  INNER JOIN menu_item
  ON menu_item.id = sale.menuItemId
  where saleDate >= ? AND saleDate < ?
  ORDER BY saleDate
  `;

  new Promise((resolve, reject) => {
    if (fromDate && toDate){
      req.service.database().query(queryWithParamsStr, [fromDate, toDate], ((err, results) => {
        if (err){
          reject(err);
        }
        resolve(JSON.stringify(results));
      }));
    }
    else{
      req.service.database().query(queryWithoutParamsStr, ((err, results) => {
        if (err){
          reject(err);
        }
        resolve(JSON.stringify(results));
      }));
    }
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

  let queryData = JSON.parse(JSON.stringify(req.body));
  let promise = null;
  if (!queryData.menuItemId){
    promise = new Promise((resolve, reject) => {
        let idQuery = 'select id from menu_item LIMIT 1';
        req.service.database().query(idQuery, ((err, result) => {
          if (err){
            reject(err);
          }
          resolve(result[0]);
        }));
      });
  }
  else{
    promise = new Promise((resolve, reject) => {
      resolve(queryData.menuItemId);
    });
  }
  
    promise.then((result) => {
      queryData.menuItemId = result.id;
      new Promise((resolve, reject) => {
        let queryStr = 'insert into ctms.sale SET ?';

        // Get Id of first menu Item (for default) if menuItemId is null
        req.service.database().query(queryStr, queryData, ((err, result) => {
          if (err){
            reject(err);
          }
          resolve();
        }));
      })
      .then(()=>{
        res.send(JSON.stringify({}))
      })
        .catch ((err) =>{
  
        next(err)
      });
    })
  }));

router.put('/updateSale', ((req, res, next) => {

  if (!Object.keys(req.body).length){
    throw new BadRequestError('Missing Fields');
  }

  new Promise((resolve, reject) => {
    req.service.database().query('select * from sale where saleId = ?', [req.body.saleId], ((err, result) => {
      if (err){
        reject(err);
      }
      let command = `update ctms.sale SET saleDate = ?, menuItemId = ?, storeId = ?, salePrice = ?, saleCost = ? where saleId = ?`;
      req.service.database().query(command, 
        [req.body.saleDate, 
          req.body.menuItemId, 
          req.body.storeId, 
          req.body.salePrice, 
          req.body.saleCost, 
          req.body.saleId], 
          ((err, result) => {
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

router.delete('/deleteSales', ((req, res, next) => {
  if (!Object.keys(req.body).length){
    throw new BadRequestError('Missing Fields')
  }
  let selectedIds = req.body.selectedIds;

  let query = 'delete from sale where saleId in (?)'
  new Promise((resolve, reject) => {
    req.service.database().query(query, [selectedIds], function (err, results) {
      if (err){
        reject(err);
      }
      resolve(results);
    });
  })
  .then(()=>{
    res.send(JSON.stringify({}))
  })
  .catch ((err) =>{
    next(err)
  });  
}));

router.delete('/deleteSale/:saleId?', ((req, res, next) => {
    
  if (!req.params.saleId){
    throw new BadRequestError('Missing req.params.saleId')
  }
  let saleId = JSON.parse(req.params.saleId)

  let query = 'delete from sale where saleId = ?'
  new Promise((resolve, reject) => {
    req.service.database().query(query, [saleId], function (err, results) {
      if (err){
        reject(err);
      }
      resolve(results);
    });
  })
  .then(()=>{
    res.send(JSON.stringify({}))
  })
  .catch ((err) =>{

    next(err)
  });  
}));
  
  module.exports = router;