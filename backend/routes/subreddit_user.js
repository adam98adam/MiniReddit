var express = require('express');
var router = express.Router();
const client = require('../exports/postgres');

router.get('/', async (req, res) => {
    const subredditUser = await client.query(
        "select * from subreddit_user;"
    );

    if(subredditUser.rows)
        return res.send(subredditUser.rows);

    return res.status(404).send("No subreddit user found");
});

router.get('/:id', async (req, res) => {
    const subredditUser = await client.query(
        "select * from subreddit_user where id = $1;",
        [req.params.id]
    );

    if(subredditUser.rows)
        return res.send(subredditUser.rows);

    return res.status(404).send("No subreddit user found.");
});

router.post("/new", async (req, res) => {
    const newSubredditUserId = await client.query(
        `insert into subreddit_user(user_id, subreddit_id) values($1, $2) RETURNING ID;`,
        [req.body.User_id, req.body.Subreddit_id]
    );

    const newSubredditUser = await client.query(
        `select * from subreddit_user where id=${newSubredditUserId.rows[0].id};`
    );

    return res.send(newSubredditUser.rows[0]);
});

router.put("/:id", async (req, res) => {
    await client.query(
        "update subreddit_user set user_id=$2, subreddit_id=$3 where id=$1;",
        [req.params.id, req.body.User_id, req.body.Subreddit_id]
    );

    const getSubredditUser = await client.query(
        "select * from subreddit_user where id=$1;",
        [req.params.id]
    );

    return res.send(getSubredditUser.rows[0]);
});

router.delete("/:id", async (req, res) => {
    const subredditUser = await client.query(
        "select * from subreddit_user where id = $1",
        [req.params.id]
    );

    if (!subredditUser.rows[0])
        return res.status(404).send("No subreddit user found.");

    await client.query(
        "delete from subreddit_user where id = $1",
        [req.params.id]
    );

    return res.status(200).send("Deleted.");
});

module.exports = router;