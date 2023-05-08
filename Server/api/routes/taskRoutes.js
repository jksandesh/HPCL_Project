const taskBuilder = require('../controllers/taskController');
var VerifyTokens = require('../config/auth')

module.exports = app => {

  app
    .route('/login')
    .post(taskBuilder.loginUser);

  app
    .route('/setHash')
    .post(taskBuilder.sethash);

  app
    .route('/getHash/:id')
    .get(taskBuilder.getHash);

  app
    .route('/register')
    .post(taskBuilder.registerNewUser);

  app
    .route('/subAdmin/modify/:subAdminId')
    .get(VerifyTokens,VerifyTokens,taskBuilder.read_a_subAdmin);

};