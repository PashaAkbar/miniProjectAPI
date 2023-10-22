const express = require('express');
const mongoose = require('mongoose');
const Poem = require('./models/poems');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000 ;

app.use(express.json());

dbUsername = process.env.DBNAME
dbPass = process.env.DBPASS


mongoose.connect(`mongodb+srv://${dbUsername}:${dbPass}@cluster0.vryvufw.mongodb.net/node-poem?retryWrites=true&w=majority`)
  .then(() => {
    console.log('Connected to MongoDB!');
    app.listen(port, () => {
      console.log(`App is running on http://localhost:${port}`);
    });
  })
  .catch(error => {
    console.error('Failed to connect to MongoDB:', error);
  });

app.get('/', (req, res) => {
  res.send("This is an Express.js Poem app");
});

app.get('/poems', async (req, res) => {
  try {
    const poems = await Poem.find({});
    res.status(200).json(poems);
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/poem/random', async (req, res) => {
  try {
    const count = await Poem.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const randomData = await Poem.findOne().skip(randomIndex);
    if (!randomData) {
      return res.status(404).json({ error: 'No data found' });
    }
    res.json(randomData);
  } catch (error) {
    handleError(res, error);
  }
});

app.post('/poem/create', async (req, res) => {
  try {
    const poem = await Poem.create(req.body);
    res.status(200).json(poem);
  } catch (error) {
    handleError(res, error);
  }
});

app.delete('/poem/:id', async (req, res) => {
    const poemId = req.params.id;
  
    try {
      const deletedPoem = await Poem.findByIdAndDelete(poemId);
  
      if (!deletedPoem) {
        return res.status(404).json({ error: 'Poem not found' });
      }
  
      res.status(200).json({ message: 'Poem deleted successfully', deletedPoem });
    } catch (error) {
      handleError(res, error);
    }
  });

function handleError(res, error) {
  console.error(error.message);
  res.status(500).json({ message: error.message });
}
