const { hash } = require("bcryptjs");
const { Schema, model } = require("mongoose");
const message = require("../json/message.json");

const meetingSchema = new Schema(
  {
    name: { type: String, unique: true, },
    room_id: { type: Schema.Types.ObjectId, ref: "room", required: true, },
    startDate: { type: Date, required: true, },
    endDate: { type: Date, required: true, },
    startTime: { type: String },
    endTime: { type: String },
    length: { type: Number, default: 15 },
    description: { type: String },
  },
  { timestamps: true, versionKey: false, }
);

let meetingModel = model("meeting", meetingSchema, "meeting");
module.exports = meetingModel;
