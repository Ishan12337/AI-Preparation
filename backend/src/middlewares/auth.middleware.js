const jwt = require("jsonwebtoken");




async function authUser(req,res,next){

    const token =
    req.cookies.token ||
    req.headers.authorization?.split(" ")[1];

    console.log("TOKEN:", token); 

    if(!token){
        console.log("❌ No token");
        return res.status(401).json({
            message: "Token not provided"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("DECODED:", decoded); 

        req.user = decoded;
        next();

    }catch(err){
        console.log("JWT ERROR:", err.message); 
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}






async function authenticateToken(req, res, next) {
  try {
    // Get token from cookie OR header
    const token =
      req.cookies.token ||
      (req.headers.authorization &&
        req.headers.authorization.split(" ")[1]);

    console.log("Incoming Cookies:", req.cookies);
    console.log("Token:", token);

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No token",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded:", decoded);

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth Error:", err.message);

    return res.status(401).json({
      message: "Unauthorized - Invalid token",
    });
  }
}

module.exports = { authUser, authenticateToken };


