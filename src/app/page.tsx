// Add 'use client' to ensure this is a client-side component
'use client';

import { useState, useEffect, ChangeEvent } from 'react';

// Interface for Todo item
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState<string>('');

  // Fetch todos when the component is mounted
  useEffect(() => {
    fetchTodos();
  }, []);

  // Function to fetch todos from the backend
  const fetchTodos = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/todos');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  // Function to add a new todo
  const addTodo = async () => {
    if (!title.trim()) return;
    try {
      const response = await fetch('http://127.0.0.1:5000/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      const newTodo: Todo = await response.json();
      setTodos((prev) => [...prev, newTodo]);
      setTitle('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  // Function to toggle the completion status of a todo
  const toggleComplete = async (id: number, completed: boolean) => {
    try {
      await fetch(`http://127.0.0.1:5000/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed }),
      });
      fetchTodos();
    } catch (error) {
      console.error('Error toggling complete:', error);
    }
  };

  // Function to delete a todo
  const deleteTodo = async (id: number) => {
    try {
      await fetch(`http://127.0.0.1:5000/todos/${id}`, {
        method: 'DELETE',
      });
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // Handle input change for the new todo title
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">To-Do List</h1>
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <input
          type="text"
          value={title}
          onChange={handleInputChange}
          placeholder="Enter new task"
          className="border p-3 rounded-lg w-full sm:w-96"
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg mt-4 sm:mt-0 sm:ml-4"
        >
          Add Task
        </button>
      </div>
      <div className="w-full sm:w-96 bg-white p-4 rounded-lg shadow-md">
        <ul className="space-y-4">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`flex justify-between items-center ${
                todo.completed ? 'text-gray-400 line-through' : ''
              }`}
            >
              <span>{todo.title}</span>
              <div className="space-x-4">
                <button
                  onClick={() => toggleComplete(todo.id, todo.completed)}
                  className="text-green-500 hover:text-green-700"
                >
                  {todo.completed ? 'Undo' : 'Complete'}
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
