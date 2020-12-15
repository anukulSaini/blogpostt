var express           = require("express"),
router                = express.Router(),
User                  = require("../models/user"),
passport              = require("passport"),
localStrategy         = require("passport-local"),
passportLocalMongoose = require("passport-local-mongoose")
	

app.get("/register",function(req,res){
	res.render();
});
app.post("/register",function(req,res){
	req.body.username
	req.body.password
	var newUser=new User({username:req.body.username})
	User.register(newUser, req.body.password,function(err,user){
		if (err){
			return res.render("/register");
		}
		{
			passport.authenticate("local")(req,res,function(){
				res.redirect();
			});
		}
	});
});
app.get("/login",function(req,res){
	res.render("login");
});
app.post("/login",passport.authenticate("local",{
	successRedirect:"/",
	failureRedirect:"/login"
}),function(req,res){
});
app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
});
