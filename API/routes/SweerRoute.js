const express = require('express');
const router = express.Router();

const { create ,get} = require('../controllers/SweetController');

router.post('/create', create);
router.put('/update', create);
router.get('/getstatus', get);

module.exports = router;