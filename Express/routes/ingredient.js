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
        menu_item_ingredient.ingredientQty  
      from ingredient
      INNER JOIN menu_item_ingredient
      ON menu_item_ingredient.ingredientId = ingredient.ingredientId
      WHERE ingredient.ingredientId IN (SELECT ingredientId FROM menu_item_ingredient WHERE menuItemId = ?)
  `;
    new Promise((resolve, reject) => {
      req.service.database().query(queryStr, [req.params.id], ((err, results) => {
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