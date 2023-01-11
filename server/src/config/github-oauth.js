require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Router = express.Router();
const jwt = require("jsonwebtoken");
const GitHubStrategy = require("passport-github2").Strategy;
const passport = require("passport");
const session = require("express-session");
const UserModel = require("../models/user.model");
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;
const axios = require("axios");

Router.use(cors({ origin: `http://localhost:3000`, credentials: true }));

Router.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
    // cookie: {
    //   sameSite: "none",
    //   secure: true,
    //   maxAge: 1000 * 60 * 60 * 60 * 24 * 7,
    // },
  })
);

Router.use(passport.initialize());
Router.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: `/auth/github/callback`,
    },
    async function (accessToken, refreshToken, profile, cb) {
      let res = await axios.get("https://api.github.com/user/emails", {
        headers: {
          Accept: "application/json",
          Authorization: `token ${accessToken}`,
        },
      });
      let data = await res.data;
      let { name } = profile._json;
      let { email } = data.find((el) => el.primary == true);
      const user = await UserModel.findOne({ email });
      if (!user) {
        const newUser = new UserModel({
          name,
          email,
          password: "1234",
        });
        newUser.save();
        let { _id } = await UserModel.findOne({ email });
        const token = jwt.sign({ _id }, JWT_SECRET, {
          expiresIn: "6h",
        });
        profile.token = token;
        profile.email = email;
        return cb(null, profile);
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "6h",
      });
      profile.token = token;
      profile.email = email;
      return cb(null, profile);
    }
  )
);

Router.get("/", passport.authenticate("github", { scope: ["user:email"] }));

Router.get(
  "/callback",
  passport.authenticate("github", {
    failureRedirect: "http://localhost:3000",
  }),
  function (req, res) {
    res.redirect("http://localhost:3000");
  }
);

Router.get("/getuser", (req, res) => {
  if (req.user) {
    return res.status(200).send(req.user);
  }
  return res.status(401).send("Please Login first");
});

Router.get("/logout", (req, res) => {
  req.logout((err, done) => {
    if (err) {
      return res.send("Something went wrong");
    }
    return res.send("Logout Successfully");
  });
});

module.exports = Router;
