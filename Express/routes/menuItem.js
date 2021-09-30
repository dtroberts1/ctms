var express = require('express');
const bodyParser = require('body-parser')

var router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

router.get('/getMenuItem/:id?', ((req, res, next) => {
    if (!req.params.id){
      throw new BadRequestError('Missing req.params.id')
    }
  
    let queryStr = 'SELECT * FROM menu_item where id = ?';
    new Promise((resolve, reject) => {
      req.service.database().query(queryStr, [req.params.id], ((err, results) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      }))
    })
    .then((result) => {
      res.send(result)
    })
    .catch ((err) =>{
      next(err)
    });  
  }));
  
  router.get('/getMenuItems', ((req, res, next) => {
    console.log("testing")
    let queryStr = 'SELECT * FROM menu_item';
  
    new Promise((resolve, reject) => {
      req.service.database().query(queryStr, ((err, results) => {
        if (err){
          reject(err);
        }
        resolve(results);
      }));
    })
    .then((result) => {
      console.log({"result":result})
      res.send(result)
    })
    .catch ((err) =>{
      console.log({"err":err})
      next(err)
    });
  }));
  
  router.post('/addMenuItem/', ((req, res, next) => {
    console.log("at 1")
    console.log({"req.body":req.body})
    if (!Object.keys(req.body).length){
      console.log("at a")
      throw new BadRequestError('Missing Fields')
    }
    let queryStr = 'insert into ctms.menu_item SET ?';
    console.log("at test")
  
    new Promise((resolve, reject) => {
      req.service.database().query(queryStr, req.body, ((err, result) => {
        if (err){
          reject(err);
        }
        resolve();
      }));
    })
    .then(()=>{
      res.send("Data added")
    })
     .catch ((err) =>{
      next(err)
    });
  }))
  
  router.put('/updateMenuItem', ((req, res, next) => {
  
    if (!Object.keys(req.body).length){
      throw new BadRequestError('Missing Fields')
    }
  
    new Promise((resolve, reject) => {
      req.service.database().query('select * from menu_item where id = 7', ((err, result) => {
        if (err){
          reject(err);
        }
        let command = 'update ctms.menu_item SET name = ?, description = ?, price = 2.44, cost = ?, popularity = ?, reviewRank = ? where id = ?';
        req.service.database().query(command, [req.body.name, req.body.description, req.body.price, req.body.cost, req.body.popularity, req.body.reviewRank, req.body.id], ((err, result) => {
          if (err){
            reject(err);
          }
          resolve(true);
        }))
      }))
    })
    .then(() => {
      res.send("Success")
    })
    .catch ((err) =>{
      next(err)
    });
  }))
  
  router.delete('/deleteMenuItem/:id?', ((req, res, next) => {
    console.log({"req.params":req.params})
    if (!req.params.id){
      throw new BadRequestError('Missing req.params.id')
    }

    let id = JSON.parse(req.params.id)
  
    let query = 'delete from menu_item where id = ?'
    new Promise((resolve, reject) => {
      req.service.database().query(query, [id], function (err, results) {
        if (err){
          reject(err);
        }
        resolve(results);
      });
    })
    .then(()=>{
      res.send("Success")
    })
    .catch ((err) =>{
      next(err)
    });  
  }));
  
  module.exports = router;