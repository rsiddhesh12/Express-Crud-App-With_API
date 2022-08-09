var express = require('express');
var router = express.Router();
var connection = require('../config/dbConfig');
// var mysql = require('mysql2');
const axios =require('axios');
var session = require('express-session');


/* GET users listing. */
router.get('/',function(req, res, next) {
    console.log('session',req.session)
    res.render('login',{title :'Login'});
});


global.userData;
router.post('/authenticate',function(req,res,next){
    axios.get(`http://localhost:3000/api/v1/user/allUser`,).then(function(response){
        userData=response.data;
        console.log(req.body,"Data")
        for(var i=0 ; i<userData.length;i++){
                    if(userData[i].email === req.body.Email  && userData[i].Password === req.body.password){
                        req.session.loggedIn = true;
                        req.session.username = req.body.Email;
                        console.log(req.session);
                        res.render('welcome', {title : 'CRUD Operation',users : userData});
                        return
                    } 
                }
            res.render('login',{title :'Login', Error: 'Enter Valid Input'});
    });
});



router.get('/logout',function(req,res){
    console.log(req.session);
    req.session.destroy((err)=>{});
    console.log("Destroy",req.session);
    res.render('login',{title :'Login'});
})




module.exports = router;