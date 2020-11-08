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
app.set("view engine","ejs");


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


 app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	next();
});
app.get("/",function(req,res){
	res.redirect("/blogs");
});
app.get('/blogs',function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log(err);
		}
		else{
			res.render("index",{blogs:blogs});
		}
	});
});
app.get('/blogs/new',isLoggedIn, function(req,res){
	res.render("new");
});
app.post("/blogs",isLoggedIn,function(req,res){
	req.body.blog.author = {
	id: req.user._id,
	username: req.user.username
	}
	Blog.create(req.body.blog,function(err,newblog){
		if (err){
			console.log(err)
		}
		else{
			res.redirect("/blogs");
		}
	});
});
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id).populate("comments").exec(function(err,findBlog){
		if(err){
			console.log(err);
		}
		else{
			res.render("show",{blog:findBlog});
		}
	});
});
app.get("/blogs/:id/edit",checkOwnerShip,function(req,res){
	Blog.findById(req.params.id,function(err,findBlog){
			res.render("edit",{blog:findBlog});
	});
});
app.put("/blogs/:id",checkOwnerShip,function(req,res){
	Blog.findByIdAndUpdate(req.params.id,req.body,function(err,update){
		if(err){
		res.redirect("/blogs/" + req.params.id);
		}
		else{
			res.redirect("/blogs/" + req.params.id);
		}
	});
});
app.delete("/blogs/:id",checkOwnerShip,function(req,res){
		Blog.findByIdAndRemove(req.params.id,function(err){
			if(err){
				res.redirect("/blogs");
			}else{
				res.redirect("/blogs");
			}
	});

	});



//authentication


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


//comments


app.get("/blogs/:id/comments/new",isLoggedIn,function(req,res){
	Blog.findById(req.params.id,function(err,blog){
		if(err){
			console.log(err);
		}
		else{
			res.render("newCom",{blog:blog});
		}
	})
});
app.post("/blogs/:id/comments",isLoggedIn,function(req,res){
	Blog.findById(req.params.id,function(err,blog){
			if(err){
				res.redirect("/blogs")
			}
			else{
			Comment.create(req.body.comment,function(err,comment){
					if(err){
						console.log(err)
					}
					else{
						
						comment.author.id=req.user._id;
						comment.author.username= req.user.username;
						
					
						
						comment.save();
						
						blog.comments.push(comment);
						
				        blog.save();
						
						
				        res.redirect('/blogs/' + blog._id);
						
					}
			});
			}
			
		 })
});
app.delete("/blogs/:id/comments/:comment_id",checkCommentOwnerShip,function(req,res){
		Comment.findByIdAndRemove(req.params.comment_id,function(err){
			if(err){
				res.redirect("back");
				
			}else{
				res.redirect("/blogs/" + req.params.id);
			}
	});
	});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}
function checkOwnerShip(req,res,next){
	if(req.isAuthenticated()){
				 Blog.findById(req.params.id,function(err,foundblog){
					if(err){
						// req.flash("error","blog not found");
					   res.redirect("/blogs");
						  }
					 else{
					   //does user own blog
							  if(foundblog.author.id.equals(req.user._id)){
							   next();
								  }
							 else{
								 // req.flash("error","You do not have permission to do that");
								  res.redirect("/blogs");
								  }
						  }	
				 });
			 }
			else{
				// req.flash("error","You need to be loged in to do that");
				res.redirect("back");
				}
}

app.listen(3000,function(){
	console.log('SERVER LISTENING');
});