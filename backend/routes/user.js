var express = require('express');
var router = express.Router();
//var passport = require("passport");
const client = require('../exports/postgres');
const isAuthenticated = require("../middlewares/auth");


router.get('/', async (req, res) => {
    const reddit_users = await client.query("select * from reddit_user");
    console.log("user")
    console.log(req.user)
    return res.send(reddit_users.rows)
})


router.get('/:id',async (req, res) => {
    const reddit_user = await client.query("select * from reddit_user where id = $1", [
        req.params.id,
    ])

    if(reddit_user.rows[0])
        return res.send(reddit_user.rows[0])

    return res.status(404).send("User not found")
})


router.get("/:nickname",async (req, res) => {
    const reddit_user = await client.query("select * from reddit_user where nickname = $1", [
        req.params.nickname,
    ])

    if(reddit_user.rows[0])
        return res.send(reddit_user.rows[0])

    return res.status(404).send("User not found")
})


router.put('/:id',isAuthenticated, async (req, res) => {
         await client.query(
        "update reddit_user set nickname = $1, password = $2, email = $3 where id = $4",
        [req.body.Nickname, req.body.Password, req.body.Email, req.params.id]
      );
      const reddit_user = await client.query("select * from reddit_user where id = $1", [
        req.params.id,
      ]);
      return res.send(reddit_user.rows[0]);
});



router.post('/', async (req,res) => {
    const id = await client.query("insert into reddit_user(nickname, activation_guid, activation_expire_date, password, email) values ($1, NULL, NULL, $2, $3) RETURNING ID;",
    [req.body.Nickname,req.body.Password,req.body.Email])

    const user = await client.query("select * from reddit_user where id = $1",[id.rows[0].id])
    return res.send(user.rows[0])
})



module.exports = router;

