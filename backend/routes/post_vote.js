var express = require('express');
var router = express.Router();
const client = require('../exports/postgres');

router.get('/', async (req, res) => {
    const postVote = await client.query(
        "select * from post_vote;"
    );

    if(postVote.rows)
        return res.send(postVote.rows);

    return res.status(404).send("No post vote found");
});

router.get('/:id', async (req, res) => {
    const postVote = await client.query(
        "select * from post_vote where id = $1;",
        [req.params.id]
    );

    if(postVote.rows)
        return res.send(postVote.rows);

    return res.status(404).send("No post vote found.");
});

router.post("/new", async (req, res) => {
    const postVoteId = await client.query(
        `insert into post_vote(vote, user_id, post_id) values($1, $2, $3) RETURNING ID;`,
        [req.body.Vote, req.body.User_id, req.body.Post_id]
    );

    const postVote = await client.query(
        `select * from post_vote where id=${postVoteId.rows[0].id};`
    );

    return res.send(postVote.rows[0]);
});

router.put("/:id", async (req, res) => {
    await client.query(
        "update post_vote set vote=$2, user_id=$3, post_id=$4 where id=$1;",
        [req.params.id, req.body.Vote, req.body.User_id, req.body.Post_id]
    );

    const getPostVote = await client.query(
        "select * from post_vote where id=$1;",
        [req.params.id]
    );

    return res.send(getPostVote.rows[0]);
});

router.delete("/:id", async (req, res) => {
    const postVote = await client.query(
        "select * from post_vote where id = $1",
        [req.params.id]
    );

    if (!postVote.rows[0])
        return res.status(404).send("No post vote found.");

    await client.query(
        "delete from post_vote where id = $1",
        [req.params.id]
    );

    return res.status(200).send("Deleted.");
});

module.exports = router;