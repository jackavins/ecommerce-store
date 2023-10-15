import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import "dotenv/config";
import express from "express";
import session from "express-session";
import router from "./routes/api";
import store from "./services/store";

const app = express();
const port = 3000;

declare module "express-session" {
	interface SessionData {
		uniqueID: string | undefined;
	}
}

app.use(cookieParser());
app.use(
	session({
		secret: "yourSecretKey",
		resave: false,
		saveUninitialized: true,
	}),
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to generate a unique ID only if it doesn't exist in the session
app.use((req, res, next) => {
	if (!req.session.uniqueID) {
		req.session.uniqueID = crypto.randomUUID();
		store.addUser(req.session.uniqueID);
	}
	next();
});

app.get("/_health", (req, res) => res.send());

app.use("/api", router);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
