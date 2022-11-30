const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("638783ada8d3c03160921c46")
    .then((user) => {
      // console.log(user);
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://TuanKhanh:B01888084955@cluster0.qwkbfqz.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then((result) => {
    console.log("Connect Successfully");
    // findOne nếu không có đối số thì luôn trả về đầu tiên
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Tuấn Khanh",
          email: "tuankhanha3dt@gmail.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
