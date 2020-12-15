 var express          = require("express"),
router                = express.Router({mergeParams:true}),
Blog                  = require("./models/blogs"),
Comment               = require("./models/comments")

Router.get("/",function(req,res){
	res.redirect("/blogs");
});
Router.get('/blogs',function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log(err);
		}
		else{
			res.render("index",{blogs:blogs});
		}
	});
});
Router.get('/blogs/new',isLoggedIn, function(req,res){
	res.render("new");
});
Router.post("/blogs",isLoggedIn,function(req,res){
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
Router.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id).populate("comments").exec(function(err,findBlog){
		if(err){
			console.log(err);
		}
		else{
			res.render("show",{blog:findBlog});
		}
	});
});
Router.get("/blogs/:id/edit",checkOwnerShip,function(req,res){
	Blog.findById(req.params.id,function(err,findBlog){
			res.render("edit",{blog:findBlog});
	});
});
Router.put("/blogs/:id",checkOwnerShip,function(req,res){
	Blog.findByIdAndUpdate(req.params.id,req.body,function(err,update){
		if(err){
		res.redirect("/blogs/" + req.params.id);
		}
		else{
			res.redirect("/blogs/" + req.params.id);
		}
	});
});
Router.delete("/blogs/:id",checkOwnerShip,function(req,res){
		Blog.findByIdAndRemove(req.params.id,function(err){
			if(err){
				res.redirect("/blogs");
			}else{
				res.redirect("/blogs");
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
					   res.redirect("back");
						  }
					 else{
					   //does user own blog
						 if(foundblog.author.id.equals(req.user._id)){
							   next();
								  }
							 else{
								  res.redirect("back");
								  }
						  }	
				 });
			 }
			else{
				res.redirect("back");
				}
}
