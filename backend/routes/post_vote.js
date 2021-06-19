var express = require('express');
var router = express.Router();
const isAuthenticated = require("../middlewares/auth");
const client = require('../exports/postgres');

router.get('/', async (req, res) => {
    const postVote = await client.query(
        "select * from post_vote;"
    );

    if(postVote.rows)
        return res.send(postVote.rows);

    return res.status(404).send("No post vote found");
});

router.get('/id=:id', async (req, res) => {
    const postVote = await client.query(
        "select * from post_vote where id = $1;",
        [req.params.id]
    );

    if(postVote.rows)
        return res.send(postVote.rows);

    return res.status(404).send("No post vote found.");
});



router.get('/user_id=:user_id', async (req, res) => {
    const postVote = await client.query(
        "select * from post_vote where user_id = $1;",
        [req.params.user_id]
    );

    if(postVote.rows)
        return res.send(postVote.rows);

    return res.status(404).send("No post vote found.");
});

router.get('/post_id=:post_id/vote=:vote',isAuthenticated, async (req, res) => {
    console.log(req.user.id);
    const postVote = await client.query(
        "select * from post_vote where post_id = $1 and user_id = $2;",
        [req.params.post_id,req.user.id]
    );
    console.log('hello')
    if(postVote.rows[0]){
        if(postVote.rows[0].vote === parseInt(req.params.vote,10)) {
            const post = await client.query(
                "delete from post_vote where post_id = $1 and user_id = $2",
                [req.params.post_id,req.user.id]
            );
            return res.send("Deleted.");
        } else {
            await client.query(
                "update post_vote set vote = $1 where post_id = $2 and user_id = $3;",
                [req.params.vote, req.params.post_id,req.user.id]
            );
        
            const getPostVote = await client.query(
                "select * from post_vote where post_id = $1 and user_id = $2;",
                [req.params.post_id,req.user.id]
            );
        
            return res.send(getPostVote.rows[0]);
        }
    } else {
        const postVoteId = await client.query(
            `insert into post_vote(vote, user_id, post_id) values($1, $2, $3) RETURNING ID;`,
            [req.params.vote, req.user.id, req.params.post_id])

            const postVote = await client.query(
                `select * from post_vote where id=${postVoteId.rows[0].id};`
            );
        
            return res.send(postVote.rows[0]);
    }
});

router.get('/counter/post_id=:post_id',async (req,res) => {
    const count = await client.query(
    "select count(*) from post_vote where vote = 1 and post_id = $1;",
    [req.params.post_id])


    return res.send(count.rows[0])
})





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

router.put("/id=:id", async (req, res) => {
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

router.delete("/id=:id", async (req, res) => {
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