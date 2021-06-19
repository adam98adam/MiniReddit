var express = require('express');
var router = express.Router();
var passport = require("passport");
// const client = require('../exports/postgres');

/*
const REDDIT_USER = {
    id: 0,
    nickname: "",
}
*/

router.post(
    "/login",
    passport.authenticate("local"), (req, res) => {
        return res.send("ok");
    }
);

router.post("/logout", (req, res) => {
    //console.log(req)
    //console.log(req.session)
    console.log(`logout ${req.session.id}`);
    const socketId = req.session.socketId;
    //console.log(socketId)
    if (socketId && io.of("/").sockets.get(socketId)) {
        console.log(`forcefully closing socket ${socketId}`);
        io.of("/").sockets.get(socketId).disconnect(true);
    }
    req.logout();
    res.cookie("connect.sid", "", { expires: new Date() });
    res.send("ok");
});

/*
passport.serializeUser((user, cb) => {
    console.log(`serializeUser ${user.id}`);
    cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
    console.log(`deserializeUser ${id}`);
    const reddit_user = await client.query(`select * from reddit_user where id = ${id}`)
    if(reddit_user.rows[0])
        REDDIT_USER.id = id
        REDDIT_USER.nickname = reddit_user.rows[0].nickname
    cb(null, REDDIT_USER);
});
*/

module.exports = router;
