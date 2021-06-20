var express = require('express');
var router = express.Router();
const client = require('../exports/postgres');
var multer = require("multer");
var upload = multer({ dest: "uploads/" });

router.get('/', async (req, res) => {
    console.log(req.user)
    // console.log('hello')
    const post = await client.query(
        "select p.*,s.name,r.nickname,(select case when sum(vote) is null then 0 else sum(vote) end as votes from post_vote v where v.post_id = p.id) from post p inner join subreddit s on p.subreddit_id=s.id inner join reddit_user r on p.user_id=r.id"
    );

    
    if(post.rows)
        return res.send(post.rows);

    return res.status(404).send("No post found.");
});

router.get('/subreddit=:subreddit', async (req, res) => {
    const post = await client.query(
        "select p.*,s.name,r.nickname,(select case when sum(vote) is null then 0 else sum(vote) end as votes from post_vote v where v.post_id = p.id) from post p inner join subreddit s on p.subreddit_id=s.id inner join reddit_user r on p.user_id=r.id  where s.name LIKE '%" + req.params.subreddit  + "%';" 
    ,);

    if(post.rows)
        return res.send(post.rows);

    return res.status(404).send("No post found");
});

router.get('/content=:content', async (req, res) => {
    const post = await client.query(
        "select p.*,s.name,r.nickname,(select case when sum(vote) is null then 0 else sum(vote) end as votes from post_vote v where v.post_id = p.id) from post p inner join subreddit s on p.subreddit_id=s.id inner join reddit_user r on p.user_id=r.id  where p.content LIKE '%" + req.params.content + "%';"
    ,);

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
router.post("/", upload.single("file"), async (req, res) => {
    // console.log("req.file: ", req.file);
    const image = "http://localhost:3000/" + req.file.path;
    const time = await client.query("SELECT date_trunc('second', now()::timestamp) as time;");
    const subreddit_id = await client.query(`select id from subreddit where name = '${req.body.subredditName}';`);
    // console.log("req.user: ", req.user);
    // console.log("subreddit_id.rows[0]: ", subreddit_id.rows[0]);

    const postId = await client.query(
        `insert into post(title, content, image_path, video_url, creation_date, subreddit_id, user_id) values($1, $2, $3, $4, $5, $6, $7) RETURNING ID;`,
        [req.body.title, req.body.content, image, req.body.video_url, time.rows[0].time, subreddit_id.rows[0].id, req.user.id] //subreddit_id.rows[0].id
    );

    return res.status(200).json("update");
    
    //subreddit_id.rows[0]

    //console.log(req.file)
    //console.log("hello123981")
    //console.log(req.body.title)
    //res.status(200).json("cos")
    /*
    const postId = await client.query(
        `insert into post(title, content, image_path, video_url, creation_date, subreddit_id, user_id) values($1, $2, $3, $4, $5, $6, $7) RETURNING ID;`,
        [req.body.Title, req.body.Content, req.body.Image_path, req.body.Video_url, req.body.Creation_date, req.body.Subreddit_id, req.body.User_id]
    );

    const post = await client.query(
        `select * from post where id=${postId.rows[0].id};`
    );

    return res.send(post.rows[0]);
    */
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

router.get("/isModerator/:subreddit_name", async (req, res) => {
    if (!req.user)
        return res.status(400).json(false);
    let isModerator = false;
    // const user = await client.query(`SELECT * FROM reddit_user WHERE nickname='${req.user.id}';`);
    const globalModerator = await client.query(
        `SELECT * FROM reddit_user AS u INNER JOIN user_role AS b ON u.id=b.user_id 
        INNER JOIN role as r ON b.role_id=r.id WHERE u.id='${req.user.id}';`
    );
    // console.log("rows length: ", globalModerator.rows.length);
    
    if (globalModerator.rows.length > 0)
        isModerator = true;
    
    const subreddit = await client.query(`SELECT * FROM subreddit WHERE name='${req.params.subreddit_name}';`);
    const subredditModerator = await client.query(
        `SELECT * FROM subreddit_user WHERE user_id='${req.user.id}' and subreddit_id='${subreddit.rows[0].id}';`
    );
    // console.log("rows length: ", subredditModerator.rows.length);
    
    if (subredditModerator.rows.length > 0)
        isModerator = true;

    return res.status(200).json(isModerator);
});

module.exports = router;
