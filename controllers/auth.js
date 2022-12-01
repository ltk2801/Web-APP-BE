const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  //   const isLoggedIn = req.get("Cookie").split("=")[1]; // req.get là lấy trong Network login, req.get('Cookie').split(';')[1].trim().split('=')[1]
  // console.log(req.session);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  //   req.isLoggedIn = true;
  //   res.setHeader("Set-Cookie", "loggedIn=true"); // Cookie
  User.findById("638783ada8d3c03160921c46")
    .then((user) => {
      // console.log(user);
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        console.log(err);
        res.redirect("/");
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
