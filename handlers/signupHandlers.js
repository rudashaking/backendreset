const fs = require('fs');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const userDataFilePath = 'users.json';

const signupHandler = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Read existing user data from JSON file
    const userData = JSON.parse(fs.readFileSync(userDataFilePath, 'utf8'));

    // Check if the username already exists
    const existingUser = userData.find(user => user.username === username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Generate UUID for the new user
    const userId = uuid.v4();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = {
      userId,
      username,
      password: hashedPassword,
      journals: [] // Initialize journals array for the user
    };

    // Add the new user to the user data array
    userData.push(newUser);

    // Write updated user data back to JSON file
    fs.writeFileSync(userDataFilePath, JSON.stringify(userData, null, 2));

    // Respond with success message and user ID
    res.status(201).json({ message: 'User created successfully', userId });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = signupHandler;
