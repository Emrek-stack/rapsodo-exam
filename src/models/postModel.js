var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var postModel = new Schema({
  title: {
    type: String,
    default: "",
    trim: true,
    required: "Title cannot be blank"
  },
  content: { type: String, default: "", trim: true },
  status: {
    isPublished: { type: Boolean, required: true, default: false },
    isDeleted: { type: Boolean, required: true, default: false }
  },
  stats: {
    readCount: { type: Number, default: 0 }
  },
  properties: {
    isPrivate: { type: Boolean, required: true, default: false }
  },
  user: { type: Schema.ObjectId, ref: "user" },
  images: [
    {
      name: { type: String },
      width: { type: Number },
      height: { type: Number },
      displayOrder: { type: Number },
      isShowCase: { type: Boolean },
      isDeleted: { type: Boolean, default: false }
    }
  ],
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model("post", postModel);
