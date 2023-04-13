const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Schema } = mongoose;

const adminSchema = new Schema(
  {
    uniqueCode: {
        type: Number,
        required: 'UniqueID cannot be blank'
    },
    taluka: {
      type: String,
      required: 'taluka cannot be blank'
    },
    name: {
         type: String,
         required: 'ruralUrban cannot be blank'
    },
    phoneNumber: {
        type: String,
        required: 'post cannot be blank'
    },
    username: {
      type: String,
      required: 'username  cannot be blank'
    },
    password: {
      type: String,
      required: [true, "Please Include your password"]
    },
    type: {
        type: String,
    },
    token: {
        type: String,
        required:''
    }
  },
  { collection: 'dataEntry' }
);

adminSchema.pre("save", async function(next) {
    // Hash the password before saving the user model
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

//this function generates an auth token for the user
adminSchema.methods.generateAuthToken = async function() {

    const user = this;
    const token = jwt.sign(
        { _id: user._id, taluka:user.taluka,username: user.username },
        "legitdocSecretkeyDlt"
    );
    user.token = token;
    await user.save();
    return token;
};

adminSchema.methods.generateUpdateToken = async function() {

    const user = this;
    const token = jwt.sign(
        { _id: user._id, taluka:user.taluka,username: user.username },
        "legitdocSecretkeyDlt"
    );
    user.token = token;
    return token;
};

module.exports = mongoose.model('dataEntry', adminSchema);