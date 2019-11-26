var userModel = require("../models/userModel");

module.exports = {
  home: (req, res) => {
    userModel.count().exec((err, count) => {
      var random = Math.floor(Math.random() * count);

      userModel.find()
        .skip(random)
        .exec((err, result) => {
          res.render("home/index", { title: "Home", users: result });
        });
    });
  }
};
