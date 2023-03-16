const messages = require("../../json/message.json");
const apiResponse = require("../../utils/api.response");
const DB = require("../../models");
const { ROOM } = require("../../models");

module.exports = exports = {

  /*meeting crud*/
  createMeeting: async (req, res) => {
    req.body.startDate = new Date(req.body.startDate);
    req.body.endDate = new Date(req.body.endDate);
    let meeting = await DB.MEETING.create(req.body);
    if (meeting) {
      let room = await ROOM.findById(req.body.room_id);
      meeting.roomName = room.name;
    }
    return apiResponse.OK({ res, message: messages.MEETING_CREATED, meeting });

  },
  getMeeting: async (req, res) => {

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
    if (!meeting) return apiResponse.NOT_FOUND({ res, message: messages.NOT_FOUND });

    if (req.body.startDate) req.body.startDate = new Date(req.body.startDate);
    if (req.body.endDate) req.body.endDate = new Date(req.body.endDate);

    let data = await DB.MEETING.findByIdAndUpdate(req.params._id, req.body, { new: true });
    return apiResponse.OK({ res, message: messages.MEETING_UPDATED, data });
  },

  /*room crud*/
  getRoom: async (req, res) => {
    const data = await DB.ROOM.find()
    return apiResponse.OK({ res, message: messages.ROOM_FETCHED, count: await DB.ROOM.countDocuments(), data });
  },

  createRoom: async (req, res) => {
    const room = await DB.ROOM.create(req.body)
    return apiResponse.OK({ res, message: messages.ROOM_CREATED, room });
  },

  updateRoom: async (req, res) => {
    let room = await DB.ROOM.findById(req.params.room_id);
    if (!room) return apiResponse.NOT_FOUND({ res, message: messages.NOT_FOUND });

    let data = await DB.ROOM.findByIdAndUpdate(req.params.room_id, req.body, { new: true });
    return apiResponse.OK({ res, message: messages.ROOM_UPDATED, data });
  },

  deleteRoom: async (req, res) => {
    let { room_id } = req.query
    if (!await ROOM.findOne({ _id: room_id })) return apiResponse.NOT_FOUND({ res, message: "room not found" });
    await ROOM.findOneAndDelete({ _id: room_id })
    return apiResponse.OK({ res, message: "room deleted successfully" });
  },

};
