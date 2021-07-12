const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
//const passportSocketIo = require("passport.socketio");

var multer = require("multer");
var upload = multer({ dest: "uploads/" });

const authRouter = require("./routes/auth");
const redditUserRouter = require("./routes/user");
const roleRouter = require("./routes/role");
const userRoleRouter = require("./routes/user_role");
const subredditRouter = require("./routes/subreddit");
const subredditModeratorRouter = require("./routes/subreddit_moderator");
const subredditUserRouter = require("./routes/subreddit_user");
const postRouter = require("./routes/post");
const postVoteRouter = require("./routes/post_vote");
const commentRouter = require("./routes/comment");

const pg = require("./exports/postgres");
const socket = require("socket.io");
//const fetch = require("node-fetch");

const sessionMiddleware = session({ secret: "changeit", resave: false, saveUninitialized: false });
const app = express();
app.use(cors({origin: "http://192.168.1.13:3000", credentials: true}));
//app.use(cors({origin: "http://a40c670e2b8a.eu.ngrok.io", credentials: true}));
app.use(sessionMiddleware);
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(express.static("../front/dist/"));
//app.use(express.static('../public'))

/*
const dbConnData = {
    host: "localhost",
    port: 5432,
    database: "",
    user: "",
    password: ""
};
const { Client } = require("pg");
const client = new Client(dbConnData);
console.log(dbConnData);
(async () => {
    await pg.query("CREATE TABLE IF NOT EXISTS post (id SERIAL, content VARCHAR NOT NULL, checked BOOLEAN NOT NULL DEFAULT FALSE)")
})
*/

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
const LocalStrategy = require("passport-local").Strategy;
// const { use } = require("./routes/auth");
const client = require("./exports/postgres");
const { user } = require("./exports/postgres");
const { post } = require("./routes/auth");

const REDDIT_USER = {
    id: 0,
    nickname: "",
};

passport.initialize();
passport.use(
    new LocalStrategy(async (username, password, done) => {
        //console.log(username)
        //console.log(password)
        const reddit_user = await client.query(`select * from reddit_user where nickname = '${username}' and password = '${password}'`)
        //console.log(reddit_user.rows)
        if (reddit_user.rows[0]) {
            console.log("authentication OK");
            REDDIT_USER.id = reddit_user.rows[0].id
            REDDIT_USER.nickname = reddit_user.rows[0].nickname
            return done(null, REDDIT_USER);
        } else {
            console.log("wrong credentials");
            return done(null, false);
        }
    })
);


passport.deserializeUser(async (id, done) => {
    console.log(`deserializeUser ${id}`);
    console.log("Reddit_User : " + JSON.stringify(REDDIT_USER));
    const reddit_user = await client.query(`select * from reddit_user where id = ${id};`);
    if(reddit_user.rows[0])
        REDDIT_USER.id = id;
    REDDIT_USER.nickname = reddit_user.rows[0].nickname;
    done(null, REDDIT_USER);
});

/*
passport.deserializeUser((id, done) => { 
    console.log(`deserializeUser ${id}`);
    //user.findById(id,(err, user) => {
     //   done(err, user);
    //});           
});
*/
passport.serializeUser((user, done) => {
    console.log(`serializeUser ${user.id}`);
    console.log("Reddit_User : " + JSON.stringify(user))
    done(null, user.id);
});

//app.use(passport.session());
app.use("/auth", authRouter);
app.use("/user",redditUserRouter);
app.use("/role",roleRouter);
app.use("/user_role",userRoleRouter);
app.use("/subreddit", subredditRouter);
app.use("/subreddit_moderator", subredditModeratorRouter);
app.use("/subreddit_user", subredditUserRouter);
app.use("/post", postRouter);
app.use("/post_vote", postVoteRouter);
app.use("/comment", commentRouter);

const server = app.listen(3000, () => {
    console.log(`listening at port 3000`);
});

const io = socket(
    server,
    {
        cors: {
            origin: "http://192.168.1.13:3000",
            //origin: "http://a40c670e2b8a.eu.ngrok.io",
            methods: ["GET","POST","PUT","DELETE"]
        }
    }
);

