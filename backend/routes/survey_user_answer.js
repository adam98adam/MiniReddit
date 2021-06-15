var express = require('express');
var router = express.Router();
const client = require('../exports/postgres');

router.get('/', async (req, res) => {
    const surveyUserAnswer = await client.query(
        "select * from survey_user_answer;"
    );

    if(surveyUserAnswer.rows)
        return res.send(surveyUserAnswer.rows);

    return res.status(404).send("No survey user answer found");
});

router.get('/id=:id', async (req, res) => {
    const surveyUserAnswer = await client.query(
        "select * from survey_user_answer where id = $1;",
        [req.params.id]
    );

    if(surveyUserAnswer.rows)
        return res.send(surveyUserAnswer.rows);

    return res.status(404).send("No survey user answer found.");
});

router.get('/answer_id=:answer_id', async (req, res) => {
    const surveyUserAnswer = await client.query(
        "select * from survey_user_answer where answer_id = $1;",
        [req.params.answer_id]
    );

    if(surveyUserAnswer.rows)
        return res.send(surveyUserAnswer.rows);

    return res.status(404).send("No survey user answer found.");
});

router.get('/user_id=:user_id', async (req, res) => {
    const surveyUserAnswer = await client.query(
        "select * from survey_user_answer where user_id = $1;",
        [req.params.user_id]
    );

    if(surveyUserAnswer.rows)
        return res.send(surveyUserAnswer.rows);

    return res.status(404).send("No survey user answer found.");
});

router.post("/new", async (req, res) => {
    const surveyUserAnswerId = await client.query(
        `insert into survey_user_answer(answer_id, user_id) values($1, $2) RETURNING ID;`,
        [req.body.Answer_id, req.body.User_id]
    );

    const surveyUserAnswer = await client.query(
        `select * from survey_user_answer where id=${surveyUserAnswerId.rows[0].id};`
    );

    return res.send(surveyUserAnswer.rows[0]);
});

router.put("/id=:id", async (req, res) => {
    await client.query(
        "update survey_user_answer set answer_id=$2, user_id=$3 where id=$1;",
        [req.params.id, req.body.Answer_id, req.body.User_id]
    );

    const getSurvey = await client.query(
        "select * from survey_user_answer where id=$1;",
        [req.params.id]
    );

    return res.send(getSurvey.rows[0]);
});

router.delete("/id=:id", async (req, res) => {
    const surveyUserAnswer = await client.query(
        "select * from survey_user_answer where id = $1",
        [req.params.id]
    );

    if (!surveyUserAnswer.rows[0])
        return res.status(404).send("No survey user answer found.");

    await client.query(
        "delete from survey_user_answer where id = $1",
        [req.params.id]
    );

    return res.status(200).send("Deleted.");
});

module.exports = router;