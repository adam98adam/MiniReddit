var express = require('express');
var router = express.Router();
var passport = require("passport");

const Adam_USER = {
  id: 1,
  username: "Adam",
};

router.post(
    "/login",
    passport.authenticate("local"), (req, res) => {
      return res.send("ok");
    }
);

router.post("/logout", (req, res) => {
  console.log(`logout ${req.session.id}`);
  const socketId = req.session.socketId;
  console.log(socketId)
  if (socketId && io.of("/").sockets.get(socketId)) {
    console.log(`forcefully closing socket ${socketId}`);
    io.of("/").sockets.get(socketId).disconnect(true);
  }
  req.logout();
  res.cookie("connect.sid", "", { expires: new Date() });
  res.send("ok");
})

passport.serializeUser((user, cb) => {
  console.log(`serializeUser ${user.id}`);
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  console.log(`deserializeUser ${id}`);
  cb(null, Adam_USER);
});

module.exports = router;