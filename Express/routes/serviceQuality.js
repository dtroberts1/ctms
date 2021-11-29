var express = require('express');
const bodyParser = require('body-parser');

var router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.text());

router.use(bodyParser.urlencoded({
  extended: true
}));

router.get('/getEmployeeServiceSummaries', ((req, res, next) => {
  let query = `
  SELECT AVG(rating) as averageRating, CONCAT(CONCAT(employee.firstName, ' '), employee.lastName) AS employeeName, service_survey.employeeId
    FROM service_survey 
    INNER JOIN employee ON
    employee.employeeId = service_survey.employeeId
    GROUP BY employeeId ORDER BY averageRating DESC 
  `;
  new Promise((resolve, reject) => {
    req.service.database().query(query, ((err, result) => {
      if (err) {
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

router.get('/getStoreServiceSummaries', ((req, res, next) => {
  /* Average Rating for Specific Employees who work at the store */
  let query = `
    SELECT store.storeId, AVG(rating) as averageRating, store.storeName
      FROM service_survey 
      INNER JOIN store ON
      store.storeId = service_survey.storeId
      GROUP BY storeId ORDER BY averageRating DESC;    
  `;

  new Promise((resolve, reject) => {
    req.service.database().query(query, ((err, result) => {
      if (err) {
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
  
  module.exports = router;