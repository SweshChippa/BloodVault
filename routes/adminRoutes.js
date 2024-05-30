const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {getDonarListController, getHospitalListController, getOrgListController, deleteDonarController} =require('../controllers/adminController');
const adminMiddleware = require('../middlewares/adminMiddleware');
// Router Object
const router = express.Router();
// Routes

// get || Donar List
router.get('/donar-list',authMiddleware,adminMiddleware, getDonarListController);

// get || Hospital List
router.get('/hospital-list',authMiddleware,adminMiddleware, getHospitalListController);

// get || organisation List
router.get('/org-list',authMiddleware,adminMiddleware, getOrgListController);

// ==========================================

// Delete Donar || Get

router.delete('/delete-donar/:id',authMiddleware,adminMiddleware, deleteDonarController);


// export

module.exports=router;