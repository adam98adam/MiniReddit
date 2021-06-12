const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
//const passportSocketIo = require("passport.socketio");
const authRouter = require("./routes/auth");

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

const Adam_USER = {
    id: 1,
    username: "Adam",
}
passport.initialize();
passport.use(
    new LocalStrategy((username, password, done) => {
        if (username === "Adam" && password === "zeb") {
            console.log("authentication OK");
            return done(null, Adam_USER);
        } else {
            console.log("wrong credentials");
            return done(null, false);
        }
    })
);
passport.deserializeUser((id, done) => {
    done(null, Adam_USER);
});
passport.serializeUser((user, done) => {
    done(null, user.id);
});
app.use(passport.session());
app.use("/auth", authRouter);

        
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
/*
io.use((socket, next) => {
    //console.log(socket.request.user)
    //console.log(socket.request)
    if (socket.request.user) {
        next();
    } else {
        console.log('problem')
        next(new Error('unauthorized'))
    }
});


io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,       // the same middleware you registrer in express
    key:          'express.sid',       // the name of the cookie where express/connect stores its session_id
    secret:       'session_secret',    // the session_secret to parse the cookie
    store:        sessionStore,        // we NEED to use a sessionstore. no memorystore please
    success:      onAuthorizeSuccess,  // *optional* callback on success - read more below
    fail:         onAuthorizeFail,     // *optional* callback on fail/error - read more below
  }));
*/



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


