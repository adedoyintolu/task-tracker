import React from "react";
import { useState, useEffect } from "react"
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Header from "./components/Header";
import Footer from "./components/footer";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import About from "./components/About";



function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTask] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTask(tasksFromServer)
    }
    getTasks()
  }, [])



  //Fetch Tasks

  const fetchTasks = async () => {
    const response = await fetch('http://localhost:5500/tasks')
    const data = await response.json();
    return data
  }


  //Fetch Task

  const fetchTask = async (id) => {
    const response = await fetch(`http://localhost:5500/tasks/${id}`)
    const data = await response.json();
    return data
  }


  //Add Task
  const addTask = async (task) => {
    const response = await fetch('http://localhost:5500/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    const data = await response.json()
    setTask([...tasks, data])

    // const id = Math.floor(Math.random() * 10000) + 1;
    // const newTask = { id, ...task };
    // setTask([...tasks, newTask])
  }


  //Delete Task

  const deleteTask = async (id) => {

    await fetch(`http://localhost:5500/tasks/${id}`, {
      method: 'DELETE',
    })
    setTask(tasks.filter((task) => task.id !== id))
  }

  //Toggle reminder

  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updTask = {
      ...taskToToggle,
      reminder: !taskToToggle.reminder
    }
    const res = await fetch(`http://localhost:5500/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updTask)
    })
    const data = await res.json()
    setTask(tasks.map((task) => task.id === id ? { ...task, reminder: data.reminder } : task))
  }


  return (
    <Router>
      <div className="container">
        <Route path='/' exact render={(props) => (
          <>
            {showAddTask && <AddTask onAdd={addTask} />}
            <Header title='Task Tracker' onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />
            {
              tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} reminder={toggleReminder} /> : 'No Tasks To Show'
            }
          </>
        )} />
        <Route path='/about' component={About} />
        <Footer />
      </div>
    </Router>

  );
}

export default App;
