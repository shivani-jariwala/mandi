const express = require('express');

const controller = require('../controller/controller.js');

const router = express.Router();

router.post('/reports',controller.postReportHandler);
router.get('/reports',controller.getReportHandler); 


module.exports=router;