var express           = require("express"),
router                = express.Router(),
User                  = require("../models/user"),
passport              = require("passport"),
localStrategy         = require("passport-local"),
passportLocalMongoose = require("passport-local-mongoose")
	

Router.get("/register",function(req,res){
	res.render();
});
Router.post("/register",function(req,res){
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
Router.get("/login",function(req,res){
	res.render("login");
});
Router.post("/login",passport.authenticate("local",{
	successRedirect:"/",
	failureRedirect:"/login"
}),function(req,res){
});
Router.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
});

module.exports = router;
