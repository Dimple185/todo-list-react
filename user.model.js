const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let User = new Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  token: {
    type: String,
  },
});


// User.pre("save", function save(next) {
//     bcrypt.hash(this.password, 10, (err, hash) => {
//         console.log(err);
//         console.log('hash', hash);
//         if (err) {
//             console.log(err);
//             return next(err);
//         }
//         this.password = hash;
//         next();
//     })

// })

// User.pre("save", function (next) {
//   const user = this;
//   bcrypt.genSalt(10, function (err, salt) {
//     if (err) {
//       return next(err);
//     }
//     console.log("hash.password", user.password);
//     bcrypt.hash(user.password, salt, (err, hash) => {
//       if (err) {
//         return next(err);
//       }
//       console.log("hash", hash);
//       user.password = hash;
//       next();
//     });
//   });
// })
  

User.method("generateAuthToken", async function () {
  const accessTokenSecret = process.env.SECRET_TOKEN;
  const user = this;
  const token = jwt.sign({ username: user.username }, accessTokenSecret);
  user.token = token;
  await user.save();
  return token;
});

module.exports = mongoose.model("User", User);
