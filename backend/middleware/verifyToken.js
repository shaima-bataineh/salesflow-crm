const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let token;

  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
//   if (req.user.role !== "admin") {
//   return res.status(403).json({ error: "Access denied" });
// }

  if (!token)
    return res.status(401).json({ error: "Not authenticated" });//401 المستخدم غير مسجل دخول مافي توكين

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });//403 المستخدم مسجل دخول لكن التوكين غير صالح
  }
};

module.exports = verifyToken;
