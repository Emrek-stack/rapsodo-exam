var PostModel = require("../models/postModel");
var mongoose = require("mongoose");

module.exports = {
  /* Post List routines */
  list: (req, res) => {
    const page = 1; //req.query.page || 1;
    const limit = 100; //req.query.limit || 10;

    PostModel.find()
      .limit(limit)
      .skip(limit * (page - 1))
      .populate("user")
      // .sort({ created: "desc" })
      .exec(function(err, posts) {
        return res.render("post/index", {
          title: "Article List",
          posts: posts
        });
      });
  },

  /* Post Create routines */
  createView: (req, res) => {
    res.render("post/create", { title: "Create a Post" });
  },
  create: (req, res) => {
    var body_temp = req.body;

    if (req.body.properties != null) {
      if (req.body.properties.isPrivate) {
        body_temp.properties.isPrivate = true;
      } else {
        body_temp.properties.isPrivate = false;
      }
    }
    if (req.body.status != null) {
      if (req.body.status.isPublished) {
        body_temp.status.isPublished = true;
      } else {
        body_temp.status.isPublished = false;
      }
    }

    var postModel = new PostModel(body_temp);
    postModel.user = mongoose.Types.ObjectId(req.session.user.id);

    postModel.save(function(err, post) {
      if (err) {
        return res.redirect("detail/" + post._id);
      }
    });

    res.render("post/create", { title: "Create a Post" });
  },
  /*Post Detail Rotines */
  detail: (req, res) => {
    res.render("home/index", { title: "Home" });
  }
};
