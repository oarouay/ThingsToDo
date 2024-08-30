import React, { useState } from 'react';
import Axios from 'axios';
import { X } from 'lucide-react';

function AITodoListGenerator({ onClose, onListGenerated }) {
  const [topic, setTopic] = useState('');
  const [numberOfTasks, setNumberOfTasks] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await Axios.post("http://localhost:3000/auth/generate-todo", { topic, numberOfTasks });
      if (response.data.status) {
        onListGenerated(response.data.todoList);
        onClose();
      } else {
        setError('Failed to generate todo list. Please try again.');
      }
    } catch (err) {
      setError('Failed to generate todo list. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='popup'>
      <div className='popup-inner'>
        <button className='close-btn' onClick={onClose}><X /></button>
        <h2>Generate AI Todo List</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="topic">Topic:</label>
            <input 
              type="text" 
              id="topic" 
              value={topic} 
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="numberOfTasks">Number of Tasks:</label>
            <input 
              type="number" 
              id="numberOfTasks" 
              value={numberOfTasks} 
              onChange={(e) => setNumberOfTasks(parseInt(e.target.value))}
              min="1"
              max="10"
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Todo List'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default AITodoListGenerator;