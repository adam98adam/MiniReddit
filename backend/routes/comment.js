var express = require('express');
var router = express.Router();
const client = require('../exports/postgres');

router.get('/', async (req, res) => {
    const comment = await client.query(
        "select * from comment;"
    );

    if(comment.rows)
        return res.send(comment.rows);

    return res.status(404).send("No comment found");
});

router.get('/:id', async (req, res) => {
    const comment = await client.query(
        "select * from comment where id = $1;",
        [req.params.id]
    );

    if(comment.rows)
        return res.send(comment.rows);

    return res.status(404).send("No comment found.");
});

router.post("/new", async (req, res) => {
    const commentId = await client.query(
        `insert into comment(content, parent_comment_id, user_id, post_id) values($1, $2, $3, $4) RETURNING ID;`,
        [req.body.Content, req.body.Parent_comment_id, req.body.User_id, req.body.Post_id]
    );

    const comment = await client.query(
        `select * from comment where id=${commentId.rows[0].id};`
    );

    return res.send(comment.rows[0]);
});

router.put("/:id", async (req, res) => {
    await client.query(
        "update comment set content=$2, parent_comment_id=$3, user_id=$4, post_id=$5 where id=$1;",
        [req.params.id, req.body.Content, req.body.Parent_comment_id, req.body.User_id, req.body.Post_id]
    );

    const getComment = await client.query(
        "select * from comment where id=$1;",
        [req.params.id]
    );

    return res.send(getComment.rows[0]);
});

router.delete("/:id", async (req, res) => {
    const comment = await client.query(
        "select * from comment where id = $1",
        [req.params.id]
    );

    if (!comment.rows[0])
        return res.status(404).send("No comment found.");

    await client.query(
        "delete from comment where id = $1",
        [req.params.id]
    );

    return res.status(200).send("Deleted.");
});

module.exports = router;