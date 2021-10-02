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
  
  module.exports = router;