const messages = require("../../json/message.json");
const apiResponse = require("../../utils/api.response");
const DB = require("../../models");
const { ROOM } = require("../../models");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = exports = {

  /*meeting crud*/
  createMeeting: async (req, res) => {
    // joi validator error handling
    if (req.error) return apiResponse.BAD_REQUEST({ res, message: req.error.details[0].payload["context"] });
    // if (new Date(req.body.startTime) < new Date() || new Date(req.body.endTime) < new Date() || new Date(req.body.endTime) < new Date(req.body.startTime)) {
    //   return apiResponse.BAD_REQUEST({ res, message: "meeting start time or end time greter than current time or mettin endtime before start time" })
    // }

    let meetingAvailable = await DB.MEETING.find({
      room_id: req.body.room_id, $or: [
        { startTime: { $gte: new Date(req.body.startTime), $lte: new Date(req.body.endTime) } },
        { endTime: { $gte: new Date(req.body.startTime), $lte: new Date(req.body.endTime) } },
        { $and: [{ startTime: { $lt: new Date(req.body.startTime) } }, { endTime: { $gt: new Date(req.body.endTime) } }] }
      ]
    });
    if (meetingAvailable.length) return apiResponse.BAD_REQUEST({ res, message: messages.MEETING_ALREADY_EXISTS });

    // let meeting
    let meeting = await DB.MEETING.create(req.body);
    if (meeting) {
      let room = await ROOM.findById(req.body.room_id);
      meeting.roomName = room.name;
    }
    return apiResponse.OK({ res, message: messages.MEETING_CREATED, meeting });

  },
  getMeeting: async (req, res) => {
    if (req.error) return apiResponse.BAD_REQUEST({ res, message: req.error.details[0].payload["context"] });

    let { page, limit, sortBy, sortOrder, search, ...query } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    sortBy = sortBy || "createdAt";
    sortOrder = sortOrder || -1;

    search ? query = {
      $or: [{ name: { $regex: search, $options: "i" } }]
    } : "";

    const data = await DB.MEETING.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .populate("room_id", "name")
      .lean();

    return apiResponse.OK({ res, message: messages.MEETTING_FETCHED, data: { count: await DB.MEETING.count(), data } });
  },

  updateMeeting: async (req, res) => {
    const meeting = await DB.MEETING.findById(req.params._id);
    if (req.error) return apiResponse.BAD_REQUEST({ res, message: req.error.details[0].payload["context"] });

    if (!meeting) return apiResponse.NOT_FOUND({ res, message: messages.NOT_FOUND });

    let meetingAvailable = await DB.MEETING.find({
      _id: { $ne: req.params._id },
      room_id: req.body.room_id, $or: [
        { startTime: { $gte: new Date(req.body.startTime), $lte: new Date(req.body.endTime) } },
        { endTime: { $gte: new Date(req.body.startTime), $lte: new Date(req.body.endTime) } },
        { $and: [{ startTime: { $lt: new Date(req.body.startTime) } }, { endTime: { $gt: new Date(req.body.endTime) } }] }
      ]
    });

    if (meetingAvailable.length) return apiResponse.BAD_REQUEST({ res, message: messages.MEETING_ALREADY_EXISTS });

    if (req.body.startDate) req.body.startDate = new Date(req.body.startDate);
    if (req.body.endDate) req.body.endDate = new Date(req.body.endDate);

    let data = await DB.MEETING.findByIdAndUpdate(req.params._id, req.body, { new: true });
    return apiResponse.OK({ res, message: messages.MEETING_UPDATED, data });
  },
  deleteMeeting: async (req, res) => {
    const meeting = await DB.MEETING.findOne({ _id: req.params._id });
    if (!meeting) return apiResponse.NOT_FOUND({ res, message: messages.NOT_FOUND });

    let data = await DB.MEETING.findOneAndDelete({ _id: req.params._id });
    return apiResponse.OK({ res, message: messages.MEETING_DELETED });
  },

  /*room crud*/
  getRoom: async (req, res) => {
    if (req.error) return apiResponse.BAD_REQUEST({ res, message: req.error.details[0].payload["context"] });
    const data = await DB.ROOM.find()
    return apiResponse.OK({ res, message: messages.ROOM_FETCHED, count: await DB.ROOM.countDocuments(), data });
  },

  createRoom: async (req, res) => {
    if (req.error) return apiResponse.BAD_REQUEST({ res, message: req.error.details[0].payload["context"] });
    const room = await DB.ROOM.create(req.body)
    return apiResponse.OK({ res, message: messages.ROOM_CREATED, room });
  },

  updateRoom: async (req, res) => {
    if (req.error) return apiResponse.BAD_REQUEST({ res, message: req.error.details[0].payload["context"] });
    let room = await DB.ROOM.findById(req.params.room_id);
    if (!room) return apiResponse.NOT_FOUND({ res, message: messages.NOT_FOUND });

    let data = await DB.ROOM.findByIdAndUpdate(req.params.room_id, req.body, { new: true });
    return apiResponse.OK({ res, message: messages.ROOM_UPDATED, data });
  },

  deleteRoom: async (req, res) => {
    if (req.error) return apiResponse.BAD_REQUEST({ res, message: req.error.details[0].payload["context"] });
    let { room_id } = req.query
    if (!await ROOM.findOne({ _id: room_id })) return apiResponse.NOT_FOUND({ res, message: "room not found" });
    await ROOM.findOneAndDelete({ _id: room_id })
    return apiResponse.OK({ res, message: "room deleted successfully" });
  },

};
