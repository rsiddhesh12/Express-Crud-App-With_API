var express = require('express');
var router = express.Router();
var connection = require('../config/dbConfig');
const axios =require('axios');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/add',(req, res) => {
  res.render('user_add', {
      title : 'Add User'
  });
});

router.post('/save',(req, res) => { 
  let data = {name: req.body.name, email: req.body.email, phone_no: req.body.phone_no,Password:req.body.password};
  // let sql = "INSERT INTO users SET ?";
  // let query = connection.query(sql, data,(err, results) => {
  //   if(err) throw err;
  //   res.redirect('/dashboard');
  // });

  // let data = {pname: req.body.pname, price: req.body.price, description: req.body.description};
    axios.post('http://localhost:3000/api/v1/user/addUser',data).
    then(function(response){
        res.redirect('/dashboard');
    });
});


router.post('/update',(req, res) => {
  const userId = req.body.id;

  let data ={
    name: req.body.name,
    email : req.body.email,
    phone_no: req.body.phone_no, 
    Password: req.body.Password};
  console.log(req.body,"Body")
  // let sql = "update users SET name='"+req.body.name+"',  email='"+req.body.email+"',  phone_no='"+req.body.phone_no+"', Password='"+req.body.Password+"' where id ="+userId;
  // let query = connection.query(sql,(err, results) => {
  //   if(err) throw err;
  //   res.redirect('/dashboard');
  // });

  axios.post(`http://localhost:3000/api/v1/user/${userId}`,data).
    then(function(response){
        res.redirect('/dashboard');
    });
});


module.exports = router;
