var express = require('express');
var router = express.Router();
const client = require('../exports/postgres');

router.get('/', async (req, res) => {
    const subreddit = await client.query(
        "select * from subreddit;"
    );

    if(subreddit.rows)
        return res.send(subreddit.rows);

    return res.status(404).send("No subreddit found.");
});

router.get('/id=:id', async (req, res) => {
    const subreddit = await client.query(
        "select * from subreddit where id = $1;",
        [req.params.id]
    );

    if(subreddit.rows)
        return res.send(subreddit.rows);

    return res.status(404).send("No subreddit found.");
});

router.post("/new", async (req, res) => {
    const newSubredditId = await client.query(
        `insert into subreddit(name, description) values($1, $2) RETURNING ID;`,
        [req.body.Name, req.body.Description]
    );

    const newSubreddit = await client.query(
        `select * from subreddit where id=${newSubredditId.rows[0].id};`
    );

    return res.send(newSubreddit.rows[0]);
});

router.put("/id=:id", async (req, res) => {
    await client.query(
        "update subreddit set name=$2, description=$3 where id=$1;",
        [req.params.id, req.body.Name, req.body.Description]
    );

    const getSubreddit = await client.query(
        "select * from subreddit where id=$1;",
        [req.params.id]
    );

    return res.send(getSubreddit.rows[0]);
});


//Klucz obcy
router.delete("/id=:id", async (req, res) => {
    const subreddit = await client.query(
        "select * from subreddit where id = $1",
        [req.params.id]
    );

    if (!subreddit.rows[0])
        return res.status(404).send("No subreddit found.");

    await client.query(
        "delete from subreddit where id = $1",
        [req.params.id]
    );

    return res.status(200).send("Deleted.");
});

module.exports = router;