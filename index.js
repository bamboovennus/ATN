const express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://bamboo:123binh789@cluster0.f1nem.mongodb.net/StudentDB?retryWrites=true&w=majority";
const client = new MongoClient(url, { useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("ATN").collection("Account");
  // perform actions on the collection object
  client.close();
});
//********** Show index page
router.get('/',(req,res)=>{
    req.session.username = null;
    res.render('index');
})

//********** Render to homepage if login valid
router.post('/doLogin', async(req,res)=>
{
    let username = req.body.username;
    let password = req.body.password;
    // if(username.trim().length == 0) {
    //     let accountEror = {userError: "Must enter the username!"};
    //     res.render('index',{account:accountEror});
    // } else if(password.trim().length == 0){
    //     let accountEror = { passError:"invalid password"};
    //     res.render('index',{account:accountEror});
    // }
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATN");
    let results = await dbo.collection("Account").find({Username:username, Password:password}).toArray();
    let results2 = await dbo.collection("Account").find({Role: 'admin', Username:username, Password:password}).toArray();
    if(results == 0)
        {
            res.redirect("/");          
        }
    else
        {
        if(results2 != 0)
            {             
                req.session.username = username; 
                res.redirect("/adminpage");               
            }
        else
            {
                req.session.username = username; 
                res.redirect("/staffProduct");
            }
        }
})

module.exports = router;