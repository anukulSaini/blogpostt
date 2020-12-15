var express    = require("express"),
mongoose       = require("mongoose"),
passport       = require("passport"),
localStrategy  = require("passport-local"),
passportLocalMongoose = require("passport-local-mongoose"),
Blog                  = require("./models/blogs"),
Comment               = require("./models/comments"),
User                  = require("./models/user"),
app                   = express();

mongoose.connect("mongodb://localhost:27017/restfullApp",{useNewUrlParser:true});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


 app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	next();
});

app.listen(3000,function(){
	console.log('SERVER LISTENING');
});