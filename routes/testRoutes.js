const express =require('express');
const { testController } = require('../controllers/testControllers');

const router=express.Router();

router.get('/',testController)

module.exports=router;