var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var validateLocalStrategyEmail = function(email) {
  return (
    (this.provider !== "local" && !this.updated) ||
    validator.isEmail(email, { require_tld: false })
  );
};

var validateUsername = function(username) {
  var usernameRegex = /^(?=[\w.-]+$)(?!.*[._-]{2})(?!\.)(?!.*\.$).{3,34}$/;
  return (
    this.provider !== "local" ||
    (username &&
      usernameRegex.test(username) &&
      config.illegalUsernames.indexOf(username) < 0)
  );
};

var userModel = new Schema({
  username: {
    type: String,
    unique: "Username already exists",
    required: "Please fill in a username",
    validate: [
      validateUsername,
      'Please enter a valid username: 3+ characters long, non restricted word, characters "_-.", no consecutive dots, does not begin or end with dots, letters a-z and numbers 0-9.'
    ],
    lowercase: true,
    trim: true
  },
  password: { type: String, required: true },
  email: {
    type: String,
    index: {
      unique: true,
      sparse: true // For this to work on a previously indexed field, the index must be dropped & the application restarted.
    },
    lowercase: true,
    trim: true,
    default: "",
    validate: [validateLocalStrategyEmail, "Please fill a valid email address"]
  },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  follwers: [this],
  following: [this],
  picture: {
    large: { type: String, required: false },
    medium: { type: String, required: false },
    thumbnail: { type: String, required: false }
  }
});

module.exports = mongoose.model("user", userModel);
