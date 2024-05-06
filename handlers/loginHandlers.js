const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userDataFilePath = 'users.json';

const loginHandler = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Read user data from JSON file
    const userData = JSON.parse(fs.readFileSync(userDataFilePath, 'utf8'));

    // Find the user by username
    const user = userData.find(user => user.username === username);

    // If user is not found or password is incorrect, return error response
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Extract userId from the user object
    const userId = user.userId;

    // Generate JWT token with the correct userId
    const token = jwt.sign({ userId }, 'secret_key', { expiresIn: '1h' });

    // Respond with success message, user ID, and journals
    res.status(200).json({ message: 'Login successful', userId, journals: user.journals, token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = loginHandler;

