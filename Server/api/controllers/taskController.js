const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dataOperator = mongoose.model('dataEntry')
const nearAPI = require("near-api-js");
const { keyStores, KeyPair, Contract } = nearAPI;
const myKeyStore = new keyStores.InMemoryKeyStore();
const PRIVATE_KEY = "ed25519:5wkMB2sZqhDGS3FudZpCu5WP4cP9EBSsbf9LKZVTnKqHc6oci9A5NQVD1fJ4Hbuj4toXJ3QLTmm1vMAwnsqfCm7i";// creates a public / private key pair using the provided private key
const keyPair = KeyPair.fromString(PRIVATE_KEY);

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

exports.sethash = async (req, res) => {
  try {
    console.log(req.body.hash)
    await myKeyStore.setKey("mainnet", "zupple_hpcl.near", keyPair);
    const { connect, Contract } = nearAPI;

    const connectionConfig = {
      networkId: "mainnet",
      keyStore: myKeyStore, // first create a key store
      nodeUrl: "https://rpc.mainnet.near.org",
      walletUrl: "https://wallet.mainnet.near.org",
      helperUrl: "https://helper.mainnet.near.org",
      explorerUrl: "https://explorer.mainnet.near.org",
    };
    const methodOptions = {
      viewMethods: ['get_hash', 'get_all_hashes'],
      changeMethods: ['set_hash']
    };
    const nearConnection = await connect(connectionConfig);
    const account = await nearConnection.account("zupple_hpcl.near");
    const contract = new Contract(account, 'zupple_hpcl.near', methodOptions);
    const hash = await contract.set_hash({ hash: req.body.hash }).then(value => {
      console.log('-------'+ value);
      this.hash = value
    });
    console.log('Here');
    console.log(this.hash);
    res.status(201).json({ hash });
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

exports.getHash = async (req, res) => {
  try {
    console.log('Here');
    console.log(req.params.id)
    await myKeyStore.setKey("mainnet", "zupple_hpcl.near", keyPair);
    const { connect, Contract } = nearAPI;

    const connectionConfig = {
      networkId: "mainnet",
      keyStore: myKeyStore, // first create a key store
      nodeUrl: "https://rpc.mainnet.near.org",
      walletUrl: "https://wallet.mainnet.near.org",
      helperUrl: "https://helper.mainnet.near.org",
      explorerUrl: "https://explorer.mainnet.near.org",
    };
    const methodOptions = {
      viewMethods: ['get_hash', 'get_all_hashes'],
      changeMethods: ['set_hash']
    };
    const nearConnection = await connect(connectionConfig);
    const account = await nearConnection.account("zupple_hpcl.near");
    const contract = new Contract(account, 'zupple_hpcl.near', methodOptions);
    const hash = await contract.get_hash({ hash: req.params.id})
    res.status(201).json({ hash });
  } catch (err) {
    res.status(400).json({ err: err });
  }
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