app.set('socketio',io);

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.sockets.on("connect", (socket) => {
    console.log("Socket.io: connected",socket.id);
    //console.log("Polaczono")

    socket.on("disconnect", () => {
        console.log("Socket:io: disconnected");
    });

    socket.on("getData", async () => {
        const posts = await pg.query("SELECT * FROM post;");
        io.sockets.emit('getData', posts);
    });

    socket.on("addPost", async (data) => {
        console.log("test " + data )
        //const time = await pg.query("SELECT date_trunc('second', now()::timestamp) as time;");
        //const user_id = await pg.query(`SELECT id from reddit_user where nickname = '${data.nickname}' `)
        //const subreddit_id =  await pg.query(`select id from subreddit where name = '${data.name}'`);
        //const checkTitle = await pg.query(` select * from post p inner join subreddit s on p.subreddit_id = s.id where s.name = '${data.name}' and p.title = '${data.title}';`)
        //if(!checkTitle.rows[0]) {
        //   await pg.query(`insert into post(title, content, image_path, video_url, creation_date, subreddit_id, user_id) values($1, $2, $3, $4, $5, $6, $7) RETURNING ID;`,
        //   [data.title, data.content, data.image_path, data.video_url, time.rows[0].time, subreddit_id.rows[0].id, user_id.rows[0].id]);
        const posts_subreddit = await  pg.query( `select p.*,s.name,r.nickname,(select case when sum(vote) is null then 0 else sum(vote) end as votes from post_vote v where v.post_id = p.id) from post p inner join subreddit s on p.subreddit_id=s.id inner join reddit_user r on p.user_id=r.id where s.name = '${data}';`)
        const all_posts = await pg.query( `select p.*,s.name,r.nickname,(select case when sum(vote) is null then 0 else sum(vote) end as votes from post_vote v where v.post_id = p.id) from post p inner join subreddit s on p.subreddit_id=s.id inner join reddit_user r on p.user_id=r.id;`)
        io.sockets.emit('getSubredditData', posts_subreddit);
        io.sockets.emit('allPosts', all_posts);
        //} else {
        //    io.to(socket.id).emit('getSubredditData', 0);
        //}
    });

    socket.on("editPost", async (data) => {
        const post = await pg.query(`SELECT * FROM post WHERE id = ${data.id};`);
        if (post) {
            await pg.query(`UPDATE post SET content = '${data.content}',checked = '${data.checked}' WHERE id = ${data.id};`);
        }
        const posts = await pg.query("SELECT * FROM post;");
        io.sockets.emit('getData', posts);
    });

    /*
    socket.on("deletePost", async (id) => {
        const post = await pg.query(`SELECT * FROM post WHERE  id = ${id};`);
        if (post) {
            await pg.query(`DELETE FROM post WHERE id = ${id};`);
        }
        const posts = await pg.query("SELECT * FROM post;");
        io.sockets.emit('getData', posts);
    });
    */

    socket.on("getSubreddits", async () => {
        const subreddits = await pg.query("SELECT * FROM subreddit;");
        io.sockets.emit('getSubreddits', subreddits);
    });

    socket.on("getSubredditData", async (name) => {
         //console.log(name);
        //console.log('hello1234')
        const posts = await pg.query(
            "select p.*,s.name,r.nickname,(select case when sum(vote) is null then 0 else sum(vote) end as votes from post_vote v where v.post_id = p.id) from post p inner join subreddit s on p.subreddit_id=s.id inner join reddit_user r on p.user_id=r.id where s.name = '" + name + "';"
        );
        //console.log(posts)

        //"SELECT * FROM subreddit WHERE name=$1;",
        // console.log(subreddit.rows[0].id);
       // const posts = await pg.query(
         //   "SELECT * FROM post WHERE subreddit_id=$1;",
           // [subreddit.rows[0].id]
        //);
        //io.sockets.emit('getSubredditData', posts);
        io.to(socket.id).emit('getSubredditData', posts);
    });

    socket.on("addSubreddit", async (newSubreddit) => {
        const newId = await pg.query(
            "INSERT INTO subreddit(name, description) VALUES($1, $2) RETURNING ID;",
            [newSubreddit.name, newSubreddit.description]
        );
        const userId = await pg.query(
            "SELECT id FROM reddit_user WHERE nickname=$1;",
            [newSubreddit.nickname]
        );
        await pg.query(
            "INSERT INTO subreddit_moderator (user_id, subreddit_id) VALUES($1, $2);",
            [userId.rows[0].id, newId.rows[0].id]
        );
        await pg.query(
            "INSERT INTO subreddit_user (user_id, subreddit_id) VALUES($1, $2);",
            [userId.rows[0].id, newId.rows[0].id]
        );

        const subreddits = await pg.query("SELECT * FROM subreddit;");
        io.sockets.emit('getSubreddits', subreddits);
    });

    socket.on("changeSubreddit", async (changeSubreddit) => {
        const sub = await pg.query(`SELECT * FROM subreddit where id !=${changeSubreddit.id} and name ='${changeSubreddit.name}' `)
        if(sub.rows[0]){
            const subreddits = await pg.query("SELECT * FROM subreddit;");
            io.to(socket.id).emit('getSubredditsFalse');
            io.sockets.emit('getSubreddits', subreddits);
        }
        else{
        console.log("123: ", changeSubreddit.id);
        await pg.query(`UPDATE subreddit SET name='${changeSubreddit.name}', description='${changeSubreddit.description}' WHERE id=${changeSubreddit.id};`);

        const subreddits = await pg.query("SELECT * FROM subreddit;");
        io.sockets.emit('getSubreddits', subreddits);
        }
    });

    socket.on("getSubredditUser", async (data) => {
        const userId = await pg.query(`SELECT * FROM reddit_user WHERE nickname='${data.userName}';`);
        const subredditId = await pg.query(`SELECT * FROM subreddit WHERE name='${data.subredditName}';`);
        const isSubredditUser = await pg.query(
            `SELECT * FROM subreddit_user 
            WHERE user_id='${userId.rows[0].id}' and 
            subreddit_id='${subredditId.rows[0].id}';`
        );
        if (isSubredditUser.rows.length === 0) {
            io.to(socket.id).emit('getSubredditUser', false);
        } else {
            io.to(socket.id).emit('getSubredditUser', true);
        }
    });

    socket.on("joinSubreddit", async (data) => {
        const userId = await pg.query(`SELECT * FROM reddit_user WHERE nickname='${data.userName}';`);
        const subredditId = await pg.query(`SELECT * FROM subreddit WHERE name='${data.subredditName}';`);
        await pg.query(
            `INSERT INTO subreddit_user(user_id, subreddit_id) 
            VALUES('${userId.rows[0].id}', '${subredditId.rows[0].id}');`
        );
        io.to(socket.id).emit('activated');
    });

    socket.on("getSinglePost", async (data) => {
        const post = await pg.query(
            `select p.*,s.name,r.nickname,(select case when sum(vote) is null then 0 else sum(vote) end 
            as votes from post_vote v where v.post_id = p.id) from post p inner join subreddit s on p.subreddit_id=s.id 
            inner join reddit_user r on p.user_id=r.id where s.name = '${data.name}' and p.id='${data.id}';`
        );
        io.to(socket.id).emit('getSinglePost', post);
    });

    socket.on("getComments", async (data) => {
        console.log(data);
        // const comments = await pg.query(`SELECT * FROM comment WHERE post_id='${data}';`);
        const comments = await pg.query(
            `SELECT c.id, c.content, c.parent_comment_id, c.user_id, c.post_id, u.nickname 
            FROM comment AS c INNER JOIN reddit_user AS u ON c.user_id=u.id WHERE c.post_id='${data}';`
        );
        console.log(comments.rows);
        io.to(socket.id).emit('getComments', comments);
    });

    socket.on("deletePost", async (data) => {
        await pg.query(`DELETE FROM comment WHERE post_id='${data.postId}';`);
        await pg.query(`DELETE FROM post_vote WHERE post_id='${data.postId}';`);
        await pg.query(`DELETE FROM post WHERE id='${data.postId}';`);
        const posts_subreddit = await  pg.query( `select p.*,s.name,r.nickname,(select case when sum(vote) is null then 0 else sum(vote) end as votes from post_vote v where v.post_id = p.id) from post p inner join subreddit s on p.subreddit_id=s.id inner join reddit_user r on p.user_id=r.id where s.name = '${data.subreddit_name}';`)
        const all_posts = await pg.query( `select p.*,s.name,r.nickname,(select case when sum(vote) is null then 0 else sum(vote) end as votes from post_vote v where v.post_id = p.id) from post p inner join subreddit s on p.subreddit_id=s.id inner join reddit_user r on p.user_id=r.id;`)
        io.sockets.emit('getSubredditData', posts_subreddit);
        io.sockets.emit('allPosts', all_posts);
        socket.broadcast.emit('getSinglePost', {post_count: 0,error_message: `This post has been deleted by ${data.nickname}`});
        io.to(socket.id).emit('getSinglePost', {post_count: 0,error_message: `This post has been deleted by you`} );
        //const all_posts = await pg.query( `select p.*,s.name,r.nickname,(select case when sum(vote) is null then 0 else sum(vote) end as votes from post_vote v where v.post_id = p.id) from post p inner join subreddit s on p.subreddit_id=s.id inner join reddit_user r on p.user_id=r.id;`)
        // io.sockets.emit('allPosts', all_posts);
    });

    socket.on("deleteComment", async (data) => {
        console.log("id: ", data.id);
        console.log("post_id: ", data.post_id);
        await pg.query(`DELETE FROM comment WHERE id='${data.id}';`);
        // const all_comments = await pg.query(`SELECT * FROM comment WHERE post_id='${data.post_id}';`);
        const all_comments = await pg.query(
            `SELECT c.id, c.content, c.parent_comment_id, c.user_id, c.post_id, u.nickname 
            FROM comment AS c INNER JOIN reddit_user AS u ON c.user_id=u.id WHERE c.post_id='${data.post_id}';`
        );

        io.sockets.emit('getComments', all_comments);
    });

    socket.on("addComment", async (data) => {
        const user_id = await pg.query(`SELECT id from reddit_user where nickname = '${data.nickname}';`);
        console.log("rows: ", user_id.rows);

        await pg.query(
            `INSERT INTO comment (content, parent_comment_id, user_id, post_id) 
            VALUES('${data.content}', NULL, ${user_id.rows[0].id}, ${data.post_id});`
        );

        // const all_comments = await pg.query(`SELECT * FROM comment WHERE post_id=${data.post_id};`);
        const all_comments = await pg.query(
            `SELECT c.id, c.content, c.parent_comment_id, c.user_id, c.post_id, u.nickname 
            FROM comment AS c INNER JOIN reddit_user AS u ON c.user_id=u.id WHERE c.post_id='${data.post_id}';`
        );
        // io.sockets.emit('allComments', {comments: all_comments.rows, post_id: data.post_id});
        console.log("all_comments rows: ", all_comments.rows)
        io.sockets.emit('allComments', {comments: all_comments.rows, post_id: data.post_id});
    });


    
    socket.on("postLikes", async(data) => {
        const user_id = await pg.query(`SELECT id FROM reddit_user where nickname = '${data.nickname}';`);
        const postVote = await pg.query(
            "SELECT * FROM post_vote WHERE post_id = $1 and user_id = $2;",
            [data.post_id, user_id.rows[0].id]
        );

         if (postVote.rows[0]) {
             if (postVote.rows[0].vote === data.vote) {
                 await pg.query(
                     "DELETE FROM post_vote WHERE post_id = $1 and user_id = $2",
                     [data.post_id,user_id.rows[0].id]
                 );
                 const getPost = await pg.query(`select case when sum(vote) is null then 0 else sum(vote) end as votes from post_vote v where v.post_id = ${data.post_id};`);
                 io.sockets.emit('getVotes', {votes: getPost.rows[0].votes, post_id: data.post_id, error_message: `Vote has been revoked by ${data.nickname}`});
                 io.to(socket.id).emit('getVotes', {votes: getPost.rows[0].votes, post_id: data.post_id,error_message: `You deleted a vote`});
             } else {
                 await pg.query(
                     "Update post_vote SET vote = $1 WHERE post_id = $2 and user_id = $3;",
                     [data.vote, data.post_id,user_id.rows[0].id]
                 );
                 const getPost = await pg.query(`select case when sum(vote) is null then 0 else sum(vote) end as votes from post_vote v where v.post_id = ${data.post_id};`);
                 io.sockets.emit('getVotes', {votes: getPost.rows[0].votes, post_id: data.post_id, error_message: `Vote has been changed by ${data.nickname}`});
                 io.to(socket.id).emit('getVotes', {votes: getPost.rows[0].votes, post_id: data.post_id,error_message: `You changed your previous vote`});
             }
         } else {
             await pg.query(
                 `INSERT INTO post_vote(vote, user_id, post_id) VALUES($1, $2, $3) RETURNING ID;`,
                 [data.vote, user_id.rows[0].id, data.post_id]
             );
             const getPost = await pg.query(`select case when sum(vote) is null then 0 else sum(vote) end as votes from post_vote v where v.post_id = ${data.post_id};`);
             io.sockets.emit('getVotes', {votes: getPost.rows[0].votes, post_id: data.post_id, error_message: `Vote has been added by ${data.nickname}`});
             io.to(socket.id).emit('getVotes', {votes: getPost.rows[0].votes, post_id: data.post_id,error_message: `You added a vote`});
         }
        




    });
});
