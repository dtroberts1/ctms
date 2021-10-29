var express = require('express');
const bodyParser = require('body-parser')

var router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.text());

router.use(bodyParser.urlencoded({
  extended: true
}));

  
router.get('/getMenuItemIngredients/:id?', ((req, res, next) => {

    if (!req.params.id){
      throw new BadRequestError('Missing req.params.id')
    }
  
    let queryStr = `
      SELECT ingredient.ingredientId, 
        ingredient.ingredientName, 
        menu_item_ingredient.menuItemId, 
        (SELECT name from measurement_unit where measurementUnitId = menu_item_ingredient.measurementUnitId) AS measurementType,
        menu_item_ingredient.measurementUnitId,
        menu_item_ingredient.ingredientQty  
      from ingredient
      INNER JOIN menu_item_ingredient
      ON menu_item_ingredient.ingredientId = ingredient.ingredientId
      WHERE ingredient.ingredientId IN (SELECT ingredientId FROM menu_item_ingredient WHERE menuItemId = ?) 
      AND menuItemId = ?
      
  `;
    new Promise((resolve, reject) => {
      req.service.database().query(queryStr, [req.params.id, req.params.id], ((err, results) => {
        if (err) {
          reject(err);
        }
    
        resolve(results);
      }))
    })
    .then((result) => {
      res.send(JSON.stringify(result))
    })
    .catch ((err) =>{
      next(err)
    });  
  }));

  router.post('/postMenuItemIngredient/', ((req, res, next) => {
    if (!Object.keys(req.body).length){
      throw new BadRequestError('Missing Fields')
    }
    let queryStr = `insert into menu_item_ingredient(menuItemId, ingredientId, measurementUnitId, ingredientQty)
    values(?, ?, ?, ?)`;
  
    new Promise((resolve, reject) => {
      req.service.database().query(queryStr, [req.body.menuItemId, req.body.ingredientId, 
        req.body.measurementUnitId, req.body.ingredientQty], ((err, result) => {
        if (err){
          reject(err);
        }
        resolve();
      }));
    })
    .then(()=>{
      res.send({"successResult":'DataAdded'})
    })
     .catch ((err) =>{

      next(err)
    });
  }))

  router.delete('/deleteMenuItemIngredient/:menuItemId/:ingredientId', ((req, res, next) => {

    if (!req.params.menuItemId || !req.params.ingredientId){
      throw new BadRequestError('Missing menuItemId or ingredientId')
    }
    let queryStr = `DELETE FROM menu_item_ingredient WHERE menuItemId = ? AND ingredientId = ?`;
  
    new Promise((resolve, reject) => {
      req.service.database().query(queryStr, [req.params.menuItemId, req.params.ingredientId], ((err, result) => {
        if (err){
          reject(err);
        }
        resolve();
      }));
    })
    .then(()=>{
      res.send({"successResult":'DataSaved'})
    })
     .catch ((err) =>{

      next(err)
    });
  }))

  router.put('/putMenuItemIngredient/', ((req, res, next) => {

    if (!Object.keys(req.body).length){
      throw new BadRequestError('Missing Fields')
    }
    let queryStr = `update menu_item_ingredient set measurementUnitId = ?, ingredientQty = ? where menuItemId = ? AND ingredientId = ?`;
  
    new Promise((resolve, reject) => {
      req.service.database().query(queryStr, [req.body.measurementUnitId, req.body.ingredientQty, 
        req.body.menuItemId, req.body.ingredientId], ((err, result) => {
        if (err){
          reject(err);
        }
        resolve();
      }));
    })
    .then(()=>{
      res.send({"successResult":'DataSaved'})
    })
     .catch ((err) =>{

      next(err)
    });
  }))

  router.get('/getIngredients', ((req, res, next) => {

    let queryStr = `SELECT * from ingredient ORDER BY ingredientName`;
    new Promise((resolve, reject) => {
      req.service.database().query(queryStr, ((err, results) => {
        if (err) {
          reject(err);
        }
    
        resolve(results);
      }))
    })
    .then((result) => {
      res.send(JSON.stringify(result))
    })
    .catch ((err) =>{
      next(err)
    });  
  }));

  router.get('/getStoreIngredients/:storeId', ((req, res, next) => {
    console.log("testing");

    console.log("id is " + req.params.storeId);
    if (!req.params.storeId){
      throw new BadRequestError('Missing storeId')
    }

    let queryStr = `
      SELECT 
        ingredient.ingredientId, 
        storeId, 
        mL, 
        ingredientName, 
        UPC, 
        isNut, 
        ingredientTypeId, 
        (SELECT name FROM ingredient_type 
          WHERE ingredientTypeId = ingredient.ingredientTypeId AND ingredient.ingredientId = store_ingredient.ingredientId) AS ingredientTypeName,
        ingredient.measurementUnitId,
        ingredient.density,
        measurement_unit.mlLitersConversionFactor AS mlLitersConversionFactor,
        measurement_unit.name AS muName,
        (mL * ingredient.density * measurement_unit.mlLitersConversionFactor) AS muQty
      FROM store_ingredient
      INNER JOIN ingredient
      ON ingredient.ingredientId = store_ingredient.ingredientId
      INNER JOIN measurement_unit
      ON measurement_unit.measurementUnitId = ingredient.measurementUnitId
      WHERE storeId = ?`;
    new Promise((resolve, reject) => {
      req.service.database().query(queryStr, req.params.storeId, ((err, results) => {
        if (err) {
          reject(err);
        }
    
        resolve(results);
      }))
    })
    .then((result) => {

      res.send(JSON.stringify(result))
    })
    .catch ((err) =>{
      next(err)
    });  
  }));

  router.get('/getIngredientTypes', ((req, res, next) => {

    let queryStr = `SELECT * from ingredient_type ORDER BY name`;
    new Promise((resolve, reject) => {
      req.service.database().query(queryStr, ((err, results) => {
        if (err) {
          reject(err);
        }
    
        resolve(results);
      }))
    })
    .then((result) => {
      res.send(JSON.stringify(result))
    })
    .catch ((err) =>{
      next(err)
    });  
  }));

  router.get('/getMeasurementUnits', ((req, res, next) => {

    let queryStr = `SELECT * from measurement_unit ORDER BY name`;
    new Promise((resolve, reject) => {
      req.service.database().query(queryStr, ((err, results) => {
        if (err) {
          reject(err);
        }
    
        resolve(results);
      }))
    })
    .then((result) => {
      res.send(JSON.stringify(result))
    })
    .catch ((err) =>{
      next(err)
    });  
  }));
  
  module.exports = router;