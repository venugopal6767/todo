const express = require('express');
const promClient = require('prom-client');
const Todo = require('../models/Todo');

const todosCreatedTotal = promClient.register.getSingleMetric('todos_created_total');
const todosDeletedTotal = promClient.register.getSingleMetric('todos_deleted_total');

const router = express.Router();

// Get all todos for user
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.userId });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a todo
router.post('/', async (req, res) => {
  const todo = new Todo({ text: req.body.text, userId: req.user.userId });
  try {
    const newTodo = await todo.save();
    todosCreatedTotal.inc({ code: res.statusCode });
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a todo
router.patch('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    if (req.body.text != null) todo.text = req.body.text;
    if (req.body.completed != null) todo.completed = req.body.completed;

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a todo
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    todosDeletedTotal.inc({ code: res.statusCode });
    res.json({ message: 'Deleted todo' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;