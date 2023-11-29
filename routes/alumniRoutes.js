const express = require('express');
const router = express.Router();
const alumniController = require('../controllers/alumniController');

// Create a new alumni
router.post('/', alumniController.createAlumni);

// Get all alumni
router.get('/', alumniController.getAllAlumni);

// Get alumni by ID
router.get('/:id', alumniController.getAlumniById);

// Update alumni by ID
router.put('/:id', alumniController.updateAlumni);

// Delete alumni by ID
router.delete('/:id', alumniController.deleteAlumni);

//Get alumni by username
router.get('/username/:username', alumniController.getAlumniByUsername);

module.exports = router;
