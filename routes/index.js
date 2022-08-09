var express = require('express');
var router = express.Router();
const {Parser} = require("json2csv");
const fs = require("fs");
var connection = require('../config/dbConfig');
const { default: axios } = require('axios');


function sessionIdentifier(req,res,next){
  if(req.session.loggedIn){
    console.log("INside FUnction",req.session);
    next();
  }
  else{
    res.render('login',{title :'Login'});
  }
}

let counter = 0;
/* GET home page. */
global.userData
router.get('/', sessionIdentifier, function(req, res, next) {
  // res.render('index', { title: 'Express' });
  axios.get(`http://localhost:3000/api/v1/user/limitedUser/5/${counter}`)
  .then(function(response){
    res.render('index', {
      title : 'CRUD Operation',
      users : response.data,
      counter:counter
  });
  // userData = response.data
  // console.log("data",response.data)
});
axios.get(`http://localhost:3000/api/v1/user/allUser`)
  .then(function(response){
  //   res.render('index', {
  //     title : 'CRUD Operation',
  //     users : response.data
  // });
  userData = response.data
  console.log("data",response.data)
});
});

router.get('/next', sessionIdentifier, function(req, res, next) {
  // res.render('index', { title: 'Express' });
  counter = counter + 1;
  console.log("length",userData.length)
  console.log("counter",counter)
  console.log("division",userData.length/5)
  let cLimit =Math.ceil(userData.length/5);
  console.log("floor",Math.ceil(userData.length/5))
  if(counter < cLimit){
  axios.get(`http://localhost:3000/api/v1/user/limitedUser/5/${counter}`)
  .then(function(response){
    res.render('index', {
      title : 'CRUD Operation',
      users : response.data,
      counter:counter
  });
  // userData = response.data
  // console.log("data",response.data)
    });
  } else{
    counter = cLimit-1;
    axios.get(`http://localhost:3000/api/v1/user/limitedUser/5/${cLimit-1}`)
  .then(function(response){
    res.render('index', {
      title : 'CRUD Operation',
      users : response.data,
      counter:counter
  });
});
  }
});


router.get('/previous', sessionIdentifier, function(req, res, next) {
  // res.render('index', { title: 'Express' });
  if(counter!==0){
  counter=counter-1;
  }

  axios.get(`http://localhost:3000/api/v1/user/limitedUser/5/${parseInt(counter)}`)
  .then(function(response){
    res.render('index', {
      title : 'CRUD Operation',
      users : response.data,
      counter:counter
  });
  // userData = response.data
  // console.log("data",response.data)
});
});

router.get('/welcome',sessionIdentifier ,function(req,res){
  res.render('welcome',{title :'Login'});
})

router.get('/download',(req, res) => {

  let new_list = userData.map(function(obj) {
    return {
      name: obj.name,
      email: obj.email,
      phone: obj.phone_no
    }
  });

  const json2csvParser =new Parser(); 
  const csv = json2csvParser.parse(new_list);

  fs.writeFile("Userlist.csv",csv,function(err){
      if(err){
          throw err;
      }
      console.log("File Saved");
  })

  // const file = `C:\new project`;
  // res.download(file); 

  // res.download(path.join(__dirname, 'Table.csv'), (err)=>{
  //     console.log(err);
  //   });
  //   console.log('Your file has been downloaded!')


  // for attachment we need to use send for prompt the download 
  res.attachment("Userlist.csv");
  res.status(200).send(csv);


  // var filePath = 'C:\Download\Table.csv';
  // fs.unlinkSync(filePath);
});


router.get('/edit/:userId', sessionIdentifier,(req, res) => {  
  const userId = req.params.userId;
  axios.get(`http://localhost:3000/api/v1/user/${userId}`).
  then(function(response){
    // if(err) throw err;
    res.render('user_edit', {
        title : 'CRUD Operation',
        user : response.data,
    });
  });
});


router.get('/delete/:userId',sessionIdentifier,(req, res) => {
  const userId = req.params.userId;
  // counter = 0;
  axios.delete(`http://localhost:3000/api/v1/user/${userId}`).
  then(function(response){
    // if(err) throw err;
    res.redirect('/dashboard');
  });
});

module.exports = router;
