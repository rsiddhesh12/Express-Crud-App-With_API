var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const session = require('express-session');
var bodyParser = require("body-parser");

var app = express();

const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

app.use(cors(corsOptions));
app.use(
  session({
    secret:'Keep it secret',
    name:'uniqueSessionID',
    resave: false,
    saveUninitialized:false
  })
);

const UserRoutes = require('./routes/database.routes.js');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var productRouter = require('./routes/product');
var logFileRouter = require('./routes/logfile');





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/v1/user', UserRoutes);
app.use('/', loginRouter);
app.use('/dashboard', indexRouter);
app.use('/users', usersRouter);
app.use('/product',productRouter);
app.use('/logfile',logFileRouter);

// app.use(sessionIdentifier)

// connection.connect(function(error){
//   if(!!error) console.log(error);
//   else console.log('Database Connected!');
// }); 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// Require employee routes
// const employeeRoutes = require('./routes/database.routes');
// const { response } = require('express');
// // using as middleware
const port = process.env.PORT || 3000
// listen for requests
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})

// module.exports = app;
