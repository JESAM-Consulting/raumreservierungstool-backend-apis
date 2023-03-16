const app = require("express")();

app.get("/", (req, res) => res.send("Welcome to FeScheduler APIs!"));

app.use("/meeting", require("./meeting.routes"));

module.exports = app;