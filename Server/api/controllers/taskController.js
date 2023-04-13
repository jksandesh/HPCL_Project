const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dataOperator = mongoose.model('dataEntry')

exports.read_a_subAdmin = (req, res) => {
  dataOperator.findById(req.params.subAdminId, (err, subAdmin) => {
    if (err) res.send(err);
    res.json(subAdmin);
  });
};

exports.registerNewUser = async (req, res) => {
  try {
    let isUser = await dataOperator.find({ username: req.body.username });
    if (isUser.length >= 1) {
      return res.status(409).json({
        message: "username already in use"
      });
    }
    const user = new dataOperator({
      uniqueCode: req.body.uniqueCode,
      taluka: req.body.taluka,
      urbanRural: req.body.urbanRural,
      post: req.body.post,
      department: req.body.department,
      username: req.body.username,
      password: req.body.password,
      type: req.body.type,
      token:' '
    });

    let data = await user.save();
    const token = await user.generateAuthToken();
    res.status(201).json({ data, token });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
};

//this method search for a user by email and password.
findByCredentials = async (username, password) => {
  const user = await dataOperator.findOne({ username });
  console.log(username)
  if (!user) {
    throw new Error({ error: "Invalid login details" });
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error({ error: "Invalid login details" });
  }
  return user;
};

exports.loginUser = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const user = await findByCredentials(username, password);
    if (!user) {
      return res
          .status(401)
          .json({ error: "Login failed! Check authentication credentials" });
    }
    const token = await user.generateAuthToken();
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

exports.getUserDetails = async (req, res) => {
  await res.json(req.userData);
};

