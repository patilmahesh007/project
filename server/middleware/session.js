import session from "express-session";

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "mySecret",
  resave: false,
  saveUninitialized: true,
  name: "widget_session",
  cookie: {
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production",
    sameSite: "none", 
    maxAge: 24 * 60 * 60 * 1000,
    domain: process.env.NODE_ENV=== "production" ? ".onrender.com" : undefined,
    path: "/",
  },
});

export default sessionMiddleware;
