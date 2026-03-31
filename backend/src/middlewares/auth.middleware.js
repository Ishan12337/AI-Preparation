const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      (req.headers.authorization &&
        req.headers.authorization.split(" ")[1]);

    console.log("TOKEN:", token);

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED:", decoded);

    // 👇 IMPORTANT
    req.userId = decoded.userId;

    next();
  } catch (err) {
    console.error("Auth Error:", err.message);

    return res.status(401).json({
      message: "Unauthorized - Invalid token",
    });
  }
};

module.exports = protect;

