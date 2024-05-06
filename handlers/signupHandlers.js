const fs = require('fs');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const userDataFilePath = 'users.json';

const signupHandler = async (req, res) => {
  const { username, password } = req.body;

  try {
  
    const userData = JSON.parse(fs.readFileSync(userDataFilePath, 'utf8'));

  
    const existingUser = userData.find(user => user.username === username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

   
    const userId = uuid.v4();

  
    const hashedPassword = await bcrypt.hash(password, 10);

   
    const newUser = {
      userId,
      username,
      password: hashedPassword,
      journals: [] 
    };

  
    userData.push(newUser);


    fs.writeFileSync(userDataFilePath, JSON.stringify(userData, null, 2));

 
    res.status(201).json({ message: 'User created successfully', userId });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = signupHandler;
