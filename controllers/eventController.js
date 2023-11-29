const Event = require('../models/EventModel');
const Alumni = require('../models/AlumniModel');

const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, category, organizer,image } = req.body;

    const newEvent = new Event({
      title,
      description,
      date,
      location,
      category,
      organizer,
      image
    });

    await newEvent.save();

    res.status(201).json({ message: 'Event created successfully' , event: newEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating event' });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting events list' });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting event by ID' });
  }
};

const updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating event' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting event' });
  }
};

const getEventsByFilter = async (req, res) => {
  try {
    const { name, location, date } = req.query;
    const filter = {};

    if (name) {
      filter.title = { $regex: new RegExp(name, 'i') };
    }

    if (location) {
      filter.location = { $regex: new RegExp(location, 'i') };
    }

    if (date) {
      filter.date = { $gte: new Date(date) };
    }

    const events = await Event.find(filter);
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting events by filter' });
  }
};

const getEventsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // Validate the category against the allowed values
    const allowedCategories = ['professional development', 'networking', 'campus events'];
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Fetch events by category
    const events = await Event.find({ category });

    // Extract day and month from each event's date
    const formattedEvents = events.map(event => ({
      ...event._doc,
      date: event.date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
    }));

    res.status(200).json(formattedEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting events by category' });
  }
};

const getEventsByOrganizer = async (req, res) => {
  try {
    const { organizerId } = req.params;

    // Fetch events organized by the specified alumni
    const events = await Event.find({ organizer: organizerId });

    // Extract day and month from each event's date
    const formattedEvents = events.map(event => ({
      ...event._doc,
      date: event.date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
    }));

    res.status(200).json(formattedEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting events by organizer' });
  }
};


const getRegisteredNotOrganizedEvents = async (req, res) => {
  try {
    const { alumniId } = req.params;

    // Fetch events registered by the alumni but not organized by them
    const events = await Event.find({ participants: alumniId, organizer: { $ne: alumniId } });

    // Extract day and month from each event's date
    const formattedEvents = events.map(event => ({
      ...event._doc,
      date: event.date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
    }));

    res.status(200).json(formattedEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting registered events not organized by alumni' });
  }
};


// Controller function to join an event
const joinEvent = async (req, res) => {
  try {
    const { eventId, userId } = req.body;

    // Check if the user and event exist
    const user = await Alumni.findById(userId);
    const event = await Event.findById(eventId);

    if (!user || !event) {
      return res.status(404).json({ message: 'User or event not found' });
    }

    // Check if the user is already a participant
    if (event.participants.includes(userId)) {
      return res.status(400).json({ message: 'User is already a participant in this event' });
    }

    // Add the user to the event's participants
    event.participants.push(userId);
    await event.save();

    res.status(200).json({ message: 'User successfully joined the event' });
  } catch (error) {
    console.error('Error joining event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Controller function to leave an event
const leaveEvent = async (req, res) => {
  try {
    const { eventId, userId } = req.body;

    // Check if the user and event exist
    const user = await Alumni.findById(userId);
    const event = await Event.findById(eventId);

    if (!user || !event) {
      return res.status(404).json({ message: 'User or event not found' });
    }

    // Check if the user is a participant in the event
    const participantIndex = event.participants.indexOf(userId);
    if (participantIndex === -1) {
      return res.status(400).json({ message: 'User is not a participant in this event' });
    }

    // Remove the user from the event's participants
    event.participants.splice(participantIndex, 1);
    await event.save();

    res.status(200).json({ message: 'User successfully left the event' });
  } catch (error) {
    console.error('Error leaving event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent ,getEventsByFilter ,getEventsByCategory,getEventsByOrganizer,getRegisteredNotOrganizedEvents,joinEvent , leaveEvent};
