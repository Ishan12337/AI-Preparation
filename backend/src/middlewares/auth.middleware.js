
const jwt = require("jsonwebtoken")
const tokenBlicklistModel = require("../models/blacklist.model")


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

module.exports = {
    authUser
}


