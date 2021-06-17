require("dotenv").config();
const fs = require('fs');

const db =  fs.readFileSync(__dirname + '/../sql/db.sql').toString();
const reddit_user = fs.readFileSync(__dirname + '/../sql/reddit_user.sql').toString();
const role = fs.readFileSync(__dirname + '/../sql/role.sql').toString();
const subreddit = fs.readFileSync(__dirname + '/../sql/subreddit.sql').toString();
const subreddit_moderator = fs.readFileSync(__dirname + '/../sql/subreddit_moderator.sql').toString();
const subreddit_user = fs.readFileSync(__dirname + '/../sql/subreddit_user.sql').toString();
const user_role = fs.readFileSync(__dirname + '/../sql/user_role.sql').toString();
const post = fs.readFileSync(__dirname + '/../sql/post.sql').toString();
const post_vote = fs.readFileSync(__dirname + '/../sql/post_vote.sql').toString();
const comment = fs.readFileSync(__dirname + '/../sql/comment.sql').toString();
const survey = fs.readFileSync(__dirname + '/../sql/survey.sql').toString();
const survey_answer = fs.readFileSync(__dirname + '/../sql/survey_answer.sql').toString();
const survey_user_answer = fs.readFileSync(__dirname + '/../sql/survey_user_answer.sql').toString();
const delete_records = fs.readFileSync(__dirname + '/../sql/delete.sql').toString();

const dbConnData = {
    host: process.env.PG_Host,
    port: process.env.PG_Port,
    database: process.env.PG_Database,
    user: process.env.PG_User,
    password: process.env.PG_Password,
};

const { Client } = require("pg");
const client = new Client(dbConnData);
console.log(dbConnData);
client.connect().then(() => {
    console.log("Connection with postgres was established");
    client.query(db);
    client.query(delete_records);
    client.query(reddit_user);
    client.query(role);
    client.query(subreddit);
    client.query(subreddit_moderator);
    client.query(subreddit_user);
    client.query(user_role);
    client.query(post);
    client.query(post_vote);
    client.query(comment);
    client.query(survey);
    client.query(survey_answer);
    client.query(survey_user_answer);
}).catch(() => {
    console.log("Connection with postgres failed");
});
module.exports = client;