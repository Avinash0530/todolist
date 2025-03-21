const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); 
const app = express();
const PORT = 3000;
app.use(bodyParser.json());
app.use(cors());
mongoose.connect('mongodb://localhost:27017/todolist', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const taskSchema = new mongoose.Schema({
  text: String,
  completed: { type: Boolean, default: false },
});
const Task = mongoose.model('Task', taskSchema);
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});
app.post('/tasks', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Task text is required' });
  }
  try {
    const newTask = new Task({ text });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add task' });
  }
});
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { completed },
      { new: true }
    );
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});