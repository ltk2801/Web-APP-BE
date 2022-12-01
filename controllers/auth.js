const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  //   const isLoggedIn = req.get("Cookie").split("=")[1]; // req.get là lấy trong Network login, req.get('Cookie').split(';')[1].trim().split('=')[1]
  // console.log(req.session);
  let message = req.flash("error");
  if (message.length > 0) {
    message = message;
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  //   req.isLoggedIn = true;
  //   res.setHeader("Set-Cookie", "loggedIn=true"); // Cookie
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      // console.log(user);
      if (!user) {
        req.flash("error", "Invalid email or password !");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          req.flash("error", "Password wrong ! ");
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
    console.log(err);
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  // console.log(message);
  if (message.length > 0) {
    message = message;
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmpassword;

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "E-Mail exists already !");
        return res.redirect("/signup");
      }
      if (password !== confirmPassword) {
        req.flash("error", "Incorrect password entered !");
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
