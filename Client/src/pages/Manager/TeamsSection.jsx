import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Users, X, Trash2 } from "lucide-react";

const mockTeams = [
  {
    id: 1,
    name: "Product Development",
    members: [
      { id: 1, name: "Akshita", email: "akshita@example.com" },
      { id: 2, name: "Ravi", email: "ravi@example.com" },
    ],
  },
  {
    id: 2,
    name: "UI/UX Designers",
    members: [{ id: 3, name: "Simran", email: "simran@example.com" }],
  },
];

const mockEmployees = [
  { id: 11, name: "Shreya", email: "shreya@example.com" },
  { id: 12, name: "Aman", email: "aman@example.com" },
  { id: 13, name: "Vishal", email: "vishal@example.com" },
];

const TeamsSection = () => {
  const [teams, setTeams] = useState(mockTeams);
  const [employees, setEmployees] = useState(mockEmployees);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTeam, setActiveTeam] = useState(null);
  const [newTeamName, setNewTeamName] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const cardHover = {
    scale: 1.05,
    rotateX: 2,
    rotateY: -2,
    transition: { type: "spring", stiffness: 300 },
  };

  // Create team
  const handleCreateTeam = () => {
    if (newTeamName.trim() === "") return;
    const newTeam = {
      id: Date.now(),
      name: newTeamName,
      members: [],
    };
    setTeams([...teams, newTeam]);
    setNewTeamName("");
    setShowCreateModal(false);
  };

  // Add existing employee to team
  const handleAddEmployeeToTeam = () => {
    if (!selectedEmployee) return;

    const employeeToAdd = employees.find((emp) => emp.id === parseInt(selectedEmployee));
    if (!employeeToAdd) return;

    const updatedTeams = teams.map((team) => {
      if (team.id === activeTeam.id) {
        // Prevent duplicates
        const alreadyMember = team.members.some((m) => m.id === employeeToAdd.id);
        if (!alreadyMember) {
          return { ...team, members: [...team.members, employeeToAdd] };
        }
      }
      return team;
    });

    setTeams(updatedTeams);
    setSelectedEmployee("");
  };

  // Remove member from team
  const handleRemoveMember = (memberId) => {
    const updatedTeams = teams.map((team) => {
      if (team.id === activeTeam.id) {
        return {
          ...team,
          members: team.members.filter((m) => m.id !== memberId),
        };
      }
      return team;
    });
    setTeams(updatedTeams);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <motion.h1
          className="text-4xl font-extrabold tracking-wide bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Teams Dashboard
        </motion.h1>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-5 py-2 bg-purple-600 rounded-xl shadow-lg hover:bg-purple-700 transition-all"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={18} /> Create Team
        </motion.button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teams.map((team) => (
          <motion.div
            key={team.id}
            whileHover={cardHover}
            onClick={() => setActiveTeam(team)}
            className="bg-[#1e293b] rounded-2xl p-6 shadow-xl relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-3">{team.name}</h2>
              <div className="flex items-center gap-2 text-gray-400">
                <Users size={18} />
                <span>{team.members.length} Members</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Team Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#1e293b] rounded-2xl p-8 w-full max-w-md relative shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                onClick={() => setShowCreateModal(false)}
              >
                <X size={24} />
              </button>
              <h3 className="text-2xl font-bold mb-6">Create New Team</h3>
              <input
                type="text"
                placeholder="Enter team name..."
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#0f172a] border border-gray-600 focus:border-purple-500 outline-none text-white"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateTeam}
                className="mt-6 w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition-all font-semibold shadow-lg"
              >
                Create Team
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Team Details Modal */}
      <AnimatePresence>
        {activeTeam && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#1e293b] rounded-2xl p-8 w-full max-w-lg relative shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                onClick={() => setActiveTeam(null)}
              >
                <X size={24} />
              </button>

              <h3 className="text-2xl font-bold mb-6">
                {activeTeam.name} Members
              </h3>

              {/* Member List */}
              <div className="space-y-4 max-h-60 overflow-y-auto">
                {activeTeam.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between bg-[#0f172a] p-3 rounded-lg border border-gray-700"
                  >
                    <div>
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-sm text-gray-400">{member.email}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-red-500 hover:text-red-600 transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Existing Employee */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2">Add Employee</h4>
                <div className="flex gap-3">
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="flex-1 p-3 rounded-lg bg-[#0f172a] border border-gray-600 text-white"
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.email})
                      </option>
                    ))}
                  </select>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddEmployeeToTeam}
                    className="px-4 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition-all shadow-lg"
                  >
                    Add
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamsSection;
