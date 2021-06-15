var express = require('express');
var router = express.Router();
const client = require('../exports/postgres');

router.get('/', async (req, res) => {
    const surveyAnswer = await client.query(
        "select * from survey_answer;"
    );

    if(surveyAnswer.rows)
        return res.send(surveyAnswer.rows);

    return res.status(404).send("No survey answer found");
});

router.get('/id=:id', async (req, res) => {
    const surveyAnswer = await client.query(
        "select * from survey_answer where id = $1;",
        [req.params.id]
    );

    if(surveyAnswer.rows)
        return res.send(surveyAnswer.rows);

    return res.status(404).send("No survey answer found.");
});

router.get('/survey_id=:survey_id', async (req, res) => {
    const surveyAnswer = await client.query(
        "select * from survey_answer where survey_id = $1;",
        [req.params.survey_id]
    );

    if(surveyAnswer.rows)
        return res.send(surveyAnswer.rows);

    return res.status(404).send("No survey answer found.");
});

router.post("/new", async (req, res) => {
    const surveyAnswerId = await client.query(
        `insert into survey_answer(answer, survey_id) values($1, $2) RETURNING ID;`,
        [req.body.Answer, req.body.Survey_id]
    );

    const surveyAnswer = await client.query(
        `select * from survey_answer where id=${surveyAnswerId.rows[0].id};`
    );

    return res.send(surveyAnswer.rows[0]);
});

router.put("/id=:id", async (req, res) => {
    await client.query(
        "update survey_answer set answer=$2, survey_id=$3 where id=$1;",
        [req.params.id, req.body.Answer, req.body.Survey_id]
    );

    const getSurvey = await client.query(
        "select * from survey_answer where id=$1;",
        [req.params.id]
    );

    return res.send(getSurvey.rows[0]);
});


//Klucz Obcy
router.delete("/id=:id", async (req, res) => {
    const surveyAnswer = await client.query(
        "select * from survey_answer where id = $1",
        [req.params.id]
    );

    if (!surveyAnswer.rows[0])
        return res.status(404).send("No survey answer found.");

    await client.query(
        "delete from survey_answer where id = $1",
        [req.params.id]
    );

    return res.status(200).send("Deleted.");
});

module.exports = router;