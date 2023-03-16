const express = require("express");
const router = express.Router();

// const { auth } = require("../middleware/auth");

const {
  MEETING: { VALIDATOR, APIS },
} = require("../controllers");

router.get("/", VALIDATOR.fetch, APIS.getMeeting);
router.get("/room", VALIDATOR.fetchRoom, APIS.getRoom);

router.post("/", VALIDATOR.create, APIS.createMeeting);
router.post("/room", VALIDATOR.createRoom, APIS.createRoom);

router.put("/room/:room_id", VALIDATOR.updateRoom, APIS.updateRoom);
router.put("/:_id", VALIDATOR.update, APIS.updateMeeting);
module.exports = router;
