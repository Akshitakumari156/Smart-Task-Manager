import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  CheckCircle,
  PlusCircle,
  Trash2,
  X,
} from "lucide-react";

export default function ManagerTask() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Create login page",
      description: "Design a beautiful dark login screen with 3D animations",
      priority: "High",
      status: "In Progress",
      dueDate: "2025-09-10",
      subtasks: [
        { title: "Wireframe UI", completed: true },
        { title: "Implement with React", completed: false },
      ],
      assignedTo: ["Akshita", "John"],
      createdBy: "Akshita",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Low",
    status: "To Do",
    dueDate: "",
    subtasks: [{ title: "", completed: false }],
    assignedTo: "",
  });

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleSubtask = (taskId, index) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((sub, i) =>
                i === index ? { ...sub, completed: !sub.completed } : sub
              ),
            }
          : task
      )
    );
  };

  const handleSubtaskChange = (index, value) => {
    const updatedSubtasks = [...form.subtasks];
    updatedSubtasks[index].title = value;
    setForm({ ...form, subtasks: updatedSubtasks });
  };

  const addSubtaskField = () => {
    setForm({
      ...form,
      subtasks: [...form.subtasks, { title: "", completed: false }],
    });
  };

  const removeSubtaskField = (index) => {
    const updatedSubtasks = form.subtasks.filter((_, i) => i !== index);
    setForm({ ...form, subtasks: updatedSubtasks });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      id: tasks.length + 1,
      ...form,
      assignedTo: form.assignedTo.split(",").map((name) => name.trim()),
      createdBy: "Akshita",
    };
    setTasks([...tasks, newTask]);
    setIsModalOpen(false);
    setForm({
      title: "",
      description: "",
      priority: "Low",
      status: "To Do",
      dueDate: "",
      subtasks: [{ title: "", completed: false }],
      assignedTo: "",
    });
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0b] overflow-hidden p-6">
      {/* Floating gradient background blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-fuchsia-600 opacity-30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-600 opacity-30 rounded-full blur-3xl animate-pulse"></div>

      <h1 className="text-3xl font-bold text-center text-white mb-8">
        ✨ My Task Board
      </h1>

      <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            whileHover={{ scale: 1.03, rotateX: 3, rotateY: -3 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="relative rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-xl border border-gray-700/50 p-6 shadow-2xl"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {task.title}
                </h2>
                <p className="text-sm text-gray-400 mt-1">{task.description}</p>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-400 hover:text-red-500 transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {/* Meta info */}
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-300">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-indigo-400" />
                Due: {task.dueDate}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4 text-fuchsia-400" />
                {task.assignedTo.join(", ")}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  task.priority === "High"
                    ? "bg-red-500/20 text-red-400"
                    : task.priority === "Medium"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-green-500/20 text-green-400"
                }`}
              >
                {task.priority}
              </span>
            </div>

            {/* Subtasks */}
            <div className="mt-5 space-y-2">
              <h3 className="text-sm text-gray-400 font-semibold">Subtasks</h3>
              {task.subtasks.map((sub, index) => (
                <label
                  key={index}
                  className="flex items-center gap-2 text-gray-300 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={sub.completed}
                    onChange={() => toggleSubtask(task.id, index)}
                    className="w-4 h-4 rounded bg-gray-800 border-gray-600 accent-indigo-500"
                  />
                  <span
                    className={`${
                      sub.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {sub.title}
                  </span>
                </label>
              ))}
            </div>

            {/* Status */}
            <div className="mt-5">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  task.status === "Completed"
                    ? "bg-green-500/20 text-green-400"
                    : task.status === "In Progress"
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-gray-500/20 text-gray-400"
                }`}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                {task.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Floating Add Button */}
      <motion.button
        onClick={() => setIsModalOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 p-4 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-lg hover:shadow-2xl transition"
      >
        <PlusCircle className="w-6 h-6" />
      </motion.button>

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0d0d12] rounded-2xl w-full max-w-lg shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-white font-semibold">
                Create New Task
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4 max-h-[75vh] overflow-y-auto pr-2"
            >
              {/* Title */}
              <div>
                <label className="text-gray-300 text-sm">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full p-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-gray-300 text-sm">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full p-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>

              {/* Priority */}
              <div>
                <label className="text-gray-300 text-sm">Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="w-full p-2 rounded-lg bg-gray-800 text-white"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="text-gray-300 text-sm">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full p-2 rounded-lg bg-gray-800 text-white"
                >
                  <option>To Do</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="text-gray-300 text-sm">Due Date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full p-2 rounded-lg bg-gray-800 text-white"
                />
              </div>

              {/* Subtasks */}
              <div>
                <label className="text-gray-300 text-sm">Subtasks</label>
                {form.subtasks.map((subtask, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={subtask.title}
                      onChange={(e) => handleSubtaskChange(index, e.target.value)}
                      placeholder={`Subtask ${index + 1}`}
                      className="flex-1 p-2 rounded-lg bg-gray-800 text-white"
                    />
                    {form.subtasks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSubtaskField(index)}
                        className="text-red-400 hover:text-red-500"
                      >
                        ✖
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSubtaskField}
                  className="text-indigo-400 text-sm hover:underline"
                >
                  + Add Subtask
                </button>
              </div>

              {/* Assigned To */}
              <div>
                <label className="text-gray-300 text-sm">
                  Assigned To (comma separated names)
                </label>
                <input
                  type="text"
                  value={form.assignedTo}
                  onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                  placeholder="e.g. Akshita, John"
                  className="w-full p-2 rounded-lg bg-gray-800 text-white"
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white font-semibold hover:shadow-xl"
              >
                Create Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
