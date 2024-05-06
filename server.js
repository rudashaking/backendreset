const express = require('express');
const bodyParser = require('body-parser');
const loginHandler = require('./handlers/loginHandlers');
const journalHandler = require('./handlers/journalHandlers');
const signupHandler = require('./handlers/signupHandlers');
const userHandlers = require('./handlers/userHandlers');
const moodHandler = require('./handlers/moodHandler');
const cors = require('cors');
const app = express();
const PORT =  8080;
app.use(cors());
app.use(bodyParser.json());

app.use('/moods/:mood', moodHandler);
app.get('/users/:userId', userHandlers.getUserById);
app.post('/login', loginHandler);
app.post('/signup', signupHandler);
app.get('/journals/:id', journalHandler.getJournal);
app.get('/journals/:userId/:id/entries', journalHandler.getJournalEntries);
app.post('/journals/:id', journalHandler.addJournal);
app.put('/journals/:userId/:id/entries', journalHandler.addJournalEntry);
app.delete('/journals/:userId/:id', journalHandler.deleteJournal); 
app.delete('/journals/:userId/:id/entries/:entryId', journalHandler.deleteJournalEntry);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
