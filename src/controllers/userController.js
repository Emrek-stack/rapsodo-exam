var UserModel = require("../models/userModel");
var axios = require("axios");
var mongoose = require("mongoose");

module.exports = {
  /**Register routines */
  registerView: (req, res) => {
    res.render("user/register", { title: "Home" });
  },
  register: (req, res) => {
    console.log(req.body);
    var userModel = new UserModel(req.body);

    userModel.save(function(err, user) {
      if (err) {
        return res.status(500).json({
          message: "Error when creating user",
          error: err
        });
      }
      return res.redirect("detail/" + user._id);
    });
  },
  /* Login Routines */
  loginView: (req, res) => {
    res.render("user/login", { title: "Home" });
  },
  login: (req, res) => {
    UserModel.findOne(
      { username: req.body.username, password: req.body.password },
      (err, user) => {
        if (!err) {
          req.session.user = { username: user.username, id: user._id };
          req.session.islogged = true;
          res.render("user/login", { title: "Home" });
        }
        else {
          console.log(err);
        }
      }
    );
  },
  /*Profile Detail Routines */
  profile: (req, res) => {
    UserModel.findOne({ _id: req.params.id })
      .populate("follwers")
      .populate("following")
      .exec((err, user) => {
        return res.render("user/profile", {
          title: "Article List",
          user: user
        });
      });
  },
  followUser: (req, res) => {
    var id = req.params.id;
    console.log(mongoose.Types.ObjectId(req.session.user.id));

    UserModel.findOne({ _id: req.session.user.id }, (err, me) => {
      me.following.push(mongoose.Types.ObjectId(id));
      me.save((err, medoc) => {
        if (err) {
          console.log(err);
        }
        UserModel.findOne({ _id: id }, (err, user) => {
          if (!err) {
            user.follwers.push(mongoose.Types.ObjectId(req.session.user.id));
            user.save((err, doc) => {
              if (!err) {
                return res.json(doc);
              }
            });
          }
        });
      });
    });
  }
  // collectSamples: (req, res) => {
  //   axios
  //     .get("https://randomuser.me/api/?results=500&nat=tr&noinfo")
  //     .then(resp => {
  //       //console.log(resp.data.results);
  //       resp.data.results.map((value, index, arr) => {
  //         //console.log(value);
  //         console.log(index);
  //         //console.log(arr);
  //         var userModel = new UserModel();
  //         userModel.firstName = value.name.first;
  //         userModel.lastName = value.name.last;
  //         userModel.email = value.email;
  //         userModel.username = value.login.username;
  //         userModel.password = value.login.password;
  //         userModel.picture.large = value.picture.large;
  //         userModel.picture.medium = value.picture.medium;
  //         userModel.picture.thumbnail = value.picture.thumbnail;
  //         console.log(userModel);

  //         userModel.save((err, doc) => {
  //           if (err) {
  //             console.log(err);
  //           }
  //         });
  //       });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // }
};
