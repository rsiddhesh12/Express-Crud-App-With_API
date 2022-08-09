var express = require('express');
var router = express.Router();
const {Parser} = require("json2csv");
const fs = require("fs");
const axios =require('axios');
var date = require('date');
var CRON =require('node-cron');
const AWS = require("aws-sdk");
var uuid = require("uuid");


AWS.config.update({
  accessKeyId: "AKIAZX5IKU6G4CRP6SSC",
  secretAccessKey: "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",
  // "region": "sa-east-1" 
}); // for simplicity. In prod, use loadConfigFromFile, or env variables

const s3 =new AWS.S3();


function sessionIdentifier(req,res,next){
  if(req.session.loggedIn){
    console.log("INside FUnction",req.session);
    next();
  }
  else{
    res.render('login',{title :'Login'});
  }
}


let fileCounter=0;

var logData = CRON.schedule('*/15 * * * *', () => {
  console.log(uuid.v1(),"UUID-------->")
  console.log("counter=============>1",fileCounter);
  let currentTime =Date.now();
  console.log(currentTime,"Time======>")
  const userDataLog = userData.filter((data) => {
          let date = new Date(data.createdAt)
    return  currentTime - date.getTime() <= 1800000;
});
console.log("newLog",userDataLog)
let new_logList = userDataLog.map(function(obj) {
  return {
    ProductName: obj.pname,
    Price: obj.price,
    Description: obj.description
  }
});
console.log("data LOG======>",new_logList)
  const json2csvParser =new Parser(); 
  const csvLog = json2csvParser.parse(new_logList);
  var fName="ProductLog"+uuid.v1()+".csv"
  fs.writeFile(fName,csvLog,function(err){
      if(err){
          throw err;
      }
      console.log("File Saved");
  });
  console.log("counter=======>2",fileCounter);
  var FILEPATH ="C:/new project/"+fName;
  fs.readFile(FILEPATH,'utf-8',  (err, data) => {
    if (err) throw err;
    const params = {
      Bucket: 'upload-log-files', 
      Key: fName, 
      Body : data
    };

    s3.upload(params, (s3Err, data) => {
      if (s3Err) throw s3Err
      console.log(`File uploaded successfully at ${data.Location}`)
    });
   });

  let data = {LogName: fName};
  axios.post('http://localhost:3000/api/v1/user/logdata/createlLog',data).
  then(function(response){
    fileCounter=fileCounter + 1;
      // res.redirect('/product');
  });
  console.log("counter==========>3",fileCounter);
});

logData.start();//scheduler for data after every 30Min


let counter = 0;
/* GET home page. */
global.userData
router.get('/', sessionIdentifier, function(req, res, next) {
  // res.render('index', { title: 'Express' });
  // let cLimit =Math.ceil(userData.length/5);
  // console.log("Climit=========>",cLimit)
  axios.get(`http://localhost:3000/api/v1/user/product/limitedProduct/5/${counter}`).
  then(function(response){
    res.render('product', {
        title : 'CRUD Operation',
        users : response.data,
        counter: counter
    });
    // userData = response.data
    // console.log("data",response.data)
  });
  axios.get('http://localhost:3000/api/v1/user/product/allProduct').
  then(function(response){
    // res.render('product', {
    //     title : 'CRUD Operation',
    //     users : response.data
    // });
    userData = response.data
    console.log("data",response.data)
  });
});




router.get('/next', sessionIdentifier, function(req, res, next) {
  // res.render('index', { title: 'Express' });
  counter =counter + 1 ;
  let cLimit =Math.ceil(userData.length/5);
  if(counter < cLimit){
    axios.get(`http://localhost:3000/api/v1/user/product/limitedProduct/5/${counter}`).
    then(function(response){
      res.render('product', {
          title : 'CRUD Operation',
          users : response.data,
          counter: counter
      });
      // userData = response.data
      // console.log("data",response.data)
    });
  } else {
    counter = cLimit -1;
    axios.get(`http://localhost:3000/api/v1/user/product/limitedProduct/5/${cLimit-1}`).
    then(function(response){
      res.render('product', {
          title : 'CRUD Operation',
          users : response.data,
          counter: counter
      });
      // userData = response.data
      // console.log("data",response.data)
    });
  }
  
});


router.get('/previous', sessionIdentifier, function(req, res, next) {
  // res.render('index', { title: 'Express' });
  if(counter !==0){
    counter = counter-1;
  }
  axios.get(`http://localhost:3000/api/v1/user/product/limitedProduct/5/${counter}`).
    then(function(response){
      res.render('product', {
          title : 'CRUD Operation',
          users : response.data,
          counter: counter
      });
      // userData = response.data
      // console.log("data",response.data)
    });
});



router.get('/download',sessionIdentifier,(req, res) => {

  let new_list = userData.map(function(obj) {
    return {
      ProductName: obj.pname,
      Price: obj.price,
      Description: obj.description
    }
  });

  const json2csvParser =new Parser(); 
  const csv = json2csvParser.parse(new_list);

  fs.writeFile("Product.csv",csv,function(err){
      if(err){
          throw err;
      }
      console.log("File Saved");
  })

  res.attachment("Product.csv");
  res.status(200).send(csv);

  // let data = {LogName:"LogFile"};
  //   axios.post('http://localhost:3000/api/v1/user/product/addProduct',data).
  //   then(function(response){
  //       res.redirect('/product');
  //   });
});


router.get('/add', sessionIdentifier,(req, res) => {
    res.render('product_add', {
        title : 'Add Product'
    });
  });
  
  router.post('/save', sessionIdentifier,(req, res) => { 
    let data = {pname: req.body.pname, price: req.body.price, description: req.body.description};
    axios.post('http://localhost:3000/api/v1/user/product/addProduct',data).
    then(function(response){
        res.redirect('/product');
    });
  });
  
  
  router.post('/update',sessionIdentifier,(req, res) => {
    const userId = req.body.pid;
    let data = {pname: req.body.pname,
      price: req.body.price, 
      description: req.body.description};
    console.log(req.body,"Body")
    axios.post(`http://localhost:3000/api/v1/user/product/${userId}`,data).
    then(function(response){
        res.redirect('/product');
    });
  });


router.get('/edit/:userId',sessionIdentifier,(req, res) => {
  const userId = req.params.userId;
  axios.get(`http://localhost:3000/api/v1/user/product/${userId}`).
  then(function(response){
    res.render('product_edit', {
        title : 'CRUD Operation',
        user : response.data,
    });
  });
});


router.get('/delete/:userId', sessionIdentifier,(req, res) => {
  const userId = req.params.userId;
  // counter = 0;
  axios.delete(`http://localhost:3000/api/v1/user/product/${userId}`).
  then(function(response){
    res.redirect('/product');
  })
});

module.exports = router;
