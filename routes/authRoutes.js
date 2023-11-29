const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register a new alumni
router.post('/register', authController.registerAlumni);

// Login alumni and get a JWT token
router.post('/login', authController.loginAlumni);

module.exports = router;
