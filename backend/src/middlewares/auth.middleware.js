const jwt = require("jsonwebtoken");

// const protect = (req, res, next) => {
//   try {
//     const token =
//       req.cookies?.token ||
//       (req.headers.authorization && req.headers.authorization.split(" ")[1]);

//     if (!token) return res.status(401).json({ message: "Unauthorized" });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.userId;

//    console.log("COOKIES:", req.cookies);
//    console.log("TOKEN:", token);

//     next();
//   } catch (err) {
//   console.log("JWT ERROR:", err.message);
//   return res.status(401).json({ message: "Unauthorized" });
// }
// };

const protect = (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    console.log("COOKIES:", req.cookies);
    console.log("TOKEN:", token);

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED:", decoded); 
    req.userId = decoded.userId;

    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message); 
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = protect;