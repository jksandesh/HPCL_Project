const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");

    const decoded = jwt.verify(token, "legitdocSecretkeyDlt");
    req.userData = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Authentification Failed"
    });
  }
};

function verifyToken(req, res, next) {
  var token = req.body.token || req.query.token || req.headers["token"];
  if (token==='[object Object]')
    return res.status(403).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, "legitdocSecretkeyDlt", function(err, decoded) {
    if (err)
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    // if everything good, save to request for use in other routes
    req.userData = decoded;
    next();
  });
}

module.exports = verifyToken;
