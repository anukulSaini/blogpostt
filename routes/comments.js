 var express   = require("express"),
router         = express.Router({mergeParams:true}),
Comment        = require("../models/comment"),
Blog           = require("../models/campground")

Router.get("/blogs/:id/comments/new",isLoggedIn,function(req,res){
	Blog.findById(req.params.id,function(err,blog){
		if(err){
			console.log(err);
		}
		else{
			res.render("newCom",{blog:blog});
		}
	})
});
Router.post("/blogs/:id/comments",isLoggedIn,function(req,res){
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
Router.delete("/blogs/:id/comments/:comment_id",checkCommentOwnerShip,function(req,res){
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
module.exports = router;
