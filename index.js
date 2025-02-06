require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import the MenuItem model
const MenuItem = require('./models/menuItem');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Add Menu Item (Create)
app.post('/menu', async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const newItem = new MenuItem({ name, description, price });
    const savedItem = await newItem.save();
    res.status(201).json({ message: "Item created successfully", item: savedItem });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// Get All Menu Items (Read)
app.get('/menu', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// Update Menu Item
app.put('/menu/:id', async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { name, description, price },
      { new: true, runValidators: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json({ message: "Item updated successfully", item: updatedItem });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// Delete Menu Item
app.delete('/menu/:id', async (req, res) => {
  try {
    const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// Start Server
const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server running on port ${port}`));