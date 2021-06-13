const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
//const passportSocketIo = require("passport.socketio");
const authRouter = require("./routes/auth");
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
    credentials: true
}));
app.use(sessionMiddleware)
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
    await pg.query("CREATE TABLE IF NOT EXISTS posts (id SERIAL, content VARCHAR NOT NULL, checked BOOLEAN NOT NULL DEFAULT FALSE)")
})

*/

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
const LocalStrategy = require("passport-local").Strategy;

const DEFAULT_USER = {
    id: 1,
    username: "john",
}
passport.initialize();
passport.use(
    new LocalStrategy((username, password, done) => {
        if (username === "john" && password === "doe") {
            console.log("authentication OK");
            return done(null, DEFAULT_USER);
        } else {
            console.log("wrong credentials");
            return done(null, false);
        }
    })
);
passport.deserializeUser((id, done) => {
    done(null, DEFAULT_USER);
});
passport.serializeUser((user, done) => {
    done(null, user.id);
});

app.use(passport.session());
app.use("/auth", authRouter);
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
            console.log("Socket.io: connected",socket.id)
            //console.log("Polaczono")
            socket.on("disconnect",() => {
                console.log("Socket:io: disconnected")
            })
            socket.on("getData",async () => {
                const posts = await pg.query("SELECT * FROM posts");
                io.sockets.emit('getData',posts) 
            })
            socket.on("addPost",async (data) => { 
                await pg.query(`INSERT INTO posts(content) VALUES ('${data.content}')`);
                const posts = await pg.query("SELECT * FROM posts");
                io.sockets.emit('getData',posts)    
            })

            socket.on("editPost",async (data) => {

                const post = await pg.query(`SELECT * FROM posts WHERE id = ${data.id}`)
                if(post) {
                    await pg.query(`UPDATE posts SET content = '${data.content}',checked = '${data.checked}' WHERE id = ${data.id}`)
                }
                const posts = await pg.query("SELECT * FROM posts");
                io.sockets.emit('getData',posts)
            }),
            socket.on("deletePost", async (id) => {
                const post = await pg.query(`SELECT * FROM posts WHERE  id = ${id}`)
                if(post) {
                    await pg.query(`DELETE FROM posts WHERE id = ${id}`)
                }
                const posts = await pg.query("SELECT * FROM posts");
                io.sockets.emit('getData',posts) 
            })
            
            const session = socket.request.session;
            console.log(`Socket.io: saving sid ${socket.id} in session ${session.id}`);
            session.socketId = socket.id;
            session.save();
        })


