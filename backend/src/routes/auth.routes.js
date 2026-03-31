const {Router} = require('express');
const authRouter = Router();

const {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController
} = require('../controllers/auth.controller');


const  protect  = require("../middlewares/auth.middleware")


/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public   
 */
authRouter.post('/register', registerUserController);



/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public   
 */
authRouter.post('/login', loginUserController);


/**
 * @route GET /api/auth/logout
 * @desc Logout a user, clear token from user cookie and add the token in blacklist
 * @access Public
 */
authRouter.get('/logout', logoutUserController)



/**
 * @route GET /api/auth/get-me
 * @desc get the current logged in user details
 * @access private
 * 
 */
authRouter.get("/get-me", protect, getMeController)


module.exports = authRouter;