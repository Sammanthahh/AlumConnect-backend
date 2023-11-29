const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Create a new event
router.post('/', eventController.createEvent);

// Get all events
router.get('/', eventController.getAllEvents);

// Get event by ID
router.get('/:id', eventController.getEventById);

// Update event by ID
router.put('/:id', eventController.updateEvent);

// Delete event by ID
router.delete('/:id', eventController.deleteEvent);

// Get events by name, location, and/or date
router.get('/search', eventController.getEventsByFilter);

// Get events by category
router.get('/category/:category', eventController.getEventsByCategory);

router.get('/organized/:organizerId', eventController.getEventsByOrganizer);

// Get events registered by a specific alumni but not organized by them
router.get('/registered-not-organized/:alumniId', eventController.getRegisteredNotOrganizedEvents);


// route for joining an event
router.post('/join', eventController.joinEvent);

router.post('/leave', eventController.leaveEvent);

module.exports = router;
