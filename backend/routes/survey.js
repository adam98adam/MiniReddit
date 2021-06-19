var express = require('express');
var router = express.Router();
const client = require('../exports/postgres');

router.get('/', async (req, res) => {
    const survey = await client.query(
        "select * from survey;"
    );

    if(survey.rows)
        return res.send(survey.rows);

    return res.status(404).send("No survey found");
});

router.get('/id=:id', async (req, res) => {
    const survey = await client.query(
        "select * from survey where id = $1;",
        [req.params.id]
    );

    if(survey.rows)
        return res.send(survey.rows);

    return res.status(404).send("No survey found.");
});

router.get('/post_id=:post_id', async (req, res) => {
    const survey = await client.query(
        "select * from survey where post_id = $1;",
        [req.params.post_id]
    );

    if(survey.rows)
        return res.send(survey.rows);

    return res.status(404).send("No survey found.");
});

router.post("/new", async (req, res) => {
    const surveyId = await client.query(
        `insert into survey(question, post_id) values($1, $2) RETURNING ID;`,
        [req.body.Question, req.body.Post_id]
    );

    const survey = await client.query(
        `select * from survey where id=${surveyId.rows[0].id};`
    );

    return res.send(survey.rows[0]);
});

router.put("/id=:id", async (req, res) => {
    await client.query(
        "update survey set question=$2, post_id=$3 where id=$1;",
        [req.params.id, req.body.Question, req.body.Post_id]
    );

    const getSurvey = await client.query(
        "select * from survey where id=$1;",
        [req.params.id]
    );

    return res.send(getSurvey.rows[0]);
});


//Klucz Obcy
router.delete("/id=:id", async (req, res) => {
    const survey = await client.query(
        "select * from survey where id = $1",
        [req.params.id]
    );

    if (!survey.rows[0])
        return res.status(404).send("No survey found.");

    await client.query(
        "delete from survey where id = $1",
        [req.params.id]
    );

    return res.status(200).send("Deleted.");
});

module.exports = router;
