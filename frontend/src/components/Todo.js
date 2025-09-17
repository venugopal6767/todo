import React, { useState } from 'react';

function Todo({ todo, toggleComplete, deleteTodo, updateTodo }) {
  const [editing, setEditing] = useState(false);
  const [newText, setNewText] = useState(todo.text);

  const handleUpdate = () => {
    updateTodo(todo._id, newText);
    setEditing(false);
  };

  return (
    <li style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
      {editing ? (
        <>
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          {todo.text}
          <button onClick={() => toggleComplete(todo._id, todo.completed)}>
            {todo.completed ? 'Undo' : 'Complete'}
          </button>
          <button onClick={() => setEditing(true)}>Edit</button>
          <button onClick={() => deleteTodo(todo._id)}>Delete</button>
        </>
      )}
    </li>
  );
}

export default Todo;