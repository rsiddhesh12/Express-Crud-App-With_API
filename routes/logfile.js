var express = require('express');
var router = express.Router();
const {Parser} = require("json2csv");
const fs = require("fs");
const axios =require('axios');
const AWS = require("aws-sdk");

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

router.get('/',sessionIdentifier, function(req, res) {
    // res.render('logs', { title: 'Express' });
    axios.get("http://localhost:3000/api/v1/user/logdata/getLog")
    .then(function(response){
      res.render('logs', {
        title : 'CRUD Operation',
        users : response.data,
        counter:0,
    });
    // userData = response.data
    // console.log("data",response.data)
  });
});

router.get('/download/:name',sessionIdentifier, function(req, res) {
  let FileName= req.params.name;
  s3.getObject(
  { Bucket: 'upload-log-files', Key: FileName },
  function (error, data) {
    if (error != null) {
      // alert("Failed to retrieve an object: " + error);
    } else {
      // alert("Loaded " + data.ContentLength + " bytes");
      // do something with data.Body
      // var buf = Buffer.from(JSON.stringify(data.Body));
      // var temp = JSON.parse(buf.toString());
      // console.log("temp",temp)
      // const json2csvParser =new Parser(); 
      // const csv = json2csvParser.parse(json);
    
      // fs.writeFile(FileName,csv,'utf-8',function(err){
      //     if(err){
      //         throw err;
      //     }
      //     console.log("File Saved");
      // })
      var file= data.Body.toString();

      res.attachment(FileName+".csv");
      res.status(200).send(file);
    }
  }
);

});



module.exports = router;