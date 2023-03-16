const { Schema, model } = require("mongoose");

let roomSchema = new Schema(
  { name: { type: String, }, },
  { timestamps: true, versionKey: false, }
);

let roomModel = model("room", roomSchema, "room");

module.exports = roomModel;
