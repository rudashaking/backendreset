const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const moodsFilePath = path.join(__dirname, '../moodData.json');


const getRandomIndex = (max) => {
  return Math.floor(Math.random() * max);
};


const getMoodHandler = (req, res) => {
  const { mood } = req.params;

  try {
    const moodsData = JSON.parse(fs.readFileSync(moodsFilePath, 'utf8'));
    const moodObjects = moodsData[mood];
    if (moodObjects) {
  
      const randomIndex = getRandomIndex(moodObjects.length);
      const selectedMoodObject = moodObjects[randomIndex];
      res.json(selectedMoodObject);
    } else {
      res.status(404).json({ message: 'Mood not found' });
    }
  } catch (error) {
    console.error('Error reading mood data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = getMoodHandler;
