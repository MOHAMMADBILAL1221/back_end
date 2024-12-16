const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

process.emitWarning = () => {};

// MongoDB connection
mongoose
  .connect('mongodb+srv://bilal:active_123@cluster2.j5w8v.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

// Define Schema and Model
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const Todo = mongoose.model('Todo', todoSchema);


// API routes
// Fetch all todos
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    console.log(todos)
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// Add a new todo
app.post('/todos', async (req, res) => {
  try {
    const todo = new Todo({
      title: req.body.title,
      completed: false,
    });
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add todo' });
  }
});

// Update a todo (edit title or toggle completed status)
app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  try {
    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (completed !== undefined) updateFields.completed = completed;

    const todo = await Todo.findByIdAndUpdate(id, updateFields, { new: true });
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// Delete a todo
app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findByIdAndDelete(id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// Start the server
app.listen(5000, () => console.log('http://localhost:5000'));
