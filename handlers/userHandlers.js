

const fs = require('fs');
const userDataFilePath = 'users.json';


const getUserById = (req, res) => {
  const { userId } = req.params;
  try {
    
    const userData = JSON.parse(fs.readFileSync(userDataFilePath, 'utf8'));

   
    const user = userData.find(user => user.userId === userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    res.json({ ...user, username: user.username });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getUserById };

