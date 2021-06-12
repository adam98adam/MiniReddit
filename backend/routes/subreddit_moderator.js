var express = require('express');
var router = express.Router();
const client = require('../exports/postgres');

router.get('/', async (req, res) => {
    const subredditModerator = await client.query(
        "select * from subreddit_moderator;"
    );

    if(subredditModerator.rows)
        return res.send(subredditModerator.rows);

    return res.status(404).send("No subreddit moderator found.");
});

router.get('/:id', async (req, res) => {
    const subredditModerator = await client.query(
        "select * from subreddit_moderator where id = $1;",
        [req.params.id]
    );

    if(subredditModerator.rows)
        return res.send(subredditModerator.rows);

    return res.status(404).send("No subreddit moderator found.");
});

router.post("/new", async (req, res) => {
    const newSubredditModeratorId = await client.query(
        `insert into subreddit_moderator(user_id, subreddit_id) values($1, $2) RETURNING ID;`,
        [req.body.User_id, req.body.Subreddit_id]
    );

    const newSubredditModerator = await client.query(
        `select * from subreddit_moderator where id=${newSubredditModeratorId.rows[0].id};`
    );

    return res.send(newSubredditModerator.rows[0]);
});

router.put("/:id", async (req, res) => {
    await client.query(
        "update subreddit_moderator set user_id=$2, subreddit_id=$3 where id=$1;",
        [req.params.id, req.body.User_id, req.body.Subreddit_id]
    );

    const getSubredditModerator = await client.query(
        "select * from subreddit_moderator where id=$1;",
        [req.params.id]
    );

    return res.send(getSubredditModerator.rows[0]);
});

router.delete("/:id", async (req, res) => {
    const subredditModerator = await client.query(
        "select * from subreddit_moderator where id = $1",
        [req.params.id]
    );

    if (!subredditModerator.rows[0])
        return res.status(404).send("No subreddit moderator found.");

    await client.query(
        "delete from subreddit_moderator where id = $1",
        [req.params.id]
    );

    return res.status(200).send("Deleted.");
});

module.exports = router;