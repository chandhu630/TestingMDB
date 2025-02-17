"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [todos, setTodos] = useState<{ _id: string; title: string; completed: boolean }[]>([]);
  const [newTodo, setNewTodo] = useState("");

  // Fetch todos
  useEffect(() => {
    const fetchTodos = async () => {
      const res = await fetch("/api/todos");
      const data = await res.json();
      setTodos(data);
    };
    fetchTodos();
  }, []);

  // Add todo
  const addTodo = async () => {
    if (!newTodo.trim()) return;
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTodo }),
    });
    const data = await res.json();
    setTodos([...todos, data]);
    setNewTodo("");
  };

  // Delete todo
  const deleteTodo = async (id: string) => {
    await fetch("/api/todos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setTodos(todos.filter((todo) => todo._id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10">
      <h1 className="text-3xl font-bold">To-Do List</h1>
      <div className="mt-5 flex space-x-2">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="border p-2 rounded w-80"
          placeholder="Add a new task"
        />
        <button onClick={addTodo} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>

      <ul className="mt-5 w-96">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="bg-white p-3 rounded shadow flex justify-between items-center mt-2"
          >
            <span>{todo.title}</span>
            <button
              onClick={() => deleteTodo(todo._id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
