import { useState, useEffect } from 'react';
import Axios from 'axios';
import './list.css';
import AddList from './addlist';
import { X } from 'lucide-react';
import './sup.css';
import {fetchUserTodos} from '../Service/GetTodoList'
function List() {
  const [showPopup, setShowPopup] = useState(false);
  const [todoLists, setTodoLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPopup, setTaskPopup] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiNumberOfTasks, setAiNumberOfTasks] = useState(5);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  Axios.defaults.withCredentials = true;

  const loadTodos = async () => {
    const result = await fetchUserTodos();
    if (result.success) {
      setTodoLists(result.data);
    } else {
      console.error(result.error);
    }
  };
  useEffect(() => {
    loadTodos();
  }, []);
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleTitleClick = (list) => {
    setSelectedList(list);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setTaskPopup(true);
  };

  const handleAddTask = () => {

    if (!selectedList) return;

    Axios.post(`http://localhost:3000/auth/todo/${selectedList._id}/task`, {
      title: taskTitle,
    })
      .then(response => {
        if (response.data.status) {
          loadTodos();
          setSelectedList(todoLists.find(todo => todo._id === selectedList._id))
          setTaskTitle('');
        } else {
          console.error("Failed to add task");
        }
      })
      .catch(error => {
        console.error("Error adding task:", error);
      });
  };

  const handleToggleTaskCompletion = (task) => {
    Axios.put(`http://localhost:3000/auth/todo/${selectedList._id}/task/${task._id}`, {
      completed: !task.completed,
    })
      .then(response => {
        if (response.data.status) {
          loadTodos();
          setSelectedList(todoLists.find(todo => todo._id === selectedList._id))
          setTaskPopup(false);
        } else {
          console.error("Failed to update task");
        }
      })
      .catch(error => {
        console.error("Error updating task:", error);
      });
  };

  const handleAIGenerateList = async (e) => {
    e.preventDefault();
    setAiLoading(true);
    setAiError(null);

    try {
      const response = await Axios.post("http://localhost:3000/auth/generate-todo", { 
        topic: aiTopic, 
        numberOfTasks: aiNumberOfTasks 
      });
      if (response.data.status) {
        setTodoLists([...todoLists, response.data.todoList]);
        setShowAIGenerator(false);
        setAiTopic('');
        setAiNumberOfTasks(5);
      } else {
        setAiError('Failed to generate todo list. Please try again.');
      }
    } catch (err) {
      setAiError('Failed to generate todo list. Please try again.');
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <>
      <div className='bydo'>
        <div className='sidebar'>
          <div className='button-19'>
          <button className='button-18' onClick={togglePopup}>Add List</button>
          <button className='button-18' onClick={() => setShowAIGenerator(true)}>Generate AI List</button>
          </div>
          <ul>
            {todoLists.map((list, index) => (
              <li key={index} onClick={() => handleTitleClick(list)}>
                {list.name}
              </li>
            ))}
          </ul>
        </div>
        <div className='center'>
          {selectedList ? (
            <>
              <div>
                <h1>{selectedList.name}</h1>
                <p>{selectedList.description}</p>
                <ul>
                  {selectedList.list.map((task, index) => (
                    <li key={index} onClick={() => handleTaskClick(task)}>
                      {task.title} - {task.completed ? 'Completed' : 'Not Completed'}
                    </li>
                  ))}
                </ul>
                <br />
                <div >
                <div className="input-box">
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="New Task"
                  />
                  </div>
                  <button className='button-18' onClick={handleAddTask}>Add Task</button>
                </div>
              </div>
            </>
          ) : (
            <h1>Select a to-do list to see tasks</h1>
          )}
        </div>
      </div>
      {showPopup && (
        <div className='popup'>
          <div className='popup-inner'>
            <button className='close-btn' onClick={togglePopup}><X /></button>
            <AddList />
          </div>
        </div>
      )}
      {taskPopup && selectedTask && (
        <div className='popup'>
          <div className='wrapper'>
            <button className='close-btn' onClick={() => setTaskPopup(false)}><X /></button>
            <h2>{selectedTask.title}</h2>
            <p>Completed: {selectedTask.completed ? 'Yes' : 'No'}</p>
            <button onClick={() => handleToggleTaskCompletion(selectedTask)}>
              Mark as {selectedTask.completed ? 'Not Completed' : 'Completed'}
            </button>
          </div>
        </div>
      )}
      {showAIGenerator && (
        <div className='popup'>
          <div className='wrapper'>
            <button className='close-btn' onClick={() => setShowAIGenerator(false)}><X /></button>
            <h1>Generate AI Todo List</h1>
            <form onSubmit={handleAIGenerateList}>
              <div className="input-box">
                <input 
                  type="text" 
                  placeholder="Topic"
                  id="aiTopic" 
                  value={aiTopic} 
                  onChange={(e) => setAiTopic(e.target.value)}
                  required
                />
              </div>
              <div className="input-box">
                <input 
                  type="number" 
                  placeholder="Number of Tasks"
                  id="aiNumberOfTasks" 
                  value={aiNumberOfTasks} 
                  onChange={(e) => setAiNumberOfTasks(parseInt(e.target.value))}
                  min="1"
                  max="10"
                  required
                />
              </div>
              <button className="btn" type="submit" disabled={aiLoading}>
                {aiLoading ? 'Generating...' : 'Generate Todo List'}
              </button>
            </form>
            {aiError && <p className="error">{aiError}</p>}
          </div>
        </div>
      )}
    </>
  );
}

export default List;