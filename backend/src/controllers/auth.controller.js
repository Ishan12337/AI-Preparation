const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");
const emailService = require("../services/email.service");


/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
// async function registerUserController(req, res) {
//   try {
//     let { username, email, password } = req.body;

//     if (!username || !email || !password) {
//       return res.status(400).json({
//         message: "All fields are required",
//       });
//     }

//     email = email.toLowerCase();

//     const existingUser = await userModel.findOne({
//       $or: [{ email }, { username }],
//     });

//     if (existingUser) {
//       return res.status(409).json({
//         message: "User already exists",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new userModel({
//       username,
//       email,
//       password: hashedPassword,
//     });

//     await newUser.save();

//     const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

   
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax",
//       maxAge: 24 * 60 * 60 * 1000,
//     });


//     res.status(201).json({
//       message: "User registered successfully",
//       user: {
//         id: newUser._id,
//         username: newUser.username,
//         email: newUser.email,
//       },
//     });
      
//     await emailService.sendRegisterUserEmail(newUser.email, newUser.username);



//   } catch (error) {
//     console.error("Register Error:", error);

//     res.status(500).json({
//       message: "Server error",
//       error: error.message,
//     });
//   }
// }

async function registerUserController(req, res) {
  try {
    let { username, email, password } = req.body;

    // ✅ Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    username = username.trim();
    email = email.toLowerCase().trim();

    // ✅ Check if user already exists
    const existingUser = await userModel.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user
    const newUser = new userModel({ username, email, password: hashedPassword });

    try {
      await newUser.save();
    } catch (err) {
      // Handle duplicate key race conditions
      if (err.code === 11000) {
        return res.status(409).json({ message: "Email or username already exists" });
      }
      throw err;
    }

    // ✅ Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // ✅ Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // ✅ Send response first
    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser._id, username: newUser.username, email: newUser.email },
    });

    // ✅ Send welcome email asynchronously
    emailService.sendRegisterUserEmail(newUser.email, newUser.username)
      .catch(err => console.error("Email send failed:", err));

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}


























/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
async function loginUserController(req, res) {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    email = email.toLowerCase();

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });


    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });




    res.status(200).json({
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

/**
 * @route GET /api/auth/logout
 * @desc logout user
 * @access Public
 */

async function logoutUserController(req, res) {
  // const token = req.cookie.token;
  const token = req.cookies.token;

  if (token) {
    await tokenBlacklistModel.create({ token });
  }

  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.status(200).json({
    message: "User logged out successfully",
  });

}

/**
 * @name getMeController
 * @desc get the current logged in user details.
 * @access private
 */

const getMeController = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
};
