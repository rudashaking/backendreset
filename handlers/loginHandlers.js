const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 


const userDataFilePath = 'users.json';

const loginHandler = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userData = JSON.parse(fs.readFileSync(userDataFilePath, 'utf8'));
    const user = userData.find(user => user.username === username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const userId = user.userId;

  
    const secretKey = process.env.JWT_SECRET;

   
    const token = jwt.sign({ userId }, secretKey, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', userId, journals: user.journals, token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = loginHandler;

