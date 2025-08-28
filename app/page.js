"use client";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const page = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [editTodo, setEditTodo] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/Todo");
      const data = await response.json();
      console.log(data);
      setTodos(data.todos);
    } catch (error) {
      toast.error("Failed to fetch todos");
    }
  };

  const addTodo = async () => {
    if (!newTodo.title || !newTodo.description) {
      toast.error("Title and description are required");
      return;
    }
    try {
      const response = await fetch("/api/Todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });
      const data = await response.json();
      setTodos([...todos, data.todo]);
      setNewTodo({
        title: "",
        description: "",
      });
      toast.success("Todo added successfully");
    } catch (error) {
      toast.error("Failed to add todo");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`/api/Todo/${id}`, {
        method: "DELETE",
      });
      setTodos(todos.filter((todo) => todo._id !== id));
      toast.success("Todo deleted successfully");
    } catch (error) {
      toast.error("Failed to delete todo");
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditTodo({ title: todo.title, description: todo.description });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTodo({ title: "", description: "" });
  };

  const updateTodo = async (id) => {
    if (!editTodo.title || !editTodo.description) {
      toast.error("Title and description are required");
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`/api/Todo/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editTodo),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setTodos(todos.map((todo) => 
          todo._id === id ? data.todo : todo
        ));
        setEditingId(null);
        setEditTodo({ title: "", description: "" });
        toast.success("Todo updated successfully");
      } else {
        toast.error(data.error || "Failed to update todo");
      }
    } catch (error) {
      toast.error("Failed to update todo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent mb-4">
            ✨ My Todo List
          </h1>
          <p className="text-gray-300 text-lg">Organize your tasks with style</p>
        </div>
        {/* add to form */}
        <div className="bg-gradient-to-r from-white to-gray-50 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 mb-10">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            ➕ Create New Task
          </h2>
          <div className="space-y-6">
            <div className="relative">
              <input
                type="text"
                placeholder="What needs to be done?"
                className="w-full border-2 border-purple-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 p-4 rounded-xl text-gray-700 bg-white/80 backdrop-blur-sm transition-all duration-300 placeholder-gray-400"
                value={newTodo.title}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, title: e.target.value })
                }
              />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Add some details..."
                className="w-full border-2 border-purple-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 p-4 rounded-xl text-gray-700 bg-white/80 backdrop-blur-sm transition-all duration-300 placeholder-gray-400"
                value={newTodo.description}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, description: e.target.value })
                }
              />
            </div>
            <button
              onClick={addTodo}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 hover:from-purple-700 hover:via-pink-700 hover:to-red-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>✨ Add Task</span>
            </button>
          </div>
        </div>
        
        {/* Todo List */}
        <div className="space-y-6">
          {todos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-300 text-xl">No tasks yet. Create your first one above!</p>
            </div>
          ) : (
            todos.map((todo, index) => (
              <div
                key={todo._id}
                className="group bg-gradient-to-r from-white/95 to-gray-50/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
              >
                {editingId === todo._id ? (
                  // Edit Mode
                  <div className="space-y-6">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Update title..."
                        className="w-full border-2 border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-200 p-4 rounded-xl text-gray-700 bg-white/90 backdrop-blur-sm transition-all duration-300"
                        value={editTodo.title}
                        onChange={(e) =>
                          setEditTodo({ ...editTodo, title: e.target.value })
                        }
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Update description..."
                        className="w-full border-2 border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-200 p-4 rounded-xl text-gray-700 bg-white/90 backdrop-blur-sm transition-all duration-300"
                        value={editTodo.description}
                        onChange={(e) =>
                          setEditTodo({ ...editTodo, description: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => updateTodo(todo._id)}
                        disabled={loading}
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "💾 Saving..." : "✅ Save"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                          {todo.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-base leading-relaxed ml-11">
                        {todo.description}
                      </p>
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button 
                        onClick={() => startEdit(todo)}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
                        title="Edit task"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => deleteTodo(todo._id)}
                        className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
                        title="Delete task"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
