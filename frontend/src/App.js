import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Todo from './components/Todo';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [showRegister, setShowRegister] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (token) fetchTodos();
  }, [token]);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/todos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addTodo = async () => {
    if (!text) return;
    try {
      await axios.post(`${API_URL}/api/todos`, { text }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setText('');
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      await axios.patch(`${API_URL}/api/todos/${id}`, { completed: !completed }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const updateTodo = async (id, newText) => {
    try {
      await axios.patch(`${API_URL}/api/todos/${id}`, { text: newText }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  if (!token) {
    return showRegister ? (
      <Register setToken={(t) => { setToken(t); localStorage.setItem('token', t); }} setShowRegister={setShowRegister} />
    ) : (
      <Login setToken={(t) => { setToken(t); localStorage.setItem('token', t); }} setShowRegister={setShowRegister} />
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Todo App</h1>
      <button onClick={handleLogout}>Logout</button>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new todo"
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo) => (
          <Todo
            key={todo._id}
            todo={todo}
            toggleComplete={toggleComplete}
            deleteTodo={deleteTodo}
            updateTodo={updateTodo}
          />
        ))}
      </ul>
    </div>
  );
}

export default App;