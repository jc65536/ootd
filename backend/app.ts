import express from "express";
import { user_router } from "./endpoints/user-endpoints";
import cors from "cors";
import session, { SessionData } from 'express-session';
import connectMongodbSession from "connect-mongodb-session";
import bodyParser from 'body-parser';
import { login_router } from "./endpoints/login-endpoints";
import { validateUser } from "./endpoints/utils";
import { uri } from "./lib/db-lib/db-client";
import { posts_router } from "./endpoints/posts-endpoints";
import { clothes_router } from "./endpoints/clothing-endpoints";
import { wardrobe_router } from "./endpoints/wardrobe-endpoints";


declare module "express-session" {
    interface SessionData {
        userID: string,
        userObjectId: string,
    }
}

const SESSION_SECRET_KEY = process.env["SESSION_SECRET_KEY"] ?? "";

const MongoDBStore = connectMongodbSession(session);
const store = new MongoDBStore({
    uri: uri,
    collection: 'sessions'
});

const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: process.env["FRONTEND_HOST"], credentials: true }))

app.use(session({
    secret: SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false, // Only create new session if client does not already have a session cookie
    store: store, // all the sessions and their data will be written to the sessions collections in MongoDB
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: true,
        maxAge: 24 * 60 * 60 * 1000 // Time is in miliseconds
    },
}));

app.use(validateUser);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/login", login_router);

app.use("/user", user_router);

app.use("/posts", posts_router);

app.use("/clothing", clothes_router);

app.use("/wardrobe", wardrobe_router);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
