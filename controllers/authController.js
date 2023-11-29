const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Alumni = require('../models/AlumniModel');

const registerAlumni = async (req, res) => {
  try {
    const { username, password, email , role} = req.body;

    // Check if the username or email is already taken
    const existingAlumni = await Alumni.findOne({ $or: [{ username }, { email }] });
    if (existingAlumni) {
      return res.status(400).json({ message: 'Username or email already in use' });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAlumni = new Alumni({
      username,
      password: hashedPassword,
      email,
      role
    });

    await newAlumni.save();

    res.status(201).json({ message: 'Alumni registered successfully', user: newAlumni });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering alumni' });
  }
};

const loginAlumni = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the alumni with the provided username exists
    const alumni = await Alumni.findOne({ username });
    if (!alumni) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, alumni.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const JWT_SECRET ='QWERTTYWUWIW'
    // Create a JWT token
    const token = jwt.sign({ username: alumni.username, id: alumni._id }, JWT_SECRET, { expiresIn: '900h' });

    res.status(200).json({ token, message: 'Alumni logged in successfully',user: alumni });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in alumni' });
  }
};

module.exports = { registerAlumni, loginAlumni };
