const Alumni = require('../models/AlumniModel');

const createAlumni = async (req, res) => {
  try {
    const newAlumni = await Alumni.create(req.body);
    res.status(201).json(newAlumni);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating alumni' });
  }
};

const getAllAlumni = async (req, res) => {
  try {
    const alumniList = await Alumni.find();
    res.status(200).json(alumniList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting alumni list' });
  }
};

const getAlumniById = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id);
    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }
    res.status(200).json(alumni);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting alumni by ID' });
  }
};

const updateAlumni = async (req, res) => {
  try {
    const updatedAlumni = await Alumni.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAlumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }
    res.status(200).json(updatedAlumni);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating alumni' });
  }
};

const deleteAlumni = async (req, res) => {
  try {
    const deletedAlumni = await Alumni.findByIdAndDelete(req.params.id);
    if (!deletedAlumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }
    res.status(200).json({ message: 'Alumni deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting alumni' });
  }
};



const getAlumniByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const alumni = await Alumni.findOne({ username });

    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }

    res.status(200).json(alumni);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting alumni by username' });
  }
};


module.exports = { createAlumni, getAllAlumni, getAlumniById, updateAlumni, deleteAlumni , getAlumniByUsername};
