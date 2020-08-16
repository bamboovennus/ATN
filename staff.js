const express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
var url = 'mongodb+srv://bamboo:123binh789@cluster0.f1nem.mongodb.net/StudentDB?retryWrites=true&w=majority';
var MongoClient = require('mongodb').MongoClient;
ObjectId = require('mongodb').ObjectId;

//********** Trang hien thi san pham
router.get('/', async(req,res)=>
{
  if(!req.session.username)
    {
      return res.status(401).send();
    }
  else
    {
      let client= await MongoClient.connect(url);
      let dbo = client.db("ATN");
      let results = await dbo.collection("Product").find({}).toArray();
      res.render('staffProduct',{products:results});
    }
})
//********** Logout
router.get('/logout', function (req, res) 
{
  req.session.username = null;
  res.redirect('/');
});

//********** Edit product page
router.get('/edit', async(req,res)=>
{
  if(!req.session.username)
  {
    return res.status(401).send();
  }
  else 
  {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;

    let client= await MongoClient.connect(url);
    let dbo = client.db("ATN");
    let result = await dbo.collection("Product").findOne({"_id" : ObjectID(id)});
    res.render('staffEditProduct',{products:result});
}})

//********** Edit product
router.post('/doEdit', async(req,res)=>
{
  if(!req.session.username)
  {
    return res.status(401).send();
  }
  else
  {
    let id = req.body.id;
    let name = req.body.name;
    let price = req.body.price;
    let origin = req.body.origin;
    let quantity = req.body.quantity;
    let description = req.body.description;

    var ObjectID = require('mongodb').ObjectID;
    let condition = {_id: ObjectID(id)};
    let newProduct= {$set:{Name: name, Price: price, Origin: origin,Quantity : quantity, Description: description}};
    
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATN");
    await dbo.collection("Product").updateOne(condition,newProduct);

    res.redirect('/staffProduct');
  }
})

//********** Delete product
router.get('/delete', async(req,res)=>
{
  if(!req.session.username)
  {
    return res.status(401).send();
  }
  else 
  {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let condition = {_id : ObjectID(id)};

    let client= await MongoClient.connect(url);
    let dbo = client.db("ATN");
    dbo.collection("Product").deleteOne(condition);
    res.redirect('/staffProduct');
  }
})
router.get('/AddProduct',(req,res)=>{
  res.render('staffAddProduct');
});
//********** Add product
router.post('/AddProduct', async(req,res)=>
{
  let name = req.body.name;
  let price = req.body.price;
  let origin = req.body.origin;
  let quantity = req.body.quantity;
  let description = req.body.description;

  let newProduct= {Name: name, Price: price, Origin: origin, Quantity : quantity ,Description: description};
    
  let client= await MongoClient.connect(url);
  let dbo = client.db("ATN");
  dbo.collection("Product").insertOne(newProduct);

  res.redirect('/staffProduct');
})

//********** Search product
router.post('/doSearch', async(req,res)=>
{
  var key = req.body.key;
  let client= await MongoClient.connect(url);
  let dbo = client.db("ATN");
  let results = await dbo.collection("Product").find({Name : key}).toArray();

  res.render("staffProduct",{products:results})
})

module.exports = router;