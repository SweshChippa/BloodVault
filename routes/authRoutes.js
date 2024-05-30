const express =require('express')
const { registerController, loginController, currentUserController } = require('../controllers/authController')
const  authMiddleWare  = require('../middlewares/authMiddleware')

const router =express.Router()
// Register
router.post('/register',registerController);

// Login
router.post('/login',loginController)

// Get current user 
router.get('/current-user',authMiddleWare,currentUserController)

module.exports=router;
