const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const todoRoutes = express.Router();
const PORT = 5001;
let Todo = require("./todo.model");
const User = require("./user.model");
const { json } = require("body-parser");
const { response } = require("express");

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;

// Once the connection is established, callback
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

app.post("/users/login", (req, res) => {
  const { username, password } = req.body;
  User.findOne({
    username: username,
  }).then((user) => {
    if (user === null) {
      return res.status(400).send("Cannot find User");
    }
    console.log("user.password", user.password);
    console.log("password", password);
    bcrypt
      .compare(password, user.password)
      .then((response) => {
        console.log(response);
        if (response) {
          user.generateAuthToken();
          res.json({ user: user, msg: "Login Success" });
        } else {
          res.json({ msg: "Wrong password, Try again!!" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  console.log(req.headers);
  if (!bearerHeader) {
    //Split at the space
    const bearer = bearerHeader.split(" ");
    //get token from array
    const bearerToken = bearer[1];
    console.log({ bearerToken });
    //set the token
    jwt.verify(bearerToken, process.env.SECRET_TOKEN, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

todoRoutes.route("/signup").post((req, res) => {
  console.log("this block runs");
  const { username, password } = req.body;
  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      console.log(err);
    }
    // console.log("hash.password", hashedPassword);
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        return next(err);
      } else {
        User.create({
          username: username,
          password: hash,
        })
          .then((response) => {
            res.json({ msg: "user added successfully!" });
          })
          .catch((err) => {
            console.log(err);
            res.json({ msg: "adding new user failed!" });
          });
      }
    });
  });
});

todoRoutes.route("/todos").get((req, res) => {
  Todo.find((err, todos) => {
    if (err) console.log(err);
    else {
      res.json(todos);
    }
  });
});

todoRoutes.route("/todos/add").post((req, res) => {
  const todo = new Todo(req.body);
  console.log("req.body: ", req.body);
  todo
    .save()
    .then((todo) => {
      res.status(200).json({ todo: "todo added successfully" });
    })
    .catch((err) => {
      res.status(400).send("adding new todo failed");
    });
});

todoRoutes.route("/todos/delete/:id").delete((req, res) => {
  const todo = new Todo(req.body);

  console.log("req.params.id: ", req.params.id);
  Todo.remove({ _id: req.params.id })
    .then((todo) => {
      res.status(200).json({ todo: "todo deleted successfully" });
    })
    .catch((err) => {
      res.status(500).send("deleting new todo failed");
    });
});
todoRoutes.route("/todos/update/:id").put((req, res) => {
  Todo.findById(req.body._id, (err, todo) => {
    console.log("req.body: ", req.body);
    if (!todo) res.status(404).send("Data is not found");
    else {
      Todo.findOneAndUpdate(
        { _id: req.body._id },
        { $set: { text: req.body.text } },
        { new: true }
      )
        .then((todo) => {
          res.json("Todo updated");
        })
        .catch((err) => {
          res.status(400).send("Update not possible");
        });
    }
  });
});

app.use("/", todoRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
