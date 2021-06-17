const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
//const passportSocketIo = require("passport.socketio");
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
const surveyRouter = require("./routes/survey");
const surveyAnswerRouter = require("./routes/survey_answer");
const surveyUserAnswerRouter = require("./routes/survey_user_answer");


const pg = require("./exports/postgres");
const socket = require("socket.io");
//const fetch = require("node-fetch");

const sessionMiddleware = session({ secret: "changeit", resave: false, saveUninitialized: false });
const app = express();
app.use(cors({
    origin: "http://localhost:8080",
    credentials: true,
}));
app.use(sessionMiddleware);
app.use(express.json());
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
const { use } = require("./routes/auth");
const client = require("./exports/postgres");

const REDDIT_USER = {
    id: 0,
    nickname: "",
}

passport.initialize();
passport.use(
    new LocalStrategy(async (username, password, done) => {
        //console.log(username)
        //console.log(password)
        const reddit_user = await client.query(`select * from reddit_user where nickname = '${username}' and password = '${password}'`)
        //console.log(reddit_user.rows)
        if(reddit_user.rows[0]) {
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
    console.log("Reddit_User : " + JSON.stringify(REDDIT_USER))
    const reddit_user = await client.query(`select * from reddit_user where id = ${id}`)
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
app.use("/survey", surveyRouter);
app.use("/survey_answer", surveyAnswerRouter);
app.use("/survey_user_answer", surveyUserAnswerRouter);



const server = app.listen(3000, () => {
    console.log(`listening at port 3000`);
});

const io = socket(server,{
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET","POST","PUT","DELETE"]
    }
});

app.set('socketio',io);

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.sockets.on("connect", (socket) => {
    console.log("Socket.io: connected",socket.id);
    //console.log("Polaczono")
    socket.on("disconnect",() => {
        console.log("Socket:io: disconnected");
    });
    socket.on("getData",async () => {
        const posts = await pg.query("SELECT * FROM post");
        io.sockets.emit('getData', posts);
    });
    socket.on("addPost",async (data) => {
        await pg.query(`INSERT INTO post(content) VALUES ('${data.content}')`);
        const posts = await pg.query("SELECT * FROM post");
        io.sockets.emit('getData', posts);
    });
    socket.on("editPost",async (data) => {
        const post = await pg.query(`SELECT * FROM post WHERE id = ${data.id}`)
        if (post) {
            await pg.query(`UPDATE post SET content = '${data.content}',checked = '${data.checked}' WHERE id = ${data.id}`)
        }
        const posts = await pg.query("SELECT * FROM post");
        io.sockets.emit('getData',posts);
    });
    socket.on("deletePost", async (id) => {
        const post = await pg.query(`SELECT * FROM post WHERE  id = ${id}`)
        if (post) {
            await pg.query(`DELETE FROM post WHERE id = ${id}`);
        }
        const posts = await pg.query("SELECT * FROM post");
        io.sockets.emit('getData',posts);
    });



    socket.on("getSubreddits",async () => {
        const subreddits = await pg.query("SELECT * FROM subreddit");
        io.sockets.emit('getSubreddits', subreddits);
    });



    /*
    console.log(socket)
    const session = socket.request.session;
    console.log(`Socket.io: saving sid ${socket.id} in session ${session.id}`);
    session.socketId = socket.id;
    session.socketId = socket.id
    console.log("JP 100% " + session.socketId);
    console.log(session)
    session.save();
    */
})