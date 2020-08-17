const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { request } = require('express');

app.use(bodyParser.urlencoded({ extended: true }));
var router = express.Router();
var url = 'mmongodb+srv://bamboo:123binh789@cluster0.f1nem.mongodb.net/StudentDB?retryWrites=true&w=majority';
var MongoClient = require('mongodb').MongoClient;
ObjectId = require('mongodb').ObjectId;


//********** Display homepage
router.get('/', async(req,res)=>
{
  if(!req.session.username)
    {
      res.status(400).send();
    }
  res.render('adminpage');
})


//********** Logout
router.get('/logout', function (req, res) 
{
  req.session.username = null;
  res.redirect('/');
});

//********** Display all employee account
router.get('/accounts', async(req,res)=>
{
  if(!req.session.username)
  {
    return res.status(401).send();
  }
  else 
  {
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATN");
    let result = await dbo.collection("Account").find({}).toArray();
    res.render('allAccounts', {accounts : result});
  }
})
router.get('/addAccount',(req,res) =>{
    res.render('addAccount')
})

//********** Add new employee
router.post('/addAccount', async(req,res)=>
{
  let name = req.body.name;
  let email = req.body.email;
  let phone = req.body.phone;
  let username = req.body.username;
  let password = req.body.password;
  let role = req.body.role;
  let newAccount = {Name: name, Email: email, Phone: phone, Username: username, Password: password, Role: role};
    
  let client= await MongoClient.connect(url);
  let dbo = client.db("ATN");
  dbo.collection("Account").insertOne(newAccount,(err,res)=>
    {
      if (err) throw err;
      console.log("Add successfully");
      client.close();
    })

  res.redirect('/adminpage/accounts');
})

//********** Edit employee page
router.get('/account/edit', async(req,res)=>
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
    let result = await dbo.collection("Account").findOne({"_id" : ObjectID(id)});
    res.render('editAccounts',{accounts:result});
}})

//********** Edit and render to all employee page
router.post('/account/doEdit', async(req,res)=>
{
  let id = req.body.id;
  let name = req.body.name;
  let email = req.body.email;
  let phone = req.body.phone;
  let username = req.body.username;
  let password = req.body.password;
  let role = req.body.role;
  let newAccount = {$set:{Name: name, Email: email, Phone: phone, Username: username, Password: password, Role: role}}
    
  var ObjectID = require('mongodb').ObjectID;
  let condition = {_id: ObjectID(id)};
  let client= await MongoClient.connect(url);
  let dbo = client.db("ATN");
  await dbo.collection("Account").updateOne(condition,newAccount);

  res.redirect('/adminpage/accounts');
})

//********** Delete account
router.get('/account/delete', async(req,res)=>
{
  if(!req.session.username)
  {
    return res.status(401).send();
  }
  else 
  {
    var ObjectID = require('mongodb').ObjectID;
    let id = req.query.id;
    let condition = {_id : ObjectID(id)};
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATN");
    dbo.collection("Account").deleteOne(condition);

    res.redirect('/adminpage/accounts');
}})

//********** Search account

router.post('/allAccounts/search', async(req,res)=>
{
  var key = req.body.key;
  let client= await MongoClient.connect(url);
  let dbo = client.db("ATN");
  let results = await dbo.collection("Account").find({Username : new RegExp(key,'i')}).toArray();
  res.render("allAccounts",{accounts:results})
})

//********** Hien thi all san pham
router.get('/products', async(req,res)=>
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
    res.render('allProducts',{products:results});
  }
});
router.get('/addProduct',(req,res)=>{
  res.render('addProduct');
});

//********** Add new product
router.post('/addProduct', async(req,res)=>
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

  res.redirect('/adminpage/products');
})

//********** Edit product
router.get('/product/edit', async(req,res)=>
{
  if(!req.session.username)
  {
    return res.status(401).send();
  }
  else 
  {
    var ObjectID = require('mongodb').ObjectID;

    let id = req.query.id;
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATN");
    let result = await dbo.collection("Product").findOne({"_id" : ObjectID(id)});
    res.render('editProducts',{products:result});
  }
});

//********** Confirm edit and render to all product page
router.post('/product/edit', async(req,res)=>
{
  let id = req.body.id;
  let name = req.body.name;
  let price = req.body.price;
  let origin = req.body.origin;
  let quantity = req.body.quantity;
  let description = req.body.description;

  var ObjectID = require('mongodb').ObjectID;
  let condition = {_id: ObjectID(id)};
  let newProduct= {$set:{Name: name, Price: price, Origin: origin, Quantity : quantity ,Description: description}};
  let client= await MongoClient.connect(url);
  let dbo = client.db("ATN");
  await dbo.collection("Product").updateOne(condition,newProduct);

  res.redirect('/adminpage/products');
})


//********** Delete product page
router.get('/product/delete', async(req,res)=>
{
  if(!req.session.username)
  {
    return res.status(401).send();
  }
  else 
  {
    var ObjectID = require('mongodb').ObjectID;

    let id = req.query.id;
    let condition = {_id : ObjectID(id)};
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATN");
    dbo.collection("Product").deleteOne(condition);
    res.redirect('/adminpage/products');
  }
})

//********** Search product
router.post('/products/search', async(req,res)=>
{
  var key = req.body.key;
  let client= await MongoClient.connect(url);
  let dbo = client.db("ATN");
  let results = await dbo.collection("Product").find({Name : key}).toArray();

  res.render("allProducts",{products:results})
})
module.exports = router;