var express = require('express');
var router = express.Router();
const client = require('../exports/postgres');

router.get('/', async (req, res) => {
    const post = await client.query(
        "select * from post;"
    );

    if(post.rows)
        return res.send(post.rows);

    return res.status(404).send("No post found");
});

router.get('/id=:id', async (req, res) => {
    const post = await client.query(
        "select * from post where id = $1;",
        [req.params.id]
    );

    if(post.rows)
        return res.send(post.rows);

    return res.status(404).send("No post found.");
});

router.get('/user_id=:user_id', async (req, res) => {
    const post = await client.query(
        "select * from post where user_id = $1;",
        [req.params.user_id]
    );

    if(post.rows)
        return res.send(post.rows);

    return res.status(404).send("No post found.");
});

router.get('/subreddit_id=:subreddit_id', async (req, res) => {
    const post = await client.query(
        "select * from post where subreddit_id = $1;",
        [req.params.subreddit_id]
    );

    if(post.rows)
        return res.send(post.rows);

    return res.status(404).send("No post found.");
});




//Do przejrzenia

router.post("/new", async (req, res) => {
    const postId = await client.query(
        `insert into post(title, content, image_path, video_url, creation_date, subreddit_id, user_id) values($1, $2, $3, $4, $5, $6, $7) RETURNING ID;`,
        [req.body.Title, req.body.Content, req.body.Image_path, req.body.Video_url, req.body.Creation_date, req.body.Subreddit_id, req.body.User_id]
    );

    const post = await client.query(
        `select * from post where id=${postId.rows[0].id};`
    );

    return res.send(post.rows[0]);
});

//Do przejrzenia

router.put("/id=:id", async (req, res) => {
    await client.query(
        "update post set title=$2, content=$3, image_path=$4, video_url=$5, creation_date=$6, subreddit_id=$7, user_id=$8 where id=$1;",
        [req.params.id, req.body.Title, req.body.Content, req.body.Image_path, req.body.Video_url, req.body.Creation_date, req.body.Subreddit_id, req.body.User_id]
    );

    const getPost = await client.query(
        "select * from post where id=$1;",
        [req.params.id]
    );

    return res.send(getPost.rows[0]);
});


//Klucz Obcy
router.delete("/id=:id", async (req, res) => {
    const post = await client.query(
        "select * from post where id = $1",
        [req.params.id]
    );

    if (!post.rows[0])
        return res.status(404).send("No post found.");

    await client.query(
        "delete from post where id = $1",
        [req.params.id]
    );

    return res.status(200).send("Deleted.");
});

module.exports = router;