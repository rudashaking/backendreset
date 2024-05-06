const { log } = require("console");
const fs = require("fs");
const userDataFilePath = "users.json";

const getJournal = (req, res) => {
  const { id } = req.params;
  try {
    
    const userData = JSON.parse(fs.readFileSync(userDataFilePath, "utf8"));

   
    const user = userData.find((user) => user.userId === id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

   
    res.json(user.journals);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addJournal = (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {

    const userData = JSON.parse(fs.readFileSync(userDataFilePath, "utf8"));

    
    const userIndex = userData.findIndex((user) => user.userId === id);
    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

   
    const newJournal = {
      id: (userData[userIndex].journals.length + 1).toString(), 
      title,
      description: description || "",
      createdAt: new Date().toISOString(),
      entries: [], 
    };

   
    userData[userIndex].journals.push(newJournal);

    
    fs.writeFileSync(userDataFilePath, JSON.stringify(userData, null, 2));

   
    res.status(201).json({ journal: newJournal });
  } catch (error) {
    console.error("Error adding journal:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getJournalEntries = (req, res) => {
  const { userId, id } = req.params;
  try {
  
    const userData = JSON.parse(fs.readFileSync(userDataFilePath, "utf8"));

    
    const user = userData.find((user) => user.userId === userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    const journal = user.journals.find((journal) => journal.id === id);
    if (!journal) {
      return res
        .status(404)
        .json({ message: "Journal not found for this user" });
    }

   
    const journalEntries = journal.entries || [];

 
    res.json(journalEntries);
  } catch (error) {
    console.error("Error fetching journal entries:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addJournalEntry = (req, res) => {
  const { userId, id } = req.params;
  const { title, content } = req.body;
  const createdAt = new Date().toISOString(); 

  try {
    
    const userData = JSON.parse(fs.readFileSync(userDataFilePath, "utf8"));

  
    const userIndex = userData.findIndex((user) => user.userId === userId);
    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    
    const journalIndex = userData[userIndex].journals.findIndex(
      (journal) => journal.id === id
    );
    if (journalIndex === -1) {
      return res
        .status(404)
        .json({ message: "Journal not found for this user" });
    }

    
    if (!userData[userIndex].journals[journalIndex].entries) {
      userData[userIndex].journals[journalIndex].entries = [];
    }

    
    const newEntry = {
      entryId: (
        userData[userIndex].journals[journalIndex].entries.length + 1
      ).toString(),
      title,
      content,
      createdAt,
    };

    
    userData[userIndex].journals[journalIndex].entries.push(newEntry);

    
    fs.writeFileSync(userDataFilePath, JSON.stringify(userData, null, 2));

    
    res.status(201).json({ entry: newEntry });
  } catch (error) {
    console.error("Error adding journal entry:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const deleteJournal = (req, res) => {
  const { userId, id } = req.params;
  try {
   
    let userData = JSON.parse(fs.readFileSync(userDataFilePath, "utf8"));

   
    const userIndex = userData.findIndex((user) => user.userId === userId);
    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    
    const journalIndex = userData[userIndex].journals.findIndex(
      (journal) => journal.id === id
    );
    if (journalIndex === -1) {
      return res
        .status(404)
        .json({ message: "Journal not found for this user" });
    }

    
    userData[userIndex].journals.splice(journalIndex, 1);

    
    fs.writeFileSync(userDataFilePath, JSON.stringify(userData, null, 2));

   
    res.status(200).json({ message: "Journal deleted successfully" });
  } catch (error) {
    console.error("Error deleting journal:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const deleteJournalEntry = (req, res) => {
  const { userId, id, entryId } = req.params;
  try {
    
    let userData = JSON.parse(fs.readFileSync(userDataFilePath, "utf8"));

   
    const userIndex = userData.findIndex((user) => user.userId === userId);
    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

   
    const journalIndex = userData[userIndex].journals.findIndex(
      (journal) => journal.id === id
    );
    if (journalIndex === -1) {
      return res
        .status(404)
        .json({ message: "Journal not found for this user" });
    }

    
    const entryIndex = userData[userIndex].journals[
      journalIndex
    ].entries.findIndex((entry) => entry.entryId === entryId);
    if (entryIndex === -1) {
      return res
        .status(404)
        .json({ message: "Journal entry not found for this user and journal" });
    }

   
    userData[userIndex].journals[journalIndex].entries.splice(entryIndex, 1);

   
    fs.writeFileSync(userDataFilePath, JSON.stringify(userData, null, 2));

   
    res.status(200).json({ message: "Journal entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting journal entry:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getJournal,
  addJournal,
  getJournalEntries,
  addJournalEntry,
  deleteJournal,
  deleteJournalEntry,
};
