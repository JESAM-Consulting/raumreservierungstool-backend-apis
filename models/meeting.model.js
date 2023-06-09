const { hash } = require("bcryptjs");
const { Schema, model } = require("mongoose");
const message = require("../json/message.json");

const meetingSchema = new Schema(
  {
    name: { type: String },
    room_id: { type: Schema.Types.ObjectId, ref: "room", required: true, },
    startDate: { type: Date, },
    endDate: { type: Date, },
    startTime: { type: Date },
    endTime: { type: Date },
    length: { type: Number, default: 15 },
    description: { type: String },
    repeat: { type: String, },
    interval: { type: Number },
    freq: { type: String }
  },
  { timestamps: true, versionKey: false, }
);

let meetingModel = model("meeting", meetingSchema, "meeting");
module.exports = meetingModel;
